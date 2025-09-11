export function isSingleEncliticsAnalysis(ea) {
    return 'analysis' in ea;
}
export function isMultiEncliticsAnalysis(ea) {
    return 'analysisOptions' in ea;
}
export function writeEncliticsAnalysis(encliticsAnalysis) {
    return 'analysis' in encliticsAnalysis
        ? encliticsAnalysis.enclitics + ' @ ' + encliticsAnalysis.analysis
        : encliticsAnalysis.enclitics + ' @ ' + encliticsAnalysis.analysisOptions.map(({ letter, analysis }) => `{ ${letter} → ${analysis}}`).join(' ');
}
