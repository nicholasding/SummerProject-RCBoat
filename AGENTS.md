# Project Notes For Agents

## Repository Shape

- This repo is primarily a browser-based lesson deck for a STEM RC boat project.
- Firmware sketches live under `firmware/` and are intended for Arduino IDE.
- Run `node tests/check-three-decks.js` after content or firmware README changes to make sure the lesson deck structure still passes.

## ESP32-C3 Remote Controller

- The remote board is an ESP32-C3 Super Mini using Arduino `ESP32C3 Dev Module` from `esp32 by Espressif Systems`, not Arduino's `Arduino ESP32 Boards` package for Arduino-branded boards.
- Current KY-023 joystick wiring:
  - `VRx -> GPIO4`
  - `VRy -> GPIO3`
  - `SW -> GPIO2`
  - `VCC -> 3V3`
  - `GND -> GND`
- Do not power KY-023 from `5V`; its analog outputs can exceed ESP32-C3 ADC-safe voltage. Use `3V3`.
- The remote sketch sends ESP-NOW control packets every `30 ms`, about `33 Hz`.
- Serial output is intentionally slower than packet sending. Do not infer send rate from the print rate.
- If idle `throttle` or `steering` is not zero, use Serial Monitor command `c` to recalibrate the joystick center.
- If joystick movement does not change raw ADC values, suspect poor header contact first. Soldered headers or soldered wires are much more reliable than loose pressure-fit pins.

## ESP-NOW Debugging

- ESP-NOW does not show up as a Wi-Fi network on macOS or phones.
- Use serial logs to verify wireless behavior:
  - Remote: `queued=ok`, increasing `tx_ok`, and low `tx_fail`.
  - Boat: increasing `seq` values and fresh packet `age`.
- Broadcast mode is used for first tests. For multiple boats, set `boatAddress` in `remote_controller.ino` to the boat ESP32-C3 MAC printed by the boat sketch.

## macOS Upload And Serial

- The user's ESP32-C3 has appeared as `/dev/cu.usbmodem2101` on macOS.
- If Arduino IDE reports `/dev/cu.usbmodem101` does not exist, select the currently listed `/dev/cu.usbmodem*` port under `Tools -> Port`.
- If a port is busy, close Serial Monitor, Serial Plotter, `screen`, or other serial tools.
- To read serial from terminal:

```sh
screen /dev/cu.usbmodem2101 115200
```

- Exit `screen` with `Ctrl-A`, then `K`, then `Y`.

## Power Notes

- Do not connect a raw 1S 3.7V LiPo directly to ESP32-C3 `5V/GND` as a normal power solution.
- Do not connect a raw LiPo directly to `3V3`; a fully charged 1S LiPo is about `4.2V`.
- For battery power, use either:
  - `1S LiPo -> 5V boost converter -> ESP32-C3 5V/GND`
  - `1S LiPo -> regulated 3.3V converter -> ESP32-C3 3V3/GND`
  - USB power bank through the ESP32-C3 USB-C port
- Avoid powering ESP32-C3 from external `5V` while it is also connected to USB unless the board's power path is known to be safe.

## Wiring Materials

- Recommended general-purpose wire for this prototype: `24 AWG stranded silicone tinned copper wire`.
- `28 AWG` is easier for small signal pads, but `24 AWG` is more universal for joystick, logic wiring, small 5V/GND runs, and 130 motor leads.
- Avoid solid-core wire for parts that move or vibrate; it can fatigue and break.
- Use red for power, black for ground, and other colors for signals. Keep exposed stripped wire short, around `2-3 mm`, on small ESP32-C3 pads.

## Git Hygiene

- Keep generated macOS files such as `.DS_Store` out of commits.
- The user asked that committed project materials be in English.
- Do not add extra diagnostic sketches unless the user explicitly wants them. A previous `joystick_pin_finder` sketch was intentionally removed.
