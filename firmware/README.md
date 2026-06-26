# ESP32-C3 RC Boat Firmware

This directory contains Arduino IDE sketches for the RC boat project:

- `remote_controller/remote_controller.ino`: remote controller firmware. The ESP32-C3 Super Mini reads the KY-023 joystick and sends `throttle` and `steering` over ESP-NOW.
- `boat_controller/boat_controller.ino`: boat controller firmware. The boat-side ESP32-C3 receives ESP-NOW packets, mixes differential steering, and drives two 130 motors through a TB6612FNG motor driver.

## Wiring Notes

Connect the KY-023 `VCC` pin to ESP32-C3 `3V3`, not `5V`. If the joystick module is powered from 5V, the `VRx/VRy` analog outputs can also approach 5V, which is too high for ESP32-C3 ADC pins.

The current remote controller wiring is:

```cpp
static constexpr uint8_t JOY_X_PIN = 4;
static constexpr uint8_t JOY_Y_PIN = 3;
static constexpr uint8_t JOY_SW_PIN = 2;
```

If your wiring follows the colored wires in the circuit image instead, change the constants to:

```cpp
static constexpr uint8_t JOY_X_PIN = 0;
static constexpr uint8_t JOY_Y_PIN = 1;
static constexpr uint8_t JOY_SW_PIN = 3;
```

## Upload Steps

1. Install the ESP32 boards package in Arduino IDE.
2. Select `ESP32C3 Dev Module`, or the matching ESP32-C3 Super Mini entry in your local board list.
3. Open and upload `remote_controller/remote_controller.ino` to the remote controller ESP32-C3.
4. Open Serial Monitor at `115200` baud. Keep the joystick centered during startup so the sketch can calibrate the neutral position.
5. Open and upload `boat_controller/boat_controller.ino` to the boat-side ESP32-C3.
6. The boat serial monitor should print received `throttle/steering` values. The remote serial monitor should print queued ESP-NOW packets and TX counters.

The remote uses ESP-NOW broadcast by default, so the first test does not require a boat MAC address. For a classroom with multiple boats, replace `boatAddress` in `remote_controller.ino` with the `Boat MAC` printed by the boat controller serial monitor.

## Debugging The Remote On macOS

After plugging in the ESP32-C3, list serial ports:

```sh
ls /dev/cu.*
```

This Mac currently sees the ESP32-C3 serial port as:

```sh
/dev/cu.usbmodem2101
```

The easiest option is to select that port in Arduino IDE, then open Serial Monitor at `115200` baud.

You can also use macOS `screen`:

```sh
screen /dev/cu.usbmodem2101 115200
```

To exit `screen`, press `Ctrl-A`, then `K`, then `Y`.

Normal serial output looks like:

```text
Joystick center: X=2040 Y=2052
Remote MAC: 84:F7:03:AA:BB:CC
Remote controller is sending ESP-NOW packets.
raw X=2044 Y=2050 | throttle=   0 steering=   0 button=0 queued=ok tx_ok=123 tx_fail=0
```

When the joystick moves, `raw X/Y` should change and `throttle/steering` should move away from `0`. When the joystick button is pressed, `button` should change from `0` to `1`.

If `throttle` or `steering` is not `0` while the joystick is centered, type this in Serial Monitor:

```text
c
```

Then press Enter. The sketch will recalibrate the center position. After recalibration, the idle output should be close to:

```text
throttle=   0 steering=   0
```

## Debug Order

1. Connect only the KY-023 and remote ESP32-C3. Confirm `raw X/Y` changes in Serial Monitor.
2. Power both ESP32-C3 boards. Confirm the boat serial monitor receives packets.
3. Keep the boat out of the water and keep propellers clear of hands and the bench. Test left and right motors at low speed.
4. If forward/backward or left/right is reversed, change `INVERT_THROTTLE` or `INVERT_STEERING` in `remote_controller.ino`.
5. Keep `MAX_OUTPUT_PERCENT = 70` in `boat_controller.ino` for early tests. Increase it only after the system is stable.
