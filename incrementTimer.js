

let timerDisplay = document.getElementById('timer-display');
let timerDisplayH = document.querySelector('.hours');
let timerDisplayM = document.querySelector('.minutes');
let timerDisplayS = document.querySelector('.seconds');

let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');
let resetButton = document.getElementById('reset-button');
let historyButton = document.getElementById('history-button');

let timerHistoryModal = document.getElementById('timer-history-modal');
let timerHistoryList = document.getElementById('timer-history-list');
let closeModalButton = document.getElementById('close-modal-button');

let timerId = null;
let timerSeconds = 0;
let timerHistory = [];

let stoppedHours = 0;
let stoppedMinutes = 0;
let stoppedSeconds = 0;

// let counter = 1;

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);
resetButton.addEventListener('click', resetTimer);
historyButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);


function startTimer() {
	if (!timerId) {
		timerId = setInterval(decrementTimer, 1000);
	}
}


function stopTimer() {
    clearInterval(timerId);
    timerId = null;
}


function decrementTimer() {
    timerSeconds++;
    let hours = Math.floor(timerSeconds / 3600);
    let minutes = Math.floor((timerSeconds % 3600) / 60);
    let seconds = timerSeconds % 60;

    timerDisplayH.textContent = `${hours.toString().padStart(2, '0')}`;
    timerDisplayM.textContent = `${minutes.toString().padStart(2, '0')}`;
    timerDisplayS.textContent = `${seconds.toString().padStart(2, '0')}`;
}


// Initialize counter with the value stored in localStorage or default to 1
let counter = localStorage.getItem('timerCounter') ? parseInt(localStorage.getItem('timerCounter')) : 1;
function saveCounter() {
    localStorage.setItem('timerCounter', counter.toString());
}


function resetTimer() {
     // Check if the timer is already stopped
    if (timerId === null) {
        return; // If the timer is stopped, exit the function
    }

    clearInterval(timerId);
    timerId = null;

    const stoppedHours = timerDisplayH.textContent;
    const stoppedMinutes = timerDisplayM.textContent;
    const stoppedSeconds = timerDisplayS.textContent;

    // Get current time
    const stoppedTime = formatCurrentTime(new Date());

    timerSeconds = 0;
    timerDisplayH.textContent = '00';
    timerDisplayM.textContent = '00';
    timerDisplayS.textContent = '00';

    // Store timer history
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
        timerHistory = []; // Initialize timer history array if it doesn't exist
    }
}

// Call the function to load timer history when the page loads
window.addEventListener('load', loadTimerHistory);


// Function to format current time as "Day Mon DD YYYY HH:MM:SS AM/PM || GMT+Timezone"
function formatCurrentTime(currentTime) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 12 hour format
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


function openModal() {
	timerHistoryModal.style.display = 'block';
	const storedHistory = localStorage.getItem('timerHistory');
	if (storedHistory) {
		timerHistory = JSON.parse(storedHistory);
		const historyList = timerHistory.map((entry, index) => `<li>${entry}</li>`).join('');
		timerHistoryList.innerHTML = historyList;
	}
}

function closeModal() {
	timerHistoryModal.style.display = 'none';
}


// Add event listener to the "Clear" button
const clearButton = document.getElementById('clear-modal-button');
clearButton.addEventListener('click', clearHistory);

// Function to clear the timer history
function clearHistory() {
    // Clear the timer history array
    timerHistory = [];
    // Clear the history displayed in the modal
    timerHistoryList.innerHTML = '';
    // Remove the timer history data from localStorage
    localStorage.removeItem('timerHistory');
    counter = 1;
    // Remove the counter data from localStorage
    localStorage.removeItem('timerCounter');
}
