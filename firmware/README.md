# ESP32-C3 RC Boat Firmware

This directory contains Arduino IDE sketches for the RC boat project:

- `remote_controller/remote_controller.ino`: remote controller firmware. The ESP32-C3 Super Mini reads the KY-023 joystick and sends `throttle` and `steering` over ESP-NOW.
- `boat_controller/boat_controller.ino`: boat receiver firmware. The boat-side ESP32-C3 receives ESP-NOW packets, mixes `throttle` and `steering` into left/right motor speeds, and drives a TB6612FNG motor driver.

Current status: the remote-to-boat ESP-NOW receive test has been verified. The boat sketch now enables wireless differential motor control and stops both motors if recent ESP-NOW packets are missing.

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

The current boat-side TB6612FNG motor driver wiring is:

```text
ESP32-C3 GPIO7 -> TB6612 AIN1
ESP32-C3 GPIO6 -> TB6612 AIN2
ESP32-C3 GPIO5 -> TB6612 PWMA
ESP32-C3 GPIO4 -> TB6612 BIN1
ESP32-C3 GPIO3 -> TB6612 BIN2
ESP32-C3 GPIO2 -> TB6612 PWMB
```

The boat sketch treats motor A as the left/port motor and motor B as the right/starboard motor. If one motor spins backward during a bench test, flip that motor's `inverted` value in `boat_controller.ino`. If your TB6612FNG board exposes `STBY`, connect it to logic high according to the driver board's instructions; otherwise the driver may stay disabled.

## Upload Steps

1. Install the ESP32 boards package in Arduino IDE.
2. Select `ESP32C3 Dev Module`, or the matching ESP32-C3 Super Mini entry in your local board list.
3. Open and upload `remote_controller/remote_controller.ino` to the remote controller ESP32-C3.
4. Open Serial Monitor at `115200` baud. Keep the joystick centered during startup so the sketch can calibrate the neutral position.
5. Open and upload `boat_controller/boat_controller.ino` to the boat-side ESP32-C3.
6. The boat serial monitor should print received `throttle/steering` values plus mixed `left/right` motor commands. The remote serial monitor should print queued ESP-NOW packets and TX counters.

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

## Debugging The Boat Controller

Open the boat-side Serial Monitor at `115200` baud. After reset, the boat sketch should print the boat ESP32-C3 MAC address and then either incoming packets or a missing-packet message.

Normal boat controller output looks like:

```text
Boat MAC: 84:F7:03:11:22:33
Boat controller is waiting for ESP-NOW packets and driving the motors.
seq=123 throttle=  45 steering= -20 left=  25 right=  65 button=0 age=12 ms
```

If the remote is off or packets are not arriving, the boat should print:

```text
No recent packet.
```

For a good radio test, `seq` should keep increasing while the remote is powered, `age` should stay low, and `throttle`, `steering`, and `button` should match the remote Serial Monitor values.

For a good motor test, lift the propellers out of the water before moving the joystick. A centered joystick should print `left=0 right=0` and both motors should be stopped. Pushing forward should make both motors run forward. Moving the joystick sideways should make the motors run at different speeds for turning.

## Debug Order

1. Connect only the KY-023 and remote ESP32-C3. Confirm `raw X/Y` changes in Serial Monitor.
2. Power both ESP32-C3 boards. Confirm the boat serial monitor receives packets.
3. Confirm the boat serial monitor shows increasing `seq` values while the remote controller is powered.
4. Lift the propellers clear of the water and confirm `left/right` commands change when the joystick moves.
5. If forward/backward or left/right is reversed, change `INVERT_THROTTLE` or `INVERT_STEERING` in `remote_controller.ino`.
6. If only one motor is reversed, flip that motor's `inverted` value in `boat_controller.ino`.
