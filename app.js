const physicsImages = {
  boatForces: "assets/physics/boat-forces.png",
  lunchTray: "assets/physics/lunch-tray-waterline.png",
};

function imageAsset(src, alt) {
  return `<img class="visual-image" src="${src}" alt="${alt}">`;
}

const svgHullOptions = `
  <svg viewBox="0 0 900 460" role="img" aria-label="Single hull and double hull design comparison">
    <rect x="0" y="265" width="900" height="195" fill="#b5e0e6"></rect>
    <path d="M0 276 C110 248 210 300 320 274 C430 250 545 300 660 276 C760 255 830 288 900 270 L900 460 L0 460 Z" fill="#087e8b"></path>
    <text x="100" y="72" font-size="34" font-weight="900" fill="#15202b">Single hull</text>
    <path d="M82 202 C165 154 325 154 410 202 C365 292 125 292 82 202 Z" fill="#f4b942" stroke="#15202b" stroke-width="5"></path>
    <line x1="246" y1="136" x2="246" y2="320" stroke="#d95d39" stroke-width="5" stroke-dasharray="10 10"></line>
    <text x="92" y="374" font-size="24" fill="#ffffff" font-weight="900">simple, faster, more balance-sensitive</text>
    <text x="570" y="72" font-size="34" font-weight="900" fill="#15202b">Double hull</text>
    <path d="M525 205 C560 160 638 160 674 205 C650 292 550 292 525 205 Z" fill="#f4b942" stroke="#15202b" stroke-width="5"></path>
    <path d="M704 205 C740 160 818 160 852 205 C830 292 728 292 704 205 Z" fill="#f4b942" stroke="#15202b" stroke-width="5"></path>
    <rect x="590" y="164" width="200" height="42" rx="8" fill="#ffffff" stroke="#15202b" stroke-width="5"></rect>
    <text x="548" y="374" font-size="24" fill="#ffffff" font-weight="900">stable, roomy, great for first prototype</text>
  </svg>
`;

const svgCircuitSystem = `
  <svg viewBox="0 0 940 520" role="img" aria-label="ESP32-C3 ESP-NOW RC boat circuit architecture">
    <defs>
      <marker id="wireArrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="#22577a"></path>
      </marker>
    </defs>
    <rect x="45" y="70" width="190" height="105" rx="8" fill="#fff8e6" stroke="#15202b" stroke-width="4"></rect>
    <text x="68" y="112" font-size="23" font-weight="900">KY-023 Joystick</text>
    <text x="78" y="145" font-size="21" font-weight="800" fill="#52616f">remote input</text>
    <rect x="325" y="56" width="230" height="132" rx="8" fill="#eef8fa" stroke="#15202b" stroke-width="4"></rect>
    <text x="355" y="105" font-size="23" font-weight="900">ESP32-C3</text>
    <text x="354" y="137" font-size="21" font-weight="800" fill="#52616f">remote controller</text>
    <rect x="670" y="60" width="220" height="120" rx="8" fill="#f0f6ec" stroke="#15202b" stroke-width="4"></rect>
    <text x="708" y="108" font-size="23" font-weight="900">ESP-NOW</text>
    <text x="706" y="140" font-size="21" font-weight="800" fill="#52616f">wireless packets</text>
    <rect x="325" y="295" width="230" height="132" rx="8" fill="#eef8fa" stroke="#15202b" stroke-width="4"></rect>
    <text x="355" y="344" font-size="23" font-weight="900">ESP32-C3</text>
    <text x="354" y="376" font-size="21" font-weight="800" fill="#52616f">boat controller</text>
    <rect x="670" y="300" width="220" height="124" rx="8" fill="#ffffff" stroke="#15202b" stroke-width="4"></rect>
    <text x="707" y="350" font-size="23" font-weight="900">TB6612FNG</text>
    <text x="700" y="382" font-size="23" font-weight="900">motor driver</text>
    <circle cx="705" cy="475" r="32" fill="#f4b942" stroke="#15202b" stroke-width="4"></circle>
    <circle cx="855" cy="475" r="32" fill="#f4b942" stroke="#15202b" stroke-width="4"></circle>
    <text x="650" y="512" font-size="20" font-weight="900">left 130 motor</text>
    <text x="805" y="512" font-size="20" font-weight="900">right 130 motor</text>
    <line x1="235" y1="122" x2="325" y2="122" stroke="#22577a" stroke-width="5" marker-end="url(#wireArrow)"></line>
    <line x1="555" y1="122" x2="670" y2="122" stroke="#22577a" stroke-width="5" marker-end="url(#wireArrow)"></line>
    <line x1="780" y1="180" x2="780" y2="300" stroke="#22577a" stroke-width="5" stroke-dasharray="12 10" marker-end="url(#wireArrow)"></line>
    <line x1="555" y1="360" x2="670" y2="360" stroke="#22577a" stroke-width="5" marker-end="url(#wireArrow)"></line>
    <line x1="735" y1="424" x2="705" y2="443" stroke="#22577a" stroke-width="5" marker-end="url(#wireArrow)"></line>
    <line x1="825" y1="424" x2="855" y2="443" stroke="#22577a" stroke-width="5" marker-end="url(#wireArrow)"></line>
  </svg>
`;

