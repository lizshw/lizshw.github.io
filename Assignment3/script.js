const canvas = document.getElementById("playCanvas");
const ctx = canvas.getContext("2d");
const regenButton = document.getElementById("regenButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Subtle alert sound for overlapping interaction feedback
const alertSound = new Audio("assets/alert.wav");
alertSound.volume = 0.2;

let shapes = [];
let draggedShape = null;
let offsetX = 0;
let offsetY = 0;
let overlappingPairs = new Set();

// Background ambient audio, looped
const audio = new Audio(
  "https://cdn.jsdelivr.net/gh/jshawl/p5js-sound-assets@main/ambient/loop1.mp3"
);
audio.loop = true;

// A palette of earthy tones to evoke a calming natural setting
const earthyColors = [
  "rgba(139, 69, 19, 0.7)",
  "rgba(85, 107, 47, 0.7)",
  "rgba(205, 133, 63, 0.7)",
  "rgba(112, 128, 144, 0.7)",
  "rgba(160, 82, 45, 0.7)",
  "rgba(143, 188, 143, 0.7)",
];

// Variety of abstract organic shapes
const shapeTypes = [
  "circle",
  "roundedRect",
  "roundedTriangle",
  "pentagon",
  "roundedStar",
];

// Generates multiple shapes randomly placed with slight motion
function generateShapes(count = 10) {
  shapes = [];
  for (let i = 0; i < count; i++) {
    shapes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 60 + Math.random() * 30,
      color: earthyColors[i % earthyColors.length],
      type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    });
  }
}

function playAlertSound() {
  const soundClone = alertSound.cloneNode();
  soundClone.play();
}

// Main render loop with animation and collision interaction
function draw() {
  for (let shape of shapes) {
    if (shape !== draggedShape) {
      shape.x += shape.vx;
      shape.y += shape.vy;

      // Bounce off canvas edges with basic collision response
      if (shape.x - shape.r < 0 || shape.x + shape.r > canvas.width) {
        shape.vx *= -1;
        shape.x = Math.max(shape.r, Math.min(canvas.width - shape.r, shape.x));
      }
      if (shape.y - shape.r < 0 || shape.y + shape.r > canvas.height) {
        shape.vy *= -1;
        shape.y = Math.max(shape.r, Math.min(canvas.height - shape.r, shape.y));
      }

      shape.vx *= 0.98; // Apply subtle friction
      shape.vy *= 0.98;
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through each shape and check for visual and sonic overlap
  for (let i = 0; i < shapes.length; i++) {
    let a = shapes[i];

    for (let j = 0; j < shapes.length; j++) {
      if (i !== j && isOverlapping(a, shapes[j])) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.arc(a.x, a.y, a.r + 10, 0, Math.PI * 2);
        ctx.fill();

        const pairKey = [i, j].sort().join("-");
        if (!overlappingPairs.has(pairKey)) {
          overlappingPairs.add(pairKey);
          playAlertSound();
        }
      } else {
        const pairKey = [i, j].sort().join("-");
        overlappingPairs.delete(pairKey);
      }
    }

    drawShape(a);
  }

  requestAnimationFrame(draw);
}

// Master shape drawing logic
function drawShape(shape) {
  ctx.fillStyle = shape.color;
  ctx.beginPath();

  if (shape.type === "circle") {
    ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape.type === "roundedRect") {
    const w = shape.r * 1.2;
    const h = shape.r * 0.8;
    const x = shape.x - w / 2;
    const y = shape.y - h / 2;
    const radius = 20;
    roundedRect(ctx, x, y, w, h, radius);
    ctx.fill();
  } else if (shape.type === "roundedTriangle") {
    drawRoundedTriangle(ctx, shape.x, shape.y, shape.r);
  } else if (shape.type === "pentagon") {
    drawPentagon(ctx, shape.x, shape.y, shape.r);
  } else if (shape.type === "roundedStar") {
    drawRoundedStar(ctx, shape.x, shape.y, shape.r);
  }
}

// Custom triangle with rounded curves
function drawRoundedTriangle(ctx, x, y, size) {
  const height = (size * Math.sqrt(3)) / 2;
  ctx.beginPath();
  ctx.moveTo(x, y - height / 2);
  ctx.quadraticCurveTo(x + size / 2, y, x, y + height / 2);
  ctx.quadraticCurveTo(x - size / 2, y, x, y - height / 2);
  ctx.closePath();
  ctx.fill();
}

// Pentagon shape using polar coordinates
function drawPentagon(ctx, x, y, radius) {
  const angle = (Math.PI * 2) / 5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = angle * i - Math.PI / 2;
    const px = x + Math.cos(a) * radius;
    const py = y + Math.sin(a) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// Star with rounded edges for organic look
function drawRoundedStar(ctx, x, y, radius) {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius * 0.5;
  const step = Math.PI / spikes;
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = i * step - Math.PI / 2;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// Standard rounded rectangle
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Checks circular shape overlap by comparing radii and distance
function isOverlapping(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  return dist < (a.r + b.r) / 2;
}

// Drag detection for interactive movement
canvas.addEventListener("mousedown", (e) => {
  for (let shape of shapes) {
    let dx = e.clientX - shape.x;
    let dy = e.clientY - shape.y;
    if (Math.sqrt(dx * dx + dy * dy) < shape.r) {
      draggedShape = shape;
      offsetX = dx;
      offsetY = dy;
      break;
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (draggedShape) {
    draggedShape.x = e.clientX - offsetX;
    draggedShape.y = e.clientY - offsetY;
  }
});

canvas.addEventListener("mouseup", () => {
  draggedShape = null;
});

// Toggle ambient audio with any key press
window.addEventListener("keydown", () => {
  if (audio.paused) audio.play();
  else audio.pause();
});

// Reset canvas and generate new shapes
regenButton.addEventListener("click", () => {
  generateShapes();
});

// Begin experience
generateShapes();
draw();

/*

References
https://stackoverflow.com/questions/55696130/how-to-constantly-generate-a-moving-shape-with-javascript-and-canvas
https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics

*/
