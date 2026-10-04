const playfield = document.getElementById("playfield");
const mortLayer = document.getElementById("morts");
const voice = document.getElementById("mortVoice");

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
}

// Windows opened by this page are moved by their opener.
// This is more reliable than a popup trying to move itself.
const movingWindows = [];

function openMortWindow() {
  const screenLeft = window.screen.availLeft;
  const screenTop = window.screen.availTop;
  const screenWidth = window.screen.availWidth;
  const screenHeight = window.screen.availHeight;

  const width = 400;
  const height = 400;
  const left = Math.round(
    screenLeft + Math.random() * Math.max(0, screenWidth - width)
  );
  const top = Math.round(
    screenTop + Math.random() * Math.max(0, screenHeight - height)
  );

  const features = [
    "popup=yes",
    `width=${width}`,
    `height=${height}`,
    `left=${left}`,
    `top=${top}`,
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

    movingWindows.push({
      window: child,
      x: left,
      y: top,
      vx: 4 + Math.random() * 2,
      vy: 3 + Math.random() * 2
    });
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

window.addEventListener("keydown", handleKeyDown);

function animatePopups() {
  const screenLeft = window.screen.availLeft;
  const screenTop = window.screen.availTop;
  const screenRight = screenLeft + window.screen.availWidth;
  const screenBottom = screenTop + window.screen.availHeight;

  for (let i = movingWindows.length - 1; i >= 0; i--) {
    const item = movingWindows[i];

    if (item.window.closed) {
      movingWindows.splice(i, 1);
      continue;
    }

    const width = item.window.outerWidth || 400;
    const height = item.window.outerHeight || 400;
    const maxX = screenRight - width;
    const maxY = screenBottom - height;

    item.x += item.vx;
    item.y += item.vy;

    if (item.x <= screenLeft) {
      item.x = screenLeft;
      item.vx = Math.abs(item.vx);
    } else if (item.x >= maxX) {
      item.x = maxX;
      item.vx = -Math.abs(item.vx);
    }

    if (item.y <= screenTop) {
      item.y = screenTop;
      item.vy = Math.abs(item.vy);
    } else if (item.y >= maxY) {
      item.y = maxY;
      item.vy = -Math.abs(item.vy);
    }

    try {
      item.window.moveTo(Math.round(item.x), Math.round(item.y));
    } catch (_) {}
  }

  requestAnimationFrame(animatePopups);
}

requestAnimationFrame(animatePopups);
