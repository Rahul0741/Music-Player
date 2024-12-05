// Playlist: Array of songs
const playlist = [
  { title: "The Life of Ram", artist: "Govind Vasanth", src: "assets/songs/The_Life_Of_Ram-MassTamilan.com.mp3" },
  { title: "Kanave Kanave", artist: "Anirudh", src: "assets/songs/Kanave-Kanave-MassTamilan.com.mp3" },
  { title: "Hosanna", artist: "AR Rahman", src: "assets/songs/Hosanna.mp3" },
  { title: "Ava Enna Enna", artist: "Harris Jayaraj", src: "assets/songs/Ava-Enna-Enna-MassTamilan.com.mp3" },
  { title: "Nee Paartha Vizhigal", artist: "Anirudh", src: "assets/songs/_Nee Paartha Vizhigal-SenSongsMp3.Co.mp3" },
  { title: "Machi Open the Bottle", artist: "Yuvan Shankar Raja", src: "assets/songs/Machi-Open-The-Bottle.mp3" },
  { title: "Nee Singam Dhan", artist: "AR Rahman", src: "assets/songs/Nee-Singam-Dhan-MassTamilan.dev.mp3" },
  { title: "Udhungada Sangu", artist: "Anirudh", src: "assets/songs/Udhungada Sangu.mp3" },
  { title: "Yaaro Ivan Yaaro", artist: "Govind Vasanth", src: "assets/songs/Yaaro Ivan Yaaro.mp3" },
  { title: "Ullaallaa", artist: "Anirudh", src: "assets/songs/Ullaallaa-MassTamilan.org.mp3" },
];

// Artist images mapping
const artistImages = {
  "Govind Vasanth": "assets/artists/Govind Vasanth.webp",
  "Anirudh": "assets/artists/Anirudh.jpg",
  "Harris Jayaraj": "assets/artists/Harris Jayaraj.jpeg",
  "Yuvan Shankar Raja": "assets/artists/Yuvan Shankar Raja.webp",
  "AR Rahman": "assets/artists/AR Rahman.jpeg",
};

// DOM Elements
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");
const progressBar = document.getElementById("progress-bar");
const volumeSlider = document.getElementById("volume");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist");
const artistImage = document.getElementById("album-art");
const currentTimeEl = document.getElementById("current-time");
const songDurationEl = document.getElementById("song-duration");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const playlistContainer = document.getElementById("playlist");
const playlistContent = document.getElementById("playlist-content");

// Current state
let isPlaying = false;
let currentIndex = 0;
let isShuffling = false;
let repeatState = 0; // 0: Off, 1: Repeat All, 2: Repeat One

// Function to load a song
function loadSong(index) {
  const song = playlist[index];
  songTitle.innerText = song.title;
  artistName.innerText = song.artist;
  audio.src = song.src;

  // Set artist image
  setArtistImage(song.artist);

  audio.addEventListener("loadedmetadata", () => {
    songDurationEl.innerText = formatTime(audio.duration || 0);
  });

  highlightCurrentSong();
}

// Function to set the artist image
function setArtistImage(artist) {
  artistImage.src = artistImages[artist] || "assets/artists/default.jpg";
}

// Highlight the current song in the playlist
function highlightCurrentSong() {
  const items = document.querySelectorAll(".playlist-item");
  items.forEach((item, index) => {
    item.classList.toggle("active", index === currentIndex);
  });
}

// Format time (MM:SS)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Toggle Play/Pause
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

// Update Play/Pause Button State
audio.addEventListener("play", () => {
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

// Play Next Song
function playNext() {
  currentIndex = isShuffling
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  audio.play();
}

// Play Previous Song
function playPrevious() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  audio.play();
}

// Shuffle Toggle
shuffleButton.addEventListener("click", () => {
  isShuffling = !isShuffling;
  shuffleButton.classList.toggle("active", isShuffling);
});

// Repeat Toggle Functionality
repeatButton.addEventListener("click", () => {
  repeatState = (repeatState + 1) % 3;
  updateRepeatButton();
});

// Update the Repeat Button UI
function updateRepeatButton() {
  if (repeatState === 0) {
    repeatButton.innerHTML = '<i class="bi bi-repeat"></i>';
  } else if (repeatState === 1) {
    repeatButton.innerHTML = '<i class="bi bi-arrow-repeat"></i>';
  } else if (repeatState === 2) {
    repeatButton.innerHTML = '<i class="bi bi-repeat-1"></i>';
  }
}

// End of Song Handler
audio.addEventListener("ended", () => {
  if (repeatState === 2) {
    audio.currentTime = 0;
    audio.play();
  } else if (repeatState === 1) {
    playNext();
  } else if (currentIndex < playlist.length - 1) {
    playNext();
  }
});

// Update Progress Bar
audio.addEventListener("timeupdate", () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress || 0;
  currentTimeEl.innerText = formatTime(audio.currentTime || 0);
});

// Seek Song
progressBar.addEventListener("input", (e) => {
  const seekTime = (e.target.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

// Volume Control
volumeSlider.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

// Initialize
loadSong(currentIndex);
playPauseBtn.addEventListener("click", togglePlayPause);
nextButton.addEventListener("click", playNext);
prevButton.addEventListener("click", playPrevious);
