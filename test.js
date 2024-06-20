const { convertToMilitaryTime } = require('./script.js');

test('converts 12:00:00 AM to 00:00:00', () => {
    expect(convertToMilitaryTime('12:00:00 AM', 'UTC')).toBe('00:00:00');
});

test('converts 12:00:00 PM to 12:00:00', () => {
    expect(convertToMilitaryTime('12:00:00 PM', 'UTC')).toBe('12:00:00');
});

test('converts 01:00:00 PM to 13:00:00', () => {
    expect(convertToMilitaryTime('01:00:00 PM', 'UTC')).toBe('13:00:00');
});

test('handles invalid time format', () => {
    expect(convertToMilitaryTime('invalid', 'UTC')).toBe('Invalid time format. Please enter time in HH:MM:SS AM/PM format.');
});
