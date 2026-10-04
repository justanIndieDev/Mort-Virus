const playfield = document.getElementById("playfield");
const mortLayer = document.getElementById("morts");
const voice = document.getElementById("mortVoice");

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

// Keep Mort stationary inside the window.
const mort = document.querySelector(".mort");

if (mort) {
  mort.style.position = "absolute";
  mort.style.left = "50%";
  mort.style.top = "50%";
  mort.style.transform = "translate(-50%, -50%)";
}

// Move the popup window itself and bounce it off the screen edges.
let windowX = window.screenX;
let windowY = window.screenY;

const WINDOW_SPEED = 4;
let windowVX = WINDOW_SPEED;
let windowVY = WINDOW_SPEED * 0.8;

function movePopup() {
  // Only move windows opened by this Mort page.
  if (!window.opener) return;

  const maxX = Math.max(
    0,
    window.screen.availLeft + window.screen.availWidth - window.outerWidth
  );
  const maxY = Math.max(
    0,
    window.screen.availTop + window.screen.availHeight - window.outerHeight
  );

  windowX += windowVX;
  windowY += windowVY;

  if (windowX <= window.screen.availLeft) {
    windowX = window.screen.availLeft;
    windowVX = Math.abs(windowVX);
  } else if (windowX >= maxX) {
    windowX = maxX;
    windowVX = -Math.abs(windowVX);
  }

  if (windowY <= window.screen.availTop) {
    windowY = window.screen.availTop;
    windowVY = Math.abs(windowVY);
  } else if (windowY >= maxY) {
    windowY = maxY;
    windowVY = -Math.abs(windowVY);
  }

  try {
    window.moveTo(Math.round(windowX), Math.round(windowY));
  } catch (_) {}
}

window.addEventListener("keydown", handleKeyDown);

window.addEventListener("load", () => {
  windowX = window.screenX;
  windowY = window.screenY;
});

setInterval(movePopup, 16);
