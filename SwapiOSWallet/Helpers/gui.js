// Normalize an input number that needs to work across various execution environments by a factor
// Example: scalable font size with a known baseline
export function normalize(pre, factor) {
    return Math.floor(pre * factor);
}