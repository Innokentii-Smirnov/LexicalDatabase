import { setMapToObject } from '../conversion.js';
import { objectToSetValuedMap } from '../common/utils.js';

type Representation = {[key: string]: string[]};

export class TranslationLexicon {
  glosses: Map<string, Set<string>>;
  constructor(obj: undefined | Representation) {
    if (obj === undefined) {
      this.glosses = new Map();
    } else {
      this.glosses = objectToSetValuedMap(obj);
    }
  }
  toObject(): Representation {
    return setMapToObject(this.glosses);
  }
}
