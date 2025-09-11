export function findBoundary(segmentation) {
    let i;
    for (i = 0; i < segmentation.length; i++) {
        const char = segmentation[i];
        if (char == '-' || char == '=') {
            break;
        }
    }
    return i;
}
function findTagBoundary(segmentation) {
    let i;
    for (i = 0; i < segmentation.length; i++) {
        const char = segmentation[i];
        if (char == '-' || char == '=' || char == '.' && i < segmentation.length - 1 &&
            segmentation.substring(i + 1).startsWith('ABS')) {
            break;
        }
    }
    return i;
}
export function getStem(segmentation) {
    const i = findBoundary(segmentation);
    const stem = segmentation.substring(0, i);
    return stem.replaceAll('(', '').replaceAll(')', '');
}
function basicGetGrammaticalMorphemes(segmentation, i) {
    if (i == segmentation.length) {
        return '-';
    }
    else {
        if (segmentation[i] === '=') {
            return '-' + segmentation.substring(i);
        }
        return segmentation.substring(i);
    }
}
export function getGrammaticalMorphemes(segmentation) {
    const i = findBoundary(segmentation);
    return basicGetGrammaticalMorphemes(segmentation, i);
}
export function getStemAndGrammaticalMorphemes(segmentation) {
    const i = findBoundary(segmentation);
    const stem = segmentation.substring(0, i);
    const grammaticalMorphemes = basicGetGrammaticalMorphemes(segmentation, i);
    return [stem, grammaticalMorphemes];
}
export function getStemAndGrammaticalMorphemesWithBoundary(segmentation) {
    const i = findBoundary(segmentation);
    const stem = segmentation.substring(0, i);
    const grammaticalMorphemes = segmentation.substring(i);
    return [stem, grammaticalMorphemes];
}
export function basicGetStem(segmentation) {
    const i = findBoundary(segmentation);
    const stem = segmentation.substring(0, i);
    return stem;
}
export function getTranslationAndMorphTag(analysis) {
    const i = findTagBoundary(analysis);
    const translation = analysis.substring(0, i);
    let tag = analysis.substring(i);
    if (tag.startsWith('-')) {
        tag = tag.substring(1);
    }
    return [translation, tag];
}
