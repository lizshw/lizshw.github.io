// Get elements
const startStopBtn = document.getElementById("startStopBtn");
const audio = document.getElementById("backgroundAudio");
const skipBtn = document.getElementById("skipBtn");
const focusInput = document.getElementById("focusInput");
const breakInput = document.getElementById("breakInput");
const timerDisplay = document.getElementById("timer");
const video = document.getElementById("videoPlayer");

// Define initial variables
let isRunning = false;
let isFocus = true;
let timeLeft;
let timerInterval;

// Function to update the timer display
function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;
  timerDisplay.textContent = `${minutes}:${seconds}`;
}
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
    //alert("Back to focus!");
    video.play();
    audio.play();
  } else {
    //alert("Break time!");
    video.pause();
    audio.pause();
  }
}

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
    startStopBtn.textContent = "Pause";

    if (timeLeft === 0 || timeLeft == null) {
      timeLeft = isFocus ? focusDuration : breakDuration;
    }

    updateDisplay();

    if (isFocus) {
      video.play();
      audio.play().catch((err) => console.log("Audio play error:", err));
    }

    timerInterval = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        startStopBtn.textContent = "Start";
        switchMode();
        startTimer(); // Start next phase
      }
    }, 1000);
  } else {
    isRunning = false;
    startStopBtn.textContent = "Start";
    clearInterval(timerInterval);
    video.pause();
    audio.pause();
  }
}

// Skip 60 seconds for testing
skipBtn.addEventListener("click", () => {
  timeLeft -= 60;
  if (timeLeft < 0) timeLeft = 0;
  updateDisplay();
});

// Button events
startStopBtn.addEventListener("click", startTimer);

// Set initial timer display
timeLeft = 25 * 60;
updateDisplay();
