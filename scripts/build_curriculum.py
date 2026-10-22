#!/usr/bin/env python3
"""Builds src/data/curriculum.json and src/data/library.json from:
  data-src/*.txt  (real playlist listings fetched with yt-dlp --flat-playlist)
  content/*.md    (hand-authored questions/exercises/recaps keyed by lecture number)
Run: python3 scripts/build_curriculum.py
"""
import re, json, math, sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEG = 38.0     # target video minutes per module (~30 min at 1.25x incl. pauses)
PACK = 46.0    # max minutes when grouping short lectures

PLAYLISTS = {
 'engr108': dict(name='ENGR108', full='Introduction to Applied Linear Algebra', who='Stephen Boyd',
    pl='PLoROMvodv4rMz-WbFQtNUsUElIh2cPmN9', page='https://web.stanford.edu/~boyd/vmls/'),
 'cs223a': dict(name='CS223A', full='Introduction to Robotics', who='Oussama Khatib',
    pl='PL65CC0384A1798ADF', page='https://see.stanford.edu/Course/CS223A'),
 'cs231n': dict(name='CS231N', full='Deep Learning for Computer Vision (Spring 2025)', who='Fei-Fei Li, Ehsan Adeli, Zane Durante',
    pl='PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16', page='https://cs231n.stanford.edu/'),
 'ee259': dict(name='EE259', full='Principles of Sensing for Autonomy (2023)', who='Stanford EE',
    pl='PLoROMvodv4rOhE007XQu707Dy52qXiZGV', page=None),
 'aa203': dict(name='AA203', full='Optimal and Learning-Based Control (Spring 2026)', who='Marco Pavone, Daniele Gammelli',
    pl='PLoROMvodv4rNsMOMF1LG3ohsTqZVJVeVp', page='https://stanfordasl.github.io/aa203/sp2526/'),
 'cs224r': dict(name='CS224R', full='Deep Reinforcement Learning (Spring 2025)', who='Chelsea Finn',
    pl='PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL', page='https://cs224r.stanford.edu/'),
 'mit64210': dict(name='MIT 6.4210', full='Robotic Manipulation: Perception, Planning, and Control (Fall 2023)', who='Russ Tedrake (MIT)',
    pl=None, url='https://www.youtube.com/watch?v=v04rn86Dehg', page='https://manipulation.csail.mit.edu'),
 'underactuated': dict(name='MIT 6.8210', full='Underactuated Robotics (Spring 2024)', who='Russ Tedrake (MIT)',
    pl=None, url='https://www.youtube.com/watch?v=uyyBT-MHhLE', page='https://underactuated.mit.edu'),
 'ethrl': dict(name='ETH Robot Learning', full='Robot Learning: From Fundamentals to Foundation Models (Spring 2026)', who='Oier Mees (ETH Zurich)',
    pl=None, url='https://www.youtube.com/watch?v=X0k14u6pSxw', page='https://cvg.ethz.ch/lectures/Robot-Learning/'),
 'ethguest': dict(name='ETH guest', full='ETH Robot Learning 2026: guest lectures', who='Various (see each talk)',
    pl=None, url='https://www.youtube.com/watch?v=aG8NPTPhwkE', page='https://cvg.ethz.ch/lectures/Robot-Learning/'),
 'aa174a': dict(name='AA174A', full='Principles of Robot Autonomy I (companion lectures to the PoRA textbook)', who='Stanford ASL (Pavone et al.)',
    pl=None, url='https://porabook.com/lectures/', page='https://porabook.com/'),
 'cs234': dict(name='CS234', full='Reinforcement Learning (optional deeper theory)', who='Emma Brunskill',
    pl='PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX', page='https://web.stanford.edu/class/cs234/'),
}
# remove 'who' guesses I could not verify from the fetched pages
PLAYLISTS['cs231n']['who'] = 'Stanford CS231N staff'
PLAYLISTS['ee259']['who'] = 'Stanford EE259 (2023)'

