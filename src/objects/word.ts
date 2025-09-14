import { MorphologicalAnalysis } from '../model/morphologicalAnalysis.js';
import { getFirstSelectedMorphTag } from '../morphologicalAnalysis/auxiliary.js';
import { makeGloss } from '../common/auxiliary.js';

export type Word = {
  transliteration: string;
  segmentation: string;
  gloss: string;
}

function getSegmentationAndGloss(morphologicalAnalysis: MorphologicalAnalysis | undefined): [string, string] {
  let segmentation: string;
  let gloss: string;
  if (morphologicalAnalysis !== undefined) {
    segmentation = morphologicalAnalysis.referenceWord;
    const { translation } = morphologicalAnalysis;
    const morphTag = getFirstSelectedMorphTag(morphologicalAnalysis);
    if (morphTag !== undefined) {
      gloss = makeGloss(translation, morphTag);
    } else {
      gloss = translation;
    }
  } else {
    segmentation = '';
    gloss = '';
  }
  return [segmentation, gloss];
}

export function updateMorphologicalAnalysis(word: Word,
                                            oldMa: MorphologicalAnalysis | undefined,
                                            newMa: MorphologicalAnalysis | undefined): Word {
  const [oldSegmentation, oldGloss] = getSegmentationAndGloss(oldMa);
  if (word.segmentation === oldSegmentation && word.gloss === oldGloss) {
    const { transliteration } = word;
    const [segmentation, gloss] = getSegmentationAndGloss(newMa);
    return { transliteration, segmentation, gloss };
  } else {
    return word;
  }
}

export function hasGivenAnalysis(word: Word, gloss: string,
  morphologicalAnalysis: MorphologicalAnalysis): boolean {
  const hasGivenSegmentation = word.segmentation === morphologicalAnalysis.referenceWord;
  const hasGivenGloss = word.gloss === gloss;
  return hasGivenSegmentation && hasGivenGloss;
}
