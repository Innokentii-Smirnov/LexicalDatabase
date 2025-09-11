export function selectedSingleMorphAnalysis(number) {
    return { _type: 'SelectedSingleMorphAnalysis', number, morphLetter: undefined, encLetter: undefined };
}
export function selectedSingleMorphAnalysisWithEnclitic(number, encLetter) {
    return { _type: 'SelectedSingleMorphAnalysisWithEnclitic', number, morphLetter: undefined, encLetter };
}
export function selectedMultiMorphAnalysisWithoutEnclitics(number, morphLetter) {
    return { _type: 'SelectedMultiMorphAnalysis', number, morphLetter, encLetter: undefined };
}
export function stringifyMultiMorphAnalysisWithEnclitics({ number, morphLetter, encLetter }) {
    return `${number}${morphLetter}${encLetter}`;
}
export function selectedMultiMorphAnalysisWithEnclitics(number, morphLetter, encLetter) {
    return { _type: 'SelectedMultiMorphAnalysisWithEnclitic', number, morphLetter, encLetter };
}
const morphRegex = /(\d+)([a-z]?)([R-Z]?)/;
export function readSelectedMorphology(morph) {
    return morph
        .split(' ')
        .map((selOpt) => selOpt.match(morphRegex))
        .filter((m) => m !== null)
        .map(([, numStr, maybeMorphLetter, maybeEncLetter]) => {
        const number = parseInt(numStr);
        if (maybeMorphLetter && maybeEncLetter) {
            return selectedMultiMorphAnalysisWithEnclitics(number, maybeMorphLetter, maybeEncLetter);
        }
        else if (maybeMorphLetter) {
            return selectedMultiMorphAnalysisWithoutEnclitics(number, maybeMorphLetter);
        }
        else if (maybeEncLetter) {
            return selectedSingleMorphAnalysisWithEnclitic(number, maybeEncLetter);
        }
        else {
            return selectedSingleMorphAnalysis(number);
        }
    });
}