def read_pl(key):
    rows = []
    for line in open(f'{ROOT}/data-src/{key}.txt', encoding='utf8'):
        line = line.rstrip('\n')
        if not line: continue
        idx, vid, dur, title = line.split('|', 3)
        if dur == 'NA' or title == 'NA': continue
        rows.append(dict(idx=int(idx), id=vid, sec=int(float(dur)), title=title))
    return rows

def lec_no(title):
    m = re.search(r'(?:Lecture|Lec\.?)\s*(\d+)', title)
    return int(m.group(1)) if m else None

def clean_title(key, title):
    if key == 'ee259':
        parts = [p.strip() for p in title.split(' I ')]
        t = parts[1] if len(parts) > 2 else parts[0]
        t = re.sub(r'^Stanford EE259 Principles of Sensing for Autonomy$', '', t)
        return t if t else parts[0]
    t = title.split('|')[-1].strip()
    t = re.sub(r'^(Lecture\s*\d+\s*[:\-]?\s*)', '', t)
    t = re.sub(r'^\d+\s*[-–]\s*', '', t)
    return t.strip()

def parse_md(path):
    out = {}
    cur = None
    for line in open(path, encoding='utf8'):
        line = line.rstrip('\n')
        if line.startswith('## '):
            cur = line[3:].strip(); out[cur] = dict(q=[], links=[])
        elif cur and line.strip():
            k, _, v = line.partition(':')
            k = k.strip(); v = v.strip()
            if k == 'Q':
                q, _, a = v.partition('=>')
                out[cur]['q'].append(dict(q=q.strip(), a=a.strip()))
            elif k == 'links':
                p = v.split('|'); out[cur]['links'] = [dict(label=p[i], url=p[i+1]) for i in range(0, len(p)-1, 2)]
            else:
                out[cur][k] = v
    return out

GENERIC_Q = [
  dict(q='Reflection: state the main idea of this segment in 2-3 sentences. What would you ask the instructor?',
       a='Personal check. If you cannot summarise it, rewatch the last 5 minutes of the segment and re-read the textbook section.'),
  dict(q='Reflection: which equation, diagram or example from this segment belongs on your cheat sheet?',
       a='Personal check - pick one and write it in your notes for this module.'),
  dict(q='Reflection: how does this segment connect to something you learned earlier in the path?',
       a='Personal check - link it to an earlier module (e.g. least squares -> estimation, Jacobian -> control, DP -> RL).'),
]

def fmt_t(sec):
    sec = int(sec); h, r = divmod(sec, 3600); m, s = divmod(r, 60)
    return f'{h}:{m:02d}:{s:02d}' if h else f'{m}:{s:02d}'

def split_qs(qs, n, i):
    """distribute lecture questions over n segments; pad to >=3 with reflection questions"""
    k = len(qs)
    if n == 1:
        sel = qs[:5]
    else:
        per = math.ceil(k / n)
        sel = qs[i*per:(i+1)*per]
    j = 0
    while len(sel) < 3:
        sel = sel + [GENERIC_Q[(i + j) % len(GENERIC_Q)]]; j += 1
    return sel[:5]

def lecture_items(key, rows, lectures, content, seminar_note=False):
    """returns list of lecture dicts for the lecture numbers in `lectures`"""
    bynum = {}
    for r in rows:
        n = lec_no(r['title'])
        if key == 'engr108' or n is not None:
            if n is not None and n not in bynum: bynum[n] = r
    res = []
    for n in lectures:
        r = bynum.get(n)
        if not r:
            print('MISSING lecture', key, n, file=sys.stderr); continue
        res.append(dict(key=key, n=n, row=r, c=content.get(str(n)) or {}))
    return res

