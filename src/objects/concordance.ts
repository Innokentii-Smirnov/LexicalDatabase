import { setMapToObject } from '../conversion.js';
import { objectToSetValuedMap, replaceKey } from '../common/utils.js';
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
}
