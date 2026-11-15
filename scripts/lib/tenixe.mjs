// Small Tenixe chat client for the content scripts. Keys come only from env TENIXE_KEYS (comma separated, never stored).
// - streaming (non-streaming calls are cut at 55 s)
// - a key whose plan has no credits left is skipped for the rest of the run; when every key is out → QuotaStop
// - an unpaid-charge error stops the whole run at once (BillingStop)
const BASE = 'https://api.tenixe.com/api/v1';

export class BillingStop extends Error {}
export class QuotaStop extends Error {}

export const stats = { calls: 0, tokIn: 0, tokOut: 0 };

const KEYS = (process.env.TENIXE_KEYS || '').split(',').map((k) => k.trim()).filter(Boolean);
const dead = new Set();

export const requireKeys = () => {
  if (!KEYS.length) {
    console.error('set TENIXE_KEYS');
    process.exit(2);
  }
};

async function chatOnce(key, model, messages, maxTokens) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, stream: true, stream_options: { include_usage: true } }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
  let text = '';
  let buf = '';
  const dec = new TextDecoder();
  for await (const chunk of res.body) {
    buf += dec.decode(chunk, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const p = line.slice(5).trim();
      if (p === '[DONE]') continue;
      const e = JSON.parse(p);
      if (e.error) throw new Error(JSON.stringify(e.error).slice(0, 300));
      text += e.choices?.[0]?.delta?.content ?? '';
      if (e.usage) {
        stats.tokIn += e.usage.prompt_tokens ?? 0;
        stats.tokOut += e.usage.completion_tokens ?? 0;
      }
    }
  }
  if (!text.trim()) throw new Error('empty completion');
  return text;
}

export async function chat(model, messages, maxTokens = 6000) {
  let last;
  for (let round = 0; round < 3; round++) {
    const live = KEYS.filter((k) => !dead.has(k));
    if (!live.length) throw new QuotaStop('every key is out of plan credits until the daily reset');
    for (const key of live) {
      try {
        stats.calls++;
        return await chatOnce(key, model, messages, maxTokens);
      } catch (e) {
        last = e;
        if (/unpaid/i.test(e.message)) throw new BillingStop(e.message);
        if (/insufficient_quota|Not enough plan credits|Quota exceeded/i.test(e.message)) {
          dead.add(key);
          console.error(`key ${key.slice(0, 8)}… is out of credits; trying the next key`);
          continue;
        }
        if (/^(402|429)/.test(e.message)) continue; // busy / other limit: next key for this call
      }
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
  throw last;
}

export const isStop = (e) => e instanceof BillingStop || e instanceof QuotaStop;

export function parseArray(text) {
  const a = text.indexOf('[');
  const b = text.lastIndexOf(']');
  if (a < 0 || b < a) throw new Error('no JSON array');
  return JSON.parse(text.slice(a, b + 1));
}
