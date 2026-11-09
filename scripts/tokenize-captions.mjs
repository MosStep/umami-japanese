// Adds `tokens` to every caption JSON line that has Japanese text.
//   node scripts/tokenize-captions.mjs [youtube_id ...]
// Uses kuromoji (IPA dictionary from node_modules). Output is compact JSON (no indentation).
// Each token: { surface, lemma, reading (hiragana), romaji (Hepburn), pos }.
// Pure punctuation tokens are kept here so the rendered text is complete; src/data/captions/index.ts
// folds them into the neighbouring token so they are not tap targets.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import kuromoji from 'kuromoji';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CAPTION_DIR = join(ROOT, 'src', 'data', 'captions');
const DIC_PATH = join(ROOT, 'node_modules', 'kuromoji', 'dict');

// Hiragana -> Hepburn. Two-kana entries (digraphs) are checked before single kana.
const BASE = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', ゐ: 'i', ゑ: 'e', を: 'o', ん: 'n',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ぁ: 'a', ぃ: 'i', ぅ: 'u', ぇ: 'e', ぉ: 'o', ゔ: 'vu', ゎ: 'wa',
};
const DIGRAPH = {
  きゃ: 'kya', きゅ: 'kyu', きょ: 'kyo', ぎゃ: 'gya', ぎゅ: 'gyu', ぎょ: 'gyo',
  しゃ: 'sha', しゅ: 'shu', しょ: 'sho', じゃ: 'ja', じゅ: 'ju', じょ: 'jo',
  ちゃ: 'cha', ちゅ: 'chu', ちょ: 'cho', ぢゃ: 'ja', ぢゅ: 'ju', ぢょ: 'jo',
  にゃ: 'nya', にゅ: 'nyu', にょ: 'nyo', ひゃ: 'hya', ひゅ: 'hyu', ひょ: 'hyo',
  びゃ: 'bya', びゅ: 'byu', びょ: 'byo', ぴゃ: 'pya', ぴゅ: 'pyu', ぴょ: 'pyo',
  みゃ: 'mya', みゅ: 'myu', みょ: 'myo', りゃ: 'rya', りゅ: 'ryu', りょ: 'ryo',
  ふぁ: 'fa', ふぃ: 'fi', ふぇ: 'fe', ふぉ: 'fo', うぃ: 'wi', うぇ: 'we', うぉ: 'wo',
  てぃ: 'ti', でぃ: 'di', とぅ: 'tu', どぅ: 'du', しぇ: 'she', じぇ: 'je', ちぇ: 'che',
  つぁ: 'tsa', ゔぁ: 'va', ゔぃ: 'vi', ゔぇ: 've', ゔぉ: 'vo',
};

const toHiragana = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
const isVowelRomaji = (r) => /^[aiueo]$/.test(r);

export function kanaToRomaji(kana) {
  const s = toHiragana(kana);
  // Build a list of units (digraph or single kana, or small/other chars) first.
  const units = [];
  for (let i = 0; i < s.length; i++) {
    const pair = s.slice(i, i + 2);
    if (DIGRAPH[pair] && i + 1 < s.length) { units.push({ k: pair, r: DIGRAPH[pair] }); i++; continue; }
    const c = s[i];
    if (c === 'っ' || c === 'ッ') { units.push({ k: c, r: '<' }); continue; } // gemination marker
    if (c === 'ー') { units.push({ k: c, r: '-' }); continue; } // long vowel marker
    if (BASE[c] !== undefined) { units.push({ k: c, r: BASE[c] }); continue; }
    units.push({ k: c, r: null }); // not kana: caller decides
  }
  let out = '';
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (u.r === null) return null;
    if (u.r === '<') {
      // Gemination: double the first consonant of the next mora ("tch" for "chi").
      const next = units[i + 1];
      if (next && next.r && next.r[0] !== undefined && !isVowelRomaji(next.r[0])) {
        out += next.r.startsWith('ch') ? 't' : next.r[0];
      }
      continue;
    }
    if (u.r === '-') {
      const last = out.match(/[aiueo](?!.*[aiueo])/);
      if (last) out += last[0];
      continue;
    }
    if (u.k === 'ん' || u.k === 'ン') {
      // n before a vowel or y needs an apostrophe: "kan'i".
      const next = units[i + 1];
      out += next && next.r && (isVowelRomaji(next.r[0]) || next.r[0] === 'y') ? "n'" : 'n';
      continue;
    }
    out += u.r;
  }
  return out;
}

