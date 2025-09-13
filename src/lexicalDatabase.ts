import { setMapToObject, mapToObject } from './conversion.js';
import { objectToMap, objectToSetValuedMap, replaceKey } from './common/utils.js';
import { readMorphAnalysisValue } from './morphologicalAnalysis/auxiliary.js';
import { writeMorphAnalysisValue, MorphologicalAnalysis } from './model/morphologicalAnalysis.js';
import { Word, updateMorphologicalAnalysis } from './word.js';

type Line = Word[];

type Representation = {
  dictionary: {[key: string]: string[]};
  glosses: {[key: string]: string[]};
  concordance: {[key: string]: string[]};
  corpus: {[key: string]: Line};
}

export class LexicalDatabase {
  dictionary: Map<string, Set<string>>;
  glosses: Map<string, Set<string>>;
  concordance: Map<string, Set<string>>;
  corpus: Map<string, Line>;
  constructor(obj: undefined | Representation) {
    if (obj === undefined) {
      this.dictionary = new Map();
      this.glosses = new Map();
      this.concordance = new Map();
      this.corpus = new Map();
    } else {
      const {dictionary, glosses, concordance, corpus} = obj;
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
    const obj = {dictionary, glosses, concordance, corpus};
    const jsonText = JSON.stringify(obj, undefined, '\t');
    return jsonText;
  }
  replaceMorphologicalAnalysis(transcriptions: string[], origin: string, target: string): void {
    this.modifyAnalysis(transcriptions, origin, target);
    this.updateCorpus(origin, target);
    this.updateConcordanceKey(origin, target);
  }
  modifyAnalysis(transcriptions: string[], oldAnalysis: string, newAnalysis: string): void {
    for (const transcription of transcriptions) {
      const valueSet = this.dictionary.get(transcription);
      if (valueSet !== undefined) {
        valueSet.delete(oldAnalysis);
        valueSet.add(newAnalysis);
      }
    }
  }
  updateConcordanceKey(oldAnalysis: string, newAnalysis: string): void {
    replaceKey(this.concordance, oldAnalysis, newAnalysis);
  }
  updateCorpus(oldAnalysis: string, newAnalysis: string): void {
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
  quickGetAttestations(morphologicalAnalysis: MorphologicalAnalysis): string[] {
    const analysis = writeMorphAnalysisValue(morphologicalAnalysis);
    const current = this.concordance.get(analysis);
    if (current === undefined) {
      return [];
    } else {
      return Array.from(current);
    }
  }
}