const svgDifferential = `
  <svg viewBox="0 0 840 430" role="img" aria-label="Differential steering">
    <defs>
      <marker id="steerArrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
        <path d="M0,0 L10,5 L0,10 Z" fill="#15202b"></path>
      </marker>
    </defs>
    <rect x="0" y="248" width="840" height="182" fill="#b5e0e6"></rect>
    <path d="M0 260 C100 240 190 282 300 258 C415 235 520 282 635 260 C735 242 790 270 840 252 L840 430 L0 430 Z" fill="#087e8b"></path>
    <path d="M255 150 L585 150 L625 255 L215 255 Z" fill="#f4b942" stroke="#15202b" stroke-width="5"></path>
    <circle cx="265" cy="272" r="31" fill="#ffffff" stroke="#15202b" stroke-width="4"></circle>
    <circle cx="575" cy="272" r="31" fill="#ffffff" stroke="#15202b" stroke-width="4"></circle>
    <text x="165" y="235" font-size="26" font-weight="900" fill="#ffffff">left motor slow</text>
    <text x="575" y="235" font-size="26" font-weight="900" fill="#ffffff">right motor fast</text>
    <line x1="265" y1="272" x2="170" y2="272" stroke="#d95d39" stroke-width="8" marker-end="url(#steerArrow)"></line>
    <line x1="575" y1="272" x2="725" y2="272" stroke="#5a8f3d" stroke-width="8" marker-end="url(#steerArrow)"></line>
    <path d="M330 105 C430 30 560 55 625 132" fill="none" stroke="#15202b" stroke-width="6" stroke-dasharray="12 12" marker-end="url(#steerArrow)"></path>
    <text x="330" y="62" font-size="28" font-weight="900" fill="#15202b">boat turns left</text>
  </svg>
`;

