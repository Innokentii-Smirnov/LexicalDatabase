import { setMapToObject } from '../conversion.js';
import { objectToSetValuedMap, add, remove } from '../common/utils.js';

type Representation = {[key: string]: string[]};

export class Dictionary {
  dictionary: Map<string, Set<string>>;
  constructor(obj: undefined | Representation) {
    if (obj === undefined) {
      this.dictionary = new Map();
    } else {
      this.dictionary = objectToSetValuedMap(obj);
    }
  }
  toObject(): Representation {
    return setMapToObject(this.dictionary);
  }
  update(transcriptions: string[], oldAnalysis: string, newAnalysis: string): void {
    for (const transcription of transcriptions) {
      const valueSet = this.dictionary.get(transcription);
      if (valueSet !== undefined) {
        valueSet.delete(oldAnalysis);
        valueSet.add(newAnalysis);
      }
    }
  }
  add(transcription: string, analysis: string) {
    add(this.dictionary, transcription, analysis);
  }
  remove(transcription: string, analysis: string) {
    remove(this.dictionary, transcription, analysis);
  }
}
