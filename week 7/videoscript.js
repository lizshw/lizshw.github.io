const rickVideo = document.querySelector("#rick-video");
console.log(rickVideo);

const playButton = document.querySelector("#play-button");

playButton.addEventListener("click", playVideo);

function playVideo() {
  rickVideo.play();
}

const pauseButton = document.querySelector("#pause-button");
pauseButton.addEventListener("click", pauseVideo);

function pauseVideo() {
  rickVideo.pause();
}
