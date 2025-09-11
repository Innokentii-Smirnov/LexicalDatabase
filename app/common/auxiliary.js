export function makeGloss(translation, tag) {
    const gloss = translation +
        ((tag.startsWith('=') || tag.startsWith('.') || tag === '') ? '' : '-') + tag;
    return gloss;
}
export function removeSuffix(s, suffix) {
    if (s.endsWith(suffix)) {
        const rest = s.substring(0, s.length - suffix.length);
        if (rest.length > 0) {
            return rest;
        }
    }
    return s;
}
