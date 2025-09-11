// regex means multiple whitespaces followed by (but not including) an opening curly brace
const letteredAnalysesSplitRegex = /\s*(?={)/;
function parseAnalysisOption(as) {
    const [letter, analysis] = as
        // Remove curly braces
        .substring(1, as.length - 1)
        .trim()
        .split('→')
        .map((s) => s.trim());
    return { letter, analysis };
}
function parseSelectableAnalysisOption(as, selectedLetters) {
    const { letter, analysis } = parseAnalysisOption(as);
    return { letter, analysis, selected: selectedLetters.includes(letter) };
}
export function parseMultiAnalysisString(as, selectedLetters) {
    return as.split(letteredAnalysesSplitRegex).map((s) => parseSelectableAnalysisOption(s, selectedLetters));
}
