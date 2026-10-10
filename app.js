const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const ROUND_SECONDS = 180;

const KEY_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
const state = { answer: "", guesses: [], keyboard: new Map(), gameOver: false, revealing: false, playerName: "", soundOn: true, secondsLeft: ROUND_SECONDS };
const board = document.querySelector("#board");
const keyboard = document.querySelector("#keyboard");
const message = document.querySelector("#message");
const clue = document.querySelector("#clue");
const attempts = document.querySelector("#attempts");
const timer = document.querySelector("#timer");
const revealButton = document.querySelector("#reveal-word");
const dialog = document.querySelector("#result-dialog");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const welcomeDialog = document.querySelector("#welcome-dialog");
const playerNameInput = document.querySelector("#player-name");
const confetti = document.querySelector("#confetti");
const leaderboardList = document.querySelector("#leaderboard-list");
let audioContext;
let timerId;
let leaderboard = {};
try { leaderboard = JSON.parse(localStorage.getItem("wordle-leaderboard") || "{}"); } catch { leaderboard = {}; }

function normalizeDictionary(words) {
  return [...new Set(words.map(word => String(word).trim().toLowerCase()).filter(word => /^[a-z]{5}$/.test(word)))];
}

const STANDARD_WORDS = normalizeDictionary(window.WORD_DICTIONARY);
const STANDARD_WORD_SET = new Set(STANDARD_WORDS);
const WORD_CLUES = {
  abide: "To follow a rule is to do this.",
  begin: "This is what you do when something starts.",
  brave: "A person who faces danger calmly can be described this way.",
  broad: "A wide street or a wide idea can be described this way.",
  chair: "You can sit on this piece of furniture.",
  clean: "After washing, something may look like this.",
  dream: "You may experience this story while sleeping.",
  earth: "We all live on this planet.",
  early: "Before the expected time is described this way.",
  fresh: "Recently made or picked is described this way.",
  great: "Something excellent can be described with this word.",
  happy: "A person who feels joy is described this way.",
  heart: "This organ pumps blood through your body.",
  house: "A building where people live can be called this.",
  laugh: "You may do this when something is funny.",
  light: "The opposite of heavy can be described this way.",
  music: "Songs and melodies together are called this.",
  ocean: "A very large body of salt water is this.",
  peace: "The absence of war is called this.",
  quick: "Something fast can be described this way.",
  quiet: "A place with very little noise is described this way.",
  river: "Water flows along this natural path to the sea.",
  smile: "You may do this to show happiness.",
  small: "The opposite of large is described this way.",
  sound: "You hear this when something makes a noise.",
  story: "A tale with events and characters is called this.",
  table: "You can put books or food on this.",
  train: "Passengers ride this vehicle on rails.",
  water: "You drink this clear liquid to stay hydrated.",
  world: "All countries and people together make up this.",
};

function scoreGuess(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const remaining = answer.split("");
  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === answer[i]) { result[i] = "correct"; remaining[i] = null; }
  }
  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (result[i] === "correct") continue;
    const found = remaining.indexOf(guess[i]);
    if (found !== -1) { result[i] = "present"; remaining[found] = null; }
  }
  return result;
}

function startGame() {
  window.clearInterval(timerId);
  const dictionary = normalizeDictionary(STANDARD_WORDS);
  state.answer = dictionary[Math.floor(Math.random() * dictionary.length)];
  state.guesses = [];
  state.currentGuess = "";
  state.keyboard = new Map();
  state.gameOver = false;
  state.revealing = false;
  state.secondsLeft = ROUND_SECONDS;
  message.textContent = "Find the hidden word in six tries.";
  clue.textContent = WORD_CLUES[state.answer] || `This five-letter word begins with “${state.answer[0].toUpperCase()}”; use the tile colors to discover the rest.`;
  attempts.textContent = "0";
  updateTimer();
  revealButton.disabled = false;
  dialog.close();
  renderBoard();
  renderKeyboard();
  if (state.playerName) {
    timerId = window.setInterval(() => {
      if (state.gameOver) return;
      state.secondsLeft = Math.max(0, state.secondsLeft - 1);
      updateTimer();
      if (state.secondsLeft === 0) revealWord("time");
    }, 1000);
  }
}

