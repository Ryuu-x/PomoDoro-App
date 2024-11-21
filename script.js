// Variables for time and state
let workTime = 25 * 60; // 25-minute work session
let breakTime = 5 * 60; // 5-minute break session
let currentTime = workTime; // Start with the work session
let isWorkSession = true; // Boolean to indicate current session type (work or break)
let isRunning = false; // Indicates if the timer is currently running
let timerInterval;
let sessionCount = 0; // Track the number of completed sessions

// DOM elements
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startPauseButton = document.getElementById('startPauseButton');
const sessionsDisplay = document.getElementById('sessions');
const bellSound = document.getElementById('bellSound');
const volumeControl = document.getElementById('volume');

// Set initial volume
bellSound.volume = volumeControl.value;

// Update volume based on slider input
volumeControl.addEventListener('input', function () {
    bellSound.volume = this.value; // Update bell sound volume dynamically
});

// Event listener for the start/pause button
startPauseButton.addEventListener('click', function () {
    if (isRunning) {
        // Pause the timer
        clearInterval(timerInterval); // Stop the interval
        this.textContent = 'Start'; // Change button text to "Start"
        isRunning = false; // Update state to paused
        document.title = 'Paused'; // Update browser tab title
    } else {
        // Start the timer
        startTimer(); // Call the startTimer function
        this.textContent = 'Pause'; // Change button text to "Pause"
        isRunning = true; // Update state to running
    }
});

// Update the timer display
function updateDisplay() {
    const minutes = Math.floor(currentTime / 60); // Calculate minutes
    const seconds = currentTime % 60; // Calculate remaining seconds
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}

// Timer function
function startTimer() {
    timerInterval = setInterval(() => {
        if (currentTime <= 0) {
            // Timer has reached zero
            clearInterval(timerInterval); // Stop the interval
            bellSound.play(); // Play bell sound to notify the user

            // Switch between work and break sessions
            if (isWorkSession) {
                currentTime = breakTime; // Set current time to break duration
                isWorkSession = false; // Toggle to break session
                document.title = 'Break Time - 5:00'; // Update browser tab title

                // Change background color to subtle blue for Pomodoro end
                document.body.classList.add('subtle-blue');
            } else {
                currentTime = workTime; // Set current time to work duration
                isWorkSession = true; // Toggle back to work session
                sessionCount++; // Increment session count after a work session completes
                sessionsDisplay.textContent = sessionCount; // Update session display
                document.title = 'Time to Focus - 25:00'; // Update browser tab title

                // Revert background color to original for break end
                document.body.classList.remove('subtle-blue');
            }

            // Reset button state and display
            startPauseButton.textContent = 'Start'; // Change button text to "Start"
            isRunning = false; // Set timer state to paused
            updateDisplay(); // Update display with new session time
        } else {
            // Decrement the current time
            currentTime--;
            const minutes = Math.floor(currentTime / 60); // Calculate minutes
            const seconds = currentTime % 60; // Calculate seconds

            // Update the display on the page
            minutesDisplay.textContent = minutes.toString().padStart(2, '0');
            secondsDisplay.textContent = seconds.toString().padStart(2, '0');

            // Update the display in the tab
            let timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.title = `${timeString} - ${isWorkSession ? 'Time to Focus' : 'Break Time'}`;
        }
    }, 10); // Run the function every second
}

// Initial display update
updateDisplay(); // Ensure the display shows the initial timer state
