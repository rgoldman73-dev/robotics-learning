## 2
speaker: Abishek Gupta (University of Washington)
title: Abishek Gupta - Simulation for robotic manipulation, without the pain
topics: Building simulation cheaply from real scenes, real-to-sim-to-real, RL fine-tuning in simulation
Q: What problem does real-to-sim address? => Building accurate simulators of real scenes is slow; reconstructing them from real data makes sim training practical.
Q: Why train manipulation in sim at all? => Cheap, safe, parallel experience for RL that would be too slow on hardware.
Q: Main risk? => The sim-to-real gap in contact, appearance and dynamics.
X: Note one claim from the talk you would want to see measured on real hardware.
R: Simulation is valuable again once scene creation is cheap.
## 3
speaker: Danfei Xu (Georgia Tech)
title: Danfei Xu - Human data as a foundation for robot learning
topics: Learning from human video and egocentric data, embodiment gap
Q: Why use human data? => It is far more plentiful and diverse than robot data.
Q: What is the embodiment gap? => Human hands and bodies differ from robot grippers, so actions must be retargeted or abstracted.
Q: Which Month 6 seminar covered similar ground? => Danfei Xu's Stanford Robotics Seminar, Robot Learning from Human Experience.
X: List three kinds of human data and what each lacks for robot training.
R: Human data can scale robot learning if the embodiment gap is handled.
## 4
speaker: Aviral Kumar (CMU / Google DeepMind)
title: Aviral Kumar - How to replicate the LLM recipe in robot learning
topics: Pretraining + RL fine-tuning, offline RL at scale, scaling laws for robotics
Q: What is the "LLM recipe"? => Large-scale pretraining followed by fine-tuning and RL on targeted objectives.
Q: What makes it harder for robots? => Scarce, heterogeneous action data and costly evaluation.
Q: Where does offline RL fit? => It can improve policies from large logged datasets before any online interaction.
X: Map each LLM training stage to a robot equivalent.
R: The open question is whether robotics can follow the pretrain-then-RL path.
## 5
speaker: Andrew Wagenmaker (UC Berkeley)
title: Andrew Wagenmaker - Robots that learn from experience
topics: Online RL fine-tuning of pretrained policies, steering diffusion policies, sample efficiency
Q: Why fine-tune a pretrained policy with RL? => Demonstrations get you close; experience lets the robot improve beyond them.
Q: What is steering a diffusion policy in latent space? => Doing RL over the policy's noise input rather than its weights, so learning is cheaper and safer.
Q: What limits real-world RL? => Sample efficiency, resets and safe exploration.
X: Describe how you would let your Month 6 LeRobot policy improve from its own failures.
R: Learning from experience is how policies get past demonstration quality.
## 6
speaker: Cheng Chi (Sunday Robotics; Diffusion Policy & UMI)
title: Cheng Chi - Robotics beyond algorithms
topics: Data collection hardware (UMI), systems engineering, what actually makes robots work
Q: What is UMI? => The Universal Manipulation Interface, a handheld gripper for collecting in-the-wild demonstrations without a robot.
Q: Main message of "beyond algorithms"? => Hardware, data collection and systems engineering often matter more than the learning algorithm.
Q: Which ETH lecture pairs with this? => L6 Generative Models (diffusion policy).
X: Design a cheap data-collection rig for one task and estimate demos per hour.
R: The diffusion policy author argues that data and systems are the bottleneck.
## 7
speaker: Ted Xiao (Prometheus; ex-Google)
title: Ted Xiao - Three eras of robot learning
topics: History of robot learning at Google (RT-1, RT-2), scaling eras, where the field is going
Q: What did RT-2 show? => A vision-language model fine-tuned on robot data can transfer web knowledge to robot actions.
Q: Why talk about "eras"? => Each era changed the main bottleneck: algorithms, then data scale, then foundation models.
Q: Which ETH lecture follows from this? => L9 Generalist Robot Policies.
X: Write a one-line summary for each of the three eras.
R: A field history from someone who built RT-1 and RT-2.
## 8
speaker: Scott Reed (NVIDIA GEAR Lab)
title: Scott Reed - What is the right backbone for embodied agents?
topics: Backbone architectures for generalist agents, video/world-model backbones vs VLMs, Gato
Q: What is the backbone question? => Whether robot policies should be built on language models, video models, or something else.
Q: Why might video models be good backbones? => They learn physics and dynamics from video, which matter for action.
Q: Which earlier paper did he lead? => Gato, a generalist agent (2022).
X: Argue for one backbone choice in a paragraph.
R: The backbone choice decides what prior knowledge a robot policy inherits.
## 9
speaker: Quan Vuong (Physical Intelligence co-founder)
title: Quan Vuong - pi0.7, a generalist model with emergent capabilities
topics: Physical Intelligence's pi models, scaling data and models, emergent generalization
Q: What does "emergent capabilities" mean here? => Behaviors the model shows that were not explicitly trained, appearing with scale.
Q: What feeds a pi-series model? => Large mixtures of cross-embodiment robot data plus vision-language pretraining.
Q: How would you test a claim of emergence? => Evaluate on held-out tasks/scenes with clear success metrics and compare with smaller models.
X: Write down the evaluation protocol you'd demand before believing an emergence claim.
R: A first-hand view of the frontier generalist model; treat capability claims with measured skepticism.
## 10
speaker: Archit Sharma (Google DeepMind)
title: Archit Sharma - Scaling test-time compute at the frontier
topics: Test-time compute, reasoning models, how it transfers to embodied agents
Q: What does scaling test-time compute mean? => Improving answers by spending more inference compute (longer reasoning, sampling, search).
Q: Why is it harder for robots? => Actions must happen in real time and errors are physical.
Q: Which ETH lecture pairs with this? => L10 Embodied Reasoning and Test-time Scaling.
X: List where in a robot stack you could afford extra thinking time.
R: Reasoning-at-inference is the newest scaling axis.
## 11
speaker: Lucas Beyer (Meta Superintelligence Labs)
title: Lucas Beyer - Vision in the age of LLMs
topics: Vision transformers, vision-language pretraining, what vision still needs
Q: What did ViT show? => Plain transformers on image patches match or beat CNNs given enough data.
Q: Why does vision matter for robots in the LLM era? => Policies are only as good as their visual understanding of space and objects.
Q: Which earlier month covered ViT/attention? => Month 3 (CS231N L8 attention and transformers).
X: Note one weakness of current VLMs for spatial reasoning that matters for manipulation.
R: The ViT co-author on where vision goes next.
