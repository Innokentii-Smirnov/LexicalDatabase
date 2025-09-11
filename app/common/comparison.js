import { removeMacron } from './utils.js';
function preprocessLetter(letter) {
    return removeMacron(letter).toLowerCase();
}
const lang = 'lv';
const latvianCompare = new Intl.Collator(lang).compare;
function compareLetter(a, b) {
    if (a === 'g' && b === 'ġ') {
        return -1;
    }
    else if (a === 'ġ' && b === 'g') {
        return 1;
    }
    else {
        return latvianCompare(a, b);
    }
}
export function compare(a, b) {
    a = preprocessLetter(a);
    b = preprocessLetter(b);
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
        const comparisonResult = compareLetter(a[i], b[i]);
        if (comparisonResult === 0) {
            continue;
        }
        else {
            return comparisonResult;
        }
    }
    return b.length - a.length;
}
