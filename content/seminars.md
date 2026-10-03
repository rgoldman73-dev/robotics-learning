## D7e7oUbtkFM
speaker: Max Simchowitz (CMU)
topics: Generative control, action chunking, Moravec's paradox
read: Re-read PoRA Chapter 19 Imitation Learning; skim ACT / Diffusion Policy papers linked on cs224r.stanford.edu
Q: What is action chunking? => Predicting a short sequence (chunk) of future actions at once instead of one action at a time.
Q: What is Moravec's paradox? => Tasks that are easy for humans (perception, dexterous manipulation) are hard for robots, while abstract reasoning is comparatively easy for computers.
Q: Why might action chunking help imitation learning? => Executing consistent multi-step chunks reduces compounding error and handles temporally correlated demonstrations.
X: Sketch a policy that outputs 10 future joint targets per call; decide how often you would re-plan.
R: Mathematical evidence for why "easy" things are hard for robots, and key ideas (generative control, chunking) in modern robot learning.
## popjDuA-whA
speaker: Yue Wang (USC)
topics: Ψ0, an open foundation model for humanoid loco-manipulation
read: Skim recent robot foundation model papers; revisit PoRA Chapter 19
Q: What is a robot foundation model? => A large model pretrained on broad, diverse robot (and human) data that can be adapted to many tasks and embodiments.
Q: What does the talk target, per the article? => An open foundation model for humanoid loco-manipulation (walking plus manipulation).
Q: What kind of data do such models need? => Huge and varied datasets.
X: List the data sources you would combine to train a humanoid loco-manipulation model.
R: Open foundation models for humanoids rely on large, varied datasets and combine locomotion and manipulation.
## 99wIpauDEmY
speaker: Yang Gao (Tsinghua)
topics: Manipulation data pyramid
read: Revisit AA203 lecture 15 notes on imitation learning
Q: What is the "manipulation data pyramid" about, per the article? => Combining internet video, human teleoperation and robot experience so each fills the gaps of the others.
Q: Which tier is cheapest and which is most relevant to the robot? => Internet video is cheapest/most abundant; robot experience is most relevant but scarce.
Q: Why not use only one data source? => Each has trade-offs in scale, embodiment match and action labels.
X: Draw your own pyramid with three tiers and annotate quantity vs relevance.
R: Robot learning needs a mixture of data sources: abundant but indirect at the bottom, scarce but on-embodiment at the top.
## 5uWtpDON7Vs
speaker: Jonas Frey (Stanford)
topics: Embodied foundation models
read: Revisit CS224R lecture 16 notes
Q: What does the article say this talk explains? => Why sim-to-real works for walking robots and why it is still hard for manipulation.
Q: Why might sim-to-real be easier for locomotion? => Contact dynamics for walking are easier to simulate and randomize than rich object interactions and visuals in manipulation.
Q: What would you randomize to help sim-to-real for a gripper task? => Object pose/mass/friction, lighting, textures, camera noise.
X: Write down 3 randomization parameters you could use in your MuJoCo scene.
R: Sim-to-real is mature for locomotion and an open problem for manipulation (about 29 minutes).
## NUtaN10cVDc
speaker: Danfei Xu (Georgia Tech, NVIDIA)
topics: Robot learning from human experience
read: Revisit PoRA Chapter 19 Imitation Learning
Q: What is the central question, per the article? => How robots can learn from video and data recorded by humans.
Q: What is the embodiment gap? => Human hands/bodies differ from robot grippers/arms, so human data must be mapped to robot actions.
Q: Why is human data attractive? => It is abundant and cheap to collect compared with robot teleoperation.
X: List two ways to bridge the embodiment gap.
R: Human experience data (video, recordings) is a scalable source for robot learning if the embodiment gap is handled.
## IT734HriiHQ
speaker: Chelsea Finn and Andrew Ng
topics: AI and Robotics conversation
read: Stanford Robotics Seminar archive; LeRobot docs
Q: What does the article say about this conversation's ending? => It ends with a section on how to get into robotics and reinforcement learning (about 33 minutes).
Q: Which ideas from this path does Finn's work most connect to? => Imitation learning, RL, multi-task/generalist robot policies.
Q: What is your next concrete step after the video? => Personal: pick your final project tier.
X: Write your final-project plan in 5 bullet points.
R: Career and research perspective from two leaders of the field.
