const foldersDiv = document.getElementById("folders");
const playBtn = document.getElementById("playBtn");
const audio = document.getElementById("audio");
const nowPlaying = document.getElementById("nowPlaying");

let playlist = [];
let currentIndex = 0;

fetch("music.json")
  .then(res => res.json())
  .then(data => {
    for (const folder in data) {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox" value="${folder}">
        ${folder}
      `;
      foldersDiv.appendChild(label);
    }

    window.musicData = data;
  });

playBtn.onclick = () => {
  buildPlaylist();
  if (playlist.length === 0) {
    alert("Please select at least one folder");
    return;
  }
  currentIndex = 0;
  playCurrent();
};

function buildPlaylist() {
  playlist = [];

  document.querySelectorAll("#folders input:checked").forEach(cb => {
    const folder = cb.value;
    musicData[folder].forEach(song => {
      playlist.push(`music/${folder}/${song}`);
    });
  });

  const mode = document.querySelector("input[name=mode]:checked").value;
  if (mode === "shuffle") shuffleArray(playlist);
}

function playCurrent() {
  audio.src = playlist[currentIndex];
  nowPlaying.textContent = "Now Playing: " + playlist[currentIndex].split("/").pop();
  audio.play();
}

audio.onended = () => {
  currentIndex++;
  if (currentIndex < playlist.length) {
    playCurrent();
  }
};

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
