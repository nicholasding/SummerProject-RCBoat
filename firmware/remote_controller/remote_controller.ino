#include <Arduino.h>
#include <esp_arduino_version.h>
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>

#ifndef ESP_ARDUINO_VERSION_MAJOR
#define ESP_ARDUINO_VERSION_MAJOR 2
#endif

// KY-023 wiring. Change these three values to match your real wiring.
// Current project wiring: VRx=GPIO4, VRy=GPIO3, SW=GPIO2.
// If you followed the callouts in the project diagram: VRx=IO3, VRy=IO4, SW=IO5.
// If you followed the colored wires in the image instead, try VRx=IO0, VRy=IO1, SW=IO3.
static constexpr uint8_t JOY_X_PIN = 4;
static constexpr uint8_t JOY_Y_PIN = 3;
static constexpr uint8_t JOY_SW_PIN = 2;

static constexpr int ADC_MAX = 4095;

// Ignore tiny joystick noise around center. Increase this if the boat creeps
// when your hand is off the joystick.
static constexpr int DEAD_BAND_PERCENT = 8;
static constexpr uint8_t ESPNOW_CHANNEL = 1;
static constexpr uint16_t SEND_INTERVAL_MS = 30;
static constexpr uint16_t STARTUP_CALIBRATION_DELAY_MS = 2000;

// Flip these after a bench test if forward/backward or left/right feels wrong.
static constexpr bool INVERT_THROTTLE = false;
static constexpr bool INVERT_STEERING = false;

// Broadcast keeps first setup simple. For a classroom with many boats, replace
// this with the boat ESP32-C3 Wi-Fi MAC address and pair one remote to one boat.
static uint8_t boatAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

struct __attribute__((packed)) ControlPacket {
  int8_t throttle;  // -100 reverse, 0 stop, +100 forward
  int8_t steering;  // -100 left, 0 straight, +100 right
  uint8_t button;   // 1 while joystick button is pressed
  uint32_t seq;
  uint32_t ms;
};

static int xCenter = ADC_MAX / 2;
static int yCenter = ADC_MAX / 2;
static uint32_t seq = 0;
static volatile uint32_t txOkCount = 0;
static volatile uint32_t txFailCount = 0;

int readAverage(uint8_t pin, uint16_t samples) {
  uint32_t total = 0;
  for (uint16_t i = 0; i < samples; i += 1) {
    total += analogRead(pin);
    delay(2);
  }
  return total / samples;
}

int axisToPercent(int raw, int center, bool invert) {
  // Convert one ADC reading into a simple -100..+100 control value.
  // The joystick center is measured on startup, so it does not need to be
  // exactly 2048.
  int value = 0;

  if (raw >= center) {
    value = map(raw, center, ADC_MAX, 0, 100);
  } else {
    value = map(raw, 0, center, -100, 0);
  }

  value = constrain(value, -100, 100);
  if (abs(value) < DEAD_BAND_PERCENT) {
    value = 0;
  }

  return invert ? -value : value;
}

void calibrateJoystick() {
  Serial.println("Leave the joystick centered. Calibrating...");
  delay(STARTUP_CALIBRATION_DELAY_MS);

  // Keep your hand off the joystick during these samples. These values become
  // the neutral throttle/steering position.
  const int measuredX = readAverage(JOY_X_PIN, 120);
  const int measuredY = readAverage(JOY_Y_PIN, 120);

  // If a wire is loose, the ADC can read near 0 or 4095. Constraining the
  // center keeps the map() math stable while the serial monitor shows the issue.
  xCenter = constrain(measuredX, 200, ADC_MAX - 200);
  yCenter = constrain(measuredY, 200, ADC_MAX - 200);
  Serial.printf(
    "Joystick center: X=%d Y=%d (measured X=%d Y=%d)\n",
    xCenter,
    yCenter,
    measuredX,
    measuredY
  );
  Serial.println("Type c in Serial Monitor and press Enter to recalibrate.");
}

#if ESP_ARDUINO_VERSION_MAJOR >= 3
void onSend(const wifi_tx_info_t *txInfo, esp_now_send_status_t status) {
  (void)txInfo;
#else
void onSend(const uint8_t *mac, esp_now_send_status_t status) {
  (void)mac;
#endif
  if (status == ESP_NOW_SEND_SUCCESS) {
    txOkCount += 1;
  } else {
    txFailCount += 1;
  }
}

void setupEspNow() {
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();

  // Both remote and boat must use the same ESP-NOW channel.
  esp_wifi_set_channel(ESPNOW_CHANNEL, WIFI_SECOND_CHAN_NONE);

  Serial.print("Remote MAC: ");
  Serial.println(WiFi.macAddress());

  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed. Restarting...");
    delay(1000);
    ESP.restart();
  }

  esp_now_register_send_cb(onSend);

  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, boatAddress, sizeof(boatAddress));
  peer.channel = ESPNOW_CHANNEL;
  peer.encrypt = false;

  if (!esp_now_is_peer_exist(boatAddress)) {
    esp_err_t result = esp_now_add_peer(&peer);
    if (result != ESP_OK) {
      Serial.printf("ESP-NOW add peer failed: %d\n", result);
      delay(1000);
      ESP.restart();
    }
  }
}

void setup() {
  Serial.begin(115200);
  delay(500);

  // ESP32-C3 ADC values are 0..4095 at 12-bit resolution.
  analogReadResolution(12);
  analogSetPinAttenuation(JOY_X_PIN, ADC_11db);
  analogSetPinAttenuation(JOY_Y_PIN, ADC_11db);

  // KY-023 SW usually connects to GND when pressed, so INPUT_PULLUP reads:
  // not pressed = HIGH, pressed = LOW.
  pinMode(JOY_SW_PIN, INPUT_PULLUP);

  calibrateJoystick();
  setupEspNow();

  Serial.println("Remote controller is sending ESP-NOW packets.");
}

void loop() {
  static uint32_t lastSend = 0;
  static uint32_t lastPrint = 0;

  if (Serial.available() > 0) {
    const char command = Serial.read();
    if (command == 'c' || command == 'C') {
      calibrateJoystick();
    }
  }

  const uint32_t now = millis();
  if (now - lastSend < SEND_INTERVAL_MS) {
    return;
  }
  lastSend = now;

  const int xRaw = analogRead(JOY_X_PIN);
  const int yRaw = analogRead(JOY_Y_PIN);

  // Packet fields are intentionally tiny so they are easy to print and debug.
  ControlPacket packet = {};
  packet.throttle = axisToPercent(yRaw, yCenter, INVERT_THROTTLE);
  packet.steering = axisToPercent(xRaw, xCenter, INVERT_STEERING);
  packet.button = digitalRead(JOY_SW_PIN) == LOW ? 1 : 0;
  packet.seq = seq++;
  packet.ms = now;

  esp_err_t result = esp_now_send(boatAddress, reinterpret_cast<uint8_t *>(&packet), sizeof(packet));

  if (now - lastPrint >= 250) {
    lastPrint = now;
    // Serial debug guide:
    // raw X/Y should be near the calibrated center when untouched.
    // throttle/steering should sit at 0 when centered and move toward +/-100.
    // button should become 1 only while the joystick switch is pressed.
    Serial.printf(
      "raw X=%4d Y=%4d | throttle=%4d steering=%4d button=%u queued=%s tx_ok=%lu tx_fail=%lu\n",
      xRaw,
      yRaw,
      packet.throttle,
      packet.steering,
      packet.button,
      result == ESP_OK ? "ok" : "fail",
      static_cast<unsigned long>(txOkCount),
      static_cast<unsigned long>(txFailCount)
    );
  }
}
