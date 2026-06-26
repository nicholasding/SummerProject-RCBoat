#include <Arduino.h>
#include <esp_arduino_version.h>
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>

#ifndef ESP_ARDUINO_VERSION_MAJOR
#define ESP_ARDUINO_VERSION_MAJOR 2
#endif

// TB6612FNG wiring. Change these values if your boat wiring is different.
static constexpr uint8_t PWMA_PIN = 3;
static constexpr uint8_t AIN1_PIN = 4;
static constexpr uint8_t AIN2_PIN = 6;
static constexpr uint8_t PWMB_PIN = 5;
static constexpr uint8_t BIN1_PIN = 7;
static constexpr uint8_t BIN2_PIN = 8;
static constexpr uint8_t STBY_PIN = 9;

static constexpr uint8_t ESPNOW_CHANNEL = 1;
static constexpr uint16_t FAILSAFE_MS = 450;
static constexpr uint8_t MAX_OUTPUT_PERCENT = 70;  // Keep early tests gentle.
static constexpr uint32_t PWM_FREQ = 20000;
static constexpr uint8_t PWM_BITS = 8;
static constexpr uint16_t PWM_MAX = (1 << PWM_BITS) - 1;

#if ESP_ARDUINO_VERSION_MAJOR < 3
static constexpr uint8_t PWMA_CHANNEL = 0;
static constexpr uint8_t PWMB_CHANNEL = 1;
#endif

struct __attribute__((packed)) ControlPacket {
  int8_t throttle;  // -100 reverse, 0 stop, +100 forward
  int8_t steering;  // -100 left, 0 straight, +100 right
  uint8_t button;
  uint32_t seq;
  uint32_t ms;
};

static ControlPacket latestPacket = {};
static volatile uint32_t lastPacketAt = 0;
static volatile bool hasPacket = false;

void attachPwm(uint8_t pin, uint8_t channel) {
#if ESP_ARDUINO_VERSION_MAJOR >= 3
  (void)channel;
  ledcAttach(pin, PWM_FREQ, PWM_BITS);
#else
  ledcSetup(channel, PWM_FREQ, PWM_BITS);
  ledcAttachPin(pin, channel);
#endif
}

void writePwm(uint8_t pin, uint8_t channel, uint16_t duty) {
#if ESP_ARDUINO_VERSION_MAJOR >= 3
  (void)channel;
  ledcWrite(pin, duty);
#else
  (void)pin;
  ledcWrite(channel, duty);
#endif
}

void driveMotor(uint8_t pwmPin, uint8_t channel, uint8_t in1Pin, uint8_t in2Pin, int command) {
  command = constrain(command, -100, 100);

  if (command == 0) {
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
    writePwm(pwmPin, channel, 0);
    return;
  }

  const bool forward = command > 0;
  const int limited = map(abs(command), 0, 100, 0, MAX_OUTPUT_PERCENT);
  const uint16_t duty = map(limited, 0, 100, 0, PWM_MAX);

  digitalWrite(in1Pin, forward ? HIGH : LOW);
  digitalWrite(in2Pin, forward ? LOW : HIGH);
  writePwm(pwmPin, channel, duty);
}

void stopMotors() {
  driveMotor(PWMA_PIN, 0, AIN1_PIN, AIN2_PIN, 0);
  driveMotor(PWMB_PIN, 1, BIN1_PIN, BIN2_PIN, 0);
}

void mixAndDrive(const ControlPacket &packet) {
  int left = packet.throttle + packet.steering;
  int right = packet.throttle - packet.steering;
  const int largest = max(abs(left), abs(right));

  if (largest > 100) {
    left = left * 100 / largest;
    right = right * 100 / largest;
  }

  driveMotor(PWMA_PIN, 0, AIN1_PIN, AIN2_PIN, left);
  driveMotor(PWMB_PIN, 1, BIN1_PIN, BIN2_PIN, right);
}

#if ESP_ARDUINO_VERSION_MAJOR >= 3
void onReceive(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  (void)info;
#else
void onReceive(const uint8_t *mac, const uint8_t *data, int len) {
  (void)mac;
#endif
  if (len != sizeof(ControlPacket)) {
    return;
  }

  memcpy(&latestPacket, data, sizeof(latestPacket));
  lastPacketAt = millis();
  hasPacket = true;
}

void setupEspNow() {
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

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(AIN1_PIN, OUTPUT);
  pinMode(AIN2_PIN, OUTPUT);
  pinMode(BIN1_PIN, OUTPUT);
  pinMode(BIN2_PIN, OUTPUT);
  pinMode(STBY_PIN, OUTPUT);
  digitalWrite(STBY_PIN, HIGH);

  attachPwm(PWMA_PIN, 0);
  attachPwm(PWMB_PIN, 1);
  stopMotors();

  setupEspNow();
  Serial.println("Boat controller is waiting for ESP-NOW packets.");
}

void loop() {
  static uint32_t lastPrint = 0;
  const uint32_t now = millis();

  if (!hasPacket || now - lastPacketAt > FAILSAFE_MS) {
    stopMotors();
    if (now - lastPrint >= 500) {
      lastPrint = now;
      Serial.println("Failsafe: no recent packet, motors stopped.");
    }
    return;
  }

  ControlPacket packet;
  memcpy(&packet, &latestPacket, sizeof(packet));
  mixAndDrive(packet);

  if (now - lastPrint >= 250) {
    lastPrint = now;
    Serial.printf(
      "seq=%lu throttle=%4d steering=%4d button=%u age=%lu ms\n",
      static_cast<unsigned long>(packet.seq),
      packet.throttle,
      packet.steering,
      packet.button,
      static_cast<unsigned long>(now - lastPacketAt)
    );
  }
}
