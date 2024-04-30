

let hoursInput = document.getElementById('hours');
let minutesInput = document.getElementById('minutes');
let secondsInput = document.getElementById('seconds');
let startButton = document.getElementById('start-button');
let resetButton = document.getElementById('reset-button');

let timerDisplay = document.getElementById('timer-display');
let timerDisplayH = document.querySelector('.hours');
let timerDisplayM = document.querySelector('.minutes');
let timerDisplayS = document.querySelector('.seconds');

let timerId = null;

startButton.addEventListener('click', startTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
    let hours = parseInt(hoursInput.value) || 0;
    let minutes = parseInt(minutesInput.value) || 0;
    let seconds = parseInt(secondsInput.value) || 0;
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

    timerId = setInterval(decrementTimer, 1000);

    function decrementTimer() {
        totalSeconds--;
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;

        // timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        timerDisplayH.textContent = `${hours.toString().padStart(2, '0')}`;
        timerDisplayM.textContent = `${minutes.toString().padStart(2, '0')}`;
        timerDisplayS.textContent = `${seconds.toString().padStart(2, '0')}`;

        if (totalSeconds <= 0) {
            clearInterval(timerId);
        }
    }
}

function resetTimer() {
    clearInterval(timerId);
    // timerDisplay.textContent = '00:00:00';
    timerDisplayH.textContent = '00';
    timerDisplayM.textContent = '00';
    timerDisplayS.textContent = '00';
    hoursInput.value = '';
    minutesInput.value = '';
    secondsInput.value = '';
}