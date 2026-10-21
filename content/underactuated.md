## 1
title: Robot dynamics and model-based control
topics: Fully-actuated vs underactuated, manipulator equations, feedback equivalence, why walking robots are underactuated
read: underactuated.mit.edu Ch 1 "Fully-actuated vs Underactuated Systems" (intro.html) and Appendix B Multi-Body
Q: What makes a system underactuated? => It cannot command an arbitrary instantaneous acceleration in every degree of freedom: it has fewer independent actuators than configuration DOFs (or input limits), so B in the manipulator equation is not full rank.
Q: Write the manipulator equations. => M(q) qdd + C(q, qd) qd = tau_g(q) + B u.
Q: Why is a walking humanoid underactuated even with a motor in every joint? => The floating base (its 6-DOF body pose) has no actuator; it can only be moved through contact forces with the ground.
X: Write M(q), C and tau_g for a simple pendulum and a 2-link arm, then check against the Month 2 CS223A dynamics you derived.
R: Underactuated control means exploiting the natural dynamics rather than cancelling them; the robot cannot simply be pushed wherever you want.
## 4
title: Dynamic programming II
topics: Optimal control as graph search, value iteration, continuous dynamic programming, Hamilton-Jacobi-Bellman
read: underactuated.mit.edu Ch 7 "Dynamic Programming" (dp.html)
Q: What does the Bellman equation say? => The optimal cost-to-go is the minimum over actions of the instantaneous cost plus the cost-to-go of the next state.
Q: What is the HJB equation? => The continuous-time Bellman equation: 0 = min_u [ l(x,u) + dJ*/dx f(x,u) ].
Q: Why does value iteration on a grid not scale? => The curse of dimensionality: the number of grid cells grows exponentially with state dimension.
X: Run value iteration on a discretised pendulum (or double integrator) in the course notebook and plot the resulting policy.
R: DP gives the globally optimal feedback policy, but only for low-dimensional systems; it's the same Bellman idea as AA203 L7 and RL in Month 5.
## 5
title: Acrobots, cart-poles, and quadrotors I
topics: Acrobot and cart-pole dynamics, linearization, LQR balancing, partial feedback linearization, swing-up via energy shaping, quadrotors
read: underactuated.mit.edu Ch 3 "Acrobots, Cart-Poles, and Quadrotors" (acrobot.html)
Q: How do you balance a cart-pole at the top? => Linearize the dynamics about the upright fixed point and design an LQR controller.
Q: What is energy-shaping swing-up? => Pump energy into the system until its total energy matches the upright state's energy, then hand over to LQR.
Q: What is partial feedback linearization? => Using the actuated DOF to cancel dynamics so one coordinate behaves like a double integrator, leaving the unactuated dynamics.
X: Reuse your Month 4 cart-pole: add an energy-shaping swing-up controller and switch to LQR near the top.
R: The canonical underactuated systems: swing up with energy, balance with LQR.
## 6
title: Dynamic programming III
topics: Function approximation for DP, fitted value iteration, LQR as a special case of DP, connections to RL
read: underactuated.mit.edu Ch 7 (continuous DP, extensions) and Ch 8 "Linear Quadratic Regulators" (lqr.html)
Q: Why is LQR a special case of DP? => For linear dynamics and quadratic cost the cost-to-go is exactly quadratic, x'Sx, and the Riccati equation solves the HJB.
Q: What is fitted value iteration? => Represent the value function with a function approximator (e.g. a neural net) and repeatedly fit it to Bellman backups on sampled states.
Q: How does this connect to deep RL? => Deep Q-learning and actor-critic methods are approximate DP from samples without a known model.
X: Derive the continuous-time algebraic Riccati equation from the HJB with J = x'Sx.
R: DP + approximation = the bridge from classical optimal control to deep RL.
## 7
title: Lyapunov analysis I
topics: Stability definitions, Lyapunov functions, energy as a Lyapunov candidate, regions of attraction
read: underactuated.mit.edu Ch 9 "Lyapunov Analysis" (lyapunov.html)
Q: What are the conditions on a Lyapunov function? => V(x) positive definite and Vdot(x) negative (semi)definite along system trajectories.
Q: What does a region of attraction mean? => The set of initial states from which trajectories converge to the fixed point.
Q: Why do safety teams care? => A Lyapunov certificate is a proof the controller stays stable over a region, not just in tested cases.
X: Show that total energy is a Lyapunov function for the damped pendulum and estimate its region of attraction.
R: Lyapunov functions turn "it seems stable in sim" into a proof.
## 8
title: Computing Lyapunov functions I
topics: Lyapunov for linear systems, sums-of-squares (SOS) optimization, semidefinite programming
read: underactuated.mit.edu Ch 9 (lyapunov.html), Appendix C Optimization
Q: How do you find a Lyapunov function for a linear system? => Solve the Lyapunov equation A'P + PA = -Q for P positive definite; V = x'Px.
Q: What is sums-of-squares optimization? => Searching for polynomials certified non-negative by writing them as sums of squares, which becomes a semidefinite program.
Q: Why use SOS for nonlinear systems? => It lets you search for polynomial Lyapunov functions and certify regions of attraction with convex optimization.
X: Use the course notebook (Drake MathematicalProgram) to compute a quadratic Lyapunov function for a linearized pendulum.
R: Convex optimization can search for stability certificates automatically.
## 9
title: Computing Lyapunov functions II
topics: Region-of-attraction estimation with SOS, S-procedure, verifying LQR controllers on nonlinear systems
read: underactuated.mit.edu Ch 9 (lyapunov.html)
Q: What does the S-procedure let you do? => Impose a non-negativity condition only within a region (e.g. a sublevel set) by adding multiplier polynomials.
Q: Why verify LQR on the nonlinear system? => LQR is designed on the linearization; only nearby states are guaranteed to be stabilised.
X: Estimate the region of attraction of your LQR cart-pole or pendulum controller (simulation sweep or SOS notebook).
R: Certified regions of attraction tell you where your controller actually works.
## 10
title: Trajectory optimization I
topics: Direct transcription, direct shooting, direct collocation, nonlinear programming
read: underactuated.mit.edu Ch 10 "Trajectory Optimization" (trajopt.html)
Q: Shooting vs transcription? => Shooting optimises only the inputs and simulates the states; transcription treats states and inputs as decision variables with dynamics as constraints.
Q: What is direct collocation? => Representing trajectories with polynomials and enforcing dynamics at collocation points, giving accurate, sparse NLPs.
Q: Which Month 4 idea is this? => AA203's direct methods for optimal control (L2-6).
X: Use Drake's DirectCollocation to swing up a pendulum or acrobot in the course notebook.
R: Trajectory optimization finds locally optimal motions for systems too big for DP.
## 11
title: Trajectory optimization II
topics: Constraints, initialization, local minima, differential dynamic programming / iLQR, solver choices
read: underactuated.mit.edu Ch 10 (trajopt.html)
Q: What is iLQR / DDP? => An iterative method that alternates rolling out a trajectory and solving a time-varying LQR on its local quadratic approximation.
Q: Why does initialization matter? => The problems are non-convex; a poor initial guess leads to bad local minima or infeasibility.
X: Implement a small iLQR for the cart-pole swing-up and compare with your collocation solution.
R: Trajectory optimization is powerful but local; good initial guesses and constraints are half the work.
## 12
title: Trajectory stabilization
topics: Time-varying LQR (TVLQR) along a nominal trajectory, model predictive control, funnels
read: underactuated.mit.edu Ch 8 "Linear Quadratic Regulators" (finite-horizon/time-varying sections) and Ch 10
Q: Why can't you just play back an optimized trajectory open-loop? => Model errors and disturbances make the state drift off the nominal; feedback is needed.
Q: What does TVLQR do? => Linearizes around the nominal trajectory at each time and computes time-varying feedback gains to stay on it.
Q: How is MPC related? => MPC re-solves the trajectory optimization online at each step instead of using fixed gains.
X: Stabilize your swing-up trajectory with TVLQR and push it with random disturbances.
R: Plan with trajectory optimization, track with TVLQR or MPC.
## 14
title: Hybrid trajectory optimization
topics: Hybrid systems, impacts and mode switches, walking as a hybrid system, limit cycles
read: underactuated.mit.edu Ch 4 "Simple Models of Walking and Running" (simple_legs.html), Ch 16 limit cycles (limit_cycles.html), Ch 17 contact.html (hybrid systems)
Q: What makes walking a hybrid system? => Continuous swing dynamics are interrupted by discrete impact events when a foot touches down.
Q: What is a limit cycle? => A periodic orbit that nearby trajectories converge to; a steady gait is one.
Q: How do you optimise across modes? => Fix the mode sequence and optimise each phase with transition (guard/reset) constraints.
X: Simulate the rimless wheel or compass gait from the book and find its stable limit cycle.
R: Legged robots are hybrid systems; gaits are limit cycles.
## 15
title: Planning and control through contact
topics: Contact-implicit trajectory optimization, complementarity constraints, combinatorial structure of contact
read: underactuated.mit.edu Ch 17 "Planning and Control through Contact" (contact.html)
Q: What is a complementarity constraint? => Two non-negative quantities whose product is zero, e.g. contact force > 0 only when the distance is 0.
Q: What does contact-implicit optimization avoid? => Specifying the contact mode sequence in advance; the solver discovers when contacts happen.
Q: How does this link to MIT 6.4210 (Month 7)? => Manipulation in clutter and grasping face the same non-smooth contact problem.
X: Write the complementarity conditions for a block sliding on a table with friction.
R: Contact is where control gets combinatorial; contact-implicit methods let the optimizer choose contacts.
## 16
title: Humanoid robots
topics: Centroidal dynamics, center of pressure and ZMP, ZMP-based walking, footstep planning, whole-body control, Atlas in the DARPA Robotics Challenge
read: underactuated.mit.edu Ch 5 "Highly-articulated Legged Robots" (humanoids.html)
Q: What is the zero-moment point (ZMP)? => The point on the ground where the resultant contact force acts with no horizontal moment; keeping it inside the support polygon keeps feet flat.
Q: What are centroidal dynamics? => The dynamics of the robot's total linear and angular momentum about its center of mass, driven only by contact forces and gravity.
Q: What does whole-body control solve? => A QP each control step that picks joint torques and contact forces to track tasks while respecting dynamics, friction and limits.
X: Simulate the linear inverted pendulum model and plan a CoM trajectory that keeps the ZMP inside a sequence of footsteps.
R: The professor who led MIT's DRC Atlas team explains how humanoid controllers really work; this is the math behind the Figure, 1X and Apptronik control jobs.
## 17
title: Mixed-discrete and continuous optimization
topics: Mixed-integer programming, graphs of convex sets (GCS), footstep and motion planning with discrete choices
read: underactuated.mit.edu Ch 17 (leveraging combinatorial optimization) and Appendix C
Q: When do you need integer variables? => When the problem has discrete choices: which contact surface, which side of an obstacle, which mode.
Q: What are graphs of convex sets? => A formulation where nodes are convex regions and edges connect them, letting shortest-path style planning be solved with strong convex relaxations.
X: Formulate footstep planning across three stepping stones as a mixed-integer problem on paper.
R: Many hard robotics choices are combinatorial; modern MIP/GCS methods handle them with guarantees.
## 18
title: Sampling-based (kinodynamic) motion planning
topics: RRT, RRT*, PRM, kinodynamic planning, distance metrics for dynamic systems
read: underactuated.mit.edu Ch 12 "Sampling-based motion planning" (planning.html)
Q: How does an RRT grow? => Sample a random state, find the nearest tree node, extend toward the sample, repeat.
Q: What makes kinodynamic planning harder? => The path must satisfy the dynamics, so you cannot connect two states with a straight line.
Q: Which Month 7 lecture covered this for arms? => MIT 6.4210 L12, sampling-based motion planning.
X: Implement a basic RRT for a 2D point among obstacles, then try it on pendulum swing-up in (theta, thetadot).
R: Sampling finds feasible paths in high-dimensional spaces; dynamics make the connections hard.
## 19
title: Stochastic dynamics
topics: Noise and uncertainty, Markov chains on continuous states, stochastic stability, master equation
read: underactuated.mit.edu Ch 13 "Robust and Stochastic Control" (robust.html)
Q: Why model dynamics as stochastic? => Real robots face uncertain terrain, sensor noise and disturbances; deterministic stability can be misleading.
Q: What is a metastable system? => One that stays near an attractor for a long but finite time before noise drives it away, like a walker that eventually falls.
X: Add random disturbances to your compass-gait/rimless-wheel simulation and measure the mean steps to failure.
R: With noise, "stable" becomes "how long until failure."
## 20
title: Stochastic control
topics: Optimal control under noise, LQG, expected cost, risk
read: underactuated.mit.edu Ch 13 (robust.html)
Q: What is the certainty-equivalence result for LQG? => With linear dynamics, quadratic cost and Gaussian noise, the optimal controller is LQR applied to the Kalman-filter state estimate.
Q: Why might you optimise risk rather than expected cost? => Rare catastrophic failures (falls, collisions) matter more than average performance.
X: Compare LQR performance on your cart-pole with and without process noise; plot the cost distribution.
R: Stochastic control plans for uncertainty instead of ignoring it.
## 21
title: Robust control and policy search
topics: Robust control, H-infinity ideas, domain randomization, policy search, model-free policy gradients
read: underactuated.mit.edu Ch 11 "Policy Search" (policy_search.html), Ch 13 robust.html, Ch 20 "Model-Free Policy Search" (rl_policy_search.html)
Q: What is policy search? => Directly optimising the parameters of a controller (e.g. a neural network) for a cost, rather than computing a value function.
Q: How does domain randomization relate to robust control? => Training over randomized dynamics approximates optimising a policy that works across the uncertainty set.
Q: Which Month 5 method is model-free policy search? => Policy gradients / PPO from CS224R and AA203.
X: Train a small policy for the cart-pole with random search or PPO under randomized pole mass and compare robustness to LQR.
R: RL for locomotion is robust policy search; this lecture connects the control view to the RL view.
## 22
title: Output feedback
topics: Partial observability, state estimation, observers, Kalman filtering, output-feedback controllers
read: underactuated.mit.edu Ch 15 "Output Feedback" (output_feedback.html) and Ch 19 "State Estimation" (state_estimation.html)
Q: What is output feedback? => Control using only measured outputs (sensors) rather than the full state.
Q: Why is it harder? => The controller must estimate the state, and the estimator and controller interact.
Q: Which earlier month covered sensors and drift? => Month 3 (EE259 IMUs/dead reckoning).
X: Add a noisy angle-only sensor to your pendulum and stabilize it with a Kalman filter + LQR.
R: Real robots never see their full state; estimation is part of control.
## 23
title: Feedback motion planning
topics: LQR-trees, funnels, combining planning with verified feedback, online planning
read: underactuated.mit.edu Ch 14 "Feedback Motion Planning" (feedback_motion_planning.html)
Q: What is an LQR-tree? => A tree of trajectories each stabilised by TVLQR with verified funnels, covering the state space with certified feedback.
Q: What is a funnel? => A time-varying region of attraction around a trajectory: start inside it and you are guaranteed to reach the end region.
X: Sketch how you'd sequence funnels to get the cart-pole from any start to upright.
R: Combine planning (many trajectories) with verification (funnels) for global, certified feedback.
## 24
title: Imitation learning, foundation models and course wrap-up
topics: Behavior cloning, diffusion policy, visuomotor policies, foundation models for robots, how learning and control fit together
read: underactuated.mit.edu Ch 21 "Imitation Learning" (imitation.html)
Q: Why did diffusion policy help behavior cloning? => It models multimodal action distributions and predicts action sequences, avoiding averaging between demonstrated modes.
Q: Where does model-based control still win over learned policies? => Low-level, safety-critical, dynamic tasks where models are good and guarantees matter.
Q: Which other modules cover this? => Month 5 CS224R imitation learning, Month 7 MIT 6.4210 L18, and Month 9 ETH L3 and L6.
X: Write one paragraph: for a humanoid, which layers would you learn and which would you control with optimization, and why?
R: The course ends where learning meets control; you now know the control half deeply.