const HAS_KANA = /[ぁ-ゖァ-ヶー]/;
const PUNCT_POS = '記号';

function tokenFor(t) {
  const surface = t.surface_form;
  const lemma = t.basic_form && t.basic_form !== '*' ? t.basic_form : surface;
  const readingKana = t.reading && t.reading !== '*' ? toHiragana(t.reading) : (HAS_KANA.test(surface) ? toHiragana(surface) : '');
  let romaji = '';
  if (readingKana) {
    // Particles: は/へ/を are read as wa/e/o in running text.
    if (t.pos === '助詞' && surface === 'は') romaji = 'wa';
    else if (t.pos === '助詞' && surface === 'へ') romaji = 'e';
    else if (t.pos === '助詞' && surface === 'を') romaji = 'o';
    else romaji = kanaToRomaji(readingKana) ?? '';
  }
  return {
    surface,
    lemma,
    reading: readingKana,
    romaji,
    pos: t.pos && t.pos !== '*' ? t.pos : '',
  };
}

const isPunctToken = (t) => t.pos === '記号' || !/[\p{L}\p{N}]/u.test(t.surface);

// Compact token for JSON: lemma and reading are omitted when they equal the surface.
// Punctuation (記号) is not stored as its own token; it is appended to the surface of the
// neighbouring token (or prefixed to the next one at the start of a line), so text is kept.
function compactTokens(tokens) {
  const out = [];
  let prefix = '';
  for (const t of tokens) {
    if (isPunctToken(t)) {
      if (out.length) out[out.length - 1].surface += t.surface;
      else prefix += t.surface;
      continue;
    }
    const c = { surface: prefix + t.surface, romaji: t.romaji, pos: t.pos };
    prefix = '';
    if (t.lemma !== t.surface) c.lemma = t.lemma;
    if (t.reading && t.reading !== t.surface) c.reading = t.reading;
    out.push(c);
  }
  if (prefix && out.length) out[out.length - 1].surface += prefix;
  return out;
}

// kuromoji splits 待っ+てる into 待っ and てる. A reading ending in っ is the first half of a
// geminate: the consonant comes from the next token's romaji ('t' before 'ch'), or 't' at the end.
function fixSokuon(tokens) {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const reading = t.reading ?? t.surface;
    if (!/[っッ]$/.test(reading) || /[^aiueo]$/.test(t.romaji)) continue;
    const next = tokens[i + 1];
    const nr = next?.romaji ?? '';
    if (nr && !/^[aiueon]/.test(nr) ) {
      t.romaji += nr.startsWith('ch') ? 't' : nr[0];
    } else {
      t.romaji += 't';
    }
  }
  return tokens;
}

function tokenizeLine(tokenizer, text) {
  const raw = tokenizer.tokenize(text).map(tokenFor).filter((t) => t.surface.length > 0);
  return compactTokens(fixSokuon(raw));
}

function build() {
  return new Promise((res, rej) => {
    kuromoji.builder({ dicPath: DIC_PATH }).build((err, tokenizer) => (err ? rej(err) : res(tokenizer)));
  });
}

const only = process.argv.slice(2);
const tokenizer = await build();
const files = readdirSync(CAPTION_DIR).filter((f) => f.endsWith('.json') && f !== 'word-index.json')
  .filter((f) => only.length === 0 || only.includes(f.replace(/\.json$/, '')));
let totalLines = 0, totalTokens = 0;
for (const f of files) {
  const path = join(CAPTION_DIR, f);
  const record = JSON.parse(readFileSync(path, 'utf8'));
  let tokenized = 0;
  for (const line of record.lines) {
    delete line.tokens;
    if (line.ja && /[^\s\p{P}]/u.test(line.ja)) {
      line.tokens = tokenizeLine(tokenizer, line.ja);
      tokenized++;
      totalTokens += line.tokens.length;
    }
  }
  totalLines += tokenized;
  writeFileSync(path, JSON.stringify(record) + '\n', 'utf8');
  console.log(`${f}: ${tokenized}/${record.lines.length} lines tokenized`);
}
console.log(`total: ${totalLines} lines, ${totalTokens} tokens`);
