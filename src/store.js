// All user data lives in localStorage under one key. No backend, no accounts.
const KEY = 'rlp.v1';
const blank = () => ({
  v: 1, theme: 'auto', startDate: null,
  completed: {},   // moduleId -> ISO timestamp
  exercise: {},    // moduleId -> true
  notes: {},       // moduleId -> text
  qstats: {},      // "moduleId#i" -> {right, wrong, last}
  sessions: [],    // quiz history [{t, right, total, scope}]
});
let state;
const listeners = new Set();

export function load() {
  try { state = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch { state = blank(); }
  if (!state.startDate) { state.startDate = todayStr(); save(); }
  return state;
}
export const get = () => state;
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('save failed', e); }
  listeners.forEach((f) => f());
}
export const onChange = (f) => { listeners.add(f); return () => listeners.delete(f); };

export function todayStr(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
const dayNum = (s) => { const [y, m, d] = s.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 86400000); };
export const daysBetween = (a, b) => dayNum(b) - dayNum(a);

export function isDone(id) { return !!state.completed[id]; }
export function setDone(id, done) {
  if (done) state.completed[id] = new Date().toISOString(); else delete state.completed[id];
  save();
}
export function setNote(id, text) { if (text) state.notes[id] = text; else delete state.notes[id]; save(); }
export function setExercise(id, v) { if (v) state.exercise[id] = true; else delete state.exercise[id]; save(); }
export function recordAnswer(qid, right) {
  const s = state.qstats[qid] || { right: 0, wrong: 0 };
  if (right) s.right++; else s.wrong++;
  s.last = right ? 'right' : 'wrong'; s.t = Date.now();
  state.qstats[qid] = s; save();
}
export function addSession(s) { state.sessions.push(s); state.sessions = state.sessions.slice(-100); save(); }

// local calendar dates (YYYY-MM-DD) on which at least one module was completed
export function completionDates() {
  const set = new Set();
  Object.values(state.completed).forEach((iso) => set.add(todayStr(new Date(iso))));
  return set;
}
export function streaks() {
  const set = completionDates();
  const days = [...set].sort();
  let longest = 0, run = 0, prev = null;
  for (const d of days) { run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1; longest = Math.max(longest, run); prev = d; }
  // current streak: counts back from today (or yesterday if nothing done yet today)
  let cur = 0, t = todayStr();
  if (!set.has(t)) { const y = new Date(); y.setDate(y.getDate() - 1); t = todayStr(y); }
  while (set.has(t)) { cur++; const dt = new Date(t + 'T12:00:00'); dt.setDate(dt.getDate() - 1); t = todayStr(dt); }
  return { current: cur, longest, doneToday: set.has(todayStr()) };
}

export function exportJSON() { return JSON.stringify(state, null, 1); }
export function importJSON(text) {
  const obj = JSON.parse(text);
  if (!obj || typeof obj !== 'object' || !obj.completed) throw new Error('Not a Robot Learning Path backup');
  state = Object.assign(blank(), obj); save();
}
export function resetAll() { state = blank(); state.startDate = todayStr(); save(); }
export function setTheme(t) {
  state.theme = t; save();
  if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
}
export function setStartDate(s) { state.startDate = s; save(); }
