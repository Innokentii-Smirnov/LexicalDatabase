import { setMapToObject } from '../conversion.js';
import { objectToSetValuedMap, add } from '../common/utils.js';
import { MorphologicalAnalysis } from '../model/morphologicalAnalysis.js';
import { getStem } from '../common/splitter.js';

type Representation = {[key: string]: string[]};

function getKey(word: string, pos: string): string {
  return word + ',' + pos;
}

const translationWordSeparator = '; ';

function splitTranslationIntoWords(translation: string): string[] {
  return translation.split(translationWordSeparator).sort();
}

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

  extractStemTranslation(ma: MorphologicalAnalysis): void {
    const segmentation = ma.referenceWord;
    const { translation } = ma;
    const pos = ma.paradigmClass;
    const stem = getStem(segmentation);
    const key = getKey(stem, pos);
    add(this.glosses, key, translation);
  }

  changeStem(oldStem: string, newStem: string, pos: string, translation: string): void {
    const oldKey = getKey(oldStem, pos);
    const newKey = getKey(newStem, pos);
    this.changeKey(oldKey, newKey, translation);
  }

  changePos(stem: string, oldPos: string, newPos: string, translation: string): void {
    const oldKey = getKey(stem, oldPos);
    const newKey = getKey(stem, newPos);
    this.changeKey(oldKey, newKey, translation);
  }

  changeKey(oldKey: string, newKey: string, translation: string): void {
    const translationWords = splitTranslationIntoWords(translation);
    const oldTranslationWordSet = this.glosses.get(oldKey);
    const newTranslationWordSet = new Set<string>();
    if (oldTranslationWordSet !== undefined) {
      for (const translationWord of translationWords) {
        oldTranslationWordSet.delete(translationWord);
      }
      if (oldTranslationWordSet.size === 0) {
        this.glosses.delete(oldKey);
      }
    }
    for (const translationWord of translationWords) {
      newTranslationWordSet.add(translationWord);
    }
    if (!(newTranslationWordSet.size === 0)) {
      this.glosses.set(newKey, newTranslationWordSet);
    }
  }

  changeTranslation(stem: string, pos: string, oldTranslation: string, newTranslation: string): void {
    const key = getKey(stem, pos);
    let current = this.glosses.get(key);
    if (current === undefined) {
      current = new Set<string>();
      this.glosses.set(key, current);
    } else {
      const oldTranslationWords = splitTranslationIntoWords(oldTranslation);
      for (const oldTranslationWord of oldTranslationWords) {
        current.delete(oldTranslationWord);
      }
    }
    const newTranslationWords = splitTranslationIntoWords(newTranslation);
    for (const newTranslationWord of newTranslationWords) {
      current.add(newTranslationWord);
    }
  }
}
