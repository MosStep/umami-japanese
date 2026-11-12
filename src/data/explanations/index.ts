/**
 * Per-line Thai explanations written offline (scripts/explain-tool.mjs):
 * src/data/explanations/<youtube_id>.json = { youtube_id, v, items: { "<start_ms>": LineExplanation } }.
 * Each clip's file is its own lazy chunk, loaded when the clip opens.
 */
export interface GrammarPoint {
  /** Text as it appears in the line (or in `fix`). */
  f: string;
  /** Base form or pattern, e.g. 〜てしまう. */
  b: string;
  /** Thai explanation. */
  e: string;
}

export interface LineExplanation {
  /** The caption's Japanese when the explanation was written; shown only while it still matches. */
  ja: string;
  /** Thai explanation of the line in context. */
  x: string;
  g?: GrammarPoint[];
  /** Corrected Japanese for a mis-heard auto caption. */
  fix?: string;
}

interface ExplanationFile {
  youtube_id: string;
  v: number;
  items: Record<string, LineExplanation>;
}

const loaders = import.meta.glob('./*.json') as Record<string, () => Promise<{ default: ExplanationFile }>>;
/** Whether this clip ships any explanations (known without loading the file). */
export const hasExplanations = (youtubeId: string): boolean => `./${youtubeId}.json` in loaders;

const cache = new Map<string, Promise<Record<string, LineExplanation>>>();

export const loadExplanations = (youtubeId: string): Promise<Record<string, LineExplanation>> => {
  let p = cache.get(youtubeId);
  if (!p) {
    const loader = loaders[`./${youtubeId}.json`];
    p = loader ? loader().then((m) => m.default.items ?? {}).catch(() => ({})) : Promise.resolve({});
    cache.set(youtubeId, p);
  }
  return p;
};

const compact = (s: string) => s.replace(/\s+/g, '');

/** The explanation for a line, or undefined when there is none or the caption changed since it was written. */
export const explanationFor = (
  items: Record<string, LineExplanation>,
  startMs: number,
  ja: string,
): LineExplanation | undefined => {
  const item = items[String(startMs)];
  return item && ja && compact(item.ja) === compact(ja) ? item : undefined;
};
