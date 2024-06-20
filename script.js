document.getElementById('timeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const time12 = document.getElementById('timeInput').value;
    const result = convertToMilitaryTime(time12);
    document.getElementById('result').innerText = result;
});

function convertToMilitaryTime(time12) {
    const timeRegex = /(\d{2}):(\d{2}):(\d{2})(AM|PM)/;
    const match = time12.match(timeRegex);

    if (!match) {
        return 'Invalid time format';
    }

    let [_, hour, minute, second, period] = match;
    hour = parseInt(hour, 10);

    if (period === 'AM' && hour === 12) {
        hour = 0;
    } else if (period === 'PM' && hour !== 12) {
        hour += 12;
    }

    const hourStr = hour.toString().padStart(2, '0');
    return `${hourStr}:${minute}:${second}`;
}
