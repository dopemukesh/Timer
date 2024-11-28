// DOM Elements
const timerDisplayH = document.querySelector('.hours');
const timerDisplayM = document.querySelector('.minutes');
const timerDisplayS = document.querySelector('.seconds');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const resetButton = document.getElementById('reset-button');
const historyButton = document.getElementById('history-button');
const closeModalButton = document.getElementById('close-modal-button');
const clearButton = document.getElementById('clear-modal-button');
const timerHistoryModal = document.getElementById('timer-history-modal');
const timerHistoryList = document.getElementById('timer-history-list');

// const timeElement = document.getElementById('realtime');

// Timer and History Variables
let timerId = null;
let timerSeconds = 0;
let timerHistory = JSON.parse(localStorage.getItem('timerHistory')) || [];
let counter = parseInt(localStorage.getItem('timerCounter')) || 1;


function update_realTime() {
    const timeElement = document.getElementById('realtime');
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();


    // Add leading zero if the value is less than 10
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12;

    // Update the time display
    timeElement.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Update the time every second (1000ms)
setInterval(update_realTime, 1000);

// Initial time update
update_realTime();



// Timer Functions
function startTimer() {
    if (!timerId) timerId = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    if (timerId) stopTimer(); // Stop if running

    const stoppedTime = formatTimeDisplay(timerSeconds);
    addToHistory(`Timer stopped after ${stoppedTime}`);

    timerSeconds = 0;
    updateDisplay(0, 0, 0);
}

function updateTimer() {
    timerSeconds++;
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    updateDisplay(hours, minutes, seconds);

}

function updateDisplay(hours, minutes, seconds) {
    timerDisplayH.textContent = hours.toString().padStart(2, '0');
    timerDisplayM.textContent = minutes.toString().padStart(2, '0');
    timerDisplayS.textContent = seconds.toString().padStart(2, '0');
}

// History Functions
function addToHistory(entry) {
    const timestamp = formatCurrentTime(new Date());
    const historyEntry = `${counter++}. ${entry} at ${timestamp}`;
    timerHistory.push(historyEntry);

    localStorage.setItem('timerHistory', JSON.stringify(timerHistory));
    localStorage.setItem('timerCounter', counter.toString());
}

function showHistory() {
    timerHistoryModal.style.display = 'flex';
    timerHistoryList.innerHTML = timerHistory.map(entry => `<li>${entry}</li>`).join('');
}

function clearHistory() {
    timerHistory = [];
    counter = 1;
    localStorage.removeItem('timerHistory');
    localStorage.removeItem('timerCounter');
    timerHistoryList.innerHTML = '';
}

function closeModal() {
    timerHistoryModal.style.display = 'none';
}

// Utility Functions
function formatTimeDisplay(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

function formatCurrentTime(date) {
    // Convert to IST (India Standard Time)
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const istDate = new Date(date.getTime() + istOffset);

    // Format the date and time
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = days[istDate.getUTCDay()];
    const month = months[istDate.getUTCMonth()];
    const dateStr = istDate.getUTCDate();
    const year = istDate.getUTCFullYear();

    let hours = istDate.getUTCHours();
    const minutes = istDate.getUTCMinutes().toString().padStart(2, '0');
    const seconds = istDate.getUTCSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    return `${day}, ${month} ${dateStr}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
}


// Event Listeners
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
historyButton.addEventListener('click', showHistory);
closeModalButton.addEventListener('click', closeModal);
clearButton.addEventListener('click', clearHistory);