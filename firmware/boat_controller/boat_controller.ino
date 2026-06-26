#include <Arduino.h>
#include <esp_arduino_version.h>
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>

#ifndef ESP_ARDUINO_VERSION_MAJOR
#define ESP_ARDUINO_VERSION_MAJOR 2
#endif

// Dual-motor TB6612FNG wiring:
// ESP32-C3 GPIO7 -> TB6612 AIN1
// ESP32-C3 GPIO6 -> TB6612 AIN2
// ESP32-C3 GPIO5 -> TB6612 PWMA
// ESP32-C3 GPIO4 -> TB6612 BIN1
// ESP32-C3 GPIO3 -> TB6612 BIN2
// ESP32-C3 GPIO2 -> TB6612 PWMB
static constexpr uint8_t ESPNOW_CHANNEL = 1;
static constexpr uint16_t FAILSAFE_MS = 450;
static constexpr uint32_t PWM_FREQUENCY_HZ = 20000;
static constexpr uint8_t PWM_RESOLUTION_BITS = 8;
static constexpr uint16_t PWM_MAX_DUTY = (1 << PWM_RESOLUTION_BITS) - 1;

struct MotorPins {
  uint8_t in1Pin;
  uint8_t in2Pin;
  uint8_t pwmPin;
#if ESP_ARDUINO_VERSION_MAJOR < 3
  uint8_t pwmChannel;
#endif
  bool inverted;
};

// Motor A is treated as the left/port motor and Motor B as the right/starboard
// motor. Flip an inverted flag if one motor spins backward during testing.
static constexpr MotorPins LEFT_MOTOR = {
  7,
  6,
  5,
#if ESP_ARDUINO_VERSION_MAJOR < 3
  0,
#endif
  false
};
static constexpr MotorPins RIGHT_MOTOR = {
  4,
  3,
  2,
#if ESP_ARDUINO_VERSION_MAJOR < 3
  1,
#endif
  false
};

// This packet layout must stay exactly the same as the one in
// remote_controller.ino so ESP-NOW payloads decode correctly.
struct __attribute__((packed)) ControlPacket {
  int8_t throttle;  // -100 reverse, 0 stop, +100 forward
  int8_t steering;  // -100 left, 0 straight, +100 right
  uint8_t button;   // 1 while joystick button is pressed
  uint32_t seq;     // Increments once per remote packet
  uint32_t ms;      // Remote-side millis() when the packet was sent
};

// These values are written by the ESP-NOW receive callback and read by loop().
static ControlPacket latestPacket = {};
static volatile uint32_t lastPacketAt = 0;
static volatile bool hasPacket = false;

#if ESP_ARDUINO_VERSION_MAJOR >= 3
void onReceive(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  (void)info;
#else
void onReceive(const uint8_t *mac, const uint8_t *data, int len) {
  (void)mac;
#endif
  // Ignore packets from sketches with a different payload format.
  if (len != sizeof(ControlPacket)) {
    return;
  }

  memcpy(&latestPacket, data, sizeof(latestPacket));
  lastPacketAt = millis();
  hasPacket = true;
}

void setupEspNow() {
  // ESP-NOW uses the Wi-Fi radio, but it does not need a router connection.
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  esp_wifi_set_channel(ESPNOW_CHANNEL, WIFI_SECOND_CHAN_NONE);

  Serial.print("Boat MAC: ");
  Serial.println(WiFi.macAddress());

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed. Restarting...");
    delay(1000);
    ESP.restart();
  }

  esp_now_register_recv_cb(onReceive);
}

void setupMotorPwm(const MotorPins &motor) {
#if ESP_ARDUINO_VERSION_MAJOR >= 3
  ledcAttach(motor.pwmPin, PWM_FREQUENCY_HZ, PWM_RESOLUTION_BITS);
#else
  ledcSetup(motor.pwmChannel, PWM_FREQUENCY_HZ, PWM_RESOLUTION_BITS);
  ledcAttachPin(motor.pwmPin, motor.pwmChannel);
#endif
}

