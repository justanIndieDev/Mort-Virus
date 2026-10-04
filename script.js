const playfield = document.getElementById("playfield");
const mort = document.getElementById("mort");

const MORT_SIZE = 120;
const MIN_SPEED = 180;
const MAX_SPEED = 320;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomVelocity() {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(MIN_SPEED, MAX_SPEED);
  return { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
}

let x = 0;
let y = 0;
let vx = 0;
let vy = 0;

function resetPosition() {
  const maxX = Math.max(0, playfield.clientWidth - MORT_SIZE);
  const maxY = Math.max(0, playfield.clientHeight - MORT_SIZE);
  x = randomBetween(0, maxX);
  y = randomBetween(0, maxY);
  ({ x: vx, y: vy } = randomVelocity());
}

function closeWindow() {
  window.close();
  setTimeout(() => {
    if (!window.closed) {
      window.open("", "_self");
      window.close();
    }
  }, 50);
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeWindow();
  }
});

let previousTime = performance.now();

function animate(now) {
  const dt = Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;

  const width = playfield.clientWidth;
  const height = playfield.clientHeight;

  x += vx * dt;
  y += vy * dt;

  if (x <= 0) {
    x = 0;
    vx = Math.abs(vx);
  } else if (x + MORT_SIZE >= width) {
    x = Math.max(0, width - MORT_SIZE);
    vx = -Math.abs(vx);
  }

  if (y <= 0) {
    y = 0;
    vy = Math.abs(vy);
  } else if (y + MORT_SIZE >= height) {
    y = Math.max(0, height - MORT_SIZE);
    vy = -Math.abs(vy);
  }

  mort.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  x = Math.min(x, Math.max(0, playfield.clientWidth - MORT_SIZE));
  y = Math.min(y, Math.max(0, playfield.clientHeight - MORT_SIZE));
});

resetPosition();
requestAnimationFrame(animate);