function updateTimer() {
  const minutes = Math.floor(state.secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (state.secondsLeft % 60).toString().padStart(2, "0");
  timer.textContent = `${minutes}:${seconds}`;
  timer.classList.toggle("urgent", state.secondsLeft <= 30);
}

function renderLeaderboard() {
  const entries = Object.entries(leaderboard)
    .filter(([, stats]) => stats && (stats.wins || stats.played))
    .sort(([, a], [, b]) => b.wins - a.wins || (a.bestTries || 99) - (b.bestTries || 99) || b.played - a.played)
    .slice(0, 8);
  leaderboardList.innerHTML = entries.map(([name, stats]) => `<li class="leaderboard-entry"><span class="leaderboard-name">${escapeHtml(name)}</span><span class="leaderboard-score">${stats.wins} ${stats.wins === 1 ? "win" : "wins"} · ${stats.bestTries ? `${stats.bestTries} best` : "—"}</span></li>`).join("");
}

function escapeHtml(value) { return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }

function recordResult(won) {
  const current = leaderboard[state.playerName] || { wins: 0, played: 0, bestTries: 0 };
  current.played += 1;
  if (won) { current.wins += 1; current.bestTries = current.bestTries ? Math.min(current.bestTries, state.guesses.length) : state.guesses.length; }
  leaderboard[state.playerName] = current;
  try { localStorage.setItem("wordle-leaderboard", JSON.stringify(leaderboard)); } catch {}
  renderLeaderboard();
}

function shakeCurrentRow() {
  const row = board.querySelectorAll(".row")[state.guesses.length];
  row.classList.remove("shake");
  window.requestAnimationFrame(() => row.classList.add("shake"));
}

function renderBoard() {
  board.innerHTML = "";
  for (let rowIndex = 0; rowIndex < MAX_ATTEMPTS; rowIndex += 1) {
    const row = document.createElement("div"); row.className = "row";
    const guess = state.guesses[rowIndex];
    for (let i = 0; i < WORD_LENGTH; i += 1) {
      const tile = document.createElement("div"); tile.className = "tile";
      tile.textContent = guess?.word[i] ?? "";
      if (guess && guess.revealed) tile.classList.add(guess.score[i]);
      else if (guess) tile.classList.add("pending");
      else if (state.guesses.length === rowIndex && state.currentGuess) { tile.textContent = state.currentGuess[i] ?? ""; if (tile.textContent) tile.classList.add("filled"); }
      row.append(tile);
    }
    board.append(row);
  }
}

function renderKeyboard() {
  keyboard.innerHTML = "";
  KEY_ROWS.forEach((letters, rowIndex) => {
    const row = document.createElement("div"); row.className = "key-row";
    if (rowIndex === 2) addKey(row, "enter", "ENTER");
    letters.split("").forEach(letter => addKey(row, letter, letter));
    if (rowIndex === 2) addKey(row, "backspace", "⌫");
    keyboard.append(row);
  });
}

function addKey(row, value, label) {
  const key = document.createElement("button"); key.className = "key"; key.type = "button"; key.dataset.key = value; key.textContent = label;
  key.setAttribute("aria-label", value === "backspace" ? "Delete letter" : value === "enter" ? "Submit guess" : `Letter ${value.toUpperCase()}`);
  if (value === "enter" || value === "backspace") key.classList.add("wide");
  const status = state.keyboard.get(value); if (status) key.classList.add(status);
  key.addEventListener("click", () => handleKey(value)); row.append(key);
}

function handleKey(key) {
  if (state.gameOver || state.revealing || !state.playerName) return;
  state.currentGuess ??= "";
  if (key === "backspace") state.currentGuess = state.currentGuess.slice(0, -1);
  else if (key === "enter") submitGuess();
  else if (/^[a-z]$/.test(key) && state.currentGuess.length < WORD_LENGTH) state.currentGuess += key;
  renderBoard();
}

function submitGuess() {
  const guess = state.currentGuess;
  if (guess.length !== WORD_LENGTH) { message.textContent = "Your guess needs five letters."; shakeCurrentRow(); playTone(180, .12, 0, "sawtooth"); return; }
  if (!STANDARD_WORD_SET.has(guess)) { message.textContent = "That word is not in the standard dictionary."; shakeCurrentRow(); playTone(180, .12, 0, "sawtooth"); return; }
  const score = scoreGuess(guess, state.answer);
  state.guesses.push({ word: guess, score, revealed: false });
  state.revealing = true;
  state.currentGuess = "";
  attempts.textContent = String(state.guesses.length);
  score.forEach((status, i) => updateKey(guess[i], status));
  renderBoard(); renderKeyboard(); playSubmitSound();
  board.scrollIntoView({ behavior: "smooth", block: "center" });
  revealGuess(state.guesses.length - 1, () => {
    state.revealing = false;
    if (guess === state.answer) finishGame(true);
    else if (state.guesses.length === MAX_ATTEMPTS) finishGame(false);
    else message.textContent = "Keep going — use the feedback to narrow it down.";
  });
}

function revealGuess(rowIndex, onComplete) {
  const row = board.querySelectorAll(".row")[rowIndex];
  const guess = state.guesses[rowIndex];
  const tiles = [...row.querySelectorAll(".tile")];
  tiles.forEach((tile, index) => {
    window.setTimeout(() => {
      tile.classList.add("revealing", "flip");
      tile.classList.remove("pending");
      playRevealSound(guess.score[index], index);
      window.setTimeout(() => {
        tile.classList.remove("revealing");
        tile.classList.add(guess.score[index]);
      }, 120);
      if (index === tiles.length - 1) {
        window.setTimeout(() => {
          guess.revealed = true;
          renderBoard();
          onComplete();
        }, 240);
      }
    }, index * 90 + 20);
  });
}

function updateKey(letter, nextStatus) {
  const priority = { absent: 1, present: 2, correct: 3 };
  if (!state.keyboard.has(letter) || priority[nextStatus] > priority[state.keyboard.get(letter)]) state.keyboard.set(letter, nextStatus);
}

function revealWord(reason = "revealed") {
  if (state.gameOver || state.revealing) return;
  state.currentGuess = "";
  state.gameOver = true;
  finishGame(false, reason);
}

function finishGame(won, reason = "missed") {
  window.clearInterval(timerId);
  revealButton.disabled = true;
  state.gameOver = true;
  recordResult(won);
  if (won) {
    resultTitle.textContent = `Brilliant, ${state.playerName}!`;
    resultCopy.textContent = `You found ${state.answer.toUpperCase()} in ${state.guesses.length} ${state.guesses.length === 1 ? "try" : "tries"}.`;
    message.textContent = "A beautiful solve. Enjoy the celebration!";
    playWinSound();
    launchConfetti();
  } else {
    resultTitle.textContent = reason === "revealed" ? "Word revealed." : reason === "time" ? "Time is up." : `So close, ${state.playerName}.`;
    resultCopy.textContent = reason === "revealed"
      ? `The word was ${state.answer.toUpperCase()}. Revealing it gives 0 points.`
      : reason === "time"
        ? `The timer ran out. The word was ${state.answer.toUpperCase()}. This round gives 0 points.`
        : `The word was ${state.answer.toUpperCase()}. Every guess gets you closer — ready for another round?`;
    message.textContent = reason === "time" ? `Time ran out — the answer was ${state.answer.toUpperCase()}.` : `The answer was ${state.answer.toUpperCase()}. You were close!`;
    playLossSound();
  }
  dialog.showModal();
}

function getAudioContext() {
  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function playTone(frequency, duration, start = 0, type = "sine") {
  if (!state.soundOn) return;
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.14, context.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + start + duration);
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.start(context.currentTime + start); oscillator.stop(context.currentTime + start + duration + 0.03);
  } catch { /* Audio is optional; never block gameplay rendering. */ }
}

