## 1
title: Introduction to robot learning
topics: What robot learning is, classical vs learned robotics, data sources, the course roadmap from MDPs to VLAs
read: Lecture 1 slides (cvg.ethz.ch/lectures/Robot-Learning/lectures/lecture1_intro.pdf)
Q: What is the course roadmap? => MDPs and imitation learning, then RL, generative models, sequence models, world models, generalist policies (VLAs), reasoning and open problems.
Q: Why is data the central problem in robot learning? => Unlike text and images, there is no internet-scale dataset of robot actions; collection is slow and expensive.
Q: What earlier months does this course build on? => Month 5 (AA203 + CS224R imitation/RL) and Month 6 (foundation-model seminars).
X: Clone github.com/mees-robot-learning-course/ethz-course-2026 and run hw1 (PyTorch & NumPy tutorial) if you need a refresher.
R: A 2026 survey course that runs from fundamentals to foundation models.
## 2
title: Robot control and MDPs
topics: Markov decision processes, policies, value functions, robot control as an MDP, exploration
read: Lecture 2 slides; paper discussion: Mania et al. 2018 "Simple random search provides a competitive approach to RL" (arxiv.org/abs/1803.07055); Irpan 2018 "Deep RL Doesn't Work Yet"
Q: What are the parts of an MDP? => States, actions, transition dynamics, reward and discount factor.
Q: What did Mania et al. show? => Simple random search over linear policies matched deep RL on MuJoCo locomotion benchmarks, questioning benchmark difficulty.
Q: Why does Irpan argue deep RL is hard? => Sample inefficiency, reward design, local optima, instability and poor reproducibility.
X: Do hw2 (robot control & MDPs) from the course repo.
R: Every RL method starts here; the paper discussion is a healthy dose of skepticism.
## 3
title: Imitation learning
topics: Behavior cloning, covariate shift, DAgger, causal confusion, visual representations for imitation
read: Lecture 3 slides; papers: de Haan et al. 2019 "Causal Confusion in Imitation Learning" (arxiv.org/abs/1905.11979); Zeng et al. 2020 Transporter Networks (arxiv.org/abs/2010.14406)
Q: What is covariate shift in behavior cloning? => The policy's small errors take it to states not in the demonstrations, where errors compound.
Q: What is causal confusion? => The policy latches onto features correlated with the expert's actions (e.g. a brake light) instead of the true causes.
Q: How does DAgger fix drift? => It queries the expert on states visited by the learned policy and adds those labels to the dataset.
X: Do hw3 (imitation learning) from the course repo; compare with your Month 5 cart-pole BC experiment.
R: Imitation learning is the workhorse of modern manipulation, but it drifts and can learn the wrong cause.
## 4
title: Reinforcement learning I
topics: Policy gradients, value-based methods, evolution strategies, RL for grasping, human-in-the-loop RL
read: Lecture 4 slides; papers: Salimans et al. 2017 Evolution Strategies (arxiv.org/abs/1703.03864); Luo et al. 2024 HIL-SERL (arxiv.org/pdf/2410.21845)
Q: What is the REINFORCE estimator? => The gradient of expected return equals the expectation of grad log pi(a|s) times return (minus a baseline).
Q: Why are evolution strategies attractive at scale? => They need only returns, not gradients, and parallelise trivially across many workers.
Q: What does human-in-the-loop RL add on real robots? => Human corrections and demonstrations speed learning and keep exploration safe.
X: Start hw4 (reinforcement learning) from the course repo.
R: RL basics, plus evidence that RL can now train precise real-world manipulation.
## 5
title: Reinforcement learning II
topics: Actor-critic, off-policy and offline RL, reward design with LLMs, end-to-end visuomotor training
read: Lecture 5 slides; papers: Levine et al. 2015 end-to-end visuomotor policies (arxiv.org/abs/1504.00702); Ma et al. 2023 Eureka (arxiv.org/abs/2310.12931)
Q: What does Eureka do? => Uses an LLM to write and iteratively refine reward functions as code for RL.
Q: Why does offline RL matter for robots? => Real-robot data is expensive; offline RL learns from fixed logged datasets without new interaction.
Q: What did Levine et al. 2015 show? => Training perception and control jointly, end-to-end from pixels to torques, on real robot tasks.
X: Finish hw4; plot learning curves and compare two algorithms.
R: Modern RL: off-policy, offline, and LLM-designed rewards.
## 6
title: Generative models
topics: VAEs, diffusion and flow matching, diffusion policy, implicit behavior cloning, planning with diffusion
read: Lecture 6 slides; papers: Janner et al. 2022 Diffuser (arxiv.org/abs/2205.09991); Florence et al. 2021 Implicit BC (arxiv.org/pdf/2109.00137)
Q: Why use generative models for policies? => Demonstrations are multimodal; a generative model can represent several valid actions instead of averaging them.
Q: What is a diffusion policy? => A policy that generates action sequences by iteratively denoising random noise conditioned on observations.
Q: What does implicit BC use instead of a direct regressor? => An energy-based model whose minimum over actions is the chosen action.
X: Explain on paper why averaging two demonstrations (go left / go right of an obstacle) crashes a regression policy but not a diffusion policy.
R: Generative models (especially diffusion) made imitation learning work for dexterous tasks.
## 7
title: Sequence modeling and transformers
topics: Transformers for control, Decision Transformer, action chunking (ACT/ALOHA), next-token prediction for locomotion
read: Lecture 7 slides; papers: Chen et al. 2021 Decision Transformer (arxiv.org/abs/2106.01345); Zhao et al. 2023 ALOHA/ACT (arxiv.org/abs/2304.13705)
Q: What does Decision Transformer condition on? => Desired return-to-go, past states and actions; it predicts the next action like a language model.
Q: What is action chunking in ACT? => Predicting a chunk of future actions at once, reducing compounding error and handling pauses in demos.
Q: Which Month 6 seminar previewed this? => Max Simchowitz's talk on generative control and action chunking.
X: Modify a BC policy to output a 10-step action chunk and use temporal ensembling; compare smoothness.
R: Robot control as sequence modeling: chunks, transformers and next-token prediction.
## 8
title: World models
topics: Learned dynamics models, video prediction as planning, training agents inside world models, world action models
read: Lecture 8 slides; papers: Du et al. 2023 UniPi (arxiv.org/abs/2302.00111); Hafner et al. 2025 (arxiv.org/abs/2509.24527)
Q: What is a world model? => A learned model that predicts future observations or latent states given actions, usable for planning or training policies in imagination.
Q: Why train agents inside a world model? => Imagined rollouts are cheap and safe compared with real-robot interaction.
Q: What is the main risk (also in AA203 model-based RL)? => The policy exploits model errors, doing well in imagination but failing in reality.
X: Write a one-paragraph comparison between a physics simulator (MuJoCo/Drake) and a learned video world model for robot training.
R: World models turn video prediction into a planning and training tool.
## 9
title: Generalist robot policies
topics: Vision-language-action models, cross-embodiment data, Gato, pi0.6/pi*0.6, language-conditioned imitation
read: Lecture 9 slides; papers: Lynch et al. language-conditioned imitation (arxiv.org/pdf/2005.07648); Reed et al. 2022 Gato (arxiv.org/abs/2205.06175); Physical Intelligence pi*0.6 (arxiv.org/abs/2511.14759)
Q: What is a VLA? => A vision-language model fine-tuned to output robot actions, conditioned on images and a language instruction.
Q: Why train across many robot embodiments? => More diverse data improves generalization and shares skills between robots.
Q: What does pi*0.6 add over plain imitation? => Learning from its own experience (RL-style improvement) on top of demonstrations.
X: Run a pretrained policy from LeRobot (e.g. SmolVLA or pi0) in simulation and change the instruction or object to test generalization.
R: Generalist policies are where the field is headed; Month 6's seminars meet their technical details here.
## 10
title: Embodied reasoning and test-time scaling
topics: In-context imitation, LLM agents for embodied tasks (Voyager), chain-of-thought for robots, test-time compute
read: Lecture 10 slides; papers: Fu et al. 2024 in-context imitation (arxiv.org/pdf/2408.15980); Wang et al. 2023 Voyager (arxiv.org/abs/2305.16291)
Q: What is test-time scaling? => Spending more computation at inference (sampling, search, reasoning) to improve decisions without retraining.
Q: What does Voyager do? => An LLM agent in Minecraft that writes code skills, stores them in a library and builds a curriculum for itself.
Q: Why add reasoning to robot policies? => To handle long-horizon, novel tasks that need planning beyond reactive control.
X: Pick one household task and write the reasoning steps a VLA would need before acting; mark where it could fail.
R: Reasoning and extra inference compute are the newest lever on robot capability.
## 11
title: Frontiers and open problems
topics: The Bitter Lesson, intelligence without representation, autonomous machine intelligence, what is still unsolved
read: Lecture 11 slides; Sutton "The Bitter Lesson" (incompleteideas.net/IncIdeas/BitterLesson.html); Brooks 1991 "Intelligence without Representation"; LeCun 2022 "A Path Towards Autonomous Machine Intelligence"
Q: What is the Bitter Lesson? => General methods that scale with computation (search and learning) eventually beat hand-built human knowledge.
Q: What did Brooks argue? => Intelligent behavior can emerge from layered reactive systems coupled to the world, without central symbolic models.
Q: Name two open problems in robot learning. => E.g. data scale, reliability/safety, long-horizon tasks, evaluation and sim-to-real.
X: Write a 1-page position: which open problem would you work on and what data would you need?
R: The course ends with the big debates; you can now take a side with evidence.