def make_watch(key, lec, t0, t1, part=None, parts=None):
    r = lec['row']
    return dict(course=PLAYLISTS[key]['name'], lecture=lec['n'], title=r['title'], id=r['id'],
                url=f"https://www.youtube.com/watch?v={r['id']}" + (f"&t={int(t0*60)}s" if t0 > 0 else ''),
                start=round(t0, 1), end=round(t1, 1), lengthMin=round(r['sec']/60, 1),
                partial=(parts or 1) > 1)

def short(key, lec):
    c = lec['c']
    nm = PLAYLISTS[key]['name']
    t = c.get('title') or c.get('topics') or clean_title(key, lec['row']['title'])
    if key == 'cs223a': t = ', '.join([x.strip() for x in c['topics'].replace(';', ',').split(',') if not x.strip().lower().startswith('guest lecturer')][:2]); t = t[:1].upper() + t[1:]
    if key == 'ee259' or key == 'engr108': t = clean_title(key, lec['row']['title'])
    return f"{nm} L{lec['n']}: {t}"

def modules_for_lecture(key, lec, month, seminar_note=False):
    """a single lecture -> n modules"""
    D = lec['row']['sec'] / 60.0
    n = 1 if D <= 46 else max(2, round(D / SEG))
    c = lec['c']
    topics = [t.strip() for t in (c.get('topics') or '').replace(';', ',').split(',') if t.strip() and not t.strip().lower().startswith('guest lecturer')]
    mods = []
    for i in range(n):
        t0, t1 = D * i / n, D * (i + 1) / n
        qs = split_qs(c.get('q', []), n, i)
        last = i == n - 1
        if n == 1:
            ex, rc = c.get('X', ''), c.get('R', '')
        elif not last:
            ex = 'Recall drill: close the video and write from memory the 3 most important ideas of this part, then check them against your notes. (Lecture exercise is in part %d.)' % n
            half = topics[:max(1, math.ceil(len(topics)/n))] if topics else []
            rc = f"Checkpoint after part {i+1}/{n}." + (f" Topics so far: {', '.join(half)}." if half else '') + ' Finish the lecture in the next module.'
        else:
            ex, rc = c.get('X', ''), c.get('R', '')
        title = short(key, lec) + (f' (part {i+1}/{n})' if n > 1 else '')
        mods.append(dict(kind='lecture', month=month, title=title, course=PLAYLISTS[key]['name'],
                         watch=[make_watch(key, lec, t0, t1, i+1, n)], read=([c.get('read', '')] if c.get('read') else []) + ([c['mml']] if c.get('mml') else []),
                         topics=topics, questions=qs, exercise=ex, recap=rc,
                         speaker=c.get('speaker'), seminar=seminar_note, links=[], videoMin=round(t1-t0, 1)))
    return mods

def modules_for_engr108(lecs, month):
    mods, cur, curmin = [], [], 0.0
    groups = []
    for lec in lecs:
        D = lec['row']['sec'] / 60.0
        if D > 52:   # long: its own, split
            if cur: groups.append(cur); cur = []; curmin = 0
            groups.append([lec]); continue
        if cur and curmin + D > PACK:
            groups.append(cur); cur = []; curmin = 0
        cur.append(lec); curmin += D
    if cur: groups.append(cur)
    for g in groups:
        if len(g) == 1 and g[0]['row']['sec']/60 > 52:
            mods += modules_for_lecture('engr108', g[0], month); continue
        watch, qs_all, reads, recs, exs = [], [], [], [], []
        for lec in g:
            D = lec['row']['sec']/60
            watch.append(make_watch('engr108', lec, 0, D))
            qs_all.append(lec['c'].get('q', []))
            if lec['c'].get('read'): reads.append(lec['c']['read'])
            if lec['c'].get('mml'): reads.append(lec['c']['mml'])
            if lec['c'].get('R'): recs.append(lec['c']['R'])
            if lec['c'].get('X'): exs.append(lec['c']['X'])
        # interleave questions
        qs = []
        for r in range(4):
            for ql in qs_all:
                if r < len(ql): qs.append(ql[r])
        qs = qs[:5]
        j = 0
        while len(qs) < 3: qs.append(GENERIC_Q[j % 3]); j += 1
        nums = [l['n'] for l in g]
        rng = f"L{nums[0]}" if len(nums) == 1 else f"L{nums[0]}-{nums[-1]}" if nums == list(range(nums[0], nums[-1]+1)) else 'L' + ', '.join(map(str, nums))
        titles = [clean_title('engr108', l['row']['title']) for l in g]
        title = f"ENGR108 {rng}: " + ' / '.join(titles) if len(g) <= 2 else f"ENGR108 {rng}: {titles[0]} … {titles[-1]}"
        mods.append(dict(kind='lecture', month=month, title=title, course='ENGR108', watch=watch, read=reads,
                         topics=[], questions=qs, exercise=exs[-1] if exs else '', recap=' '.join(recs[:3]),
                         speaker=None, seminar=False, links=[], videoMin=round(sum(w['lengthMin'] for w in watch), 1)))
    return mods

