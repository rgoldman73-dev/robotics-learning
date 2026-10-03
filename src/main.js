import './style.css';
import curriculum from './data/curriculum.json';
import library from './data/library.json';
import * as S from './store.js';
import { buildIndex, query, snippet } from './search.js';
import { h, fmtMin, fmtClock, toast, download, shuffle } from './ui.js';

const { meta, modules } = curriculum;
const byId = Object.fromEntries(modules.map((m) => [m.id, m]));
const KIND = { lecture: 'Lecture', project: 'Project', milestone: 'Milestone' };
const app = document.getElementById('app');
S.load();
if (S.get().theme !== 'auto') document.documentElement.dataset.theme = S.get().theme;

/* ---------- helpers ---------- */
const nextModule = () => modules.find((m) => !S.isDone(m.id)) || null;
const doneCount = () => modules.filter((m) => S.isDone(m.id)).length;
const link = (href, text, cls = '') => h('a', { href, class: cls }, text);
const ext = (href, text, cls = '') => h('a', { href, class: cls, target: '_blank', rel: 'noopener noreferrer' }, text);
const moduleText = (m) => [m.title, m.topics.join(' '), m.read.join(' '), m.steps || '', m.exercise, m.recap, m.speaker || '',
  m.questions.map((q) => q.q + ' ' + q.a).join(' '), S.get().notes[m.id] || ''].join(' ');
let index = null;
const getIndex = () => index || (index = buildIndex(modules.map((m) => ({ id: m.id, title: `${m.title} ${m.course}`, text: moduleText(m) }))));
S.onChange(() => { index = null; });

function bar(pct, cls = '') { return h('div', { class: 'bar ' + cls, role: 'progressbar', 'aria-valuenow': Math.round(pct), 'aria-valuemin': 0, 'aria-valuemax': 100 }, h('i', { style: `width:${pct}%` })); }
function chip(text, cls = '') { return h('span', { class: 'chip ' + cls }, text); }

function moduleRow(m, opts = {}) {
  const done = S.isDone(m.id);
  return h('a', { class: 'row' + (done ? ' done' : ''), href: `#/module/${m.id}` },
    h('span', { class: 'tick', 'aria-hidden': 'true' }, done ? '✓' : String(m.day)),
    h('span', { class: 'rowmain' },
      h('span', { class: 'rowtitle' }, m.title),
      h('span', { class: 'rowsub' }, `Day ${m.day} · Month ${m.month} · ${KIND[m.kind]}${m.videoMin ? ` · ${Math.round(m.videoMin)} min video` : ''}`)));
}

/* ---------- layout ---------- */
const TABS = [['#/', 'Today', '🏠'], ['#/modules', 'Modules', '📚'], ['#/quiz', 'Quiz', '❓'], ['#/search', 'Search', '🔎'], ['#/more', 'More', '⋯']];
function shell(route, content) {
  const nav = h('nav', { class: 'tabs', 'aria-label': 'Main' },
    TABS.map(([href, label, icon]) => h('a', { href, class: route === href || (href === '#/more' && ['#/notes', '#/library', '#/settings', '#/about'].includes(route)) ? 'on' : '' },
      h('span', { class: 'ic', 'aria-hidden': 'true' }, icon), h('span', null, label))));
  const top = h('header', { class: 'top' },
    h('a', { href: '#/', class: 'brand' }, h('img', { src: './favicon.svg', alt: '', width: 26, height: 26 }), 'Robot Learning Path'),
    h('span', { class: 'net', id: 'net' }, navigator.onLine ? '' : 'offline'),
    h('button', { class: 'icon', 'aria-label': 'Toggle dark mode', onclick: toggleTheme }, '◐'));
  return h('div', { class: 'shell' }, top, h('main', { id: 'main' }, content), nav);
}
function toggleTheme() {
  const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  S.setTheme(cur === 'dark' ? 'light' : 'dark');
}
window.addEventListener('online', () => { const n = document.getElementById('net'); if (n) n.textContent = ''; });
window.addEventListener('offline', () => { const n = document.getElementById('net'); if (n) n.textContent = 'offline'; });

