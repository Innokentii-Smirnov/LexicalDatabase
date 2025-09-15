import { mapToObject } from '../conversion.js';
import { objectToMap } from '../common/utils.js';
import { Word, updateMorphologicalAnalysis } from './word.js';
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

  /* Add a new line to the corpus.
   * attestation: a string identifying the added line of the form text,lnr
   * line: an array of word representations
   */
  addLine(attestation: string, line: Line) {
    this.corpus.set(attestation, line);
  }

  /* Change the annotation of a single word in the specified line.
   * attestation: a string identifying the edited line of the form text,lnr
   * i: the position of the edited word
   * word: the new representation of the edited word
   */
  updateLine(attestation: string, i: number, word: Word): void {
    const line = this.corpus.get(attestation);
    if (line !== undefined) {
      if (0 <= i && i < line.length) {
        line[i] = word;
      }
    }
  }
}