const decks = {
  physics: {
    label: "Part 1",
    title: "Physics: Why Boats Float",
    subtitle: "Buoyancy, displacement, waterline, draft, stability, and practice problems.",
    theme: "physics",
    slides: [
      {
        kicker: "Part 1: Physics",
        title: "Physics: Why Boats Float",
        subtitle: "Before designing an RC boat, we need a mental model for water, weight, and stability.",
        body: `
          <div class="hero-layout">
            <ul class="big-list">
              <li><span class="marker">1</span><span>Identify the four main forces on a boat.</span></li>
              <li><span class="marker">2</span><span>Use displacement to estimate whether an object floats.</span></li>
              <li><span class="marker">3</span><span>Draw waterline, draft, and freeboard with real numbers.</span></li>
            </ul>
            <div class="visual">${imageAsset(physicsImages.boatForces, "Illustration of a boat floating with colored force arrows and a dashed waterline.")}</div>
          </div>
        `
      },
      {
        kicker: "Forces",
        title: "The Four Forces on a Boat",
        subtitle: "A boat is a moving system. Floating and driving both come from force balance.",
        body: `
          <div class="two-col">
            <div class="visual">${imageAsset(physicsImages.boatForces, "Illustration of a boat floating with colored force arrows and a dashed waterline.")}</div>
            <ul class="big-list">
              <li><span class="marker">W</span><span><strong>Weight:</strong> gravity pulls the boat down.</span></li>
              <li><span class="marker">B</span><span><strong>Buoyancy:</strong> water pushes the boat up.</span></li>
              <li><span class="marker">T</span><span><strong>Thrust:</strong> motors push air or water backward.</span></li>
              <li><span class="marker">D</span><span><strong>Drag:</strong> water and air resist motion.</span></li>
            </ul>
          </div>
        `
      },
      {
        kicker: "Buoyancy",
        title: "Archimedes' Idea",
        subtitle: "A floating object pushes water out of the way. The water pushes back.",
        body: `
          <div class="formula">
            <h3>Fresh water shortcut</h3>
            <div class="math-box">
              <math display="block">
                <mn>1</mn>
                <msup><mi>cm</mi><mn>3</mn></msup>
                <mo>&#x2248;</mo>
                <mn>1</mn>
                <mi>g</mi>
              </math>
            </div>
            <p>One cubic centimeter of displaced fresh water supports about one gram of mass.</p>
          </div>
          <div class="activity"><h3>Think</h3><p>If a box pushes away 300 cm^3 of water, about how many grams can it support before it is exactly at the waterline?</p></div>
        `
      },
      {
        kicker: "Vocabulary",
        title: "Waterline, Draft, and Freeboard",
        subtitle: "These three words describe the same picture from different angles.",
        body: `
          <div class="three-col">
            <div class="comparison-card"><h3>Waterline</h3><p>The line or position where the water touches the hull.</p></div>
            <div class="comparison-card"><h3>Draft</h3><p>The vertical distance from the bottom of the hull to the waterline.</p></div>
            <div class="comparison-card"><h3>Freeboard</h3><p>The vertical distance from the waterline to the top edge of the hull.</p></div>
          </div>
          <div class="activity"><h3>Key sentence</h3><p>The draft tells us where to draw the waterline.</p></div>
        `
      },
      {
        kicker: "Concrete Example",
        title: "Lunch Tray Waterline",
        subtitle: "A lunch tray is a simple model because the bottom area is easy to calculate.",
        body: `
          <div class="hero-layout">
            <div class="visual">${imageAsset(physicsImages.lunchTray, "Illustration of a lunch tray floating with a dashed waterline and draft measurement.")}</div>
            <div class="steps">
              <div class="step"><div><h3>Mass</h3><p>Loaded tray mass = 500 g, so it must displace about 500 cm^3 of water.</p></div></div>
              <div class="step"><div><h3>Bottom area</h3><p>25 cm x 20 cm = 500 cm^2.</p></div></div>
              <div class="step"><div><h3>Draft</h3><p>500 cm^3 / 500 cm^2 = 1 cm. Draw the waterline 1 cm above the bottom.</p></div></div>
            </div>
          </div>
        `
      },
      {
        kicker: "Practice",
        title: "Practice: Lunch Tray Waterline",
        subtitle: "Use the same idea with new numbers.",
        body: `
          <div class="two-col">
            <div class="panel"><h3>Tray A</h3><p>Loaded mass = 600 g. Bottom = 30 cm x 20 cm. Height = 4 cm.</p></div>
            <div class="panel"><h3>Tray B</h3><p>Loaded mass = 600 g. Bottom = 20 cm x 15 cm. Height = 4 cm.</p></div>
          </div>
          <div class="activity"><h3>Your task</h3><p>Calculate draft for each tray. Which tray has more freeboard? Which one is safer for electronics?</p></div>
        `
      },
      {
        kicker: "Stability",
        title: "Why Wide Boats Feel Stable",
        subtitle: "Stability is not only about floating. It is about resisting roll when the boat turns or carries weight.",
        body: `
          <div class="three-col">
            <div class="comparison-card"><h3>Low center of mass</h3><p>Put battery and heavy parts low in the hull.</p></div>
            <div class="comparison-card"><h3>Wide base</h3><p>A wider hull or double hull resists rolling more easily.</p></div>
            <div class="comparison-card"><h3>Symmetry</h3><p>Left and right sides should carry similar weight.</p></div>
          </div>
        `
      },
      {
        kicker: "Safety Margin",
        title: "Do Not Design a Boat That Barely Floats",
        subtitle: "Real boats need room for waves, splashes, mistakes, and extra parts.",
        body: `
          <div class="formula">
            <h3>Classroom rule</h3>
            <div class="math-box">
              <math display="block">
                <msub><mi>V</mi><mtext>target</mtext></msub>
                <mo>=</mo>
                <mn>1.5</mn>
                <mo>&#x00D7;</mo>
                <msub><mi>m</mi><mtext>loaded</mtext></msub>
              </math>
            </div>
            <p>Design for about 1.5 times the loaded mass, then check that the waterline still leaves good freeboard.</p>
          </div>
          <div class="activity"><h3>Practice</h3><p>If the final boat is 700 g, what target displacement should the hull support?</p></div>
        `
      },
      {
        kicker: "Checkpoint",
        title: "Physics Design Checklist",
        subtitle: "Use this checklist before choosing a hull.",
        body: `
          <ul class="big-list">
            <li><span class="marker">1</span><span>Can you explain the difference between waterline and draft?</span></li>
            <li><span class="marker">2</span><span>Can you estimate the draft of a simple rectangular floating shape?</span></li>
            <li><span class="marker">3</span><span>Can you explain why a wider hull is usually more stable?</span></li>
            <li><span class="marker">4</span><span>Can you explain why a safety margin matters?</span></li>
          </ul>
        `
      }
    ],
  },
  modeling: {
    label: "Part 2",
    title: "3D Modeling: Choose Your Hull",
    subtitle: "CAD design choices for a printable RC boat hull.",
    theme: "design",
    slides: [
      {
        kicker: "Part 2: 3D Modeling",
        title: "3D Modeling: Choose Your Hull",
        subtitle: "The hull is the boat's structure, flotation, electronics tray, and design personality.",
        body: `
          <div class="hero-layout">
            <ul class="big-list">
              <li><span class="marker">1</span><span>Compare single hull and double hull designs.</span></li>
              <li><span class="marker">2</span><span>Choose a hull that matches stability, print time, and electronics space.</span></li>
              <li><span class="marker">3</span><span>Plan where motors, battery, controller, and wires will sit.</span></li>
            </ul>
            <div class="visual">${svgHullOptions}</div>
          </div>
        `
      },
      {
        kicker: "Design Goal",
        title: "What the Hull Must Do",
        subtitle: "A good student hull is not the fastest hull. It is the hull that makes learning and testing possible.",
        body: `
          <div class="three-col">
            <div class="comparison-card"><h3>Float</h3><p>Enough volume to support the loaded boat with freeboard.</p></div>
            <div class="comparison-card"><h3>Stay stable</h3><p>Wide enough and balanced enough to resist rolling.</p></div>
            <div class="comparison-card"><h3>Hold parts</h3><p>Dry space for ESP32-C3, driver, battery, wires, and motor mounts.</p></div>
          </div>
        `
      },
      {
        kicker: "Option A",
        title: "Single Hull Design",
        subtitle: "A single hull looks like many traditional boats and can be efficient, but balance matters.",
        body: `
          <div class="two-col">
            <div class="panel"><h3>Advantages</h3><p>Simple outline, one body to print, lower drag potential, easy to make a classic boat shape.</p></div>
            <div class="panel"><h3>Challenges</h3><p>Less roll stability, narrow electronics space, battery placement is more sensitive.</p></div>
          </div>
          <div class="activity"><h3>Good fit</h3><p>Choose this if you want a more realistic boat and are willing to tune balance carefully.</p></div>
        `
      },
      {
        kicker: "Option B",
        title: "Double Hull Design",
        subtitle: "A double hull is like a small catamaran. It is usually the friendliest first build.",
        body: `
          <div class="two-col">
            <div class="panel"><h3>Advantages</h3><p>High stability, wide deck, easy electronics layout, good for two motor differential steering.</p></div>
            <div class="panel"><h3>Challenges</h3><p>More material, more alignment work, turns may be wider if motors are weak.</p></div>
          </div>
          <div class="activity"><h3>Recommended</h3><p>For this project, start with double hull unless the team has a strong reason to choose single hull.</p></div>
        `
      },
      {
        kicker: "Comparison",
        title: "Hull Trade-off Table",
        subtitle: "Use trade-offs instead of guessing which design is better.",
        body: `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Question</th><th>Single hull</th><th>Double hull</th></tr></thead>
              <tbody>
                <tr><td>Beginner stability</td><td>Medium</td><td>High</td></tr>
                <tr><td>Electronics space</td><td>Limited</td><td>Generous deck space</td></tr>
                <tr><td>Print complexity</td><td>One main body</td><td>Two hulls plus bridge</td></tr>
                <tr><td>Speed potential</td><td>Often better</td><td>Good enough for prototype</td></tr>
                <tr><td>First-test success</td><td>Depends on balance</td><td>Usually easier</td></tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        kicker: "CAD Parameters",
        title: "Start With Editable Dimensions",
        subtitle: "Parametric dimensions make iteration less painful.",
        body: `
          <div class="metric-grid">
            <div class="metric"><strong>L</strong><span>Hull length controls volume and straight-line tracking.</span></div>
            <div class="metric"><strong>W</strong><span>Hull width controls volume and stability.</span></div>
            <div class="metric"><strong>H</strong><span>Hull height controls freeboard and splash tolerance.</span></div>
            <div class="metric"><strong>T</strong><span>Wall thickness controls strength, weight, and waterproofing.</span></div>
          </div>
        `
      },
      {
        kicker: "Layout",
        title: "Plan the Deck Before Printing",
        subtitle: "Electronics layout is part of hull design, not an afterthought.",
        body: `
          <div class="three-col">
            <div class="comparison-card"><h3>Battery</h3><p>Low and centered. It is usually the heaviest component.</p></div>
            <div class="comparison-card"><h3>ESP32-C3 and driver</h3><p>High, dry, easy to reach, with wire strain relief.</p></div>
            <div class="comparison-card"><h3>Motors</h3><p>Symmetric left/right placement to avoid unwanted turning.</p></div>
          </div>
          <div class="activity"><h3>Sketch</h3><p>Draw a top view and mark every component before opening CAD.</p></div>
        `
      },
      {
        kicker: "Printability",
        title: "3D Printing Design Rules",
        subtitle: "A printed hull must be light, strong, and sealable.",
        body: `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Choice</th><th>Starting recommendation</th><th>Why</th></tr></thead>
              <tbody>
                <tr><td>Wall thickness</td><td>1.2 mm to 2.0 mm</td><td>Enough shell strength without too much mass.</td></tr>
                <tr><td>Fillets</td><td>Add small fillets</td><td>Reduces stress and makes parts nicer to print.</td></tr>
                <tr><td>Open top</td><td>Use a removable deck cover</td><td>Allows inspection and drying after tests.</td></tr>
                <tr><td>Sealing</td><td>Use tape, epoxy, spray sealant, or silicone</td><td>Layer lines can leak even when the print looks solid.</td></tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        kicker: "Decision",
        title: "Choose a Hull Concept",
        subtitle: "Each team should make a design argument, not just pick the coolest shape.",
        body: `
          <div class="steps">
            <div class="step"><div><h3>Pick one</h3><p>Single hull or double hull.</p></div></div>
            <div class="step"><div><h3>Explain why</h3><p>Use stability, electronics space, print difficulty, and expected waterline.</p></div></div>
            <div class="step"><div><h3>Sketch it</h3><p>Side view, top view, motor positions, electronics bay, and waterline estimate.</p></div></div>
            <div class="step"><div><h3>CAD it</h3><p>Keep dimensions editable so the next version is easy to change.</p></div></div>
          </div>
        `
      }
    ],
  },
  circuits: {
    label: "Part 3",
    title: "Circuit Design: ESP32-C3 RC Boat",
    subtitle: "ESP32-C3 Super Mini, KY-023 Joystick, ESP-NOW, MP1584EN buck converter, TB6612FNG, and two 130 motors.",
    theme: "electronics",
    slides: [
      {
        kicker: "Part 3: Circuit Design",
        title: "Circuit Design: ESP32-C3 RC Boat",
        subtitle: "The electronics turn joystick movement into left and right motor power.",
        body: `
          <ul class="big-list">
            <li><span class="marker">1</span><span>Remote controller: ESP32-C3 Super Mini + KY-023 Joystick.</span></li>
            <li><span class="marker">2</span><span>Use one ESP32-C3 Super Mini on the boat.</span></li>
            <li><span class="marker">3</span><span>Send joystick commands with ESP-NOW wireless packets.</span></li>
            <li><span class="marker">4</span><span>Boat power: 2S LiPo input to MP1584EN Buck Converter, output 5V.</span></li>
            <li><span class="marker">5</span><span>Drive two 130 motor outputs through a TB6612FNG dual motor driver.</span></li>
          </ul>
        `
      },
      {
        kicker: "Circuit Diagram",
        title: "Detailed Wiring Diagram",
        subtitle: "This generated diagram shows the final hardware plan for the remote controller and the boat controller.",
        body: `
          <img class="diagram-image" src="assets/esp32-c3-rc-boat-circuit.png" alt="ESP32-C3 RC boat circuit diagram showing KY-023 joystick, ESP-NOW, MP1584EN buck converter, TB6612FNG, and two 130 motors">
        `
      },
      {
        kicker: "Controller",
        title: "ESP32-C3 Super Mini Roles",
        subtitle: "The same tiny board can play two different roles.",
        body: `
          <div class="two-col">
            <div class="panel"><h3>Remote controller ESP32-C3</h3><p>Reads KY-023 Joystick X/Y values, packages throttle and steering, sends packets over ESP-NOW.</p></div>
            <div class="panel"><h3>Boat ESP32-C3</h3><p>Receives packets, checks timeout, mixes steering and throttle, commands the TB6612FNG motor driver.</p></div>
          </div>
          <div class="activity"><h3>Important</h3><p>The ESP32-C3 GPIO pins are 3.3 V logic. Do not connect motor power directly to GPIO.</p></div>
        `
      },
      {
        kicker: "Wireless",
        title: "ESP-NOW Remote Control",
        subtitle: "ESP-NOW sends small packets directly between ESP32 devices without joining a Wi-Fi router.",
        body: `
          <div class="three-col">
            <div class="comparison-card"><h3>Good for RC</h3><p>Small packets, low overhead, and no phone or router required.</p></div>
            <div class="comparison-card"><h3>Packet size</h3><p>Keep commands tiny: throttle, steering, buttons, sequence number.</p></div>
            <div class="comparison-card"><h3>Failsafe</h3><p>If no valid packet arrives for 300-500 ms, stop both motors.</p></div>
          </div>
        `
      },
      {
        kicker: "Control Packet",
        title: "What Should the Remote Send?",
        subtitle: "A good control packet is simple and easy to debug.",
        body: `
          <div class="table-wrap">
            <table>
              <thead><tr><th>Field</th><th>Example</th><th>Meaning</th></tr></thead>
              <tbody>
                <tr><td>throttle</td><td>-100 to +100</td><td>Reverse, stop, or forward command.</td></tr>
                <tr><td>steering</td><td>-100 to +100</td><td>Left, straight, or right command.</td></tr>
                <tr><td>seq</td><td>0, 1, 2...</td><td>Sequence number for detecting stale packets.</td></tr>
              </tbody>
            </table>
          </div>
        `
      },
      {
        kicker: "Power",
        title: "Power Plan: 2S LiPo to 5V",
        subtitle: "The boat uses a 2S LiPo battery, then an MP1584EN Buck Converter set to 5V.",
        body: `
          <div class="three-col">
            <div class="panel"><h3>Input</h3><p>2S LiPo battery feeds the MP1584EN input. A 2S pack is about 7.4 V nominal and 8.4 V fully charged.</p></div>
            <div class="panel"><h3>Output</h3><p>Adjust the MP1584EN Buck Converter output to 5V before connecting the ESP32-C3 Super Mini or motor driver.</p></div>
            <div class="panel"><h3>Loads</h3><p>5V powers the boat ESP32-C3 and the TB6612FNG motor supply for the two 130 motors in this classroom design.</p></div>
          </div>
          <div class="activity"><h3>Rule</h3><p>Boat-side grounds must connect together: MP1584EN output GND, boat ESP32-C3 GND, and TB6612FNG GND. The remote controller has its own separate ground.</p></div>
        `
      },
      {
        kicker: "Motor Driver",
        title: "Dual Motor Driver",
        subtitle: "The TB6612FNG is the muscle between the boat ESP32-C3 and the two 130 motors.",
        body: `
          <div class="three-col">
            <div class="comparison-card"><h3>Inputs</h3><p>ESP32-C3 sends PWMA, AIN1, AIN2, PWMB, BIN1, BIN2, and STBY control signals.</p></div>
            <div class="comparison-card"><h3>Power</h3><p>TB6612FNG receives 5V from the MP1584EN output for this small 130 motor prototype.</p></div>
            <div class="comparison-card"><h3>Outputs</h3><p>AO1/AO2 drive the left 130 motor. BO1/BO2 drive the right 130 motor.</p></div>
          </div>
          <div class="activity"><h3>Why not direct GPIO?</h3><p>ESP32-C3 pins send logic signals only. The TB6612FNG handles motor current and direction switching.</p></div>
        `
      },
      {
        kicker: "Motors",
        title: "130 Motor Basics",
        subtitle: "A 130 motor is a small brushed DC motor. It is cheap, common, and easy to drive.",
        body: `
          <div class="two-col">
            <div class="panel"><h3>Why use it?</h3><p>Simple two-wire motor, reversible, low cost, enough power for small air-prop prototypes.</p></div>
            <div class="panel"><h3>What to watch</h3><p>Stall current is much higher than normal current. Do not oversize the propeller.</p></div>
          </div>
          <div class="activity"><h3>Bench test</h3><p>Test each motor without water first. Start at low PWM and check direction, vibration, and heat.</p></div>
        `
      },
      {
        kicker: "Differential Drive",
        title: "Differential Steering",
        subtitle: "Two motors can turn the boat without a rudder.",
        body: `
          <div class="hero-layout">
            <div class="visual">${svgDifferential}</div>
            <div class="formula">
              <h3>Mixing rule</h3>
              <div class="math-box">
                <math display="block">
                  <mtable>
                    <mtr><mtd><msub><mi>M</mi><mtext>left</mtext></msub></mtd><mtd><mo>=</mo></mtd><mtd><mi>throttle</mi><mo>+</mo><mi>steering</mi></mtd></mtr>
                    <mtr><mtd><msub><mi>M</mi><mtext>right</mtext></msub></mtd><mtd><mo>=</mo></mtd><mtd><mi>throttle</mi><mo>-</mo><mi>steering</mi></mtd></mtr>
                  </mtable>
                </math>
              </div>
            </div>
          </div>
        `
      },
      {
        kicker: "Failsafe",
        title: "The Boat Must Know When to Stop",
        subtitle: "A lost wireless signal should never mean motors keep running.",
        body: `
          <div class="steps">
            <div class="step"><div><h3>Record time</h3><p>Every time a packet arrives, save the current time.</p></div></div>
            <div class="step"><div><h3>Check age</h3><p>If the newest packet is older than 300-500 ms, treat the signal as lost.</p></div></div>
            <div class="step"><div><h3>Stop motors</h3><p>Set left and right motor commands to zero.</p></div></div>
          </div>
        `
      },
      {
        kicker: "Wiring",
        title: "Suggested Wiring Checklist",
        subtitle: "Wire slowly. Test one subsystem at a time.",
        body: `
          <ul class="big-list">
            <li><span class="marker">1</span><span>KY-023 Joystick VRx/VRy to remote ESP32-C3 ADC pins; SW can be left unused or used as a debug button.</span></li>
            <li><span class="marker">2</span><span>Remote ESP32-C3 sends throttle and steering to boat ESP32-C3 using ESP-NOW.</span></li>
            <li><span class="marker">3</span><span>2S LiPo input to MP1584EN; adjust MP1584EN output to 5V before connecting electronics.</span></li>
            <li><span class="marker">4</span><span>Boat ESP32-C3 output pins to TB6612FNG PWMA, AIN1, AIN2, PWMB, BIN1, BIN2, STBY.</span></li>
            <li><span class="marker">5</span><span>TB6612FNG AO1/AO2 to left 130 motor; BO1/BO2 to right 130 motor.</span></li>
            <li><span class="marker">6</span><span>Boat-side common ground shared by MP1584EN output, boat ESP32-C3, and TB6612FNG. No GND wire between remote and boat.</span></li>
          </ul>
        `
      },
      {
        kicker: "Debug",
        title: "Circuit Test Order",
        subtitle: "Debugging order matters more than clever code.",
        body: `
          <div class="steps">
            <div class="step"><div><h3>Joystick only</h3><p>Print X/Y values to serial. Confirm center, min, max.</p></div></div>
            <div class="step"><div><h3>ESP-NOW only</h3><p>Send joystick values and print them on the boat ESP32-C3.</p></div></div>
            <div class="step"><div><h3>Motor driver only</h3><p>Run each motor forward and reverse at low PWM.</p></div></div>
            <div class="step"><div><h3>Full system</h3><p>Enable failsafe, then test low-speed steering with the boat lifted.</p></div></div>
          </div>
        `
      }
    ],
  },
};

