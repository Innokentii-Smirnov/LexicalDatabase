import {setMapToObject, mapToObject} from './conversion.js';
import {objectToMap, objectToSetValuedMap} from './utils.js';

type Word = {
  transliteration: string;
  segmentation: string;
  gloss: string;
}

type Line = Word[];

type Representation = {
  dictionary: {[key: string]: string[]};
  glosses: {[key: string]: string[]};
  concordance: {[key: string]: string[]};
  corpus: {[key: string]: Line[]};
}

export class LexicalDatabase {
  dictionary: Map<string, Set<string>>;
  glosses: Map<string, Set<string>>;
  concordance: Map<string, string[]>;
  corpus: Map<string, Line[]>;
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
      this.concordance = objectToMap(concordance);
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
}
