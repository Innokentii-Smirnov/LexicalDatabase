import { Dictionary } from './dictionary.js'
import { TranslationLexicon } from './translationLexicon.js'
import { Concordance } from './concordance.js'
import { Corpus, Line } from './corpus.js'

type Representation = {
  dictionary: {[key: string]: string[]};
  glosses: {[key: string]: string[]};
  concordance: {[key: string]: string[]};
  corpus: {[key: string]: Line};
}

export class LexicalDatabase {
  dictionary: Dictionary;
  translationLexicon: TranslationLexicon;
  concordance: Concordance;
  corpus: Corpus;
  constructor(obj: undefined | Representation) {
    if (obj === undefined) {
      this.dictionary = new Dictionary(undefined);
      this.translationLexicon = new TranslationLexicon(undefined);
      this.concordance = new Concordance(undefined);
      this.corpus = new Corpus(undefined, this.concordance);
    } else {
      const {dictionary, glosses, concordance, corpus} = obj;
      this.dictionary = new Dictionary(dictionary);
      this.translationLexicon = new TranslationLexicon(glosses);
      this.concordance = new Concordance(concordance);
      this.corpus = new Corpus(corpus, this.concordance);
    }
  }
  toJSON() {
    const dictionary = this.dictionary.toObject();
    const glosses = this.translationLexicon.toObject();
    const concordance = this.concordance.toObject();
    const corpus = this.corpus.toObject();
    const obj = {dictionary, glosses, concordance, corpus};
    const jsonText = JSON.stringify(obj, undefined, '\t');
    return jsonText;
  }
  replaceMorphologicalAnalysis(transcriptions: string[], origin: string, target: string): void {
    this.dictionary.update(transcriptions, origin, target);
    this.corpus.update(origin, target);
    this.concordance.update(origin, target);
  }
  changeStem(oldStem: string, newStem: string, pos: string, translation: string): void {
    this.translationLexicon.changeStem(oldStem, newStem, pos, translation);
  }
  changePos(stem: string, oldPos: string, newPos: string, translation: string): void {
    this.translationLexicon.changePos(stem, oldPos, newPos, translation);
  }
  changeTranslation(stem: string, pos: string, oldTranslation: string, newTranslation: string): void {
    this.translationLexicon.changeTranslation(stem, pos, oldTranslation, newTranslation);
  }
  editTokenAnnotation(text: string, lnr: string, position: number,
                     transcription: string, oldAnalysis: string,
                     newAnalysis: string): void {
    const attestation = text + ',' + lnr;
    const hasOtherOccurrences = this.corpus.hasOtherOccurences(oldAnalysis,
      attestation, position);
    const remove = !hasOtherOccurrences;
    this.corpus.editTokenAnnotation(attestation, position, oldAnalysis,
                                    newAnalysis);
    this.concordance.editTokenAnnotation(attestation, oldAnalysis,
                                         newAnalysis, remove);
    this.dictionary.add(transcription, newAnalysis);
  }
}
