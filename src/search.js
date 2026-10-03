// Tiny in-browser BM25 index over the curriculum (module text + your notes). Fully offline.
const tok = (s) => (s.toLowerCase().match(/[a-z0-9\u03a8+#]+/g) || []).filter((w) => w.length > 1 && !STOP.has(w));
const STOP = new Set('the of and to in is it a an for on as at by or be are was this that with from you your what why how does do can its their then than into'.split(' '));

export function buildIndex(docs) {
  // docs: [{id, title, text}]
  const df = new Map(); const rows = []; let total = 0;
  for (const d of docs) {
    const tf = new Map();
    const tt = tok(d.title), bt = tok(d.text);
    for (const w of bt) tf.set(w, (tf.get(w) || 0) + 1);
    for (const w of tt) tf.set(w, (tf.get(w) || 0) + 3);   // title boost
    const len = bt.length + tt.length * 3; total += len;
    for (const w of tf.keys()) df.set(w, (df.get(w) || 0) + 1);
    rows.push({ d, tf, len });
  }
  return { rows, df, avg: total / Math.max(1, rows.length), N: rows.length };
}

export function query(idx, q, limit = 12) {
  const terms = tok(q); if (!terms.length) return [];
  const k1 = 1.4, b = 0.75; const out = [];
  for (const r of idx.rows) {
    let s = 0;
    for (const t of terms) {
      const f = r.tf.get(t); if (!f) continue;
      const n = idx.df.get(t) || 0;
      const idf = Math.log(1 + (idx.N - n + 0.5) / (n + 0.5));
      s += idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * r.len / idx.avg));
    }
    if (s > 0) out.push({ d: r.d, score: s });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function snippet(text, q, n = 170) {
  const terms = tok(q); const low = text.toLowerCase();
  let pos = -1;
  for (const t of terms) { const i = low.indexOf(t); if (i >= 0 && (pos < 0 || i < pos)) pos = i; }
  const start = Math.max(0, (pos < 0 ? 0 : pos) - 40);
  return (start > 0 ? '… ' : '') + text.slice(start, start + n) + (start + n < text.length ? ' …' : '');
}