/* ---------- views ---------- */
function Home() {
  const st = S.get(), n = doneCount(), total = modules.length, nm = nextModule();
  const sk = S.streaks();
  const minsDone = n * 30, minsLeft = (total - n) * 30;
  const sched = Math.min(total, Math.max(1, S.daysBetween(st.startDate, S.todayStr()) + 1));
  const diff = n - (sched - 1);   // completed vs expected-before-today
  const wrap = h('div', { class: 'page' });
  if (nm) {
    const m = nm;
    wrap.append(h('section', { class: 'card hero' },
      h('div', { class: 'eyebrow' }, sk.doneToday ? 'Done for today — bonus module' : "Today's module"),
      h('h1', null, m.title),
      h('p', { class: 'muted' }, `Day ${m.day} of ${total} · ${meta.months[m.month].label}: ${meta.months[m.month].title} · ~30 min`),
      m.watch.length ? h('p', null, '▶ ', m.watch.map((w) => ext(w.url, `${w.course}${w.lecture ? ' L' + w.lecture : ''}${w.partial ? ` ${fmtClock(w.start)}–${fmtClock(w.end)}` : ''}`)).reduce((a, x) => (a.length ? [...a, ' · ', x] : [x]), [])) : h('p', null, m.kind === 'project' ? '🛠 Hands-on coding session' : '✅ Self-assessment'),
      h('div', { class: 'btns' },
        link(`#/module/${m.id}`, 'Open module', 'btn primary'),
        h('button', { class: 'btn', onclick: () => { S.setDone(m.id, true); toast('Marked complete 🎉'); render(); } }, 'Mark complete'))));
  } else {
    wrap.append(h('section', { class: 'card hero' }, h('h1', null, '🎉 Path complete'), h('p', null, 'You finished every module. Keep going with one Stanford Robotics Seminar a week (see Library).')));
  }
  wrap.append(h('section', { class: 'stats' },
    stat(`${sk.current}🔥`, 'day streak', `best ${sk.longest}`),
    stat(`${n}/${total}`, 'modules done', `${Math.round((n / total) * 100)}%`),
    stat(fmtMin(minsDone), 'studied', fmtMin(minsLeft) + ' left')));
  const behind = diff < 0 ? `${-diff} module${-diff === 1 ? '' : 's'} behind` : diff > 0 ? `${diff} ahead` : 'on schedule';
  wrap.append(h('section', { class: 'card' }, h('div', { class: 'spread' }, h('strong', null, 'Pace'), h('span', { class: 'muted' }, `one module a day since ${st.startDate} → ${behind}`)), bar((n / total) * 100),
    h('p', { class: 'muted small' }, 'Missed days never reset your place: “Today” always shows the first module you have not finished.')));
  // months
  const months = h('section', { class: 'card' }, h('h2', null, 'Six months'));
  for (const k of Object.keys(meta.months)) {
    const ms = modules.filter((m) => String(m.month) === k), d = ms.filter((m) => S.isDone(m.id)).length;
    months.append(h('a', { class: 'month', href: `#/modules?month=${k}` }, h('div', { class: 'spread' }, h('strong', null, `${meta.months[k].label}: ${meta.months[k].title}`), h('span', { class: 'muted' }, `${d}/${ms.length}`)),
      h('div', { class: 'muted small' }, meta.months[k].sub), bar((d / ms.length) * 100)));
  }
  wrap.append(months);
  const upcoming = modules.filter((m) => !S.isDone(m.id)).slice(1, 4);
  if (upcoming.length) wrap.append(h('section', { class: 'card' }, h('h2', null, 'Up next'), upcoming.map((m) => moduleRow(m))));
  return wrap;
}
const stat = (big, label, sub) => h('div', { class: 'stat' }, h('div', { class: 'big' }, big), h('div', null, label), h('div', { class: 'muted small' }, sub));

