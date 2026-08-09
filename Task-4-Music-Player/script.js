// Playlist Array
const playlist = [
    {
        title: "Neon Nights",
        artist: "Synthwave Studio",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Midnight Drive",
        artist: "The Retros",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop"
    },
    {
        title: "Electric Pulse",
        artist: "Cyber Punker",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop"
    }
];

let songIndex = 0;
let isPlaying = false;
let isMuted = false;
let isShuffle = false;
let isRepeat = false;

const audio = new Audio();

// DOM Elements
const playerContainer = document.getElementById('playerContainer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');

const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const coverImage = document.getElementById('coverImage');

const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');
const volumeBar = document.getElementById('volumeBar');
const muteBtn = document.getElementById('muteBtn');

// New UI Elements
const minimizeBtn = document.getElementById('minimizeBtn');
const queueBtn = document.getElementById('queueBtn');
const closeQueueBtn = document.getElementById('closeQueueBtn');
const queuePanel = document.getElementById('queuePanel');
const queueList = document.getElementById('queueList');

// Elements to hide on minimize
const albumArtContainer = document.getElementById('albumArtContainer');
const volumeContainer = document.getElementById('volumeContainer');

// 🎵 Load Song Function
function loadSong(index) {
    const song = playlist[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    coverImage.src = song.cover;
    audio.src = song.src;
    renderQueue(); // Update queue UI to show active song
}

// ▶️ Play/Pause Logic
function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    } else {
        audio.play();
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    }
    isPlaying = !isPlaying;
}

// ⏭️ Next & Previous Logic
function prevSong() {
    songIndex = (songIndex - 1 + playlist.length) % playlist.length;
    loadSong(songIndex);
    if (isPlaying) audio.play();
}

function nextSong() {
    if (isShuffle) {
        let randomIndex = Math.floor(Math.random() * playlist.length);
        while (randomIndex === songIndex && playlist.length > 1) {
            randomIndex = Math.floor(Math.random() * playlist.length);
        }
        songIndex = randomIndex;
    } else {
        songIndex = (songIndex + 1) % playlist.length;
    }
    loadSong(songIndex);
    if (isPlaying) audio.play();
}

// 🔀 Shuffle & Repeat Logic
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleBtn.classList.replace('text-zinc-500', 'text-pink-500');
        isRepeat = false;
        audio.loop = false;
        repeatBtn.classList.replace('text-pink-500', 'text-zinc-500');
    } else {
        shuffleBtn.classList.replace('text-pink-500', 'text-zinc-500');
    }
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    audio.loop = isRepeat;
    if (isRepeat) {
        repeatBtn.classList.replace('text-zinc-500', 'text-pink-500');
        isShuffle = false;
        shuffleBtn.classList.replace('text-pink-500', 'text-zinc-500');
    } else {
        repeatBtn.classList.replace('text-pink-500', 'text-zinc-500');
    }
});

// ⏳ Progress Bar Logic
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
}

audio.addEventListener('timeupdate', () => {
    const { currentTime, duration } = audio;
    if (duration) {
        progressBar.value = (currentTime / duration) * 100;
        currentTimeEl.textContent = formatTime(currentTime);
        durationTimeEl.textContent = formatTime(duration);
    }
});

progressBar.addEventListener('input', (e) => {
    audio.currentTime = (e.target.value / 100) * audio.duration;
});

audio.addEventListener('ended', nextSong);

// 🔊 Volume Logic
volumeBar.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    isMuted = audio.volume === 0;
});

muteBtn.addEventListener('click', () => {
    if (isMuted) {
        audio.volume = volumeBar.value || 1;
        isMuted = false;
    } else {
        audio.volume = 0;
        isMuted = true;
    }
});

// 🚀 Queue Panel Logic
function renderQueue() {
    queueList.innerHTML = '';
    playlist.forEach((song, idx) => {
        const isActive = idx === songIndex;
        const item = document.createElement('div');
        
        item.className = `flex items-center gap-4 p-2 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-zinc-800 border-l-4 border-violet-500 shadow-md' : 'hover:bg-zinc-800/50'}`;
        
        item.innerHTML = `
            <div class="relative w-12 h-12 flex-shrink-0">
                <img src="${song.cover}" class="w-full h-full rounded-md object-cover">
                ${isActive && isPlaying ? '<div class="absolute inset-0 bg-black/40 flex items-center justify-center rounded-md"><svg class="w-5 h-5 text-violet-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg></div>' : ''}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate ${isActive ? 'text-violet-400' : 'text-white'}">${song.title}</p>
                <p class="text-xs text-zinc-400 truncate">${song.artist}</p>
            </div>
        `;

        item.addEventListener('click', () => {
            songIndex = idx;
            loadSong(songIndex);
            if (!isPlaying) togglePlay(); 
            else audio.play();
        });

        queueList.appendChild(item);
    });
}

queueBtn.addEventListener('click', () => {
    queuePanel.classList.remove('translate-y-full');
    renderQueue();
});

closeQueueBtn.addEventListener('click', () => {
    queuePanel.classList.add('translate-y-full');
});

// 🚀 UPDATED: TRUE Minimize Logic (Sleek Compact Mode)
let isMinimized = false;
minimizeBtn.addEventListener('click', () => {
    isMinimized = !isMinimized;
    if (isMinimized) {
        // 1. Hide Album Art and Volume Bar
        albumArtContainer.classList.add('hidden');
        volumeContainer.classList.add('hidden');
        
        // 2. Make the container slimmer
        playerContainer.classList.replace('max-w-md', 'max-w-sm');
        
        // 3. Change Minimize Icon to 'Expand' icon
        minimizeBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>`;
    } else {
        // 1. Restore Album Art and Volume Bar
        albumArtContainer.classList.remove('hidden');
        volumeContainer.classList.remove('hidden');
        
        // 2. Restore container size
        playerContainer.classList.replace('max-w-sm', 'max-w-md');
        
        // 3. Change Icon back to 'Minimize' down arrow
        minimizeBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
    }
});

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Initial Load
loadSong(songIndex);