const playfield = document.getElementById("playfield");
const mortLayer = document.getElementById("morts");
const voice = document.getElementById("mortVoice");

const MORT_SIZE = 120;
const MIN_SPEED = 120;
const MAX_SPEED = 280;

const morts = [];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomVelocity() {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(MIN_SPEED, MAX_SPEED);

  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };
}

function spawnLocalMort() {
  const mort = document.createElement("img");
  mort.className = "mort";
  mort.src = "assets/mort.jpg";
  mort.alt = "";

  const maxX = Math.max(0, playfield.clientWidth - MORT_SIZE);
  const maxY = Math.max(0, playfield.clientHeight - MORT_SIZE);

  const instance = {
    element: mort,
    x: randomBetween(0, maxX),
    y: randomBetween(0, maxY),
    ...randomVelocity()
  };

  mortLayer.appendChild(mort);
  morts.push(instance);
}

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
}

function openMortWindow() {
  const features = [
    "popup=yes",
    "width=400",
    "height=400",
    "resizable=yes",
    "scrollbars=no"
  ].join(",");

  const child = window.open(
    `${window.location.pathname}?mort=1${window.location.hash}`,
    "_blank",
    features
  );

  if (child) {
    try {
      child.focus();
    } catch (_) {}
  }
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    window.close();
    return;
  }

  playVoice();
  openMortWindow();
}

let previousTime = performance.now();

function animate(now) {
  const dt = Math.min((now - previousTime) / 1000, 0.05);
  previousTime = now;

  const width = playfield.clientWidth;
  const height = playfield.clientHeight;

  for (const mort of morts) {
    mort.x += mort.vx * dt;
    mort.y += mort.vy * dt;

    if (mort.x <= 0) {
      mort.x = 0;
      mort.vx = Math.abs(mort.vx);
    } else if (mort.x + MORT_SIZE >= width) {
      mort.x = Math.max(0, width - MORT_SIZE);
      mort.vx = -Math.abs(mort.vx);
    }

    if (mort.y <= 0) {
      mort.y = 0;
      mort.vy = Math.abs(mort.vy);
    } else if (mort.y + MORT_SIZE >= height) {
      mort.y = Math.max(0, height - MORT_SIZE);
      mort.vy = -Math.abs(mort.vy);
    }

    mort.element.style.transform =
      `translate3d(${mort.x}px, ${mort.y}px, 0)`;
  }

  requestAnimationFrame(animate);
}

window.addEventListener("keydown", handleKeyDown);

window.addEventListener("resize", () => {
  const width = playfield.clientWidth;
  const height = playfield.clientHeight;

  for (const mort of morts) {
    mort.x = Math.min(mort.x, Math.max(0, width - MORT_SIZE));
    mort.y = Math.min(mort.y, Math.max(0, height - MORT_SIZE));
  }
});

spawnLocalMort();
requestAnimationFrame(animate);
