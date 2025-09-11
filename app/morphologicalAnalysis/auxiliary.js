import { readMorphologicalAnalysis } from '../model/morphologicalAnalysis.js';
export function readMorphAnalysisValue(value) {
    return readMorphologicalAnalysis(1, value, []);
}
export function isSelected(morphologicalAnalysis) {
    switch (morphologicalAnalysis._type) {
        case 'SingleMorphAnalysisWithoutEnclitics':
            return morphologicalAnalysis.selected;
        case 'MultiMorphAnalysisWithoutEnclitics':
            return morphologicalAnalysis.analysisOptions.some(analysisOption => analysisOption.selected);
        default:
            return false;
    }
}
export function getFirstSelectedMorphTag(morphologicalAnalysis) {
    switch (morphologicalAnalysis._type) {
        case 'SingleMorphAnalysisWithoutEnclitics': {
            return morphologicalAnalysis.analysis;
        }
        case 'MultiMorphAnalysisWithoutEnclitics': {
            const analysisOption = morphologicalAnalysis
                .analysisOptions
                .find(analysisOption => analysisOption.selected);
            if (analysisOption !== undefined) {
                return analysisOption.analysis;
            }
            else {
                return undefined;
            }
        }
        default:
            return undefined;
    }
}
export function getMorphTags(analysis) {
    switch (analysis._type) {
        case 'SingleMorphAnalysisWithoutEnclitics':
            return [analysis.analysis];
        case 'MultiMorphAnalysisWithoutEnclitics':
            return analysis.analysisOptions.map(({ analysis }) => analysis);
        default:
            return [];
    }
}
function convertToSingle(multi) {
    const { number, referenceWord, translation, paradigmClass, determinative, encliticsAnalysis } = multi;
    const analysisOption = multi.analysisOptions[0];
    const { analysis, selected } = analysisOption;
    const single = {
        _type: 'SingleMorphAnalysisWithoutEnclitics',
        number,
        referenceWord,
        translation,
        analysis,
        paradigmClass,
        determinative,
        encliticsAnalysis,
        selected
    };
    return single;
}
export function convertToSingleIfAppropriate(ma) {
    if (ma._type === 'MultiMorphAnalysisWithoutEnclitics' && ma.analysisOptions.length === 1) {
        return convertToSingle(ma);
    }
    else {
        return ma;
    }
}