function Modules(params) {
  let month = params.get('month') || 'all', status = params.get('status') || 'all', q = '';
  const list = h('div', { class: 'list' });
  const draw = () => {
    list.replaceChildren();
    const f = modules.filter((m) => (month === 'all' || String(m.month) === month) &&
      (status === 'all' || (status === 'done') === S.isDone(m.id)) &&
      (!q || (m.title + ' ' + m.course).toLowerCase().includes(q)));
    if (!f.length) list.append(h('p', { class: 'muted' }, 'Nothing matches.'));
    let lastMonth = null;
    for (const m of f) {
      if (month === 'all' && m.month !== lastMonth) { lastMonth = m.month; list.append(h('h3', { class: 'grp' }, `${meta.months[m.month].label}: ${meta.months[m.month].title}`)); }
      list.append(moduleRow(m));
    }
  };
  const mk = (opts, cur, set) => h('div', { class: 'chips' }, opts.map(([v, l]) => h('button', { class: 'chip btnchip' + (cur() === v ? ' on' : ''), onclick: (e) => { set(v); e.target.parentElement.querySelectorAll('button').forEach((b) => b.classList.remove('on')); e.target.classList.add('on'); draw(); } }, l)));
  const wrap = h('div', { class: 'page' }, h('h1', null, 'Modules'), h('p', { class: 'muted' }, `${modules.length} modules · each ~30 minutes`),
    mk([['all', 'All'], ...Object.keys(meta.months).map((k) => [k, 'M' + k])], () => month, (v) => (month = v)),
    mk([['all', 'Any'], ['todo', 'To do'], ['done', 'Done']], () => status, (v) => (status = v)),
    h('input', { type: 'search', placeholder: 'Filter by title…', class: 'inp', 'aria-label': 'Filter modules', oninput: (e) => { q = e.target.value.toLowerCase(); draw(); } }), list);
  draw();
  return wrap;
}

