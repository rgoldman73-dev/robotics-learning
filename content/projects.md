## P1.1
month: 1
title: Practice: Least squares line fit
steps: Install Python with NumPy and Jupyter. Generate 50 noisy points around a line, fit the line using the normal-equations formula by hand, then with np.linalg.lstsq, and check that you get the same answer.
links: NumPy|https://numpy.org/install/|Jupyter|https://jupyter.org/install
Q: What are the normal equations? => A^T A x = A^T b.
Q: Why is lstsq preferred over inverting A^T A? => It's more numerically stable (uses QR/SVD).
Q: What does the residual look like when the fit is good? => Small and uncorrelated with the columns of A.
X: Print both coefficient vectors and assert np.allclose.
R: Least squares by formula and by library should agree; least squares reappears in sensor calibration.
## P1.2
month: 1
title: Practice: Rotate a 2D point
steps: Write rotate(point, angle) using the 2x2 rotation matrix, and plot a square rotating in 10-degree steps.
links: Matplotlib|https://matplotlib.org/
Q: Write the 2D rotation matrix. => [[cos t, -sin t],[sin t, cos t]].
Q: What is R(t)^{-1}? => R(-t) = R(t)^T.
Q: What happens to lengths and angles under rotation? => They are preserved.
X: Plot 36 rotated squares and check the last one equals the first.
R: Rotation is a matrix; this will return in kinematics.
## P1.3
month: 1
title: Practice: Simulate a linear dynamical system
steps: Simulate x(t+1) = A x(t) in a loop and plot what happens when you change A (try rotation-scaling matrices with eigenvalue magnitudes 0.9, 1.0, 1.1).
links: NumPy|https://numpy.org/
Q: When is x(t+1)=A x(t) stable? => When all eigenvalues of A have magnitude less than 1.
Q: What does an eigenvalue of magnitude 1 with rotation do? => Pure oscillation around the origin without decay.
Q: How does this relate to a robot's state? => A linearized robot is a linear system around an operating point.
X: Plot trajectories for the three A matrices and label stable/unstable.
R: Linear systems model state evolution; Month 1 milestone: simulate a linear system in a loop and plot it.
## M1
month: 1
title: Month 1 milestone check
steps: Self-assess against the Month 1 milestone from the article and revisit anything shaky.
links: VMLS|https://web.stanford.edu/~boyd/vmls/|Mathematics for Machine Learning (free PDF, optional refresher)|https://mml-book.github.io/|MML post by @mentalium_|https://x.com/mentalium_/status/2112909734936199213
Q: Can you multiply a 2x2 matrix by a vector in your head and explain it geometrically? => Yes if you can describe it as a combination of the matrix columns, i.e. a transformed grid.
Q: Can you explain why least squares is "the best fit"? => It minimizes the sum of squared residuals; the residual is orthogonal to the columns of A.
Q: Can you rotate points with a rotation matrix in code? => Yes (Practice 2).
Q: Can you simulate a linear system in a loop and plot it? => Yes (Practice 3).
X: Rate yourself 1-5 on each milestone line; revisit modules where you scored below 4.
R: Month 1 gives you the language of vectors, matrices and least squares that all later courses assume.
## P2.1
month: 2
title: Practice: Load the SO-ARM100 in MuJoCo
steps: Install MuJoCo (pip install mujoco). Get the model trs_so_arm100 from mujoco_menagerie, load it and print joint names, joint limits and the gripper site position.
links: MuJoCo Menagerie SO-ARM100|https://github.com/google-deepmind/mujoco_menagerie/tree/main/trs_so_arm100|MuJoCo docs|https://mujoco.readthedocs.io/
Q: How do you load an MJCF in Python? => mujoco.MjModel.from_xml_path(path), then mujoco.MjData(model).
Q: Where are joint angles stored? => data.qpos.
Q: How do you step the physics? => mujoco.mj_step(model, data) (or mj_forward for kinematics only).
X: Print qpos for the zero pose and the gripper's world position (data.site_xpos or body xpos after mj_forward).
R: You can load a real robot model in MuJoCo and read its state.
## P2.2
month: 2
title: Practice: Forward kinematics vs the simulator
steps: Read the joint angles, compute the gripper position yourself with forward kinematics (transform chain from the model's body offsets), and check it against the simulator's answer.
links: MuJoCo docs|https://mujoco.readthedocs.io/
Q: What is the FK formula for a serial chain? => T = T_1(q_1) T_2(q_2) ... T_n(q_n), each a homogeneous transform.
Q: Where in the MJCF do link offsets come from? => Body pos/quat attributes and joint axis definitions.
Q: What tolerance should agree? => Position equality to ~1e-6 m.
X: Assert your FK matches data.site_xpos for 5 random poses.
R: When your math and the simulator agree on where the gripper is, you understand the robot's body.
## P2.3
month: 2
title: Practice: Numerical inverse kinematics
steps: Write a simple IK solver (Jacobian pseudo-inverse or damped least squares using mujoco.mj_jacSite) that moves the gripper to a target point.
links: MuJoCo docs|https://mujoco.readthedocs.io/
Q: What is the damped least squares update? => dq = J^T (J J^T + λ² I)^{-1} dx.
Q: Why damped? => Avoids huge steps near singularities (Levenberg-Marquardt, ENGR108 lecture 51).
Q: How do you compute J in MuJoCo? => mujoco.mj_jacSite(model, data, jacp, jacr, site_id).
X: Move the gripper to three targets and record the final position error.
R: IK is solved iteratively with the Jacobian, linking Months 1 and 2.
## P2.4
month: 2
title: Practice: Find a singularity
steps: Find a pose where the arm loses a degree of freedom and explain what happened using the Jacobian (rank, smallest singular value).
links: MuJoCo docs|https://mujoco.readthedocs.io/
Q: How do you detect it numerically? => Smallest singular value of J near zero or rank drop.
Q: Which direction is lost? => The direction in the left null space of J (cannot be produced by any joint velocity).
Q: Why do singularities matter for learned policies? => A policy commanding hand motion there demands near-infinite joint speeds.
X: Plot the smallest singular value while sweeping one joint.
R: Singularities are configurations where J loses rank; Month 2 milestone achieved.
## M2
month: 2
title: Month 2 milestone check
steps: Self-assess against the Month 2 milestone.
links: SEE CS223A|https://see.stanford.edu/Course/CS223A
Q: Can you describe the pose of any object with a transform? => Yes: rotation + translation as a 4x4 matrix.
Q: Can you compute FK for a simple arm by hand and in code? => Yes (Practice 5).
Q: Can you solve IK numerically? => Yes (Practice 6).
Q: Can you explain the Jacobian to a novice? => It tells how fast each joint must move to move the hand at a given velocity (and how forces map back).
X: Write a 3-sentence explanation of the Jacobian for a friend.
R: You understand the robot's body: frames, FK, IK, Jacobian, dynamics and control.
## P3.1
month: 3
title: Practice: Add a camera and three colored objects
steps: Add a camera to your MuJoCo scene from Month 2 and place three colored objects on a table.
links: MuJoCo docs|https://mujoco.readthedocs.io/
Q: How do you render an image in MuJoCo's Python bindings? => mujoco.Renderer(model, h, w) then renderer.update_scene(data, camera) and renderer.render().
Q: What are camera intrinsics? => Focal length, principal point and distortion.
Q: Why use distinct colors? => They make labeling and a first detector easy.
X: Save one rendered image and compute where each object appears in pixels.
R: A simulated camera lets you generate labeled training data.
## P3.2
month: 3
title: Practice: Generate data and train a CNN
steps: Render images with random object positions and train a small CNN in PyTorch to predict the pixel position of one object.
links: PyTorch|https://pytorch.org/get-started/locally/
Q: What loss for regressing a position? => Mean squared error (or L1).
Q: How do you check for overfitting? => Hold out a validation set; compare errors.
Q: Why normalize targets? => Keeps the loss scale well-behaved.
X: Report validation error in pixels.
R: A small CNN can locate an object after training on a few thousand rendered images.
## P3.3
month: 3
title: Practice: Close the loop with IK
steps: Convert predicted pixel position into a table position, then use your Month 2 IK to move the gripper above it.
links: MuJoCo docs|https://mujoco.readthedocs.io/
Q: What do you need to convert pixels to a table point? => Camera intrinsics/extrinsics and the table plane height.
Q: What is hand-eye calibration? => Finding the transform between camera and robot base.
Q: What errors will you see? => Pixel prediction error and projection errors combine.
X: Measure how often the gripper ends within 1 cm of the object.
R: Perception + IK form a minimal see-then-act pipeline.
## P3.4
month: 3
title: Practice: Add noise and lighting changes
steps: Add random noise and lighting changes to images and watch the accuracy drop - your first sim-to-real gap taste.
links: PyTorch|https://pytorch.org/
Q: What is the sim-to-real gap? => The difference between clean simulated data and messy real data.
Q: How does data augmentation help? => Training on varied conditions makes the model robust.
Q: What do you record? => Accuracy before and after perturbations.
X: Plot error vs noise level.
R: Models trained on clean images degrade under shifts.
## M3
month: 3
title: Month 3 milestone check
steps: Self-assess against the Month 3 milestone.
links: CS231N|https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16
Q: Can you train and evaluate a CNN in PyTorch? => Yes (Practice 9).
Q: Can you explain attention in a paragraph without equations? => Tokens look at each other and mix information based on relevance.
Q: Why does an IMU drift and why do lidar and cameras fail differently? => Integration accumulates bias and noise; lidar gives range but struggles with glass/fog, cameras give appearance but no direct depth.
Q: Can you connect a vision model to an arm in simulation? => Yes (Practice 10).
X: Write the one-paragraph answers to the three explain-questions.
R: You can see and sense: vision models, IMUs and lidar.
## P4.1
month: 4
title: Practice: Cart-pole model and linearization
steps: Use the Gymnasium MuJoCo InvertedPendulum/cart-pole or write a cart-pole simulation in Python. Linearize around the upright position to get A and B.
links: Gymnasium MuJoCo|https://gymnasium.farama.org/environments/mujoco/
Q: How do you linearize numerically? => Finite differences of the dynamics around (x*, u*).
Q: What is the upright equilibrium state? => Pole angle 0 with zero velocities.
Q: Is the open-loop upright pole stable? => No, A has an eigenvalue with positive real part.
X: Compute eigenvalues of A and confirm instability.
R: Linearization yields the (A,B) pair that LQR needs.
## P4.2
month: 4
title: Practice: Balance with LQR
steps: Compute LQR gain K with scipy.linalg.solve_continuous_are (or discrete) and balance the pole.
links: SciPy|https://docs.scipy.org/doc/scipy/reference/generated/scipy.linalg.solve_continuous_are.html
Q: What are Q and R in the LQR cost? => State and input penalty matrices.
Q: What is u in terms of K? => u = -K x.
Q: What happens with larger R? => Less aggressive control, slower response.
X: Plot the pole angle for several (Q,R) choices.
R: LQR balances a linearized cart-pole; implement it until you can do it from memory.
## P4.3
month: 4
title: Practice: Replace LQR with MPC
steps: Implement a simple MPC (e.g. with CVXPY and the linearized model) with a limit on how hard the cart can push.
links: CVXPY|https://www.cvxpy.org/
Q: What changes vs LQR? => You solve a finite-horizon constrained problem each step.
Q: Why does MPC re-plan every step? => To correct for model error and disturbances.
Q: What constraint did you add? => Force limit |u| ≤ u_max.
X: Show a case where LQR saturates and MPC respects the limit.
R: MPC handles constraints explicitly.
## P4.4
month: 4
title: Practice: Disturbance comparison
steps: Push the pole with a random force and compare how both controllers recover.
links: Gymnasium|https://gymnasium.farama.org/
Q: What metrics compare them? => Recovery time, peak input and failure rate.
Q: When might LQR fail where MPC succeeds? => When saturation matters.
Q: What is the computational cost difference? => MPC solves an optimization each step.
X: Run 20 pushes and tabulate failures.
R: You now have both classical controllers to compare against learned policies in Month 5.
## M4
month: 4
title: Month 4 milestone check
steps: Self-assess against the Month 4 milestone.
links: AA203|https://stanfordasl.github.io/aa203/sp2526/
Q: Can you write a goal as a cost function? => Yes: sum of squared error and effort terms.
Q: Can you explain DP and the Bellman equation? => Optimal cost-to-go satisfies J(x) = min_u [g + J(f(x,u))].
Q: Why does MPC re-plan at every step? => Feedback against disturbances/model errors.
Q: What does reachability guarantee? => That states from which the system cannot avoid danger are identified, so safe sets can be enforced.
X: Implement discrete LQR from scratch without looking.
R: You know the classical half of the stack.
## P5.1
month: 5
title: Practice: Train PPO on a MuJoCo task
steps: Install Stable-Baselines3 and Gymnasium[mujoco]. Train PPO on Hopper-v4/v5 and plot the learning curve.
links: Stable-Baselines3|https://stable-baselines3.readthedocs.io/|Gymnasium MuJoCo|https://gymnasium.farama.org/environments/mujoco/
Q: What does the learning curve show? => Episode return vs environment steps.
Q: Why average over seeds? => RL results are high variance.
Q: Which PPO hyperparameters matter first? => Learning rate, n_steps, clip range.
X: Plot the curve with at least 3 seeds if time permits.
R: PPO is the baseline policy-gradient method.
## P5.2
month: 5
title: Practice: Train SAC and compare
steps: Train SAC on the same environment and compare steps needed to reach a given return.
links: Stable-Baselines3|https://stable-baselines3.readthedocs.io/
Q: Why is SAC more sample efficient? => Off-policy replay with entropy-regularized actor-critic.
Q: What is a downside? => More memory/compute per step.
Q: What do you compare? => Return vs steps and wall-clock time.
X: Report steps to reach return 1000.
R: Off-policy methods tend to be more sample efficient than PPO.
## P5.3
month: 5
title: Practice: Record 50 LQR episodes
steps: Go back to your cart-pole from Month 4. Record 50 episodes of your LQR controller balancing it and store (state, action) pairs.
links: Gymnasium|https://gymnasium.farama.org/
Q: What data do you need? => Observations and expert actions.
Q: Why 50 episodes? => A small demo set mirrors real teleoperation data amounts.
Q: How to vary data? => Randomize initial states.
X: Save the dataset to .npz.
R: You have expert demonstrations from a controller you designed.
## P5.4
month: 5
title: Practice: Behavior cloning and failure analysis
steps: Train a small neural network to copy the LQR controller with behavior cloning. Push the cloned policy off its usual path and watch it fail, then explain why using AA203 lecture 15.
links: PyTorch|https://pytorch.org/
Q: Why does the cloned policy fail off-path? => Covariate shift: it never saw those states.
Q: How can DAgger help? => Query LQR for labels on states visited by the cloned policy.
Q: What would you measure? => Success rate vs push magnitude.
X: Write a 3-sentence failure analysis.
R: An LQR controller and a learned clone make a strong interview comparison.
## M5
month: 5
title: Month 5 milestone check
steps: Self-assess against the Month 5 milestone.
links: CS224R|https://cs224r.stanford.edu/
Q: Imitation learning vs RL? => IL learns from demonstrations; RL from reward interaction.
Q: Can you train PPO and SAC and read a learning curve? => Yes (Practice 16-17).
Q: Why does BC drift and how does DAgger fix it? => Covariate shift; DAgger adds expert labels on the learner's states.
Q: Model-free vs model-based RL? => Model-free is simpler and robust; model-based is more sample efficient but suffers from model bias.
Q: How does RL connect to dynamic programming? => RL approximates DP without knowing the model.
X: Draw the concept map connecting DP, LQR, MPC, Q-learning and policy gradients.
R: You can explain and train both learning families.
## P6.1
month: 6
title: Final project (1/5) - Choose your tier and set up
steps: Pick a tier: $0 simulation with LeRobot, $122 one SO-101 follower arm (3D-printed), or $230 leader+follower pair. Install LeRobot and run its quickstart.
links: LeRobot|https://huggingface.co/docs/lerobot/index|SO-ARM100|https://github.com/TheRobotStudio/SO-ARM100
Q: Which tier fits you and why? => Personal; the $0 simulation tier is a valid full project.
Q: What is LeRobot? => Hugging Face's open-source robot learning library with datasets and pretrained policies.
Q: What deliverable do all tiers share? => GitHub repo with README, a 30-second video, and one honest paragraph about what failed.
X: Create an empty GitHub repo plan (README outline with the three numbers).
R: Whatever tier you choose, the deliverable is the same.
## P6.2
month: 6
title: Final project (2/5) - Data collection or dataset
steps: Simulation tier: pick a LeRobot simulated task and dataset. Hardware tiers: record 50 demonstrations of one simple task (block in cup).
links: LeRobot|https://huggingface.co/docs/lerobot/index
Q: How many demonstrations does the article suggest for hardware? => 50 of one simple task.
Q: Why keep the task simple? => Fewer variables, so you can measure how it breaks.
Q: What do you log? => Number of demos and conditions.
X: Verify your dataset loads and count episodes.
R: Good data collection is the foundation of imitation learning.
## P6.3
month: 6
title: Final project (3/5) - Train an imitation policy
steps: Train an imitation learning policy (e.g. ACT or Diffusion Policy in LeRobot) on your data.
links: LeRobot|https://huggingface.co/docs/lerobot/index
Q: What is the training loss? => Typically regression to expert actions (ACT adds a CVAE objective; diffusion uses denoising).
Q: How do you know it trained? => Loss falls and rollouts improve.
Q: What do you log? => Training steps and wall-clock time.
X: Record the number of training steps.
R: You now have a trained policy.
## P6.4
month: 6
title: Final project (4/5) - Evaluate and measure how it breaks
steps: Measure (1) success rate on the trained task, (2) success rate after changing one thing in the scene, (3) how many demonstrations/training steps it took.
links: LeRobot|https://huggingface.co/docs/lerobot/index
Q: Which number do interviewers care about most? => Success rate after changing one thing.
Q: What can you change? => Object position, color or lighting.
Q: Why measure failure? => Everyone can make a demo work once.
X: Run at least 20 trials per condition.
R: Evaluation with numbers distinguishes real work from a demo.
## P6.5
month: 6
title: Final project (5/5) - Write-up, video, publish
steps: Write the README, record a 30-second video and write one honest paragraph about what failed. Publish to GitHub yourself (this app does not push anything).
links: GitHub|https://github.com
Q: What are the three required numbers? => Task success rate, success rate under one scene change, demonstrations or training steps.
Q: What should the failure paragraph contain? => What failed, why you think so, what you'd try next.
Q: Where should the repo be shared? => Publicly, to build a network.
X: Share your project link with one person.
R: Posting what you build in public is your deadline and feedback loop.
## M6
month: 6
title: Month 6 milestone check
steps: Self-assess against the Month 6 milestone and plan to watch one seminar a week.
links: Robotics Seminar archive|https://stanfordasl.github.io/robotics_seminar/
Q: What is a robot foundation model and what data does it need? => A large pretrained policy; needs huge, varied data.
Q: What is action chunking and why did it help? => Predicting several actions at once, reducing compounding error.
Q: Can you train and evaluate an IL policy with LeRobot? => Yes (final project).
Q: How will you follow new research? => The Stanford Robotics Seminar archive, one talk per week.
X: Schedule one seminar per week in your calendar.
R: You finished the path: you can build, measure and explain robot learning.
## P7.0
month: 7
title: Start here: MIT 6.4210 Robotic Manipulation (Tedrake)
steps: Bonus month, shared by @0x_meden (x.com/0x_meden/status/2112588317925531663). Russ Tedrake's MIT 6.4210 "Robotic Manipulation: Perception, Planning, and Control" is fully free: 23 lectures (~30 h, Fall 2023) on YouTube, a free textbook website updated each semester, and Python notebook exercises built on Drake, his lab's open-source toolkit. It covers pick and place, geometric perception, grasping in clutter, motion planning, force control, deep perception, behavior cloning, RL, foundation models and tactile sensing. It builds directly on Month 2 (CS223A kinematics, Jacobians, force control) and Month 4 (AA203 planning/control); Lecture 18 (behavior cloning) is the idea behind ALOHA, Diffusion Policy and pi0 and pairs with Month 5's CS224R imitation-learning modules. Today: bookmark the book, clone the repo and run one notebook.
links: Textbook (free)|https://manipulation.csail.mit.edu|Lectures on YouTube|https://www.youtube.com/watch?v=v04rn86Dehg|Code & exercises|https://github.com/RussTedrake/manipulation|Drake|https://drake.mit.edu|Source post (@0x_meden)|https://x.com/0x_meden/status/2112588317925531663
Q: What are the three pillars in the course title? => Perception, planning and control.
Q: Which earlier months does it build on? => Month 2 (CS223A kinematics/force control) and Month 4 (AA203 planning and control); L18 links to Month 5 imitation learning.
Q: What toolkit do the exercises use? => Drake (open source, from Tedrake's lab), via Python notebooks.
X: Clone github.com/RussTedrake/manipulation (or open the book's notebook links) and run the first chapter's example.
R: A free MIT course that turns the arm math from Months 2 and 4 into full manipulation systems.
## P7.C
month: 7
title: Sidebar: the humanoid robotics career map (412 job posts)
steps: From @0x_meden's X Article "I read 412 humanoid robot jobs. Here's the real career map." (Oct 2026; 412 roles at Figure, 1X, Agility, Apptronik, Skild AI and Physical Intelligence). Only 2 of 412 require a PhD; 160 (39%) mention no degree at all. In engineering roles: Python 50%, C++ 32%, PyTorch 11%, ROS 7.5%, MuJoCo/Isaac 7.1%, RL 5.8%, imitation learning 5.8%. Median posted pay for AI/ML roles: $200K–$305.5K. Career ladder: data collection operator (1X, $28–36/hr) → service technician (Figure, $35–65/hr) → Robot Operator II (Agility, $102–133K) → AI researcher (1X, $200–300K) → staff teleop engineer (Agility, $190–296K) → Helix AI engineer (Figure, $200–400K). 12-month plan: months 1–2 Python, Linux, Stanford ENGR108; 3–4 CS223A + MuJoCo; 5–6 C++, AA203 control, then RL; 7–8 SO-101 arm ($122–230) + 50 LeRobot demos + an imitation policy; 9 measure success rate and robustness and write up the failures; 10–12 apply via operator, technician, residency or internship roles. Figures are the author's; check current postings.
links: Career map article (@0x_meden)|https://x.com/i/status/2107423031588946035|Post sharing MIT 6.4210|https://x.com/0x_meden/status/2112588317925531663|LeRobot|https://huggingface.co/docs/lerobot/index|SO-ARM100 / SO-101|https://github.com/TheRobotStudio/SO-ARM100
Q: How many of the 412 roles required a PhD? => 2.
Q: Which skill appeared most in engineering roles? => Python (50%), then C++ (32%).
Q: What are the entry rungs of the ladder? => Data collection operator and service technician roles, then robot operator.
Q: What should months 7–9 of the plan produce? => An SO-101 arm, 50 LeRobot demos, a trained imitation policy, and a write-up of its success rate, robustness and failures.
X: Map your own progress in this app onto the 12-month plan and pick one entry-level role to target.
R: The bar is a demonstrated robot project plus Python/C++, not a PhD.
## M7
month: 7
title: Month 7 milestone check
steps: Self-assess after MIT 6.4210.
links: Textbook|https://manipulation.csail.mit.edu
Q: Can you script a pick and place in Drake with differential IK? => Yes if you completed L3–5 exercises.
Q: Can you estimate an object's pose from a point cloud and explain ICP's failure modes? => Yes (L6–7).
Q: Can you explain behavior cloning, compounding error and action chunking? => Yes (L18).
X: Rate yourself 1-5 per line; revisit weak lectures.
R: You can now build an end-to-end manipulation system in simulation.
## P8.0
month: 8
title: Start here: MIT 6.8210 Underactuated Robotics (Tedrake)
steps: Bonus month, shared by @0x_meden (x.com/0x_meden/status/2112875067273068637). Russ Tedrake's MIT 6.8210 "Underactuated Robotics" (Spring 2024) is free: 21 recorded lectures (about 28 h) on his YouTube channel, a free 21-chapter textbook, and Python notebooks built on Drake. "Underactuated" means the robot has fewer motors than ways it can move: a walking humanoid can't push its body anywhere it wants, so it falls forward and catches itself. Topics: pendulums, acrobots, cart-poles, quadrotors, dynamic programming, LQR, Lyapunov analysis, trajectory optimization, control through contact, humanoids (L16, from the professor who led MIT's DARPA Robotics Challenge Atlas team), motion planning, robust/stochastic control and imitation learning. It is the deep version of Month 4 (AA203): same LQR/DP/MPC ideas, applied to walking and balancing robots. It pairs with Month 7 (same instructor, same Drake toolkit). Note: the Spring 2024 recordings skip lectures 2, 3 and 13 (they were not posted), so the numbering jumps; the book covers that material (Ch 2 Simple Pendulum, Ch 3 Acrobots/Cart-Poles, Ch 8 LQR). Today: bookmark the book, read Ch 1-2, and open one notebook.
links: Textbook (free)|https://underactuated.mit.edu|Lecture 1 on YouTube|https://www.youtube.com/watch?v=uyyBT-MHhLE|Course notebooks repo|https://github.com/RussTedrake/underactuated|Drake|https://github.com/RobotLocomotion/drake|Source post (@0x_meden)|https://x.com/0x_meden/status/2112875067273068637|Related: Month 4 (AA203 control)|https://rgoldman73-dev.github.io/robotics-learning/#/modules?month=4|Related: Month 7 (MIT 6.4210, same instructor)|https://rgoldman73-dev.github.io/robotics-learning/#/modules?month=7
Q: What does "underactuated" mean? => The robot cannot command arbitrary accelerations in all its degrees of freedom (fewer actuators than DOFs, or limits), e.g. a humanoid's floating base.
Q: Which earlier month does this course deepen? => Month 4 (AA203 optimal control: DP, LQR, MPC, trajectory optimization).
Q: Which lecture is about humanoids? => Lecture 16 (79 minutes), taught by the professor who led MIT's Atlas team in the DARPA Robotics Challenge.
X: Read underactuated.mit.edu Ch 2 (The Simple Pendulum) to cover the unrecorded lectures 2-3, and run its first notebook.
R: The math behind robots that walk, run and flip: exploit the dynamics instead of fighting them.
## P8.1
month: 8
title: Project: acrobot / cart-pole swing-up, stabilize and verify
steps: Pull Months 4 and 8 together on one system (cart-pole from Month 4, or the acrobot from the book). 1) Swing up with energy shaping (L5). 2) Compute a swing-up trajectory with direct collocation (L10-11). 3) Track it with TVLQR and finish with LQR at the top (L12). 4) Estimate the region of attraction of the final LQR controller by simulation sweep or SOS (L7-9). 5) Add random pushes and noise and report success rate. Put it on GitHub with plots and one honest paragraph about what failed.
links: Ch 3 Acrobots, Cart-Poles, and Quadrotors|https://underactuated.mit.edu/acrobot.html|Ch 10 Trajectory Optimization|https://underactuated.mit.edu/trajopt.html|Ch 9 Lyapunov Analysis|https://underactuated.mit.edu/lyapunov.html
Q: Why combine trajectory optimization with TVLQR? => The optimized trajectory is open-loop; TVLQR adds feedback to stay on it under disturbances.
Q: What does the region-of-attraction estimate tell you? => From which states the final LQR controller is guaranteed (or empirically shown) to balance.
Q: Which number matters most in the write-up? => Success rate under disturbances, not the single best run.
X: Ship the repo with a swing-up GIF, the ROA plot and the disturbance success rate.
R: One system, end to end: plan, track, balance, verify.
## M8
month: 8
title: Month 8 milestone check
steps: Self-assess after MIT 6.8210.
links: Textbook|https://underactuated.mit.edu
Q: Can you explain why a humanoid is underactuated and what ZMP/centroidal dynamics are? => Yes (L1, L16).
Q: Can you balance an underactuated system with LQR and swing it up? => Yes (L5, P8.1).
Q: Can you set up a direct-collocation trajectory optimization and stabilise it with TVLQR? => Yes (L10-12).
Q: Can you state what a Lyapunov function certifies? => Yes (L7-9).
X: Rate yourself 1-5 per line; revisit weak lectures.
R: You now have the control half of the humanoid stack, the part learning sits on top of.
## P9.0
month: 9
title: Start here: ETH Zurich Robot Learning (Oier Mees, Spring 2026)
steps: Bonus month, shared by @rahim_mirani (x.com/rahim_mirani/status/2112282923395379537). ETH Zurich 263-5911-00L "Robot Learning: From Fundamentals to Foundation Models" (Spring 2026, Oier Mees): 11 recorded lectures plus 10 recorded guest talks, slides for every lecture, and four coding homeworks on GitHub. It runs MDPs and imitation learning, then RL, generative models (diffusion), sequence models, world models, generalist policies (VLAs), embodied reasoning and open problems. Guest speakers include Quan Vuong (Physical Intelligence co-founder), Cheng Chi (Diffusion Policy/UMI), Ted Xiao (RT-1/RT-2), Scott Reed (Gato, NVIDIA), Archit Sharma (Gemini Deep Think) and Lucas Beyer (ViT). Each lecture module lists that week's three paper-discussion readings. Guest talks follow the lecture they accompanied. It is the 2026 follow-on to Month 5 (CS224R, AA203 learning) and Month 6 (seminars), and is the most current material in the path. Today: open the course page and clone the homework repo.
links: Course page (slides + recordings)|https://cvg.ethz.ch/lectures/Robot-Learning/|Homework repo|https://github.com/mees-robot-learning-course/ethz-course-2026|Lecture 1 on YouTube|https://www.youtube.com/watch?v=X0k14u6pSxw|Oier Mees|https://www.oiermees.com|Source post (@rahim_mirani)|https://x.com/rahim_mirani/status/2112282923395379537|Related: Month 5 (imitation learning & RL)|https://rgoldman73-dev.github.io/robotics-learning/#/modules?month=5|Related: Month 6 (frontier seminars)|https://rgoldman73-dev.github.io/robotics-learning/#/modules?month=6
Q: What is the course arc? => MDPs/imitation -> RL -> generative models -> sequence/world models -> generalist policies (VLAs) -> reasoning and open problems.
Q: What earlier months does it build on? => Month 5 (imitation learning and RL) and Month 6 (foundation-model seminars); L7 links to Month 7/8 imitation-learning material.
Q: Where are the exercises? => Four homeworks in github.com/mees-robot-learning-course/ethz-course-2026 (PyTorch, control/MDPs, imitation learning, RL).
X: Clone the homework repo and get hw1 running.
R: A current, free course from fundamentals to VLAs, with guest talks from the people building them.
## P9.1
month: 9
title: Project: ETH homeworks 2-4 + one paper replication
steps: Complete the course's coding homeworks hw2 (robot control & MDPs), hw3 (imitation learning) and hw4 (reinforcement learning) from the ETH repo. Then pick one paper from the weekly paper-discussion lists (e.g. Implicit BC, ACT/ALOHA, Decision Transformer) and replicate its key result in simulation at small scale with LeRobot or your own code. Report success rate, a perturbation test, and what didn't replicate.
links: Homework repo|https://github.com/mees-robot-learning-course/ethz-course-2026|Course page (paper lists)|https://cvg.ethz.ch/lectures/Robot-Learning/|LeRobot|https://huggingface.co/docs/lerobot/index
Q: Why replicate a paper rather than only read it? => Replication exposes hidden details, hyperparameters and failure modes, and makes a strong portfolio piece.
Q: What must the report include? => Success rate, a robustness/perturbation test, and an honest account of what didn't replicate.
Q: Which homework covers DAgger-style imitation? => hw3 imitation learning.
X: Push the homeworks and replication to GitHub with a README.
R: Homework + replication = proof you can do modern robot learning, not just watch it.
## M9
month: 9
title: Month 9 milestone check
steps: Self-assess after ETH Robot Learning.
links: Course page|https://cvg.ethz.ch/lectures/Robot-Learning/
Q: Can you explain covariate shift, causal confusion and DAgger? => Yes (L3).
Q: Can you explain why diffusion policies and action chunking help imitation learning? => Yes (L6-7).
Q: Can you explain what a VLA is and how generalist policies are trained? => Yes (L9).
Q: Can you describe what a world model is and its main failure mode? => Yes (L8).
X: Rate yourself 1-5 per line; revisit weak lectures.
R: You can follow and critique current robot learning research.
