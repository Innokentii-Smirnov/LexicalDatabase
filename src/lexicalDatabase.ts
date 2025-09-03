import {setMapToObject, mapToObject} from './conversion.js';

export class LexicalDatabase {
  constructor() {
    this.dictionary = new Map();
    this.glosses = new Map();
    this.concordance = new Map();
    this.corpus = new Map();
  }
  toJSON() {
    const dictionary = setMapToObject(this.dictionary);
    const glosses = setMapToObject(this.glosses);
    const concordance = setMapToObject(this.concordance);
    const corpus = mapToObject(this.corpus);
    const object = {dictionary, glosses, concordance, corpus};
    const jsonText = JSON.stringify(object);
    return jsonText;
  }
}