const deck = document.querySelector("#deck");
const controls = document.querySelector(".deck-controls");
const slideCount = document.querySelector("#slideCount");
const progressBar = document.querySelector("#progressBar");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const overviewBtn = document.querySelector("#overviewBtn");
const printBtn = document.querySelector("#printBtn");
const homeBtn = document.querySelector("#homeBtn");
const overview = document.querySelector("#overview");
const overviewGrid = document.querySelector("#overviewGrid");
const closeOverviewBtn = document.querySelector("#closeOverviewBtn");

let currentDeckId = new URLSearchParams(window.location.search).get("deck");
let currentSlide = Number.parseInt(new URLSearchParams(window.location.search).get("slide") || "1", 10) - 1;

function activeSlides() {
  return currentDeckId && decks[currentDeckId] ? decks[currentDeckId].slides : [];
}

function updateUrl() {
  const url = new URL(window.location.href);
  if (currentDeckId) {
    url.searchParams.set("deck", currentDeckId);
    url.searchParams.set("slide", String(currentSlide + 1));
  } else {
    url.searchParams.delete("deck");
    url.searchParams.delete("slide");
  }
  window.history.replaceState({}, "", url);
}

function showDeckMenu() {
  currentDeckId = null;
  currentSlide = 0;
  deck.innerHTML = `
    <section class="slide active kicker-project deck-menu" aria-label="Deck menu">
      <header class="slide-header">
        <p class="kicker">Summer STEM Project</p>
        <h1>RC Boat Project Lab</h1>
        <p class="subtitle">Explore the three learning modules behind a working remote-controlled boat: physics, 3D modeling, and circuit design.</p>
      </header>
      <div class="content deck-card-grid">
        ${Object.entries(decks).map(([id, item]) => `
          <button class="deck-card" type="button" data-deck="${id}">
            <span>${item.label}</span>
            <strong>${item.title}</strong>
            <small>${item.subtitle}</small>
          </button>
        `).join("")}
      </div>
      <footer class="footer-note">Start with any module. Each one can be viewed or printed separately.</footer>
    </section>
  `;
  controls.style.display = "none";
  progressBar.style.width = "0";
  deck.querySelectorAll(".deck-card").forEach((card) => {
    card.addEventListener("click", () => openDeck(card.dataset.deck, 0));
  });
  updateUrl();
}

