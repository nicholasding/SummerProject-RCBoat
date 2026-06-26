#include <Arduino.h>
#include <esp_arduino_version.h>
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>

#ifndef ESP_ARDUINO_VERSION_MAJOR
#define ESP_ARDUINO_VERSION_MAJOR 2
#endif

// Receive-only test mode: this sketch does not configure or write any motor
// driver pins. It only listens for ESP-NOW packets and prints their contents.
static constexpr uint8_t ESPNOW_CHANNEL = 1;
static constexpr uint16_t FAILSAFE_MS = 450;

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

void setup() {
  Serial.begin(115200);
  delay(500);

  // No motor pins are configured in this receiver test.
  setupEspNow();
  Serial.println("Boat controller receive-only test is waiting for ESP-NOW packets.");
}

void loop() {
  static uint32_t lastPrint = 0;
  const uint32_t now = millis();

  if (!hasPacket || now - lastPacketAt > FAILSAFE_MS) {
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
