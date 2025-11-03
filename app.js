const $ = id => document.getElementById(id);

const timerEl = $('timer');
const sessionTypeEl = $('session-type');
const progressBar = $('progress-bar');
const startBtn = $('start-btn');
const resetBtn = $('reset-btn');
const pauseBtn = $('pause-btn');
const completedEl = $('completed');
const cycleEl = $('cycle');
const workDurationInput = $('work-duration');
const breakDurationInput = $('break-duration');
const longBreakDurationInput = $('long-break-duration');

let timer;
let isRunning = false;
let isWorkSession = true;
let timerLeft;
let totalTime;
let completedSessions = 0;
let currentCyle = 1;
const cyclesPerLongBreak = 4;


// Initilize timer

function initTimer ()
{
    const workDuration = parseInt(workDurationInput.value) * 60;
    const breakDuration = parseInt(breakDurationInput.value) * 60;

    if (isWorkSession)
    {
        timerLeft = workDuration;
        totalTime = workDuration;
        sessionTypeEl.textContent = "Work Session";
        sessionTypeEl.style.color = '#3498db';

    }
    else
    {
        timerLeft = breakDuration;
        totalTime = breakDuration;
        sessionTypeEl.textContent = completedSessions % cyclesPerLongBreak === 0 ? 'Long Break' : 'Short Break';
        sessionTypeEl.style.color = '#3498db'
    }

    updateDisplay();
    updateProgressBar();
}


// Update timer display
function updateDisplay()
{
    const minutes = Math.floor(timerLeft / 60);
    const seconds  = timerLeft % 60;
    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgressBar()
{
    const progress = ((totalTime - timerLeft) / totalTime) * 100;
    progressBar.style.width = `${progress}%`;
}

// start timer
function startTimer()
{
    if (!isRunning)
    {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        timer = setInterval(() => {
            timerLeft--;
            updateDisplay();
            updateProgressBar();

            if (timerLeft <= 0)
            {
                clearInterval(timer);
                isRunning = false;

                // Play notification sound
                playNotification();

                // Switch session type
                if (isWorkSession)
                {
                    completedSessions++;
                    completedEl.textContent = completedSessions;

                    if (completedSessions % cyclesPerLongBreak === 0)
                    {
                        // Long break after completing a cycle
                        currentCyle++;
                        cycleEl.textContent = `${currentCyle}/${cyclesPerLongBreak}`;

                        isWorkSession = false;
                        initTimer();
                        alert('Work session completed! Time for long break.');
                    }else{
                        // Regular break
                        isWorkSession = false;
                        initTimer();
                        alert('Work session completed! Time for a short break.');
                    }
                }else{
                    // Back to work
                    isWorkSession = true;
                    initTimer();
                    alert('Break over! Time to get back to work');
                }

                startBtn.disabled = false;
                pauseBtn.disabled = true;
            }
        }, 1000)
    }
}

// Pause Timer

function pauseTimer()
{
    if (isRunning)
    {
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
}


// Reset timer

function resetTimer()
{
    clearInterval(timer);
    isRunning = false;
    isWorkSession = true;
    completedSessions = 0;
    currentCyle = 1;
    completedEl.textContent = '0';
    cycleEl.textContent = '1/4';
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    initTimer();
}

// Play notification sound;
function playNotification()
{
    // Create a simple beep sound using WAA(Web Audio API);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const osclillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osclillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osclillator.frequency.value = 800;
    osclillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    osclillator.start(audioContext.currentTime);
    osclillator.stop(audioContext.currentTime + 1);

}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// update timer when setting changes

workDurationInput.addEventListener('change', () => {
    if (!isRunning)
    {
        initTimer();
    }
});

breakDurationInput.addEventListener('change', () => {
    if (!isRunning && !isWorkSession)
    {
        initTimer();
    }
});


longBreakDurationInput.addEventListener('change', () => {
    if (!isRunning && !isWorkSession && completedSessions % cyclesPerLongBreak === 0)
    {
        initTimer();
    }
});

// init

initTimer();