function openDeck(deckId, slideIndex = 0) {
  currentDeckId = deckId;
  currentSlide = slideIndex;
  renderSlides();
  updateSlide();
}

function renderSlides() {
  const deckInfo = decks[currentDeckId];
  if (!deckInfo) {
    showDeckMenu();
    return;
  }
  controls.style.display = "flex";
  deck.innerHTML = deckInfo.slides.map((slide, index) => `
    <section class="slide kicker-${deckInfo.theme}" data-index="${index}" aria-label="Slide ${index + 1}: ${slide.title}">
      <header class="slide-header">
        <p class="kicker">${slide.kicker}</p>
        ${index === 0 ? `<h1>${slide.title}</h1>` : `<h2>${slide.title}</h2>`}
        ${slide.subtitle ? `<p class="subtitle">${slide.subtitle}</p>` : ""}
      </header>
      <div class="content">${slide.body}</div>
      <footer class="footer-note">${deckInfo.label}: ${deckInfo.title}</footer>
    </section>
  `).join("");

  overviewGrid.innerHTML = deckInfo.slides.map((slide, index) => `
    <button class="overview-card" type="button" data-target="${index}">
      <strong>${String(index + 1).padStart(2, "0")} · ${slide.kicker}</strong>
      <span>${slide.title}</span>
    </button>
  `).join("");

  overviewGrid.querySelectorAll(".overview-card").forEach((card) => {
    card.addEventListener("click", () => {
      goToSlide(Number.parseInt(card.dataset.target, 10));
      closeOverview();
    });
  });
}

