import { setMapToObject, mapToObject } from './conversion.js';
import { objectToMap, objectToSetValuedMap, replaceKey } from './common/utils.js';
import { readMorphAnalysisValue, getFirstSelectedMorphTag } from './morphologicalAnalysis/auxiliary.js';
import { makeGloss } from './common/auxiliary.js';
import { writeMorphAnalysisValue } from './model/morphologicalAnalysis.js';
export class LexicalDatabase {
    constructor(obj) {
        if (obj === undefined) {
            this.dictionary = new Map();
            this.glosses = new Map();
            this.concordance = new Map();
            this.corpus = new Map();
        }
        else {
            const { dictionary, glosses, concordance, corpus } = obj;
            this.dictionary = objectToSetValuedMap(dictionary);
            this.glosses = objectToSetValuedMap(glosses);
            this.concordance = objectToSetValuedMap(concordance);
            this.corpus = objectToMap(corpus);
        }
    }
    toJSON() {
        const dictionary = setMapToObject(this.dictionary);
        const glosses = setMapToObject(this.glosses);
        const concordance = setMapToObject(this.concordance);
        const corpus = mapToObject(this.corpus);
        const obj = { dictionary, glosses, concordance, corpus };
        const jsonText = JSON.stringify(obj, undefined, '\t');
        return jsonText;
    }
    replace(transcriptions, origin, target) {
        this.modifyAnalysis(transcriptions, origin, target);
        this.replaceMorphologicalAnalysis(origin, target);
        this.updateConcordanceKey(origin, target);
    }
    modifyAnalysis(transcriptions, oldAnalysis, newAnalysis) {
        for (const transcription of transcriptions) {
            const valueSet = this.dictionary.get(transcription);
            if (valueSet !== undefined) {
                valueSet.delete(oldAnalysis);
                valueSet.add(newAnalysis);
            }
        }
    }
    updateConcordanceKey(oldAnalysis, newAnalysis) {
        replaceKey(this.concordance, oldAnalysis, newAnalysis);
    }
    replaceMorphologicalAnalysis(oldAnalysis, newAnalysis) {
        const oldMa = readMorphAnalysisValue(oldAnalysis);
        if (oldMa !== undefined) {
            const newMa = readMorphAnalysisValue(newAnalysis);
            for (const attestation of this.quickGetAttestations(oldMa)) {
                const line = this.corpus.get(attestation);
                if (line !== undefined) {
                    for (let i = 0; i < line.length; i++) {
                        const word = line[i];
                        line[i] = updateMorphologicalAnalysis(word, oldMa, newMa);
                    }
                }
            }
        }
    }
    quickGetAttestations(morphologicalAnalysis) {
        const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
        const current = this.concordance.get(analysis);
        if (current === undefined) {
            return [];
        }
        else {
            return Array.from(current);
        }
    }
}
function getSegmentationAndGloss(morphologicalAnalysis) {
    let segmentation;
    let gloss;
    if (morphologicalAnalysis !== undefined) {
        segmentation = morphologicalAnalysis.referenceWord;
        const { translation } = morphologicalAnalysis;
        const morphTag = getFirstSelectedMorphTag(morphologicalAnalysis);
        if (morphTag !== undefined) {
            gloss = makeGloss(translation, morphTag);
        }
        else {
            gloss = translation;
        }
    }
    else {
        segmentation = '';
        gloss = '';
    }
    return [segmentation, gloss];
}
function updateMorphologicalAnalysis(word, oldMa, newMa) {
    const [oldSegmentation, oldGloss] = getSegmentationAndGloss(oldMa);
    if (word.segmentation === oldSegmentation && word.gloss === oldGloss) {
        const { transliteration } = word;
        const [segmentation, gloss] = getSegmentationAndGloss(newMa);
        return { transliteration, segmentation, gloss };
    }
    else {
        return word;
    }
}
