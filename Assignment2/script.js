// Get elements
// const startStopBtn = document.getElementById("startStopBtn");
const audio1 = document.getElementById("backgroundAudio");
const audio2 = document.getElementById("alertAudio");
const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");
const timerDisplay = document.getElementById("timer");
const video = document.getElementById("videoPlayer");
const modeIndicator = document.getElementById("modeIndicator");

// Define initial variables
let isRunning = false;
let isFocus = true;
let timeLeft;
let timerInterval;
let adjustingFocus = true; // Controls which time we're adjusting

// Function to update the timer display
function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

// Switch between focus and break
function switchMode() {
  let focusDuration =
    parseInt(focusInput.value) && parseInt(focusInput.value) > 0
      ? parseInt(focusInput.value) * 60
      : 25 * 60;
  let breakDuration =
    parseInt(breakInput.value) && parseInt(breakInput.value) > 0
      ? parseInt(breakInput.value) * 60
      : 5 * 60;

  isFocus = !isFocus;
  timeLeft = isFocus ? focusDuration : breakDuration;
  updateDisplay();

  if (isFocus) {
    video.play();
    audio1.play();
  } else {
    video.pause();
    audio1.pause();
    audio2.play();
    modeIndicator.textContent = "Break Time";
  }
}

// Start or pause the timer
function startTimer() {
  let focusDuration =
    parseInt(focusInput.value) && parseInt(focusInput.value) > 0
      ? parseInt(focusInput.value) * 60
      : 25 * 60;
  let breakDuration =
    parseInt(breakInput.value) && parseInt(breakInput.value) > 0
      ? parseInt(breakInput.value) * 60
      : 5 * 60;

  if (!isRunning) {
    isRunning = true;

    if (timeLeft === 0 || timeLeft == null) {
      timeLeft = isFocus ? focusDuration : breakDuration;
    }

    updateDisplay();

    if (isFocus) {
      video.play();
      audio1.play();
    }

    timerInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        switchMode();
        startTimer(); // Automatically start next phase
      }
    }, 1000);
  } else {
    isRunning = false;
    clearInterval(timerInterval);
    video.pause();
    audio1.pause();
  }
}

// Set initial timer display
timeLeft = 25 * 60;
updateDisplay();

// === iPod-style controls ===

// Central play/pause button
document
  .querySelector(".control-button.center")
  .addEventListener("click", () => {
    startTimer();
  });

// Left arrow: switch to adjusting focus
document.querySelector(".control-button.left").addEventListener("click", () => {
  adjustingFocus = true;
  modeIndicator.textContent = "Focus Time";

  // Add class for border-radius
  focusInput.classList.add("selected");
  breakInput.classList.remove("selected");
});

// Right arrow: switch to adjusting break
document
  .querySelector(".control-button.right")
  .addEventListener("click", () => {
    adjustingFocus = false;
    modeIndicator.textContent = "Break Time";

    // Add class for border-radius
    breakInput.classList.add("selected");
    focusInput.classList.remove("selected");
  });

// Up arrow: increment current timer
document.querySelector(".control-button.top").addEventListener("click", () => {
  if (adjustingFocus) {
    focusInput.value = parseInt(focusInput.value || 25) + 1;
    if (!isRunning && isFocus) {
      timeLeft = parseInt(focusInput.value) * 60;
      updateDisplay();
    }
  } else {
    breakInput.value = parseInt(breakInput.value || 5) + 1;
    if (!isRunning && !isFocus) {
      timeLeft = parseInt(breakInput.value) * 60;
      updateDisplay();
    }
  }
});

// Down arrow: decrement current timer
document
  .querySelector(".control-button.bottom")
  .addEventListener("click", () => {
    if (adjustingFocus) {
      focusInput.value = Math.max(1, parseInt(focusInput.value || 25) - 1);
      if (!isRunning && isFocus) {
        timeLeft = parseInt(focusInput.value) * 60;
        updateDisplay();
      }
    } else {
      breakInput.value = Math.max(1, parseInt(breakInput.value || 5) - 1);
      if (!isRunning && !isFocus) {
        timeLeft = parseInt(breakInput.value) * 60;
        updateDisplay();
      }
    }
  });
