# Robot Learning Path — daily 30-minute modules (PWA)

An installable, offline-capable web app that turns the free Stanford robotics curriculum from the X Article
**"Stanford's Robotics Degree, for Free: the 6-month path to Robot Learning Engineer"** (@0x_meden, Sep 2026)
into **189 daily ~30-minute modules** (≈ 6.2 months at one module a day).

Static site (Vite + vanilla JS). No backend, no accounts. Progress, streak, notes and quiz stats live in `localStorage`.

## Features
- **Today** screen: the first unfinished module, streak, progress, pace vs. start date, month overview
- **Module** page: what to watch (YouTube link with start offset, optional inline player), what to read, 3–5 self-check questions (reveal + self-grade), one exercise, recap, notes
- **Modules** list with month / done / text filters
- **Quiz mode**: flashcards from today's module, completed modules, missed questions, or everything; session history
- **Notes** page (export to Markdown), **Search** (offline BM25 over all module text + your notes), **Library** (every lecture in every playlist incl. ones outside the path)
- Dark mode (system / light / dark), mobile-first layout, installable (manifest + service worker), works offline after first load
- Backup/restore progress as JSON (Settings)

## Run
```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # -> dist/  (static files + service worker)
npm run preview      # serves dist/ on http://localhost:4173
```

## Deploy (nothing is deployed for you)
`vite.config.js` uses `base: './'`, so the same `dist/` works at a domain root or under a sub-path.
- **GitHub Pages**: push to a repo on `main`, set *Settings → Pages → Source: GitHub Actions*. Workflow: `.github/workflows/deploy.yml`.
- **Netlify**: import the repo (uses `netlify.toml`) or drag the contents of `dist/` / `robotics-learning-app.zip` onto app.netlify.com/drop.
- **Vercel**: import the repo (uses `vercel.json`), or `npx vercel --prod` from the folder.
- Any static host: upload `dist/`. Service workers need HTTPS (localhost is exempt).

## How the curriculum was built
`python3 scripts/build_curriculum.py` regenerates `src/data/curriculum.json` and `src/data/library.json` from:
- `data-src/*.txt` — the **real playlist listings** (index | video id | seconds | title) fetched on 2026-10-03 with
  `yt-dlp --flat-playlist` from the seven playlists in the article.
- `content/*.md` — hand-written questions/answers, exercises, recaps and reading pointers, keyed by lecture number.

Path (follows the article): Month 1 ENGR108 (51 of 54 lectures; skips 13, 14, 47 as the article suggests) · Month 2 CS223A (16) ·
Month 3 CS231N (10: 1–6, 8, 9, 15, 17) + EE259 (5: 5, 6, 7, 15, 19) · Month 4 AA203 L1–12 · Month 5 AA203 L13–19 + CS224R (L2, 3, 4, 6, 7, 11, 16) ·
Month 6 CS231N L17 again, CS224R L17 & L18, 5 seminars + the Finn/Ng conversation, and the final project.

**Month 7 (bonus, added 2026-10-21):** MIT 6.4210 Robotic Manipulation (Russ Tedrake, Fall 2023, 23 lectures; book https://manipulation.csail.mit.edu, code https://github.com/RussTedrake/manipulation), shared by @0x_meden, plus a career-map sidebar from his article on 412 humanoid robot job posts. Appended after Month 6 so existing module ids (and saved progress) do not change.

**Month 8 (bonus, added 2026-10-21, m239-m283):** MIT 6.8210 Underactuated Robotics (Russ Tedrake, Spring 2024; 21 recorded lectures, L2/L3/L13 were not posted; book https://underactuated.mit.edu, code https://github.com/RobotLocomotion/drake), shared by @0x_meden (https://x.com/0x_meden/status/2112875067273068637), plus a swing-up/stabilize/verify project.

**Month 9 (bonus, added 2026-10-21, m284-m319):** ETH Zurich Robot Learning: From Fundamentals to Foundation Models (Oier Mees, Spring 2026; 11 lectures + 10 guest talks; https://cvg.ethz.ch/lectures/Robot-Learning/, homeworks https://github.com/mees-robot-learning-course/ethz-course-2026), shared by @rahim_mirani (https://x.com/rahim_mirani/status/2112282923395379537), plus a homework + paper-replication project.
**Maths refresher (added 2026-10-22, no new modules, ids unchanged):** optional *Mathematics for Machine Learning* (Deisenroth, Faisal, Ong; free PDF https://mml-book.github.io/), shared by @mentalium_ (https://x.com/mentalium_/status/2112909734936199213). An `mml:` line in `content/*.md` adds an extra "read" item to 23 modules where the maths is used: ENGR108 norms/projections/least squares/classifiers, CS231N L2-4 (risk minimization, gradient descent, backprop), EE259 L7 (Gaussian conditioning for filtering), AA203 L2 and L13 (constrained/convex optimization, regression for system ID), CS224R L2 (behaviour cloning as MLE), MIT 6.4210 L6-7 (SVD/PCA in point-cloud registration), plus the Month 1 milestone links. The book is personal-use only, so it is linked, not bundled; a local searchable index lives at `/workspace/mml-rag` on the Grok Bot box.
= 116 distinct lectures/talks in the path (+3 optional ENGR108 lectures = the article's 119), ≈ 95 h of video, 24 project modules (the article's six practice projects broken into sessions) and 6 monthly milestone checks.

### Honest notes / known gaps
- **Timestamps:** no topic timestamps were available. Long lectures are split into 2 equal *time* ranges (e.g. 0:00–29:06); these are not topic boundaries. At 1.25× (the article's tip) a ~37-minute chunk fits a 30-minute slot.
- **CS223A topic lists** come from the SEE course page (https://see.stanford.edu/Course/CS223A); the YouTube playlist titles are only "Lecture N | Introduction to Robotics", so lecture N is assumed to match SEE lecture N (16 lectures both places).
- **AA203** playlist (59 items) also contains unrelated seminars; only the 19 AA203 lectures (+ seminars listed in the article) are used. One playlist item is hidden/unavailable and 1 returned no metadata.
- **EE259** playlist has an extra "Lecture 12 (Extra Session)", so playlist index ≠ lecture number after 12; lectures are matched by the number in the title.
- **Questions/answers/exercises are original study aids** written from lecture titles, course schedules, SEE topic lists, VMLS/PoRA tables of contents and the article. They were not generated by watching the lectures; check answers against the lecture and textbook. Seminar and guest-lecture questions (and CS224R L17/L18) are especially thin. Where a module has fewer than 3 lecture-specific questions, generic "reflection" cards (no fixed answer) pad it.
- **Textbook references:** VMLS section numbers were verified against the book's PDF contents; for *Principles of Robot Autonomy* (https://porabook.com) the app points to chapters (the 19 chapter titles were read from the site) rather than section numbers.
- **"Ask the textbook" RAG** (stretch goal) was **skipped**: bundling VMLS/PoRA text would redistribute copyrighted books (VMLS is hosted by permission of Cambridge UP) and bloat the offline cache, and PoRA already ships its own "Ask the Book". Instead the app has an offline BM25 search across its own content and your notes.
- Video playback (YouTube) needs internet; everything else works offline after the first load.
- Streak = consecutive local calendar days with at least one completed module.

## Layout
```
content/        hand-written lecture content (markdown-ish)
data-src/       fetched playlist listings
scripts/        curriculum builder
src/            app (main.js, store.js, search.js, ui.js, style.css, data/*.json)
public/         icons, favicon
```
