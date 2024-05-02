// Get DOM elements
let timerDisplay = document.getElementById('timer-display');
let timerDisplayH = document.querySelector('.hours');
let timerDisplayM = document.querySelector('.minutes');
let timerDisplayS = document.querySelector('.seconds');

// Buttons
let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');
let resetButton = document.getElementById('reset-button');
let historyButton = document.getElementById('history-button');

// Modal elements
let timerHistoryModal = document.getElementById('timer-history-modal');
let timerHistoryList = document.getElementById('timer-history-list');
let closeModalButton = document.getElementById('close-modal-button');

// Timer variables
let timerId = null;
let timerSeconds = 0;
let timerHistory = [];

// Variables to store stopped time
let stoppedHours = 0;
let stoppedMinutes = 0;
let stoppedSeconds = 0;

// Event listeners for buttons
startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
historyButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);

// Function to start the timer
function startTimer() {
	if (!timerId) {
		timerId = setInterval(decrementTimer, 1000);
	}
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}

// Function to decrement the timer
function decrementTimer() {
    timerSeconds++;
    let hours = Math.floor(timerSeconds / 3600);
    let minutes = Math.floor((timerSeconds % 3600) / 60);
    let seconds = timerSeconds % 60;

    timerDisplayH.textContent = `${hours.toString().padStart(2, '0')}`;
    timerDisplayM.textContent = `${minutes.toString().padStart(2, '0')}`;
    timerDisplayS.textContent = `${seconds.toString().padStart(2, '0')}`;
}

// Counter for timer history
let counter = localStorage.getItem('timerCounter') ? parseInt(localStorage.getItem('timerCounter')) : 1;
// Function to save the counter in localStorage
function saveCounter() {
    localStorage.setItem('timerCounter', counter.toString());
}

// Function to reset the timer
function resetTimer() {
    if (timerId === null) {
        return;
    }

    clearInterval(timerId);
    timerId = null;

    const stoppedHours = timerDisplayH.textContent;
    const stoppedMinutes = timerDisplayM.textContent;
    const stoppedSeconds = timerDisplayS.textContent;

    const stoppedTime = formatCurrentTime(new Date());

    timerSeconds = 0;
    timerDisplayH.textContent = '00';
    timerDisplayM.textContent = '00';
    timerDisplayS.textContent = '00';

    timerHistory.push(`${counter}. Timer stopped after ${stoppedHours}:${stoppedMinutes}:${stoppedSeconds} at ${stoppedTime}`);
    localStorage.setItem('timerHistory', JSON.stringify(timerHistory));

    counter++;
    saveCounter();
}

// Function to load timer history from localStorage
function loadTimerHistory() {
    const storedHistory = localStorage.getItem('timerHistory');
    if (storedHistory) {
        timerHistory = JSON.parse(storedHistory);
    } else {
        timerHistory = [];
    }
}

// Call the function to load timer history when the page loads
window.addEventListener('load', loadTimerHistory);

// Function to format current time
function formatCurrentTime(currentTime) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    const timeZoneOffset = currentTime.getTimezoneOffset();
    const timeZoneOffsetHours = Math.floor(Math.abs(timeZoneOffset / 60));
    const timeZoneOffsetMinutes = Math.abs(timeZoneOffset) % 60;
    const timezone = timeZoneOffset >= 0 ? `GMT-${timeZoneOffsetHours}:${timeZoneOffsetMinutes}` : `GMT+${timeZoneOffsetHours}:${timeZoneOffsetMinutes}`;

    const day = days[currentTime.getDay()];
    const month = months[currentTime.getMonth()];
    const date = currentTime.getDate();
    const year = currentTime.getFullYear();

    return `${day} ${month} ${date} ${year} ${hours}:${minutes}:${seconds} ${ampm} || ${timezone}`;
}

// Function to open the modal
function openModal() {
	timerHistoryModal.style.display = 'flex';
	const storedHistory = localStorage.getItem('timerHistory');
	if (storedHistory) {
		timerHistory = JSON.parse(storedHistory);
		const historyList = timerHistory.map((entry, index) => `<li>${entry}</li>`).join('');
		timerHistoryList.innerHTML = historyList;
	}
}

// Function to close the modal
function closeModal() {
	timerHistoryModal.style.display = 'none';
}

// Clear button event listener
const clearButton = document.getElementById('clear-modal-button');
clearButton.addEventListener('click', clearHistory);

// Function to clear the timer history
function clearHistory() {
    timerHistory = [];
    timerHistoryList.innerHTML = '';
    localStorage.removeItem('timerHistory');
    counter = 1;
    localStorage.removeItem('timerCounter');
}
