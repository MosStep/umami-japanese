/**
 * Dictionary linking and content-word rules shared by the app (captions/index.ts, AppContext) and the
 * build scripts (scripts/*.mjs bundle this file with esbuild), so the word index and the glossary
 * export cannot drift from what the app links.
 *
 * No imports on purpose: this file must stay dependency-free.
 */

export interface LinkableWord {
  id: string;
  lemma: string;
  reading_kana: string;
}

/** IPA parts of speech that are not content words (stored raw in caption tokens). */
export const NON_CONTENT_IPA_POS = new Set(['助詞', '助動詞', '記号']);

/**
 * The tokenizer folds punctuation into the neighbouring token's surface ("私、", "「俺").
 * Lemma and reading must come from the bare word, so leading/trailing punctuation and spaces are trimmed.
 */
export const coreSurface = (surface: string): string =>
  surface.replace(/^[\p{P}\p{S}\s]+|[\p{P}\s]+$/gu, '');

/** Lemma and hiragana reading of a raw caption token (as stored in src/data/captions/*.json). */
export const lemmaReadingOf = (t: { surface: string; lemma?: string; reading?: string }): { lemma: string; reading: string } => {
  const core = coreSurface(t.surface);
  const lemma = t.lemma ?? core;
  const reading = t.reading ?? (/^[ぁ-ゖ]+$/.test(core) ? core : '');
  return { lemma, reading };
};

/** First dictionary entry per lemma. */
export const buildDictionaryByLemma = <T extends LinkableWord>(words: readonly T[]): Map<string, T> => {
  const map = new Map<string, T>();
  for (const w of words) if (!map.has(w.lemma)) map.set(w.lemma, w);
  return map;
};

/**
 * A token links to the dictionary entry with the same lemma when its reading starts with the entry's
 * first kana. This keeps homographs apart: 人 (ひと vs じん), 今 (いま vs こん), 力 (ちから vs りょく).
 * The token reading is the stem reading, so it is compared on the first kana only (待っ -> 待つ).
 */
export const linkDictionaryEntry = <T extends LinkableWord>(
  dict: Map<string, T>,
  lemma: string,
  reading: string
): T | undefined => {
  const entry = dict.get(lemma);
  if (!entry || !reading || !entry.reading_kana) return undefined;
  return reading[0] === entry.reading_kana[0] ? entry : undefined;
};