function playSubmitSound() { playTone(330, .08, 0, "triangle"); }
function playRevealSound(status, index) {
  const note = status === "correct" ? 660 : status === "present" ? 520 : 290;
  playTone(note, .12, index * .02, status === "absent" ? "triangle" : "sine");
}
function playWinSound() { [523, 659, 784, 988, 1175, 1319].forEach((note, index) => playTone(note, .24, index * .1, "sine")); }
function playLossSound() { [262, 220, 196, 175, 147].forEach((note, index) => playTone(note, .3, index * .13, "triangle")); }

function launchConfetti() {
  const colors = ["#56d397", "#e3ad53", "#e7836d", "#9b8cff", "#f4f1e8"];
  confetti.innerHTML = "";
  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("span"); piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`; piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * .45}s`; piece.style.setProperty("--drift", `${(Math.random() - .5) * 260}px`); piece.style.setProperty("--rotation", `${Math.random() * 360}deg`);
    confetti.append(piece);
  }
  window.setTimeout(() => { confetti.innerHTML = ""; }, 3000);
}

function beginPlaying() {
  const name = playerNameInput.value.trim();
  if (!name) { playerNameInput.focus(); return; }
  state.playerName = name;
  welcomeDialog.close();
  startGame();
  message.textContent = `Welcome, ${state.playerName}. Find the hidden word in six tries.`;
}

document.addEventListener("keydown", event => {
  if (welcomeDialog.open && event.target === playerNameInput) return;
  if (event.key === "Enter") handleKey("enter");
  else if (event.key === "Backspace") handleKey("backspace");
  else if (/^[a-zA-Z]$/.test(event.key)) handleKey(event.key.toLowerCase());
});
document.querySelector("#new-game").addEventListener("click", startGame);
document.querySelector("#play-again").addEventListener("click", startGame);
revealButton.addEventListener("click", () => revealWord("revealed"));
document.querySelector("#close-dialog").addEventListener("click", () => dialog.close());
document.querySelector("#start-game").addEventListener("click", beginPlaying);
playerNameInput.addEventListener("keydown", event => { if (event.key === "Enter") beginPlaying(); });
document.querySelector("#sound-toggle").addEventListener("click", event => {
  state.soundOn = !state.soundOn;
  event.currentTarget.textContent = state.soundOn ? "♪" : "∅";
  event.currentTarget.title = state.soundOn ? "Mute sound" : "Turn sound on";
  event.currentTarget.setAttribute("aria-label", event.currentTarget.title);
});
const themeToggle = document.querySelector("#theme-toggle");
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const light = theme === "light";
  themeToggle.textContent = light ? "☾" : "☼";
  themeToggle.title = light ? "Switch to dark mode" : "Switch to light mode";
  themeToggle.setAttribute("aria-label", themeToggle.title);
  try { localStorage.setItem("wordle-theme", theme); } catch {}
}
themeToggle.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light"));
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("wordle-theme") || "dark"; } catch {}
applyTheme(savedTheme);
renderLeaderboard();
startGame();
welcomeDialog.showModal();
playerNameInput.focus();