def project_module(pid, c, month, kind):
    return dict(kind=kind, month=month, title=c['title'], course='Project' if kind == 'project' else 'Milestone',
                watch=[], read=[], topics=[], steps=c.get('steps', ''), questions=c['q'][:5], exercise=c.get('X', ''),
                recap=c.get('R', ''), speaker=None, seminar=False, links=c.get('links', []), videoMin=0)

# ---- PoRA (Principles of Robot Autonomy, Stanford 2026): AA174A lectures + Colab labs attached as links to the matching module.
# Links only, so module ids/progress stay stable. Attached to the last part of the given (course, lecture).
PORA_NB = 'https://colab.research.google.com/github/StanfordASL/pora-exercises/blob/main/'
def _nb(path, label): return dict(label=f'PoRA lab (Colab): {label}', url=PORA_NB + path + '.ipynb')
def _v(n, vid, t): return dict(label=f'PoRA lecture, AA174A L{n}: {t}', url=f'https://www.youtube.com/watch?v={vid}')
PORA_LINKS = {
 ('CS223A', 12): [_v(1, 'Lgt5ONBtFI0', 'Course overview and mobile robot kinematics'), _nb('ch01/exercises/double_integrator_dynamics', 'Ch.1 Double integrator dynamics'),
                  _nb('ch01/exercises/nonholonomic_wheeled_robot_dynamics', 'Ch.1 Nonholonomic wheeled robot'), _nb('ch01/exercises/simulation', 'Ch.1 Simulation'), _nb('ch01/numerical_integration', 'Ch.1 Numerical integration')],
 ('CS223A', 9): [_v(9, 'idD08N4rgJU', 'Stereo vision')],
 ('CS223A', 10): [_v(2, 'Kv5G2OlrIbU', 'Trajectory optimization'), _v(4, 'Izu4_AUiHyk', 'Advanced trajectory optimization'), _nb('ch02/differentially_flat_planar_quadrotor', 'Ch.2 Differentially flat planar quadrotor'),
                  _v(5, 'hFCIZjVkSaw', 'Motion planning: graph search'), _v(6, 'AN4jXyWwV7Q', 'Motion planning: sampling-based'),
                  _nb('ch04/exercises/a_star', 'Ch.4 A*'), _nb('ch04/exercises/rrt', 'Ch.4 RRT'), _nb('ch04/prm_star', 'Ch.4 PRM*')],
 ('CS223A', 14): [_v(3, 'nluc4rMiipA', 'Trajectory tracking'), _nb('ch03/exercises/pid_control', 'Ch.3 PID control'), _nb('ch03/exercises/unicycle_trajectory_tracking', 'Ch.3 Unicycle trajectory tracking')],
 ('CS231N', 2): [_v(10, '8A3NmdQJRNc', 'Image processing'), _v(11, 'GsIRJJ5sYoU', 'Classic visual recognition'), _nb('ch08/exercises/correlation_filter', 'Ch.8 Correlation filter')],
 ('CS231N', 5): [_nb('ch09/exercises/cnn', 'Ch.9 CNN')],
 ('CS231N', 9): [_nb('ch10/exercises/object_detection', 'Ch.10 Object detection')],
 ('CS231N', 15): [_nb('ch06/sift_feature_matching', 'Ch.6 SIFT feature matching'), _nb('ch08/exercises/icp', 'Ch.8 ICP')],
 ('EE259', 19): [_v(7, 'emb_KF3OSu0', 'Sensors and intro to computer vision'), _v(8, 'QyG0PTgLBxQ', 'Camera models & calibration'),
                 _nb('ch06/exercises/camera_intrinsics', 'Ch.6 Camera intrinsics'), _nb('ch06/exercises/camera_extrinsics', 'Ch.6 Camera extrinsics')],
 ('EE259', 5): [_nb('ch11/discrete_bayes', 'Ch.11 Discrete Bayes filter'), _nb('ch12/exercises/kalman_filter', 'Ch.12 Kalman filter')],
 ('EE259', 6): [_nb('ch12/ekf_ukf_range_bearing', 'Ch.12 EKF/UKF range-bearing'), _nb('ch15/exercises/kalman_sensor_fusion', 'Ch.15 Kalman sensor fusion')],
 ('EE259', 7): [_v(12, 'dG3-D-vDwe8', 'Localization & filters'), _v(13, 'pSBhRF6j-Zc', 'Parametric filtering'), _v(14, '9y_lJdQmKcY', 'EKF localization'),
                _nb('ch13/exercises/ekf_localization', 'Ch.13 EKF localization'), _nb('ch13/exercises/particle_filter_localization', 'Ch.13 Particle filter localization'),
                _nb('ch14/exercises/ekf_slam', 'Ch.14 EKF SLAM'), _nb('ch14/range_bearing_ekf_slam', 'Ch.14 Range-bearing EKF SLAM'), _nb('ch14/pose_graph_slam', 'Ch.14 Pose-graph SLAM')],
 ('AA203', 5): [_nb('ch02/tpbvp', 'Ch.2 Two-point boundary value problem'), _nb('ch02/free_final_time_optimal_control', 'Ch.2 Free final time optimal control'), _nb('ch02/zermelos_problem', "Ch.2 Zermelo's problem")],
 ('AA203', 6): [_nb('ch02/exercises/unicycle_optimal_control', 'Ch.2 Unicycle optimal control')],
 ('AA203', 7): [_nb('ch03/lqr', 'Ch.3 LQR'), _nb('ch03/exercises/cartpole_lqr_control', 'Ch.3 Cart-pole LQR'), _nb('ch03/jax_linearization', 'Ch.3 JAX linearization')],
 ('AA203', 8): [_nb('ch03/exercises/cartpole_iterative_lqr', 'Ch.3 Cart-pole iterative LQR')],
 ('AA203', 9): [_nb('ch17/exercises/markovian_drone', 'Ch.17 Markovian drone (DP)'), _nb('ch18/policy_iteration', 'Ch.18 Policy iteration')],
 ('AA203', 11): [_nb('ch03/exercises/linear_mpc', 'Ch.3 Linear MPC')],
 ('AA203', 16): [_nb('ch18/exercises/widget_sales', 'Ch.18 Widget sales (RL)'), _nb('ch18/exercises/cartpole_balance', 'Ch.18 Cart-pole balance (RL)')],
 ('CS224R', 4): [_nb('ch18/exercises/advantage_actor_critic', 'Ch.18 Advantage actor-critic')],
}
def attach_pora(M):
    last = {}
    for m in M:
        for w in m['watch']: last[(w['course'], w['lecture'])] = m
    for k, links in PORA_LINKS.items():
        assert k in last, ('PoRA target missing', k)
        last[k]['links'] = last[k]['links'] + links
    n = sum(len(v) for v in PORA_LINKS.values()); print('PoRA links attached:', n, 'to', len(PORA_LINKS), 'modules')

