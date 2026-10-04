const voice = document.getElementById("mortVoice");

let xOff = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 3);
let yOff = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 3);
let xPos = 100;
let yPos = 100;
let flagRun = 1;

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
}

function openWindow() {
  const width = 400;
  const height = 400;
  const left = Math.max(
    screen.availLeft,
    Math.min(
      screen.availLeft + screen.availWidth - width,
      Math.round(screen.availLeft + Math.random() * Math.max(1, screen.availWidth - width))
    )
  );
  const top = Math.max(
    screen.availTop,
    Math.min(
      screen.availTop + screen.availHeight - height,
      Math.round(screen.availTop + Math.random() * Math.max(1, screen.availHeight - height))
    )
  );

  return window.open(
    `${window.location.pathname}?mort=1${window.location.hash}`,
    "_blank",
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=no,scrollbars=no`
  );
}

function procreate() {
  for (let i = 0; i < 6; i++) {
    openWindow();
  }
}

function playBall() {
  xPos += xOff;
  yPos += yOff;

  const minX = screen.availLeft;
  const minY = screen.availTop;
  const maxX = minX + screen.availWidth - window.outerWidth;
  const maxY = minY + screen.availHeight - window.outerHeight;

  if (xPos >= maxX) {
    xPos = maxX;
    xOff = -Math.abs(xOff);
  } else if (xPos <= minX) {
    xPos = minX;
    xOff = Math.abs(xOff);
  }

  if (yPos >= maxY) {
    yPos = maxY;
    yOff = -Math.abs(yOff);
  } else if (yPos <= minY) {
    yPos = minY;
    yOff = Math.abs(yOff);
  }

  if (flagRun === 1) {
    try {
      window.moveTo(Math.round(xPos), Math.round(yPos));
    } catch (_) {}
    requestAnimationFrame(playBall);
  }
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    flagRun = 0;
    try {
      window.close();
    } catch (_) {}
    return;
  }

  playVoice();
  procreate();
}

window.addEventListener("keydown", handleKeyDown);

if (window.opener) {
  xPos = Math.max(screen.availLeft, Math.min(window.screenX, screen.availLeft + screen.availWidth - window.outerWidth));
  yPos = Math.max(screen.availTop, Math.min(window.screenY, screen.availTop + screen.availHeight - window.outerHeight));
  playBall();
}
