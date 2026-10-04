const playfield = document.getElementById("playfield");
const mortLayer = document.getElementById("morts");
const voice = document.getElementById("mortVoice");

const MORT_SIZE = 120;
const MIN_SPEED = 120;
const MAX_SPEED = 280;
const MORT_COUNT = 8;

const morts = [];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomVelocity() {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(MIN_SPEED, MAX_SPEED);
  return {
    x: Math.cos(angle) * speed,
    y: Math.sin(angle) * speed
  };
}

function spawnLocalMort() {
  const element = document.createElement("img");
  element.className = "mort";
  element.src = "assets/mort.jpg";
  element.alt = "";

  const maxX = Math.max(0, playfield.clientWidth - MORT_SIZE);
  const maxY = Math.max(0, playfield.clientHeight - MORT_SIZE);

  const instance = {
    element,
    x: randomBetween(0, maxX),
    y: randomBetween(0, maxY),
    ...randomVelocity()
  };

  mortLayer.appendChild(element);
  morts.push(instance);
}

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
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
    return;
  }

  playVoice();
  if (morts.length < MORT_COUNT) {
    spawnLocalMort();
  }
});

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

window.addEventListener("resize", () => {
  const width = playfield.clientWidth;
  const height = playfield.clientHeight;

  for (const mort of morts) {
    mort.x = Math.min(mort.x, Math.max(0, width - MORT_SIZE));
    mort.y = Math.min(mort.y, Math.max(0, height - MORT_SIZE));
  }
});

for (let i = 0; i < MORT_COUNT; i++) {
  spawnLocalMort();
}

requestAnimationFrame(animate);