function Module(id) {
  const m = byId[id]; if (!m) return h('div', { class: 'page' }, h('p', null, 'Module not found.'), link('#/modules', 'All modules'));
  const idx = modules.indexOf(m), prev = modules[idx - 1], next = modules[idx + 1];
  const wrap = h('div', { class: 'page' });
  wrap.append(h('div', { class: 'crumbs' }, link('#/modules', '← Modules'), h('span', { class: 'muted' }, ` Day ${m.day}/${modules.length}`)));
  wrap.append(h('h1', null, m.title),
    h('div', { class: 'chips' }, chip(`~${m.minutes} min`), chip(KIND[m.kind]), chip(meta.months[m.month].label), m.speaker ? chip(m.speaker) : null, S.isDone(m.id) ? chip('Completed ✓', 'ok') : null));
  if (m.topics.length) wrap.append(h('p', { class: 'muted' }, 'Topics: ' + m.topics.join(', ')));

  if (m.watch.length) {
    const sec = h('section', { class: 'card' }, h('h2', null, '▶ Watch'));
    for (const w of m.watch) {
      const slot = h('div', { class: 'embed' });
      sec.append(h('div', { class: 'watch' },
        h('div', null, h('strong', null, `${w.course}${w.lecture ? ' · Lecture ' + w.lecture : ''}`), h('div', { class: 'muted small' }, w.title),
          h('div', { class: 'small' }, w.partial ? `Watch ${fmtClock(w.start)} → ${fmtClock(w.end)} of ${fmtClock(w.lengthMin)} (split evenly by time, not by topic)` : `Full video · ${Math.round(w.lengthMin)} min`)),
        h('div', { class: 'btns' }, ext(w.url, 'Open on YouTube', 'btn primary'),
          h('button', { class: 'btn', onclick: () => { if (slot.firstChild) { slot.replaceChildren(); return; }
            if (!navigator.onLine) return toast('Offline: videos need a connection');
            const start = Math.floor(w.start * 60);
            slot.append(h('iframe', { src: `https://www.youtube-nocookie.com/embed/${w.id}?start=${start}&rel=0`, title: w.title, allow: 'accelerometer; encrypted-media; picture-in-picture', allowfullscreen: true, loading: 'lazy' })); } }, 'Play inline')),
        slot));
    }
    sec.append(h('p', { class: 'muted small' }, 'Tip from the article: watch at 1.25× — ~37 min of video fits a 30-minute slot. Pause to take notes below.'));
    wrap.append(sec);
  }
  if (m.steps) wrap.append(h('section', { class: 'card' }, h('h2', null, '🛠 What to do'), h('p', null, m.steps)));
  if (m.read.length) wrap.append(h('section', { class: 'card' }, h('h2', null, '📖 Read'), h('ul', null, m.read.map((r) => h('li', null, r))),
    h('p', { class: 'small' }, ext('https://web.stanford.edu/~boyd/vmls/', 'VMLS book'), ' · ', ext('https://porabook.com', 'Principles of Robot Autonomy'))));
  if (m.links.length) wrap.append(h('section', { class: 'card' }, h('h2', null, '🔗 Links'), h('ul', null, m.links.map((l) => h('li', null, ext(l.url, l.label))))));

  // self-check
  const qs = h('section', { class: 'card' }, h('h2', null, '🧠 Self-check'), h('p', { class: 'muted small' }, 'Answer in your head or on paper first, then reveal. Be honest — it feeds Quiz mode.'));
  m.questions.forEach((q, i) => {
    const qid = `${m.id}#${i}`;
    const ans = h('div', { class: 'ans', hidden: true }, q.a, h('div', { class: 'btns' },
      h('button', { class: 'btn ok', onclick: (e) => { S.recordAnswer(qid, true); e.target.parentElement.innerHTML = '✓ got it'; } }, 'Got it'),
      h('button', { class: 'btn bad', onclick: (e) => { S.recordAnswer(qid, false); e.target.parentElement.innerHTML = '↻ marked for review'; } }, 'Review')));
    qs.append(h('div', { class: 'q' }, h('p', null, h('strong', null, `${i + 1}. `), q.q), h('button', { class: 'btn small', onclick: (e) => { ans.hidden = !ans.hidden; e.target.textContent = ans.hidden ? 'Show answer' : 'Hide answer'; } }, 'Show answer'), ans));
  });
  wrap.append(qs);

  const exBox = h('input', { type: 'checkbox', id: 'ex', checked: !!S.get().exercise[m.id], onchange: (e) => S.setExercise(m.id, e.target.checked) });
  wrap.append(h('section', { class: 'card' }, h('h2', null, '✍️ Exercise'), h('p', null, m.exercise), h('label', { class: 'check' }, exBox, ' I did it')));
  wrap.append(h('section', { class: 'card recap' }, h('h2', null, '📝 Recap'), h('p', null, m.recap)));
  const ta = h('textarea', { class: 'notes', rows: 6, placeholder: 'Your notes for this module (saved on this device)…', 'aria-label': 'Notes' }, S.get().notes[m.id] || '');
  let tm; ta.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(() => S.setNote(m.id, ta.value.trim()), 400); });
  wrap.append(h('section', { class: 'card' }, h('h2', null, '🗒 Notes'), ta));
  const done = S.isDone(m.id);
  wrap.append(h('div', { class: 'actions' },
    prev ? link(`#/module/${prev.id}`, '‹ Prev', 'btn') : h('span'),
    h('button', { class: 'btn big ' + (done ? '' : 'primary'), onclick: () => { S.setDone(m.id, !done); if (!done) { toast('Module complete 🎉'); const n = nextModule(); if (n) { location.hash = `#/module/${n.id}`; return; } } render(); } }, done ? 'Mark as not done' : 'Mark complete'),
    next ? link(`#/module/${next.id}`, 'Next ›', 'btn') : h('span')));
  return wrap;
}

