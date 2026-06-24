# STEM Summer Project: RC Boat

A simple browser-based slide deck for a summer STEM project about building an RC boat. The project is split into three lesson decks:

- Physics: why boats float, buoyancy, displacement, waterline, draft, and stability
- 3D modeling: choosing and designing a printable hull
- Circuit design: ESP32-C3 remote control, ESP-NOW, motor driver wiring, and differential steering

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
├── assets/
│   ├── esp32-c3-rc-boat-circuit.png
│   └── physics/
│       ├── boat-forces.png
│       └── lunch-tray-waterline.png
└── tests/
    └── check-three-decks.js
```

## Getting Started

Open `index.html` directly in a web browser to view the deck menu.

No build step, package install, or local server is required.

## Controls

- Use the arrow buttons or keyboard arrow keys to move between slides.
- Use `Overview` to jump to a specific slide.
- Use `Print` to print the current deck or save it as a PDF.
- Use `Back to decks` to return to the deck menu.

## Checks

Run the included Node.js structure check:

```sh
node tests/check-three-decks.js
```

The check confirms that the three main decks and required RC boat lesson content are present.
