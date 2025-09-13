import { mapToObject } from '../conversion.js';
import { objectToMap } from '../common/utils.js';
import { Word, updateMorphologicalAnalysis } from './word.js';
import { Concordance } from './concordance.js';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary.js';

export type Line = Word[];
type Representation = {[key: string]: Line};

export class Corpus {
  corpus: Map<string, Line>;
  concordance: Concordance;
  constructor(obj: undefined | Representation, concordance: Concordance) {
    this.concordance = concordance;
    if (obj === undefined) {
      this.corpus = new Map();
    } else {
      this.corpus = objectToMap(obj);
    }
  }
  toObject(): Representation {
    return mapToObject(this.corpus);
  }
  update(oldAnalysis: string, newAnalysis: string): void {
    const oldMa = readMorphAnalysisValue(oldAnalysis);
    if (oldMa !== undefined) {
      const newMa = readMorphAnalysisValue(newAnalysis);
      for (const attestation of this.concordance.quickGetAttestations(oldMa)) {
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
}