/* ----- Quiz mode ----- */
function Quiz() {
  const wrap = h('div', { class: 'page' }, h('h1', null, 'Quiz mode'));
  const st = S.get();
  const pool = (scope) => {
    let ms;
    if (scope === 'today') { const n = nextModule(); ms = n ? [n] : []; }
    else if (scope === 'done') ms = modules.filter((m) => S.isDone(m.id));
    else ms = modules;
    const out = [];
    ms.forEach((m) => m.questions.forEach((q, i) => out.push({ ...q, qid: `${m.id}#${i}`, mod: m })));
    return scope === 'missed' ? modules.flatMap((m) => m.questions.map((q, i) => ({ ...q, qid: `${m.id}#${i}`, mod: m }))).filter((x) => (st.qstats[x.qid] || {}).last === 'wrong') : out;
  };
  const area = h('div');
  const counts = { today: pool('today').length, done: pool('done').length, missed: pool('missed').length, all: pool('all').length };
  const start = (scope, size) => runQuiz(area, shuffle(pool(scope)).slice(0, size), scope);
  wrap.append(h('p', { class: 'muted' }, 'Flashcard-style: read the question, answer in your head, reveal, then grade yourself honestly. Missed cards come back via “Missed”.'));
  const menu = h('div', { class: 'card' });
  [['today', "Today's module", 'Questions from the module you are on'], ['done', 'Completed modules', 'Spaced review of what you have finished'], ['missed', 'Missed questions', 'Cards you marked “Review”'], ['all', 'Everything (random)', 'Any question from all modules']].forEach(([s, l, d]) => {
    menu.append(h('button', { class: 'menu', disabled: counts[s] === 0, onclick: () => { menu.hidden = true; start(s, 10); } }, h('strong', null, `${l} (${counts[s]})`), h('span', { class: 'muted small' }, d)));
  });
  wrap.append(menu, area);
  const hist = st.sessions.slice(-5).reverse();
  if (hist.length) wrap.append(h('section', { class: 'card' }, h('h2', null, 'Recent sessions'), hist.map((s) => h('div', { class: 'spread' }, h('span', null, `${new Date(s.t).toLocaleDateString()} · ${s.scope}`), h('strong', null, `${s.right}/${s.total}`)))));
  return wrap;
}
function runQuiz(area, cards, scope) {
  let i = 0, right = 0;
  const show = () => {
    area.replaceChildren();
    if (i >= cards.length) {
      S.addSession({ t: Date.now(), right, total: cards.length, scope });
      area.append(h('section', { class: 'card hero' }, h('h2', null, 'Session complete'), h('p', { class: 'big' }, `${right} / ${cards.length}`), h('div', { class: 'btns' }, h('button', { class: 'btn primary', onclick: () => render() }, 'Back to quiz menu'))));
      return;
    }
    const c = cards[i];
    const ans = h('div', { class: 'ans', hidden: true }, c.a);
    const grade = h('div', { class: 'btns', hidden: true },
      h('button', { class: 'btn ok', onclick: () => { right++; S.recordAnswer(c.qid, true); i++; show(); } }, 'Got it'),
      h('button', { class: 'btn bad', onclick: () => { S.recordAnswer(c.qid, false); i++; show(); } }, 'Missed'));
    area.append(h('section', { class: 'card' }, h('div', { class: 'spread muted small' }, h('span', null, `Card ${i + 1}/${cards.length}`), link(`#/module/${c.mod.id}`, 'module ↗')),
      bar((i / cards.length) * 100), h('p', { class: 'qbig' }, c.q), h('div', { class: 'muted small' }, c.mod.title),
      h('button', { class: 'btn primary', onclick: (e) => { ans.hidden = false; grade.hidden = false; e.target.hidden = true; } }, 'Reveal answer'), ans, grade));
  };
  show();
}

/* ----- Notes ----- */
function Notes() {
  const notes = Object.entries(S.get().notes).map(([id, t]) => [byId[id], t]).filter(([m]) => m).sort((a, b) => a[0].day - b[0].day);
  const wrap = h('div', { class: 'page' }, h('h1', null, 'Notes'), h('p', { class: 'muted' }, `${notes.length} module${notes.length === 1 ? '' : 's'} with notes. Notes are written inside each module and stay on this device.`));
  if (notes.length) wrap.append(h('div', { class: 'btns' }, h('button', { class: 'btn', onclick: () => download('robotics-notes.md', notes.map(([m, t]) => `## Day ${m.day}: ${m.title}\n\n${t}\n`).join('\n'), 'text/markdown') }, 'Export as Markdown')));
  notes.forEach(([m, t]) => wrap.append(h('section', { class: 'card' }, h('h3', null, link(`#/module/${m.id}`, `Day ${m.day}: ${m.title}`)), h('p', { class: 'pre' }, t))));
  if (!notes.length) wrap.append(h('p', null, 'Nothing yet — open a module and jot something down.'));
  return wrap;
}

