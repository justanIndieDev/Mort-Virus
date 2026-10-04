const playfield = document.getElementById("playfield");
const voice = document.getElementById("mortVoice");

const WINDOW_SIZE = 400;
const MIN_SPEED = 3;
const MAX_SPEED = 7;
const mortWindows = [];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
}

function createMortWindow() {
  const element = document.createElement("div");
  element.className = "mort-window";

  const image = document.createElement("img");
  image.src = "assets/mort.jpg";
  image.alt = "";
  image.className = "mort";

  element.appendChild(image);
  playfield.appendChild(element);

  const maxX = Math.max(0, playfield.clientWidth - WINDOW_SIZE);
  const maxY = Math.max(0, playfield.clientHeight - WINDOW_SIZE);
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(MIN_SPEED, MAX_SPEED);

  const instance = {
    element,
    x: randomBetween(0, maxX),
    y: randomBetween(0, maxY),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed
  };

  mortWindows.push(instance);
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    document.body.innerHTML = "";
    document.body.style.background = "white";
    return;
  }

  playVoice();
  createMortWindow();
}

function animate(now) {
  const dt = Math.min((now - animate.lastTime) / 16.67, 2);
  animate.lastTime = now;

  const width = playfield.clientWidth;
  const height = playfield.clientHeight;

  for (const item of mortWindows) {
    item.x += item.vx * dt;
    item.y += item.vy * dt;

    const maxX = Math.max(0, width - WINDOW_SIZE);
    const maxY = Math.max(0, height - WINDOW_SIZE);

    if (item.x <= 0) {
      item.x = 0;
      item.vx = Math.abs(item.vx);
    } else if (item.x >= maxX) {
      item.x = maxX;
      item.vx = -Math.abs(item.vx);
    }

    if (item.y <= 0) {
      item.y = 0;
      item.vy = Math.abs(item.vy);
    } else if (item.y >= maxY) {
      item.y = maxY;
      item.vy = -Math.abs(item.vy);
    }

    item.element.style.transform =
      `translate3d(${item.x}px, ${item.y}px, 0)`;
  }

  requestAnimationFrame(animate);
}

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("resize", () => {
  const width = playfield.clientWidth;
  const height = playfield.clientHeight;

  for (const item of mortWindows) {
    item.x = Math.min(item.x, Math.max(0, width - WINDOW_SIZE));
    item.y = Math.min(item.y, Math.max(0, height - WINDOW_SIZE));
  }
});

createMortWindow();
animate.lastTime = performance.now();
requestAnimationFrame(animate);
