const fs = require("fs");
const path = require("path");

const source = fs.readFileSync("app.js", "utf8");
const index = fs.readFileSync("index.html", "utf8");

if (!source.includes("const decks = {")) {
  throw new Error("Expected app.js to define a decks object with independent slide decks.");
}

const requiredDecks = ["physics", "modeling", "circuits"];
for (const deck of requiredDecks) {
  if (!source.includes(`${deck}: {`)) {
    throw new Error(`Missing deck entry: ${deck}`);
  }
}

const requiredTitles = [
  "Physics: Why Boats Float",
  "Practice: Lunch Tray Waterline",
  "3D Modeling: Choose Your Hull",
  "Single Hull Design",
  "Double Hull Design",
  "Circuit Design: ESP32-C3 RC Boat",
  "ESP-NOW Remote Control",
  "Dual Motor Driver",
  "Differential Steering",
];

for (const title of requiredTitles) {
  if (!source.includes(`title: "${title}"`)) {
    throw new Error(`Missing required slide title: ${title}`);
  }
}

if (!source.includes("ESP32-C3 Super Mini") || !source.includes("130 motor") || !source.includes("joystick")) {
  throw new Error("Circuit deck must mention ESP32-C3 Super Mini, 130 motor, and joystick.");
}

const requiredCircuitTerms = [
  "KY-023 Joystick",
  "MP1584EN Buck Converter",
  "2S LiPo",
  "TB6612FNG",
  "assets/esp32-c3-rc-boat-circuit.png",
];

for (const term of requiredCircuitTerms) {
  if (!source.includes(term)) {
    throw new Error(`Circuit deck is missing required final-design term: ${term}`);
  }
}

if (!fs.existsSync(path.join(process.cwd(), "assets/esp32-c3-rc-boat-circuit.png"))) {
  throw new Error("Missing generated circuit diagram asset: assets/esp32-c3-rc-boat-circuit.png");
}

if (!source.includes("assets/physics/boat-forces.png") || !source.includes("assets/physics/lunch-tray-waterline.png")) {
  throw new Error("Physics deck must use generated PNG image assets.");
}

const physicsStart = source.indexOf("physics: {");
const modelingStart = source.indexOf("modeling: {");
const physicsBlock = source.slice(physicsStart, modelingStart);
if (physicsBlock.includes("<svg")) {
  throw new Error("Physics deck should not embed SVG visuals.");
}

if (!source.includes("deck-menu") || !index.includes("Back to decks")) {
  throw new Error("Expected independent deck menu and back navigation UI.");
}

if (source.includes('title: "Whole-System Block Diagram"')) {
  throw new Error("Whole-System Block Diagram slide should be removed from Part 3.");
}

if (!source.includes("No GND wire between remote and boat")) {
  throw new Error("Circuit deck should state that remote and boat grounds are separate.");
}

if (source.includes("<tr><td>armed</td>") || source.includes("arm/enable")) {
  throw new Error("Control packet should not include armed; safety should use failsafe and physical power control.");
}

if (!source.includes("RC Boat Project Lab") || source.includes("Choose a PPT")) {
  throw new Error("Expected the home page to use Summer STEM Project naming instead of Choose a PPT.");
}

console.log("Three-deck structure check passed.");