def main():
    rows = {k: read_pl(k) for k in PLAYLISTS}
    C = {k: parse_md(f'{ROOT}/content/{k}.md') for k in ['engr108', 'cs223a', 'cs231n', 'ee259', 'aa203', 'cs224r', 'mit64210', 'underactuated', 'ethrl', 'ethguest']}
    SEM = parse_md(f'{ROOT}/content/seminars.md')
    PROJ = parse_md(f'{ROOT}/content/projects.md')

    def L(key, nums): return lecture_items(key, rows[key], nums, C[key])
    def pm(pid):
        c = PROJ[pid]; return project_module(pid, c, int(c['month']), 'milestone' if pid.startswith('M') else 'project')

    # ---- seminars (identified by video id) ----
    sem_rows = {r['id']: r for r in rows['aa203']}
    for r in rows['cs224r']: sem_rows[r['id']] = r
    for r in rows['cs231n']: sem_rows[r['id']] = r
    def seminar_mod(vid, title, extra_note=True):
        r = sem_rows[vid]; c = SEM[vid]
        D = r['sec']/60; n = 1 if D <= 46 else max(2, round(D/SEG)); mods = []
        for i in range(n):
            t0, t1 = D*i/n, D*(i+1)/n
            qs = split_qs(c['q'], n, i)
            last = i == n-1
            mods.append(dict(kind='lecture', month=6, title=title + (f' (part {i+1}/{n})' if n > 1 else ''), course='Seminar',
                watch=[dict(course='Stanford Robotics Seminar' if 'Seminar' in r['title'] else 'Stanford', lecture=None, title=r['title'], id=vid,
                    url=f"https://www.youtube.com/watch?v={vid}" + (f"&t={int(t0*60)}s" if t0 > 0 else ''), start=round(t0,1), end=round(t1,1),
                    lengthMin=round(D,1), partial=n > 1)],
                read=[c.get('read','')], topics=[c.get('topics','')], questions=qs,
                exercise=c['X'] if (last) else 'Recall drill: note 3 claims the speaker made so far and one you doubt.',
                recap=c['R'] if last else f'Checkpoint {i+1}/{n}. Continue in the next module.', speaker=c.get('speaker'), seminar=True, links=[], videoMin=round(t1-t0,1)))
        return mods

    M = []   # list of module dicts in order
    # ---- Month 1 ----
    e_lecs = [l for l in L('engr108', [n for n in range(1, 55) if n not in (13, 14, 47) and str(n) in C['engr108']])]
    # project placement: after the module that contains given lecture number
    placement1 = {26: 'P1.3', 29: 'P1.2', 35: 'P1.1'}
    e_mods = modules_for_engr108(e_lecs, 1)
    for m in e_mods:
        M.append(m)
        nums = [w['lecture'] for w in m['watch']]
        last_part = (not m['watch'][0]['partial']) or m['title'].endswith(tuple(f'{k}/{k})' for k in range(1, 5)))
        for ln, pid in list(placement1.items()):
            if ln in nums and last_part: M.append(pm(pid)); placement1.pop(ln)
    M.append(pm('M1'))
    # ---- Month 2 ----
    place2 = {3: 'P2.1', 5: 'P2.2', 8: 'P2.3'}
    for lec in L('cs223a', range(1, 17)):
        M += modules_for_lecture('cs223a', lec, 2)
        if lec['n'] in place2: M.append(pm(place2[lec['n']]))
        if lec['n'] == 8: M.append(pm('P2.4'))
    M.append(pm('M2'))
    # ---- Month 3 ----
    def lec3(key, n): return modules_for_lecture(key, L(key, [n])[0], 3)
    for n in [1,2,3,4,5,6]: M += lec3('cs231n', n)
    for n in [5,6,7]: M += lec3('ee259', n)
    for n in [8,9]: M += lec3('cs231n', n)
    M += [pm('P3.1'), pm('P3.2')]
    for n in [15, 19]: M += lec3('ee259', n)
    M += lec3('cs231n', 15)
    M += [pm('P3.3'), pm('P3.4')]
    M += lec3('cs231n', 17)
    M.append(pm('M3'))
    # ---- Month 4 ----
    for lec in L('aa203', range(1, 13)):
        M += modules_for_lecture('aa203', lec, 4)
        if lec['n'] == 8: M += [pm('P4.1'), pm('P4.2')]
    M += [pm('P4.3'), pm('P4.4'), pm('M4')]
    # ---- Month 5 ----
    def lec5(key, n): return modules_for_lecture(key, L(key, [n])[0], 5)
    for n in [13,14,15,16]: M += lec5('aa203', n)
    M += lec5('cs224r', 2); M += [pm('P5.3'), pm('P5.4')]
    for n in [17,18]: M += lec5('aa203', n)
    for n in [3,4,6]: M += lec5('cs224r', n)
    M += [pm('P5.1'), pm('P5.2')]
    M += lec5('aa203', 19)
    for n in [7,11,16]: M += lec5('cs224r', n)
    M.append(pm('M5'))
    # ---- Month 6 ----
    M.append(pm('P6.1'))
    c231_17 = dict(L('cs231n', [17])[0])
    c231_17['c'] = dict(topics='', read='Re-read your Month 3 notes for this lecture first',
        q=[dict(q='What do you recognise now that you did not in Month 3? Name three concepts from Months 4-5.', a='Personal check - e.g. imitation learning/behaviour cloning, value functions, model-based RL, sim-to-real.'),
           dict(q='Which part of the lecture relates to RL or model learning from Months 4-5, and how?', a='Personal check - connect to AA203 lectures 14-19 / CS224R.'),
           dict(q='Which robotics manipulation idea would you reuse in your final project?', a='Personal check.')],
        X='Compare your Month 3 notes with new notes and highlight what changed.', R='A second watch after a month of RL looks like a different lecture (per the article).')
    ms = modules_for_lecture('cs231n', c231_17, 6); [m.update(title=m['title'].replace('CS231N L17', 'CS231N L17 (re-watch)'), seminar=True) for m in ms]; M += ms
    for n in [17, 18]:
        ms = modules_for_lecture('cs224r', L('cs224r', [n])[0], 6); [m.update(seminar=True) for m in ms]; M += ms
    S = [('D7e7oUbtkFM','Seminar: Gen Control, Action Chunking, Moravec’s Paradox'),
         ('popjDuA-whA','Seminar: Ψ0, an Open Foundation Model'),
         ('99wIpauDEmY','Seminar: Manipulation Data Pyramid'),
         ('5uWtpDON7Vs','Seminar: Embodied Foundation Models'),
         ('NUtaN10cVDc','Seminar: Robot Learning from Human Experience'),
         ('IT734HriiHQ','Talk: AI and Robotics - Chelsea Finn & Andrew Ng')]
    order = [S[0], S[1], 'P6.2', S[2], S[3], S[4], 'P6.3', S[5], 'P6.4', 'P6.5', 'M6']
    for o in order:
        if isinstance(o, str): M.append(pm(o))
        else: M += seminar_mod(*o)
    # ---- Month 7 (bonus, appended so existing module ids/progress stay stable) ----
    M += [pm('P7.0'), pm('P7.C')]
    for lec in L('mit64210', range(1, 24)):
        M += modules_for_lecture('mit64210', lec, 7)
    M.append(pm('M7'))
    # ---- Month 8 (bonus): MIT 6.8210 Underactuated Robotics ----
    M.append(pm('P8.0'))
    for lec in L('underactuated', [1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]):
        M += modules_for_lecture('underactuated', lec, 8)
        if lec['n'] == 12: M.append(pm('P8.1'))
    M.append(pm('M8'))
    # ---- Month 9 (bonus): ETH Zurich Robot Learning, each guest talk after its lecture ----
    M.append(pm('P9.0'))
    for lec in L('ethrl', range(1, 12)):
        M += modules_for_lecture('ethrl', lec, 9)
        for g in L('ethguest', [lec['n']]) if str(lec['n']) in C['ethguest'] else []:
            ms = modules_for_lecture('ethguest', g, 9); [m.update(seminar=True) for m in ms]; M += ms
        if lec['n'] == 5: M.append(pm('P9.1'))
    M.append(pm('M9'))

    PH = {1:('Month 1','The math everything else stands on','ENGR108 Applied Linear Algebra (Boyd)'),
          2:('Month 2',"The robot's body",'CS223A Introduction to Robotics (Khatib)'),
          3:('Month 3','How a robot sees and senses','CS231N + EE259'),
          4:('Month 4','Planning and control','AA203 lectures 1-12 (Pavone, Gammelli)'),
          5:('Month 5','Teaching robots instead of programming them','AA203 13-19 + CS224R (Finn)'),
          6:('Month 6','The frontier, and your first real robot','Seminars + final project'),
          7:('Month 7 (bonus)','Robotic manipulation, end to end','MIT 6.4210 (Tedrake) + humanoid career map'),
          8:('Month 8 (bonus)','Underactuated robotics: walking, balancing, humanoids','MIT 6.8210 (Tedrake)'),
          9:('Month 9 (bonus)','Robot learning, fundamentals to foundation models','ETH Zurich Robot Learning 2026 (Mees) + guest talks')}
    attach_pora(M)
    for i, m in enumerate(M):
        m['id'] = f'm{i+1:03d}'; m['day'] = i+1; m['minutes'] = 30
    # sanity
    for m in M:
        assert 3 <= len(m['questions']) <= 5, (m['id'], m['title'], len(m['questions']))
    lec_ids = {w['id'] for m in M for w in m['watch']}
    mins = sum(m['videoMin'] for m in M)
    # Count distinct lectures in path
    path_lectures = len({(w['course'], w['lecture'], w['id']) for m in M for w in m['watch']})
    meta = dict(source='X Article by @0x_meden: Stanford\'s Robotics Degree, for Free: the 6-month path to Robot Learning Engineer',
                modules=len(M), pathLectures=path_lectures, videoHours=round(mins/60, 1),
                months={str(k): dict(label=v[0], title=v[1], sub=v[2]) for k, v in PH.items()},
                built='2026-10-03')
    json.dump(dict(meta=meta, modules=M), open(f'{ROOT}/src/data/curriculum.json', 'w'), ensure_ascii=False, indent=1)

    # ---- library (all lectures incl. those outside the path) ----
    in_path = {(w['course'], w['id']) for m in M for w in m['watch']}
    lib = []
    for k, p in PLAYLISTS.items():
        items = []
        for r in rows[k]:
            if k == 'aa203' and not re.search(r'AA203', r['title']): continue  # playlist also contains unrelated seminar items
            items.append(dict(idx=r['idx'], id=r['id'], title=r['title'], min=round(r['sec']/60), lecture=lec_no(r['title']),
                              inPath=(p['name'], r['id']) in in_path))
        lib.append(dict(key=k, name=p['name'], full=p['full'], who=p['who'], playlist=p.get('url') or f"https://www.youtube.com/playlist?list={p['pl']}", page=p['page'], items=items))
    json.dump(dict(courses=lib), open(f'{ROOT}/src/data/library.json', 'w'), ensure_ascii=False, indent=1)
    print('modules', len(M), 'path lectures', path_lectures, 'video hours', round(mins/60,1))
    from collections import Counter
    print(Counter(m['month'] for m in M)); print(Counter(m['kind'] for m in M))

if __name__ == '__main__': main()
