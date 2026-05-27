const RANGES = ["ms", "s", "m", "h", "d"];
const MS_PER = [1, 1000, 60000, 3600000, 86400000];

export function formatTime(startUnix, endUnix, startRange, endRange) {
    if (startUnix > endUnix) {
        logError("formatTime: startUnix must be lower than endUnix");
        return;
    }
    if (!Number.isInteger(startRange) || !Number.isInteger(endRange) || startRange < 0 || startRange > 4 || endRange < 0 || endRange > 4) {
        logError("formatTime: startRange and endRange must be integers between 0 and 4");
        return;
    }
    if (startRange > endRange) {
        logError("formatTime: startRange must be lower than or equal to endRange");
        return;
    }

    let remaining = endUnix - startUnix;
    let parts = [];

    for (let i = endRange; i >= startRange; i--) {
        const val = Math.floor(remaining / MS_PER[i]);
        remaining = remaining % MS_PER[i];
        parts.push(val + RANGES[i]);
    }

    return parts.join("");
}

export function Capitalize(text) {
    if (!text) return text;

    return text.charAt(0).toUpperCase() + text.slice(1);
}