/* ----- Search (BM25) ----- */
function Search(params) {
  const out = h('div'), inp = h('input', { type: 'search', class: 'inp', placeholder: 'e.g. “why does an IMU drift”, “Jacobian”, “DAgger”', value: params.get('q') || '', 'aria-label': 'Search the curriculum' });
  const run = () => {
    out.replaceChildren(); const q = inp.value.trim(); if (!q) return;
    const res = query(getIndex(), q, 12);
    if (!res.length) { out.append(h('p', { class: 'muted' }, 'No matches. Try other keywords.')); return; }
    res.forEach(({ d }) => { const m = byId[d.id];
      out.append(h('a', { class: 'card hit', href: `#/module/${m.id}` }, h('strong', null, `Day ${m.day} · ${m.title}`), h('div', { class: 'muted small' }, snippet(moduleText(m), q))));
    });
  };
  inp.addEventListener('input', () => { clearTimeout(inp._t); inp._t = setTimeout(run, 120); });
  const w = h('div', { class: 'page' }, h('h1', null, 'Search'), h('p', { class: 'muted' }, 'Offline keyword search (BM25) over every module’s questions, answers, recaps, exercises — and your own notes.'), inp, out,
    h('p', { class: 'muted small' }, 'Textbook full-text “ask the book” is not bundled (copyright/size); use the textbook links on each module.'));
  run(); return w;
}

