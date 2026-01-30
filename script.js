const foldersDiv = document.getElementById("folders");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const audio = document.getElementById("audio");
const nowPlaying = document.getElementById("nowPlaying");

let playlist = [];
let currentIndex = 0;
let musicData = {};

fetch("music.json")
  .then(res => res.json())
  .then(data => {
    musicData = data;
    renderFolders();
  });

function renderFolders() {
  for (const folder in musicData) {
    const wrapper = document.createElement("div");
    wrapper.className = "folder";

    const header = document.createElement("div");
    header.className = "folder-header";

    const folderCheckbox = document.createElement("input");
    folderCheckbox.type = "checkbox";
    folderCheckbox.dataset.folder = folder;

    const title = document.createElement("span");
    title.textContent = folder;

    header.appendChild(folderCheckbox);
    header.appendChild(title);

    const songsDiv = document.createElement("div");
    songsDiv.className = "folder-songs";

    musicData[folder].forEach(song => {
      const label = document.createElement("label");
      label.innerHTML = `
        <input type="checkbox"
               data-folder="${folder}"
               data-song="${song}">
        ${song}
      `;
      songsDiv.appendChild(label);
    });

    header.addEventListener("click", (e) => {
      if (e.target.type !== "checkbox") {
        songsDiv.style.display =
          songsDiv.style.display === "none" ? "block" : "none";
      }
    });

    folderCheckbox.onchange = () => {
      songsDiv.querySelectorAll("input").forEach(cb => {
        cb.checked = folderCheckbox.checked;
      });
    };

    wrapper.appendChild(header);
    wrapper.appendChild(songsDiv);
    foldersDiv.appendChild(wrapper);
  }
}

playBtn.onclick = () => {
  buildPlaylist();
  if (playlist.length === 0) {
    alert("Please select songs or folders");
    return;
  }
  currentIndex = 0;
  playCurrent();
};

prevBtn.onclick = () => {
  if (playlist.length === 0) return;
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  playCurrent();
};

nextBtn.onclick = () => {
  if (playlist.length === 0) return;
  currentIndex = (currentIndex + 1) % playlist.length;
  playCurrent();
};

function buildPlaylist() {
  playlist = [];

  document.querySelectorAll(".folder-songs input:checked").forEach(cb => {
    const folder = cb.dataset.folder;
    const song = cb.dataset.song;
    playlist.push(`music/${folder}/${song}`);
  });

  const mode = document.querySelector("input[name=mode]:checked").value;
  if (mode === "shuffle") shuffleArray(playlist);
}

function playCurrent() {
  audio.src = playlist[currentIndex];
  nowPlaying.textContent = "Now Playing: " + getSongName(playlist[currentIndex]);
  audio.play();
}

audio.onended = () => {
  nextBtn.onclick();
};

function getSongName(path) {
  return decodeURIComponent(path.split("/").pop());
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
