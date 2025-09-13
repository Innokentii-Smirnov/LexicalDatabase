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
  glosses: TranslationLexicon;
  concordance: Concordance;
  corpus: Corpus;
  constructor(obj: undefined | Representation) {
    if (obj === undefined) {
      this.dictionary = new Dictionary(undefined);
      this.glosses = new TranslationLexicon(undefined);
      this.concordance = new Concordance(undefined);
      this.corpus = new Corpus(undefined, this.concordance);
    } else {
      const {dictionary, glosses, concordance, corpus} = obj;
      this.dictionary = new Dictionary(dictionary);
      this.glosses = new TranslationLexicon(glosses);
      this.concordance = new Concordance(concordance);
      this.corpus = new Corpus(corpus, this.concordance);
    }
  }
  toJSON() {
    const dictionary = this.dictionary.toObject();
    const glosses = this.glosses.toObject();
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
}
