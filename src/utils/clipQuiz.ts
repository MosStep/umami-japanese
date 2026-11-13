/**
 * Offline end-of-clip quiz (5 questions) and word harvest, built only from the clip's own subtitle data:
 * word meaning, listen → meaning, sentence → Thai, fill the blank, put the words in order.
 */
import type { SubtitleLineRecord, SubtitleTokenJSON, WordLearningStatus } from '../schema/databaseSchema';

const CONTENT_POS = new Set(['คำนาม', 'คำกริยา', 'คำคุณศัพท์', 'คำวิเศษณ์']);
const HAS_KANJI = /[一-鿿]/;

export interface ClipWord {
  id: string;
  lemma: string;
  reading: string;
  surface: string;
  meaning: string;
  count: number;
}

export type QuizQuestion =
  | { kind: 'meaning'; word: ClipWord; options: string[]; answer: number }
  | { kind: 'listen'; word: ClipWord; options: string[]; answer: number }
  | { kind: 'sentence'; line: SubtitleLineRecord; options: string[]; answer: number }
  | { kind: 'cloze'; line: SubtitleLineRecord; blank: number; word: ClipWord; options: string[]; answer: number }
  | { kind: 'order'; line: SubtitleLineRecord; pieces: string[]; shuffled: number[] };

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** Word id that follows the word across clips (dictionary id or g:lemma|reading), not a per-line fallback id. */
const isStableId = (id: string) => id.startsWith('g:') || !id.startsWith('cap-');

const isContent = (t: SubtitleTokenJSON) =>
  CONTENT_POS.has(t.part_of_speech) &&
  !!t.thai_meaning &&
  isStableId(t.word_id) &&
  (HAS_KANJI.test(t.lemma) || t.lemma.length >= 3);

/** Content words of the clip with a Thai meaning, most frequent first. */
export const clipWords = (lines: SubtitleLineRecord[]): ClipWord[] => {
  const map = new Map<string, ClipWord>();
  for (const line of lines) {
    for (const t of line.tokens_json) {
      if (!isContent(t)) continue;
      const w = map.get(t.word_id);
      if (w) w.count++;
      else
        map.set(t.word_id, {
          id: t.word_id,
          lemma: t.lemma,
          reading: t.reading_kana,
          surface: t.surface,
          meaning: (t.thai_meaning ?? '').trim(),
          count: 1,
        });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
};

/** Picks `n` options with distinct text including the answer; returns options and the answer's index. */
const withDistractors = (answer: string, pool: string[], n = 4): { options: string[]; answer: number } | null => {
  const others = shuffle([...new Set(pool.filter((p) => p && p !== answer))]).slice(0, n - 1);
  if (others.length < n - 1) return null;
  const options = shuffle([answer, ...others]);
  return { options, answer: options.indexOf(answer) };
};

const lineThai = (l: SubtitleLineRecord) => (l.thai_translation || l.natural_translation || '').trim();

export const buildClipQuiz = (
  lines: SubtitleLineRecord[],
  status: (id: string) => WordLearningStatus,
): QuizQuestion[] => {
  const words = clipWords(lines);
  const meanings = words.map((w) => w.meaning);
  // Words to ask about: not known yet first (the ones worth learning), then the rest.
  const askable = [...words.filter((w) => status(w.id) !== 'known'), ...words.filter((w) => status(w.id) === 'known')];
  const used = new Set<string>();
  const nextWord = () => {
    const w = askable.find((x) => !used.has(x.id));
    if (w) used.add(w.id);
    return w;
  };
  const sentenceLines = lines.filter((l) => {
    const len = l.raw_text.replace(/\s/g, '').length;
    return len >= 5 && len <= 28 && lineThai(l).length > 0;
  });
  const usedLines = new Set<string>();
  const pickLine = (ok: (l: SubtitleLineRecord) => boolean) => {
    const l = shuffle(sentenceLines).find((x) => !usedLines.has(x.id) && ok(x));
    if (l) usedLines.add(l.id);
    return l;
  };

  const out: QuizQuestion[] = [];
  const addWordQuestion = (kind: 'meaning' | 'listen') => {
    const w = nextWord();
    if (!w) return false;
    const d = withDistractors(w.meaning, meanings);
    if (!d) return false;
    out.push({ kind, word: w, ...d });
    return true;
  };

  addWordQuestion('meaning');
  addWordQuestion('listen');

  const sLine = pickLine(() => true);
  if (sLine) {
    const d = withDistractors(lineThai(sLine), sentenceLines.map(lineThai));
    if (d) out.push({ kind: 'sentence', line: sLine, ...d });
  }

  const cLine = pickLine((l) => l.tokens_json.some(isContent));
  if (cLine) {
    const blank = cLine.tokens_json.findIndex(isContent);
    const t = cLine.tokens_json[blank];
    const word = words.find((w) => w.id === t.word_id);
    const d = word && withDistractors(t.surface, words.map((w) => w.surface));
    if (word && d) out.push({ kind: 'cloze', line: cLine, blank, word, ...d });
  }

  const oLine = pickLine((l) => l.tokens_json.length >= 3 && l.tokens_json.length <= 7);
  if (oLine) {
    const pieces = oLine.tokens_json.map((t) => t.surface);
    let shuffled = shuffle(pieces.map((_, i) => i));
    if (shuffled.every((v, i) => v === i)) shuffled = [...shuffled.slice(1), shuffled[0]];
    out.push({ kind: 'order', line: oLine, pieces, shuffled });
  }

  // Not enough sentence data: fill up with more word questions.
  while (out.length < 5 && addWordQuestion(out.length % 2 ? 'listen' : 'meaning')) {}
  return out.slice(0, 5);
};

/** Words worth adding to the deck: new to the user, seen at least twice in this clip (or missed in the quiz). */
export const harvestWords = (
  lines: SubtitleLineRecord[],
  status: (id: string) => WordLearningStatus,
  missed: Set<string>,
  max = 10,
): ClipWord[] =>
  clipWords(lines)
    .filter((w) => status(w.id) === 'new' && (w.count >= 2 || missed.has(w.id)))
    .sort((a, b) => Number(missed.has(b.id)) - Number(missed.has(a.id)) || b.count - a.count)
    .slice(0, max);
