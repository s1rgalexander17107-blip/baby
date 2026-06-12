const buttonArea = document.getElementById("buttonArea");
const noButton = document.getElementById("noButton");
const yesButton = document.getElementById("yesButton");
const questionPanel = document.getElementById("questionPanel");
const answerPanel = document.getElementById("answerPanel");

let noButtonIsRunning = false;

// Calculates a random point that keeps the "No" button fully inside the button area.
function getRandomPosition() {
  const areaRect = buttonArea.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const padding = 10;

  const maxLeft = Math.max(padding, areaRect.width - buttonRect.width - padding);
  const maxTop = Math.max(padding, areaRect.height - buttonRect.height - padding);
  const yesRect = yesButton.getBoundingClientRect();
  const yesBounds = {
    left: yesRect.left - areaRect.left - padding,
    right: yesRect.right - areaRect.left + padding,
    top: yesRect.top - areaRect.top - padding,
    bottom: yesRect.bottom - areaRect.top + padding
  };

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const position = {
      left: randomBetween(padding, maxLeft),
      top: randomBetween(padding, maxTop)
    };

    if (!overlapsYesButton(position, buttonRect, yesBounds)) {
      return position;
    }
  }

  return {
    left: randomBetween(padding, maxLeft),
    top: randomBetween(padding, maxTop)
  };
}

function overlapsYesButton(position, buttonRect, yesBounds) {
  const noBounds = {
    left: position.left,
    right: position.left + buttonRect.width,
    top: position.top,
    bottom: position.top + buttonRect.height
  };

  return !(
    noBounds.right < yesBounds.left ||
    noBounds.left > yesBounds.right ||
    noBounds.bottom < yesBounds.top ||
    noBounds.top > yesBounds.bottom
  );
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Keeps the initial layout perfectly aligned, then switches only the escaping button to absolute positioning.
function startRunningMode() {
  if (noButtonIsRunning) {
    return;
  }

  const areaRect = buttonArea.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();

  noButton.style.left = `${buttonRect.left - areaRect.left}px`;
  noButton.style.top = `${buttonRect.top - areaRect.top}px`;
  noButton.classList.add("is-running");
  noButtonIsRunning = true;
}

// Moves smoothly thanks to the CSS transition on left/top.
function moveNoButton() {
  startRunningMode();

  const nextPosition = getRandomPosition();
  noButton.style.left = `${nextPosition.left}px`;
  noButton.style.top = `${nextPosition.top}px`;
}

function showHappyAnswer() {
  questionPanel.classList.add("hidden");
  answerPanel.classList.remove("hidden");
}

noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("focus", moveNoButton);
noButton.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

yesButton.addEventListener("click", showHappyAnswer);

window.addEventListener("resize", () => {
  if (noButtonIsRunning) {
    moveNoButton();
  }
});
