/**
 * Prompts and reply parsing for the AI conversation practice. The model answers with one JSON object per turn.
 * Japanese carries readings as kanji[よみ] so the chat can draw furigana without a tokenizer.
 */
import type { ChatScenario } from '../data/chatScenarios';

export interface ChatTurn {
  role: 'ai' | 'user';
  /** Japanese with kanji[reading] (ai) or the learner's raw text (user). */
  ja: string;
  th?: string;
  /** A more natural version of the learner's sentence, when it needed one. */
  fix?: { ja: string; note: string };
}

export interface AiReply {
  ja: string;
  th: string;
  fix?: { ja: string; note: string };
  done: string[];
  end: boolean;
}

export interface AiHint {
  ja: string;
  th: string;
}

const LEVEL_RULES: Record<string, string> = {
  N5: 'Learner level: JLPT N5 (beginner). Use only very common N5 words and grammar, one or two SHORT sentences (under 25 characters each), speak slowly and clearly. No rare kanji.',
  N4: 'Learner level: JLPT N4. Everyday words and grammar, at most two short sentences.',
  N3: 'Learner level: JLPT N3. Natural everyday Japanese, at most two or three sentences.',
};

const READING_RULE =
  'In every Japanese string write the hiragana reading in square brackets right after each kanji word, e.g. 駅[えき]まで歩[ある]きます。 No romaji.';

/** Removes the [reading] marks: plain Japanese for speech and for showing the learner\'s own text. */
export const stripReadings = (s: string): string => s.replace(/\[[^\]]*\]/g, '');

/** Splits "駅[えき]まで" into ruby segments. */
export const rubySegments = (s: string): { text: string; reading?: string }[] => {
  const out: { text: string; reading?: string }[] = [];
  const re = /([一-鿿々〆ヶ]+)\[([^\]]+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index) });
    out.push({ text: m[1], reading: m[2] });
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ text: s.slice(last) });
  // A stray [..] that follows kana is dropped rather than shown.
  return out.map((seg) => (seg.reading ? seg : { text: seg.text.replace(/\[[^\]]*\]/g, '') })).filter((seg) => seg.text);
};

export const isThaiOnly = (s: string): boolean => /[฀-๿]/.test(s) && !/[぀-ヿ一-鿿]/.test(s);

const transcript = (turns: ChatTurn[], keep = 10): string =>
  turns
    .slice(-keep)
    .map((t) => `${t.role === 'ai' ? 'YOU' : 'LEARNER'}: ${stripReadings(t.ja)}`)
    .join('\n');

export const replySystemPrompt = (sc: ChatScenario): string =>
  [
    'You are a Japanese conversation partner inside the うまみ app for Thai learners. Stay in character and keep the scene moving.',
    `Scene: ${sc.brief}`,
    LEVEL_RULES[sc.level],
    'Never switch to English or Thai inside "ja". React to what the learner actually said; ask one thing at a time.',
    'In "th" use ONE polite particle that fits your character (never write "ครับ/ค่ะ" with a slash).',
    READING_RULE,
    sc.goals.length
      ? `The learner has tasks to complete. Task ids: ${sc.goals.map((g) => `${g.id} = ${g.th}`).join('; ')}. A task is done once the learner has said it in Japanese (mistakes are fine if the meaning is clear).`
      : 'There are no tasks: just have a friendly chat.',
    'Also check the learner\'s LAST message: if it has a real mistake or sounds unnatural, give a corrected natural version in "fix" with a short Thai note (max 80 characters) about what changed. If it is fine, "fix" is null. Do not nitpick politeness level or tiny style choices.',
    'Answer with ONLY one JSON object, no markdown:',
    '{"ja": "<your next line in character>", "th": "<natural Thai translation of ja>", "fix": null | {"ja": "<corrected learner sentence>", "note": "<Thai note>"}, "done": [<ids of ALL tasks completed so far>], "end": <true only when every task is done and you have said goodbye or closed the scene>}',
  ].join('\n');

export const replyUserPrompt = (turns: ChatTurn[], doneSoFar: string[]): string =>
  `Conversation so far:\n${transcript(turns)}\n\nTasks already done: ${doneSoFar.length ? doneSoFar.join(', ') : 'none'}\nWrite your next line as JSON.`;

export const hintSystemPrompt = (sc: ChatScenario): string =>
  [
    'You help a Thai learner in a Japanese role-play. Suggest what the LEARNER could say next.',
    `Scene: ${sc.brief}`,
    LEVEL_RULES[sc.level],
    READING_RULE,
    'In "th" leave out polite particles (no ครับ/ค่ะ).',
    'Answer with ONLY a JSON array of exactly 2 different options, no markdown: [{"ja": "<what the learner can say>", "th": "<Thai meaning>"}]',
  ].join('\n');

export const hintUserPrompt = (sc: ChatScenario, turns: ChatTurn[], doneSoFar: string[]): string => {
  const left = sc.goals.filter((g) => !doneSoFar.includes(g.id)).map((g) => g.th);
  return `Conversation so far:\n${transcript(turns)}\n\n${left.length ? `Tasks the learner still has to do: ${left.join('; ')}. Help with the next one.` : 'Suggest natural replies.'}`;
};

export const teachSystemPrompt = (sc: ChatScenario): string =>
  [
    'A Thai learner in a Japanese role-play typed what they want to say in THAI. Give the Japanese they should say.',
    `Scene: ${sc.brief}`,
    LEVEL_RULES[sc.level],
    READING_RULE,
    'Answer with ONLY one JSON object, no markdown: {"ja": "<the Japanese sentence>", "th": "<short Thai tip about the key word or pattern, max 80 characters>"}',
  ].join('\n');

const jsonSlice = (text: string, open: string, close: string): unknown => {
  const a = text.indexOf(open);
  const b = text.lastIndexOf(close);
  if (a < 0 || b <= a) throw new Error('no json');
  return JSON.parse(text.slice(a, b + 1));
};

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export const parseReply = (text: string): AiReply => {
  const o = jsonSlice(text, '{', '}') as Record<string, unknown>;
  const ja = str(o.ja);
  if (!ja) throw new Error('no ja');
  const f = o.fix as Record<string, unknown> | null | undefined;
  const fix = f && str(f.ja) ? { ja: str(f.ja), note: str(f.note) } : undefined;
  return {
    ja,
    th: str(o.th),
    fix,
    done: Array.isArray(o.done) ? o.done.filter((x): x is string => typeof x === 'string') : [],
    end: o.end === true,
  };
};

export const parseHints = (text: string): AiHint[] => {
  const arr = jsonSlice(text, '[', ']') as unknown[];
  return (Array.isArray(arr) ? arr : [])
    .map((x) => x as Record<string, unknown>)
    .filter((x) => x && str(x.ja))
    .map((x) => ({ ja: str(x.ja), th: str(x.th) }))
    .slice(0, 2);
};

export const parseTeach = (text: string): AiHint => {
  const o = jsonSlice(text, '{', '}') as Record<string, unknown>;
  if (!str(o.ja)) throw new Error('no ja');
  return { ja: str(o.ja), th: str(o.th) };
};

/** Finished conversations kept on this phone (newest last, max 50): the profile and backup can use them. */
export interface ChatLogEntry {
  id: string;
  day: string;
  turns: number;
  done: number;
  goals: number;
}
const LOG_KEY = 'umami_chat_log';
export const loadChatLog = (): ChatLogEntry[] => {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || '[]') as ChatLogEntry[];
  } catch {
    return [];
  }
};
export const addChatLog = (e: ChatLogEntry) => {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify([...loadChatLog(), e].slice(-50)));
  } catch {}
};
