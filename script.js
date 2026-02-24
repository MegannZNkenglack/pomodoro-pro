/**
 * FILE: script.js
 * DESCRIPTION: Logic for the Pomodoro Timer. 
 * Handles time calculations, interval management, and UI updates.
 * AUTHOR: [Your Name]
 */

// --- Global Variables ---
let timeLeft = 1500;        // Default time: 25 minutes (in seconds)
let timerId = null;         // Reference to the setInterval loop
let currentMode = 'work';   // Tracks if we are in 'work', 'short', or 'long' mode
let sessionsCompleted = 0;  // User session counter

// DOM Element references for easy access
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');

// Configuration for mode lengths (Standard Pomodoro lengths)
const modes = {
    work: 1500,  // 25 mins
    short: 300,  // 5 mins
    long: 900    // 15 mins
};

/**
 * Updates the text on the screen and the browser tab title
 */
function updateDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    
    // Formatting: Adds a leading zero if seconds < 10 (e.g., 25:09 instead of 25:9)
    let timeString = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    
    timerDisplay.innerHTML = timeString;
    document.title = `(${timeString}) Pomodoro`; // Updates browser tab for user convenience
}

/**
 * Logic to start or pause the timer
 */
function toggleTimer() {
    if (timerId) {
        // If timer is running, clear the interval (Pause)
        clearInterval(timerId);
        timerId = null;
        startBtn.innerHTML = "Start";
    } else {
        // If timer is stopped, start the 1-second interval (Play)
        startBtn.innerHTML = "Pause";
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            // Check if timer has hit zero
            if (timeLeft <= 0) {
                handleTimerEnd();
            }
        }, 1000);
    }
}

/**
 * Executed when the timer reaches 00:00
 */
function handleTimerEnd() {
    clearInterval(timerId);
    timerId = null;
    startBtn.innerHTML = "Start";
    
    // Increment session count only if a 'Work' session was completed
    if (currentMode === 'work') {
        sessionsCompleted++;
        document.getElementById('sessions').innerText = sessionsCompleted;
        alert("Work session over! Take a break.");
    } else {
        alert("Break over! Time to get back to work.");
    }
}

/**
 * Switches between timer modes (Work/Short/Long)
 * @param {string} mode - The mode string passed from the HTML buttons
 */
function setMode(mode) {
    currentMode = mode;
    timeLeft = modes[mode]; // Update time based on config object
    updateDisplay();
    
    // UI Logic: Remove 'active' class from all buttons, add to the selected one
    document.querySelectorAll('.modes button').forEach(btn => {
        btn.classList.remove('active');
        // Check if button text matches the mode name
        if(btn.innerText.toLowerCase().includes(mode)) btn.classList.add('active');
    });
}

/**
 * Resets the current timer to the starting value of the current mode
 */
function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    startBtn.innerHTML = "Start";
    setMode(currentMode); // Reset to the current mode's default time
}