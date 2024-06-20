document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('timeForm');
    const timeInput = document.getElementById('timeInput');
    const timeZone = document.getElementById('timeZone');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const historyList = document.getElementById('historyList');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const clearHistoryBtn = document.getElementById('clearHistory');

    // Load time zones from an API
    fetch('https://worldtimeapi.org/api/timezone')
        .then(response => response.json())
        .then(timezones => {
            timezones.forEach(zone => {
                const option = document.createElement('option');
                option.value = zone;
                option.textContent = zone.replace('_', ' ');
                timeZone.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching time zones:', error));

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const time12 = timeInput.value;
        const selectedTimeZone = timeZone.value;
        const result = convertToMilitaryTime(time12, selectedTimeZone);

        if (result.startsWith('Invalid')) {
            showError(result);
        } else {
            showResult(result);
            addToHistory(time12, result);
        }
    });

    toggleThemeBtn.addEventListener('click', toggleDarkMode);
    clearHistoryBtn.addEventListener('click', clearHistory);

    loadHistory();
    updateLiveClock();

    function convertToMilitaryTime(time12, timeZone) {
        const timeRegex = /(\d{1,2}):(\d{2}):(\d{2})\s?(AM|PM)/i;
        const match = time12.match(timeRegex);

        if (!match) {
            return 'Invalid time format. Please enter time in HH:MM:SS AM/PM format.';
        }

        let [_, hour, minute, second, period] = match;
        hour = parseInt(hour, 10);

        if (period.toUpperCase() === 'AM' && hour === 12) {
            hour = 0;
        } else if (period.toUpperCase() === 'PM' && hour !== 12) {
            hour += 12;
        }

        const date = new Date();
        date.setHours(hour, minute, second);

        const options = {
            timeZone: timeZone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const timeString = date.toLocaleTimeString('en-US', options);
        return timeString;
    }

    function showResult(result) {
        errorDiv.innerText = '';
        resultDiv.innerHTML = `Converted Time: <span id="convertedTime">${result}</span> <button id="copyButton">Copy</button>`;
        document.getElementById('copyButton').addEventListener('click', () => copyToClipboard(result));
    }

    function showError(error) {
        resultDiv.innerText = '';
        errorDiv.innerText = error;
    }

    function addToHistory(originalTime, convertedTime) {
        const history = getHistory();
        history.unshift({ originalTime, convertedTime });
        if (history.length > 5) history.pop();
        localStorage.setItem('conversionHistory', JSON.stringify(history));
        loadHistory();
    }

    function loadHistory() {
        const history = getHistory();
        historyList.innerHTML = '';
        history.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.innerText = `${entry.originalTime} -> ${entry.convertedTime}`;
            historyList.appendChild(listItem);
        });
    }

    function getHistory() {
        const history = localStorage.getItem('conversionHistory');
        return history ? JSON.parse(history) : [];
    }

    function clearHistory() {
        localStorage.removeItem('conversionHistory');
        loadHistory();
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }, () => {
            alert('Failed to copy!');
        });
    }

    function updateLiveClock() {
        const now = new Date();
        const options12 = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const options24 = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

        document.getElementById('time12').innerText = now.toLocaleTimeString('en-US', options12);
        document.getElementById('time24').innerText = now.toLocaleTimeString('en-US', options24);

        setTimeout(updateLiveClock, 1000);
    }

    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    }
});
