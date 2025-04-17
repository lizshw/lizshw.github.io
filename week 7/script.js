const airportAudio = document.querySelector("#airport-audio");
console.log(airportAudio);

const playButton = document.querySelector("#play-button");
console.log(airportAudio);

playButton.addEventListener("click", playAudio);

function playAudio() {
  airportAudio.play();
}

const pauseButton = document.querySelector("#pause-button");
console.log(airportAudio);

pauseButton.addEventListener("click", pauseAudio);

function pauseAudio() {
  airportAudio.pause();
}

const popSound = document.querySelector("#pop-sound");
const popButton = document.querySelector("#pop-button");
console.log(popSound);

popButton.addEventListener("click", popAudio);

function popAudio() {
  popSound.play();
}
