import { mapToObject } from '../conversion.js';
import { objectToMap, makeGlossFromMorphologicalAnalysis }
  from '../common/utils.js';
import { Word, updateMorphologicalAnalysis,
  hasGivenAnalysis } from './word.js';
import { Concordance } from './concordance.js';
import { readMorphAnalysisValue } from '../morphologicalAnalysis/auxiliary.js';
import { makeGloss } from '../common/auxiliary.js';

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
  editTokenAnnotation(attestation: string, i: number,
                     oldMa: string, newMa: string): void {
    const line = this.corpus.get(attestation);
    if (line !== undefined) {
      if (0 <= i && i < line.length) {
        const word = line[i];
        const oldMorphologicalAnalysis = readMorphAnalysisValue(oldMa);
        const newMorphologicalAnalysis = readMorphAnalysisValue(newMa);
        line[i] = updateMorphologicalAnalysis(word,
          oldMorphologicalAnalysis, newMorphologicalAnalysis);
      }
    }
  }

  /* Check whether an analysis occurs in any position other
   * than the specified one.
  */
  hasOtherOccurences(analysis: string, attestation: string,
                     position: number): boolean {
    const line = this.corpus.get(attestation);
    if (line !== undefined) {
      const morphologicalAnalysis = readMorphAnalysisValue(analysis);
      if (morphologicalAnalysis !== undefined) {
        const gloss = makeGlossFromMorphologicalAnalysis(
          morphologicalAnalysis);
        for (let i = 0; i < line.length; i++) {
          if (i !== position) {
            const word = line[i];
            const hasSameAnalysis = hasGivenAnalysis(word, gloss,
              morphologicalAnalysis);
            if (hasSameAnalysis) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