function updateSlide() {
  const slides = activeSlides();
  if (!slides.length) {
    showDeckMenu();
    return;
  }
  currentSlide = Math.max(0, Math.min(slides.length - 1, currentSlide));
  document.querySelectorAll(".slide").forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
  });
  slideCount.textContent = `${currentSlide + 1} / ${slides.length}`;
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === slides.length - 1;
  updateUrl();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlide();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function previousSlide() {
  goToSlide(currentSlide - 1);
}

function openOverview() {
  overview.classList.add("open");
  overview.setAttribute("aria-hidden", "false");
}

function closeOverview() {
  overview.classList.remove("open");
  overview.setAttribute("aria-hidden", "true");
}

prevBtn.addEventListener("click", previousSlide);
nextBtn.addEventListener("click", nextSlide);
overviewBtn.addEventListener("click", openOverview);
closeOverviewBtn.addEventListener("click", closeOverview);
printBtn.addEventListener("click", () => window.print());
homeBtn.addEventListener("click", showDeckMenu);

document.addEventListener("keydown", (event) => {
  if (!currentDeckId) {
    return;
  }
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    nextSlide();
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    previousSlide();
  }
  if (event.key === "Home") {
    event.preventDefault();
    goToSlide(0);
  }
  if (event.key === "End") {
    event.preventDefault();
    goToSlide(activeSlides().length - 1);
  }
  if (event.key === "Escape") {
    closeOverview();
  }
});

if (!decks[currentDeckId]) {
  showDeckMenu();
} else {
  renderSlides();
  updateSlide();
}