/* ----- More / Library / Settings / About ----- */
function More() {
  const w = h('div', { class: 'page' }, h('h1', null, 'More'));
  [['#/notes', '🗒 Notes', 'All your module notes'], ['#/library', '🎞 Library', 'Every lecture in every playlist, incl. ones outside the path'], ['#/settings', '⚙️ Settings & backup', 'Theme, start date, export/import progress, install'], ['#/about', 'ℹ️ About', 'Source, scope and honest limitations']]
    .forEach(([href, t, d]) => w.append(h('a', { class: 'menu', href }, h('strong', null, t), h('span', { class: 'muted small' }, d))));
  return w;
}
function Library() {
  const w = h('div', { class: 'page' }, h('h1', null, 'Library'), h('p', { class: 'muted' }, 'Lecture lists were fetched from the official YouTube playlists (Oct 2026). ✔ = included in the daily path.'));
  library.courses.forEach((c) => {
    const inP = c.items.filter((i) => i.inPath).length;
    const d = h('details', { class: 'card' }, h('summary', null, h('strong', null, `${c.name} — ${c.full}`), h('span', { class: 'muted small' }, ` ${c.items.length} videos · ${inP} in path`)),
      h('div', { class: 'small' }, c.who, ' · ', ext(c.playlist, 'playlist'), c.page ? [' · ', ext(c.page, 'course page')] : ''),
      h('ol', { class: 'lib' }, c.items.map((i) => h('li', null, h('span', { class: i.inPath ? 'in' : 'out' }, i.inPath ? '✔' : '·'), ' ', ext(`https://www.youtube.com/watch?v=${i.id}`, i.title), h('span', { class: 'muted small' }, ` ${i.min} min`)))));
    w.append(d);
  });
  w.append(h('section', { class: 'card' }, h('h2', null, 'Textbooks & tools'), h('ul', null,
    ...[['VMLS — Vectors, Matrices, and Least Squares', 'https://web.stanford.edu/~boyd/vmls/'], ['Principles of Robot Autonomy (porabook.com)', 'https://porabook.com'], ['AA203 course page', 'https://stanfordasl.github.io/aa203/sp2526/'], ['CS224R course page', 'https://cs224r.stanford.edu/'], ['CS223A on SEE', 'https://see.stanford.edu/Course/CS223A'], ['Stanford Robotics Seminar archive', 'https://stanfordasl.github.io/robotics_seminar/'],
      ['MuJoCo', 'https://mujoco.readthedocs.io/'], ['MuJoCo Menagerie: SO-ARM100', 'https://github.com/google-deepmind/mujoco_menagerie/tree/main/trs_so_arm100'], ['Gymnasium', 'https://gymnasium.farama.org/'], ['Stable-Baselines3', 'https://stable-baselines3.readthedocs.io/'], ['LeRobot', 'https://huggingface.co/docs/lerobot/index'], ['SO-ARM100 / SO-101', 'https://github.com/TheRobotStudio/SO-ARM100']]
      .map(([t, u]) => h('li', null, ext(u, t))))));
  return w;
}
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; const b = document.getElementById('installBtn'); if (b) b.hidden = false; });
function Settings() {
  const st = S.get();
  const file = h('input', { type: 'file', accept: 'application/json', hidden: true, onchange: async (e) => { try { S.importJSON(await e.target.files[0].text()); toast('Progress imported'); render(); } catch (err) { toast('Import failed: ' + err.message); } } });
  return h('div', { class: 'page' }, h('h1', null, 'Settings & backup'),
    h('section', { class: 'card' }, h('h2', null, 'Appearance'), h('div', { class: 'chips' }, [['auto', 'System'], ['light', 'Light'], ['dark', 'Dark']].map(([v, l]) => h('button', { class: 'chip btnchip' + (st.theme === v ? ' on' : ''), onclick: () => { S.setTheme(v); render(); } }, l)))),
    h('section', { class: 'card' }, h('h2', null, 'Start date'), h('p', { class: 'muted small' }, 'Used only for the pace indicator on the home screen.'), h('input', { type: 'date', class: 'inp', value: st.startDate, onchange: (e) => { if (e.target.value) S.setStartDate(e.target.value); toast('Start date saved'); } })),
    h('section', { class: 'card' }, h('h2', null, 'Install'), h('p', { class: 'muted small' }, 'Install to your home screen / desktop. After the first load the app works offline (videos still need internet).'),
      h('button', { class: 'btn primary', id: 'installBtn', hidden: !deferredInstall, onclick: async () => { if (!deferredInstall) return; deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; } }, 'Install app'),
      h('p', { class: 'muted small' }, 'No install button? iPhone: Share → Add to Home Screen. Desktop Chrome/Edge: install icon in the address bar.')),
    h('section', { class: 'card' }, h('h2', null, 'Backup'), h('p', { class: 'muted small' }, 'Progress, notes and quiz stats live only in this browser. Export a backup to move devices.'),
      h('div', { class: 'btns' }, h('button', { class: 'btn', onclick: () => download(`robotics-progress-${S.todayStr()}.json`, S.exportJSON()) }, 'Export progress'), h('button', { class: 'btn', onclick: () => file.click() }, 'Import progress'), file)),
    h('section', { class: 'card' }, h('h2', null, 'Danger zone'), h('button', { class: 'btn bad', onclick: () => { if (confirm('Erase all progress, notes and quiz stats on this device?')) { S.resetAll(); toast('Reset'); render(); } } }, 'Reset all progress')));
}
function About() {
  return h('div', { class: 'page' }, h('h1', null, 'About'),
    h('section', { class: 'card' }, h('p', null, `Built from the X Article “Stanford's Robotics Degree, for Free: the 6-month path to Robot Learning Engineer” by @0x_meden (Sep 2026). ${meta.modules} modules (~30 min each) cover ${meta.pathLectures} lectures / ~${Math.round(meta.videoHours)} h of video, plus textbook reading and the article's six practice projects.`),
      h('p', null, 'Honest notes:'), h('ul', null,
        h('li', null, 'Lecture titles, durations and links come from the official YouTube playlists. Long lectures are split into time-based parts — the time ranges are NOT topic timestamps.'),
        h('li', null, 'Quiz questions, exercises and recaps were written for this app from the lecture titles, course schedules, SEE topic lists and the article; answers are study aids — check them against the lecture and textbook.'),
        h('li', null, 'Reflection cards are generic prompts and have no fixed answer.'),
        h('li', null, 'Everything is stored locally; nothing is uploaded. Free Stanford materials are linked, not copied.')),
      h('p', null, 'Source article: ', ext('https://x.com/0x_meden/status/2103423701349781606', 'x.com/0x_meden'))));
}

/* ---------- router ---------- */
function render() {
  const [pathPart, qs] = (location.hash || '#/').split('?');
  const params = new URLSearchParams(qs || '');
  const route = pathPart || '#/';
  let view;
  if (route.startsWith('#/module/')) view = Module(route.slice(9));
  else if (route === '#/modules') view = Modules(params);
  else if (route === '#/quiz') view = Quiz();
  else if (route === '#/search') view = Search(params);
  else if (route === '#/more') view = More();
  else if (route === '#/notes') view = Notes();
  else if (route === '#/library') view = Library();
  else if (route === '#/settings') view = Settings();
  else if (route === '#/about') view = About();
  else view = Home();
  app.replaceChildren(shell(route.startsWith('#/module/') ? '#/modules' : route, view));
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);
render();
