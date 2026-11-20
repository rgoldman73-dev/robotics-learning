# Hands-on hardware track: MIT MAS.863 How To Make (almost) Anything (Fall 2026)

**What it is.** MIT MAS.863 / 4.140 / 6.9020, taught by Neil Gershenfeld at the Center for Bits and Atoms. It is a weekly, documented fabrication course: each week you learn one way of making something, write up enough that someone else could reproduce it, and at the end you combine the skills in a final project. The 2026 class runs Wednesdays 1–4 p.m. in E14-633, with Thursday recitations. [2026 course site](https://pub.cba.mit.edu/863.26/site/) · [Application / syllabus](https://pub.cba.mit.edu/863.26/site/file/app.html) · [Prior years](https://pub.cba.mit.edu/863.26/site/file/prior.html)

The weekly lecture notes and assignments are the same pages used by [Fab Academy 2026](https://fabacademy.org/2026/), which also posts [lecture videos](https://fabacademy.org/2026/schedule). Use those videos and class pages; do not copy them into this repo. New in the 2026 MAS.863 schedule, and the reason this is also cross-linked from Learn AI, are recitations on [AI agents](https://pub.cba.mit.edu/863.26/site/recitations/AI/index.html) (1 Oct) and [Edge AI](https://pub.cba.mit.edu/863.26/site/recitations/edge_ai/) (29 Oct, [code](https://forge.cba.mit.edu/erik.strand/embedded_ai)).

This is the missing hands-on hardware track for the Robot Learning Path. Months 1–9 teach math, kinematics, vision, control, learning and manipulation mostly in simulation and on other people's videos. MAS.863 is how you actually cut, print, mill, design a board, read a sensor, move a motor, and integrate a machine. It fits as a companion, not as a new bonus month of lecture modules: there is no single YouTube playlist to split into 30-minute path items, and several weeks need a shop.

> Honest limits: you are not enrolled at MIT, and the class is limited by lab space. The official shop (laser, large CNC, PCB mill, molding bench) is in Cambridge. You have Macs and DGX Sparks, not a fab lab, so several weeks need a local makerspace, a send-out service, or a smaller home substitute (see hardware below). MIT rates the class at about 18 hours a week; self-study can go slower, one skill a week or every two weeks. The 2026 MAS.863 lectures themselves are not posted as a tidy course playlist; Fab Academy's Wednesday videos are the closest public recording of the same weekly skills, on a January–June calendar rather than September–December. All sources, including AI, must be acknowledged if you follow the class rules. This track links out; it does not copy MIT or Fab Academy notes.

## Prerequisites

- A text editor, Git, and a way to publish weekly notes (a GitHub repo or GitLab pages is enough). The [9/10 recitation](https://pub.cba.mit.edu/863.26/site/recitations/version/index.html) covers version control and web development.
- No prior CAD or electronics is required. The official class mixes beginners and experts on purpose.
- Safety training before you use a laser, CNC, or soldering setup. A makerspace will require this; do not skip it at home either.
- Best started once Month 2 (the robot's body) feels familiar, and run in parallel with the Month 6 final project or Month 7 "let's get you a robot" lectures. Software-only weeks (CAD, embedded programming in simulation, EDA, interface apps, AI agents, Edge AI on the Sparks) can start immediately.

## Week map

Dates are from the [2026 MAS.863 schedule](https://pub.cba.mit.edu/863.26/site/). Assignment briefs and tool lists are on the shared class pages. Module ids are the existing Robot Learning Path modules this week deepens; they are not new path items.

| When | Skill (official page) | Recitation | Maps to | Home / shop note |
|---|---|---|---|---|
| 9 Sep | [Introduction](https://fabacademy.org/2026/classes/principles_practices/index.html), [CAD](https://fabacademy.org/2026/classes/computer_design/index.html) | [Version control and web development](https://pub.cba.mit.edu/863.26/site/recitations/version/index.html) | [m034](#/module/m034)–[m035](#/module/m035) CS223A L1 (roadmap) | FreeCAD, Onshape, or Fusion 360 personal on a Mac. Model a possible final project. |
| 16 Sep | [Project management](https://fabacademy.org/2026/classes/project_management/index.html), [computer-controlled cutting](https://fabacademy.org/2026/classes/computer_cutting/index.html) | [Parametric design](https://pub.cba.mit.edu/alfonso.parra/HTMAA-CAD-Recitation/) | Month 2 practice projects; mechanical later | Vinyl cutter at home, or laser at a makerspace / send-out. Account for kerf. |
| 23 Sep | [Embedded programming](https://fabacademy.org/2026/classes/embedded_programming/index.html) | [Electronics](https://docs.google.com/presentation/d/1yi74tyA7pndkprdBvipFG7vPN_mt5oaKWDUpzZvqBeQ/edit?usp=sharing) | [m194](#/module/m194) 6.4210 L2; [m168](#/module/m168) final-project setup | XIAO or similar + PlatformIO/Arduino. Simulate first in Wokwi if you want. |
| 30 Sep | [3D scanning and printing](https://fabacademy.org/2026/classes/scanning_printing/index.html) | [AI agents](https://pub.cba.mit.edu/863.26/site/recitations/AI/index.html) | [m097](#/module/m097) EE259 L19 (cameras); Learn AI m07–m08, m17 | Phone photogrammetry + a budget FDM printer or a shop printer. Agents recitation is the Learn AI cross-link. |
| 7 Oct | [Electronics design](https://fabacademy.org/2026/classes/electronics_design/index.html), first review | [EDA](https://pub.cba.mit.edu/863.26/site/recitations/EDA/EDA_recitation_10-08.pdf) | [m194](#/module/m194) 6.4210 L2 | KiCad (free) and the fab parts library. Check ERC/DRC. No mill needed yet. |
| 14 Oct | [Electronics production](https://fabacademy.org/2026/classes/electronics_production/index.html) | [Debugging](https://docs.google.com/presentation/d/1rCjAHXTtOT6wu7UAMmudnBsidMiCNB94gpR2nMy-xGw/edit?usp=sharing) | [m168](#/module/m168), [m194](#/module/m194) | Order boards from a board house, or mill at a makerspace. Do not buy a PCB mill for one course. |
| 21 Oct | [Computer-controlled machining](https://fabacademy.org/2026/classes/computer_machining/index.html) | [CAM](https://docs.google.com/presentation/d/1pmB81ebrsAB84UiewVSpeEZ-BaWs2pfRtmKS7dmI_tc/edit?usp=sharing) | Month 7 hardware; machine-design weeks | The official assignment is something about a meter across. Use a makerspace CNC, or scale down and say so in your notes. |
| 28 Oct | [Input devices](https://fabacademy.org/2026/classes/input_devices/index.html) | [Edge AI slides](https://pub.cba.mit.edu/863.26/site/recitations/edge_ai/), [code](https://forge.cba.mit.edu/erik.strand/embedded_ai) | [m083](#/module/m083)–[m086](#/module/m086) EE259 inertial sensors; [m236](#/module/m236) 6.4210 tactile; Learn AI m26 | Add a sensor to a board you designed. Prototype edge models on the DGX Sparks, then deploy a tiny model to the board. |
| 4 Nov | [Output devices](https://fabacademy.org/2026/classes/output_devices/index.html) | [Motor and motion control](https://pub.cba.mit.edu/863.26/site/recitations/motor_control/) | [m068](#/module/m068) CS223A L16 force control; [m218](#/module/m218) 6.4210 L14 | Servo, stepper, or DC motor + driver on your board. Measure current. |
| 11 Nov | [Mechanical](https://fabacademy.org/2026/classes/mechanical_design/index.html) and [machine design](https://fabacademy.org/2026/classes/machine_design/index.html) | Machine building | Month 2 projects; [m194](#/module/m194); Month 6 project; Learn AI m29 | Mechanism + actuation + automation. A small plotter, card machine, or sensor rig is enough at home. |
| 18 Nov | [Wildcard](https://fabacademy.org/2026/classes/wildcard/index.html), second review | [Molding and casting](https://fabacademy.org/2026/classes/molding_casting/index.html) | optional | Shop or a small home kit with ventilation and PPE. Or skip and note why. |
| 25 Nov | [Networking](https://fabacademy.org/2026/classes/networking_communications/index.html) and [interface / app programming](https://fabacademy.org/2026/classes/interface_application_programming/index.html) | Mesh networks | [m168](#/module/m168)–[m188](#/module/m188); Learn AI m19 | Two ESP32 boards talking; a phone or laptop UI is a valid interface. |
| 2–15 Dec | [System integration](https://fabacademy.org/2026/classes/system_integration/index.html), [project development](https://fabacademy.org/2026/classes/project_development/index.html), [presentation](https://fabacademy.org/2026/classes/project_presentation/index.html) | Lab help | [m168](#/module/m168)–[m188](#/module/m188) Month 6 final project | Integrate, document, and show the thing working. |

Student weekly write-ups from this offering (examples of the documentation standard, not materials to copy): [Ivan Ren, week 2, laser cutting and CAD](https://pub.cba.mit.edu/863.26/ivan.ren/docs/week2/), [Shimon Horwitz, week 5, KiCad](https://pub.cba.mit.edu/863.26/shimon.horwitz/week5.html), [Xiangtao Shi, week 5, electronics design](https://pub.cba.mit.edu/863.26/xiangtao.shi/week5/index.html).

## Hardware for home self-study

Prices are late-2026 US ballparks in dollars, to be checked before anyone buys anything. Nothing below is a recommendation to purchase; it is a map of cheaper equivalents to a fab lab.

**Already on the desk (about $0 extra).** Macs for CAD, KiCad, Git, and interface apps. DGX Sparks for Edge AI prototyping and any local-model work. Free tools: [FreeCAD](https://www.freecad.org/), [Onshape](https://www.onshape.com/) (free plan), Fusion 360 personal use, [KiCad](https://www.kicad.org/), [Wokwi](https://wokwi.com/), Arduino or PlatformIO, phone photogrammetry (PolyCam, RealityScan, or similar).

**Home electronics bench, about $150–350.** A USB-C iron (Pinecil-class irons are around $25–80), a basic multimeter ($20–40), a breadboard and passives kit ($20–30), two or three Seeed XIAO ESP32-S3 or RP2040 boards (about $8–15 each; this is what 2026 students are using), a sensor assortment ($20–40), a servo or stepper plus driver ($30–60), safety glasses, and optionally a small fume extractor. When a board needs to be real, send the KiCad files to a board house such as JLCPCB or PCBWay (often $5–30 plus shipping for a small two-layer run) instead of buying a desktop mill.

**Add a 3D printer, about $200–400 more.** A compact FDM machine such as the Bambu Lab A1 mini is listed around $199 on the US store, plus filament at about $20–30/kg. Or use a library or makerspace printer and skip the purchase. Scanning can stay on a phone.

**Do not buy a home fab lab for this track.** A CO2 laser, a large CNC, and a PCB mill are thousands of dollars and need extraction, training, and space. For laser cutting, vinyl, meter-scale CNC, and molding, use a shop or a send-out service (SendCutSend and similar for profiles). A vinyl cutter (Cricut/Cameo, often $200–400) can cover the vinyl half of the cutting week at home. A small molding kit is about $50–100 if you have ventilation and PPE; otherwise do it at a shop or skip it.

**Local shop, Metro Detroit.** [i3Detroit](https://www.i3detroit.org/) in Ferndale (1481 Wordsworth Street) is a community makerspace with a woodshop, laser, and a 5×10-foot CNC. Membership has been listed at $59/month for 24/7 access; some machines need authorization, and they ask prospective members to tour first (Friday evenings 6:30–8:30 p.m. is the usual open time). Confirm current dues and training on their site before planning around it. Maker Works in Ann Arbor is another option if that is closer.

**A realistic budget.** Software weeks plus the electronics bench and a printer (or shop time for printing) is about $400–800 one-time, plus makerspace dues for the weeks that need a laser or CNC (two to four months at about $59, if you join i3Detroit). That is the path this track assumes. Equipping a garage like a fab lab is a different project.

## A pace that fits

Twelve to fourteen sittings, one official week each, stretched over two to four months if you are also on the daily robotics modules. Do the CAD, embedded, EDA, interface, and both AI recitations at home first. Book shop time before the cutting, machining, and molding weeks. Write a short reproducible note every week, even when the part is only a simulation or a board-house order; that is most of the official grade, and it is the habit worth stealing.

## Ask the course library

Public course pages (schedule, syllabus, agreement, weekly assignments and tool lists, recitation notes) are indexed under `htmaa` in the private course RAG. Student pages are not in the index. Hits cite the class page and link back to it:

```sh
/workspace/course-rag/search.py "parametric laser kerf construction kit" -s htmaa
/workspace/course-rag/search.py "KiCad schematic ERC DRC ratsnest" -s htmaa
/workspace/course-rag/search.py "edge AI microcontroller" -s htmaa
/workspace/course-rag/search.py "agentic CAD FEA loop" -s htmaa
```
