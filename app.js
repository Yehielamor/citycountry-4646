// CityCountry Game Logic
const socket = io('http://localhost:3000'); // Mock socket for MVP
const currentLetterEl = document.getElementById('current-letter');
const categoryEl = document.getElementById('category');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const leaderboardEl = document.getElementById('leaderboard');
const practiceBtn = document.getElementById('practice-btn');
const multiplayerBtn = document.getElementById('multiplayer-btn');

let currentLetter = 'A';
let currentCategory = 'City';
let score = 0;
let leaderboardData = [];

// Initialize with mock data
function initGame() {
    updateGameDisplay();
    loadLeaderboard();
    setupEventListeners();
}

function updateGameDisplay() {
    currentLetterEl.textContent = currentLetter;
    categoryEl.textContent = currentCategory;
}

function loadLeaderboard() {
    leaderboardData = MOCK_LEADERBOARD;
    renderLeaderboard();
}

function renderLeaderboard() {
    leaderboardEl.innerHTML = '';
    leaderboardData.forEach((player, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center';
        li.innerHTML = `<span class="font-medium">${index + 1}. ${player.name}</span><span class="text-secondary font-bold">${player.score} pts</span>`;
        leaderboardEl.appendChild(li);
    });
}

function submitAnswer() {
    const answer = answerInput.value.trim();
    if (answer && answer.toLowerCase().startsWith(currentLetter.toLowerCase())) {
        score += 10;
        alert(`Correct! +10 points. Total: ${score}`);
        // Simulate adding to leaderboard for MVP
        leaderboardData.push({ name: 'You', score: score });
        leaderboardData.sort((a, b) => b.score - a.score);
        leaderboardData = leaderboardData.slice(0, 5);
        renderLeaderboard();
        // Generate new letter and category
        currentLetter = MOCK_LETTERS[Math.floor(Math.random() * MOCK_LETTERS.length)];
        currentCategory = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
        updateGameDisplay();
    } else {
        alert('Incorrect! Try again.');
    }
    answerInput.value = '';
    answerInput.focus();
}

function setupEventListeners() {
    submitBtn.addEventListener('click', submitAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitAnswer();
    });
    practiceBtn.addEventListener('click', () => {
        alert('Practice mode started! Solo play with random letters.');
        currentLetter = MOCK_LETTERS[Math.floor(Math.random() * MOCK_LETTERS.length)];
        currentCategory = MOCK_CATEGORIES[Math.floor(Math.random() * MOCK_CATEGORIES.length)];
        updateGameDisplay();
    });
    multiplayerBtn.addEventListener('click', () => {
        alert('Multiplayer matchmaking initiated! (Mock for MVP)');
        // In full version, this would connect via Socket.io
    });
    // Mock socket events for real-time updates
    socket.on('leaderboardUpdate', (data) => {
        leaderboardData = data;
        renderLeaderboard();
    });
    socket.on('newGame', (data) => {
        currentLetter = data.letter;
        currentCategory = data.category;
        updateGameDisplay();
    });
}

// Start the game
initGame();