void writeMotorPwm(const MotorPins &motor, uint16_t duty) {
  duty = constrain(duty, 0, PWM_MAX_DUTY);
#if ESP_ARDUINO_VERSION_MAJOR >= 3
  ledcWrite(motor.pwmPin, duty);
#else
  ledcWrite(motor.pwmChannel, duty);
#endif
}

void writeMotor(const MotorPins &motor, int speedPercent) {
  speedPercent = constrain(speedPercent, -100, 100);
  if (motor.inverted) {
    speedPercent = -speedPercent;
  }

  if (speedPercent > 0) {
    digitalWrite(motor.in1Pin, HIGH);
    digitalWrite(motor.in2Pin, LOW);
  } else if (speedPercent < 0) {
    digitalWrite(motor.in1Pin, LOW);
    digitalWrite(motor.in2Pin, HIGH);
  } else {
    digitalWrite(motor.in1Pin, LOW);
    digitalWrite(motor.in2Pin, LOW);
  }

  const uint16_t duty = map(abs(speedPercent), 0, 100, 0, PWM_MAX_DUTY);
  writeMotorPwm(motor, duty);
}

void stopDrive() {
  writeMotor(LEFT_MOTOR, 0);
  writeMotor(RIGHT_MOTOR, 0);
}

void setupMotor() {
  pinMode(LEFT_MOTOR.in1Pin, OUTPUT);
  pinMode(LEFT_MOTOR.in2Pin, OUTPUT);
  pinMode(RIGHT_MOTOR.in1Pin, OUTPUT);
  pinMode(RIGHT_MOTOR.in2Pin, OUTPUT);

  digitalWrite(LEFT_MOTOR.in1Pin, LOW);
  digitalWrite(LEFT_MOTOR.in2Pin, LOW);
  digitalWrite(RIGHT_MOTOR.in1Pin, LOW);
  digitalWrite(RIGHT_MOTOR.in2Pin, LOW);

  setupMotorPwm(LEFT_MOTOR);
  setupMotorPwm(RIGHT_MOTOR);

  stopDrive();
}

void mixTankDrive(const ControlPacket &packet, int &leftSpeed, int &rightSpeed) {
  leftSpeed = packet.throttle + packet.steering;
  rightSpeed = packet.throttle - packet.steering;

  const int maxMagnitude = max(abs(leftSpeed), abs(rightSpeed));
  if (maxMagnitude > 100) {
    leftSpeed = leftSpeed * 100 / maxMagnitude;
    rightSpeed = rightSpeed * 100 / maxMagnitude;
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);

  setupMotor();

  setupEspNow();
  Serial.println("Boat controller is waiting for ESP-NOW packets and driving the motors.");
}

void loop() {
  static uint32_t lastPrint = 0;
  const uint32_t now = millis();

  if (!hasPacket || now - lastPacketAt > FAILSAFE_MS) {
    stopDrive();
    // Print slowly when packets are missing so the serial monitor stays readable.
    if (now - lastPrint >= 500) {
      lastPrint = now;
      Serial.println("No recent packet.");
    }
    return;
  }

  ControlPacket packet;
  // Copy the latest packet before printing so one line uses one consistent snapshot.
  memcpy(&packet, &latestPacket, sizeof(packet));

  int leftSpeed = 0;
  int rightSpeed = 0;
  mixTankDrive(packet, leftSpeed, rightSpeed);
  writeMotor(LEFT_MOTOR, leftSpeed);
  writeMotor(RIGHT_MOTOR, rightSpeed);

  if (now - lastPrint >= 250) {
    lastPrint = now;
    Serial.printf(
      "seq=%lu throttle=%4d steering=%4d left=%4d right=%4d button=%u age=%lu ms\n",
      static_cast<unsigned long>(packet.seq),
      packet.throttle,
      packet.steering,
      leftSpeed,
      rightSpeed,
      packet.button,
      static_cast<unsigned long>(now - lastPacketAt)
    );
  }
}
