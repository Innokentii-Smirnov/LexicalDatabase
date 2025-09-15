import { setMapToObject } from '../conversion.js';
import { objectToSetValuedMap, replaceKey, add, remove } from '../common/utils.js';
import { writeMorphAnalysisValue, MorphologicalAnalysis } from '../model/morphologicalAnalysis.js';

type Representation = {[key: string]: string[]};

export class Concordance {
  concordance: Map<string, Set<string>>;
  constructor(obj: undefined | Representation) {
    if (obj === undefined) {
      this.concordance = new Map();
    } else {
      this.concordance = objectToSetValuedMap(obj);
    }
  }
  toObject(): Representation {
    return setMapToObject(this.concordance);
  }
  update(oldAnalysis: string, newAnalysis: string): void {
    replaceKey(this.concordance, oldAnalysis, newAnalysis);
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
  editTokenAnnotation(attestation: string, oldMa: string, newMa: string,
                      removeConcordanceRecordForOldAnalysis: boolean): void {
    if (removeConcordanceRecordForOldAnalysis) {
      remove(this.concordance, oldMa, attestation);
    }
    add(this.concordance, newMa, attestation);
  }

  /* Add a new attestation for the given morphological analysis
   * attestation: a string identifying a text line of the form text,lnr
   */
  addAttestation(morphologicalAnalysis: string, attestation: string) {
    add(this.concordance, morphologicalAnalysis, attestation);
  }


  /* Remove an attestation for the given morphological analysis
   * attestation: a string identifying a text line of the form text,lnr
   */
  removeAttestation(morphologicalAnalysis: string, attestation: string) {
    remove(this.concordance, morphologicalAnalysis, attestation);
  }
}
