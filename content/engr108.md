## 1
read: VMLS Preface and start of Chapter 1 (pp. xi, 3)
Q: Why does the course treat linear algebra as a tool for applications rather than as abstract proofs? => Vectors and matrices are used to represent data (time series, images, features, states) and to compute with it; the goal is to be able to formulate and solve real problems.
Q: Name two kinds of real-world data a vector can hold. => E.g. a time series of sensor readings, pixel values of an image, a feature vector for a data point, the state of a robot (positions and velocities).
X: Write down a 5-vector that represents your last 5 days of sleep hours and say what each entry means.
R: Applied linear algebra = representing real data as vectors/matrices and computing with them. The course builds from vectors to least squares to control and estimation.
## 2
read: VMLS 1.1 Vectors
Q: What is an n-vector, and what does "dimension" mean? => An ordered list of n numbers; n is its dimension (size).
Q: Give a robotics example of a vector with 6 entries. => E.g. 6 joint angles of an arm, or a 3D position plus 3D velocity.
Q: What does the notation x_i mean, and what is the zero vector? => x_i is the i-th entry (element); the zero vector has all entries 0.
X: In NumPy create np.array([1.,2.,3.]); print its length, its 2nd entry (watch zero-based indexing), and np.zeros(3).
R: A vector is an ordered list of numbers. Indexing, dimension and special vectors (zeros, ones, unit vectors) are the vocabulary for everything later.
## 3
read: VMLS 1.1 Vectors (examples)
Q: Why can an image or a document be treated as a vector? => You can stack pixel intensities (or word counts) into one long list of numbers, so vector tools (distance, angle) apply.
Q: What is a unit vector e_i? => The vector with a 1 in position i and 0 elsewhere.
X: Represent the sentence "robots learn robots" as a word-count vector over the vocabulary [robots, learn, from, data].
R: Many kinds of data become vectors; choosing the representation is the first modeling step.
## 4
read: VMLS 1.2 Vector addition, 1.3 Scalar-vector multiplication
Q: How is vector addition defined for two n-vectors? => Entry by entry: (a+b)_i = a_i + b_i. Both must have the same size.
Q: What is a linear combination of vectors a_1..a_k? => beta_1 a_1 + ... + beta_k a_k with scalar coefficients beta_i.
Q: Geometrically, what does a + b look like in 2D? => Place b's tail at a's head (parallelogram rule); the sum goes from the origin to the far corner.
X: In NumPy, compute 2*a - 3*b for a=[1,2], b=[0,1] and sketch it on paper.
R: Addition and scalar multiplication generate linear combinations, the basic building block for almost every later idea.
## 5
read: VMLS 1.4 Inner product
Q: Define the inner product a^T b. => Sum of products of corresponding entries: a_1 b_1 + ... + a_n b_n.
Q: What does an inner product with a vector of all ones compute? => The sum of the entries.
X: Compute np.dot(a, b) for a=[1,2,3], b=[4,5,6] by hand, then verify in NumPy.
R: The inner product turns two vectors into one number and underlies sums, averages, weighted scores, norms and angles.
## 6
read: VMLS 1.5 Complexity of vector computations
Q: Roughly how many flops does an inner product of n-vectors take? => About 2n flops (n multiplications and n-1 additions).
Q: Why do we count flops? => To estimate how computation time scales with problem size independent of the machine.
X: Time np.dot on vectors of length 10^3, 10^5, 10^7 and note the scaling.
R: Vector operations cost O(n); flop counts tell you how algorithms scale.
## 7
read: VMLS 2.1 Linear functions
Q: State the superposition property of a linear function f. => f(alpha x + beta y) = alpha f(x) + beta f(y).
Q: Show that f(x)=a^T x is linear. => It's an inner product, so a^T(alpha x + beta y) = alpha a^T x + beta a^T y.
Q: What is the difference between linear and affine? => Affine = linear + constant offset, f(x) = a^T x + b.
X: Is f(x)=x_1 + 2 linear? Test superposition with a numerical example.
R: Linear functions are exactly inner products with a fixed vector; affine adds a constant.
## 8
read: VMLS 2.2 Taylor approximation, 2.3 Regression model
Q: What is the first-order Taylor approximation of f near z? => f(x) ≈ f(z) + grad f(z)^T (x - z), an affine function.
Q: What is a regression model y = x^T beta + v? => A prediction of an outcome y from features x via weights beta and offset v.
X: Linearize f(x)=x^2 around z=3 and compare with f(3.1).
R: Taylor approximation lets us replace a nonlinear function with an affine one locally; the same idea underlies linearizing robot dynamics in LQR.
## 9
read: VMLS 3.1 Norm
Q: Define the Euclidean norm of x. => ||x|| = sqrt(x_1^2 + ... + x_n^2) = sqrt(x^T x).
Q: Name two properties every norm satisfies. => E.g. homogeneity ||alpha x|| = |alpha| ||x||, triangle inequality, nonnegativity, definiteness.
X: Compute the norm of [3,4] by hand, then verify np.linalg.norm.
R: The norm measures a vector's size; the RMS value is norm/sqrt(n).
## 10
read: VMLS 3.2 Distance
Q: Define the distance between a and b. => dist(a,b) = ||a - b||.
Q: What is the nearest-neighbor idea? => Pick the data point with smallest distance to the query point.
X: Find, among three 2D points, which is closest to (1,1).
R: Distance = norm of the difference; many algorithms (k-NN, clustering, feature matching) rest on it.
## 11
read: VMLS 3.3 Standard deviation
Q: How is the standard deviation of a vector defined? => The RMS value of the de-meaned vector: std(x) = ||x - avg(x) 1|| / sqrt(n).
Q: Why is standard deviation useful with sensor data? => It quantifies spread or noise around the average.
X: Compute the standard deviation of 10 noisy measurements of a constant in NumPy.
R: Mean and standard deviation summarize location and spread; the std is the norm of the mean-removed signal.
## 12
read: VMLS 3.4 Angle
Q: How is the angle between nonzero vectors defined? => cos(theta) = a^T b / (||a|| ||b||).
Q: What does a^T b = 0 tell you? => The vectors are orthogonal (90 degrees).
Q: What does Cauchy-Schwarz say? => |a^T b| <= ||a|| ||b||, so the cosine is between -1 and 1.
X: Compute the angle between [1,0] and [1,1] in degrees.
R: Angles come from normalized inner products. Orthogonality (zero inner product) is key to least squares and QR.
## 15
read: VMLS 5.1 Linear dependence, 5.2 Basis
Q: When are vectors a_1..a_k linearly independent? => When the only combination equal to zero is the one with all coefficients zero.
Q: What is a basis of R^n? => A set of n linearly independent n-vectors; every vector is a unique combination of them.
X: Check whether [1,2],[2,4] are independent and explain.
R: Independence means no redundancy; a basis gives unique coordinates for every vector.
## 16
read: VMLS 5.3 Orthonormal vectors, 5.4 Gram-Schmidt algorithm
Q: What does orthonormal mean? => Vectors are mutually orthogonal and each has norm 1.
Q: What does Gram-Schmidt do? => Turns independent vectors into orthonormal ones spanning the same space by subtracting projections on earlier ones and normalizing.
X: Run Gram-Schmidt by hand on [1,1] and [1,0].
R: Gram-Schmidt builds orthonormal bases; it is the engine of the QR factorization.
## 17
read: VMLS 6.1 Matrices, 6.2 Zero and identity matrices, 6.3 Transpose, addition, and norm
Q: What is an m x n matrix? => A rectangular array with m rows and n columns.
Q: What does the transpose do? => Swaps rows and columns: (A^T)_ij = A_ji.
Q: What is the identity matrix? => Square matrix with ones on the diagonal and zeros elsewhere; I x = x.
X: Create a 2x3 matrix in NumPy and print A.T and A.shape.
R: Matrices organize data and functions; transpose, addition and identity are the basics.
## 18
read: VMLS 6.4 Matrix-vector multiplication
Q: How do you compute y = A x? => y_i = (row i of A) . x, equivalently y = x_1 * col_1 + ... + x_n * col_n.
Q: Why is y = A x a linear function? => A(alpha x + beta z) = alpha A x + beta A z.
X: Multiply [[1,2],[3,4]] by [1,1] by hand using both row and column views.
R: Matrix-vector multiplication = inner products with rows = linear combination of columns.
## 19
read: VMLS 6.4 Matrix-vector multiplication (examples)
Q: Which matrix computes the average of a vector's entries? => The row (1/n) 1^T.
Q: Give a matrix that reverses a 3-vector. => The anti-diagonal permutation matrix with ones on the anti-diagonal.
X: Build a 3x3 matrix that computes differences of consecutive entries.
R: Many familiar operations (sum, mean, difference, reversal) are matrix-vector products.
## 20
read: VMLS 7.2 Selectors
Q: What is a selector matrix? => A matrix whose rows are unit vectors; A x picks out entries of x.
Q: What does a downsampling matrix do? => Selects every k-th entry of a vector.
X: Write the selector matrix that picks entries 1 and 3 of a 4-vector.
R: Selectors pick, reorder and subsample entries via matrix multiplication.
## 21
read: VMLS 7.3 Incidence matrix
Q: How is a directed graph's incidence matrix defined? => Rows = nodes, columns = edges; +1 at the edge's head, -1 at its tail, 0 elsewhere.
Q: What does A^T x give for a potential vector x on nodes? => Differences of potentials across each edge.
X: Write the incidence matrix for a 3-node directed path 1->2->3.
R: Incidence matrices encode graph structure; transposed, they compute differences along edges.
## 22
read: VMLS 7.4 Convolution
Q: What is convolution of two vectors? => (a*b)_k = sum over i+j=k+1 of a_i b_j, polynomial-multiplication-like sliding product.
Q: How is convolution a matrix-vector product? => a*b = T(b) a where T(b) is a Toeplitz matrix built from b.
X: Convolve [1,2,3] with [1,-1] using np.convolve.
R: Convolution (filtering, smoothing) is linear and can be written with a Toeplitz matrix. It is the core of CNNs later.
## 23
read: VMLS 8.1 Linear and affine functions
Q: Which functions R^n -> R^m are linear? => Exactly f(x) = A x for some m x n matrix A.
Q: How do you find A from f? => Its columns are f(e_1), ..., f(e_n).
X: Find the matrix of the function that rotates a 2-vector by 90 degrees.
R: Every linear vector function is a matrix multiply; the columns are the images of the unit vectors.
## 24
read: VMLS 8.2 Linear function models
Q: What is a "linear model" for a relationship near an operating point? => An affine approximation using the Jacobian (derivative matrix).
Q: Give an example from physics/engineering. => E.g. price elasticity, small-signal circuit models or linearized robot dynamics.
X: Linearize f(x)=[x1*x2, x1+x2] at (1,2) by computing its Jacobian.
R: The derivative matrix gives the best local linear model of a vector function.
## 25
read: VMLS 8.3 Systems of linear equations
Q: How do you write a set of linear equations compactly? => A x = b.
Q: How many solutions can A x = b have? => None, one, or infinitely many.
X: Solve [[1,1],[1,-1]] x = [3,1] with np.linalg.solve.
R: Systems of equations are matrix equations; solvability depends on A's shape and independence.
## 26
read: VMLS 9.1-9.5 Linear dynamical systems
Q: Write the linear dynamical system equation. => x_{t+1} = A_t x_t (optionally + B_t u_t + c_t).
Q: What does the state x_t represent? => A vector summarizing everything needed to predict the future.
Q: What happens in x_{t+1}=A x_t if all eigenvalues have magnitude < 1? => The state decays to zero (stable system).
X: Simulate x_{t+1}=A x_t for A=[[0.9,0.2],[-0.2,0.9]] for 50 steps and plot it. (Month 1 practice task.)
R: Linear dynamical systems model how a state evolves; this is your first look at robot dynamics and control.
## 27
read: VMLS 10.1 Matrix-matrix multiplication
Q: How is (AB)_ij computed? => Inner product of row i of A with column j of B.
Q: Is matrix multiplication commutative? => No, AB != BA in general.
X: Compute AB and BA for A=[[1,2],[0,1]], B=[[1,0],[3,1]].
R: Matrix multiplication composes linear functions; order matters.
## 28
read: VMLS 10.1-10.2 Matrix-matrix multiplication, Composition of linear functions
Q: What does the product AB represent as a function? => First apply B then A: (AB)x = A(Bx).
Q: Give an example where composition of linear functions appears. => E.g. rotating then scaling; chaining coordinate transformations.
X: Verify that two successive 45-degree rotation matrices equal a 90-degree rotation.
R: Chained linear maps multiply as matrices; this is how coordinate-frame transformations compose in robotics.
## 29
read: VMLS 10.3 Matrix powers, 10.4 QR factorization
Q: What is A^k used for in dynamical systems? => x_t = A^t x_0 gives the state after t steps.
Q: What is a QR factorization? => A = QR with Q having orthonormal columns and R upper triangular, from Gram-Schmidt.
X: Use np.linalg.qr on a random 4x3 matrix and check Q^T Q = I.
R: Matrix powers propagate dynamics; QR gives an orthonormal basis plus triangular coefficients and is the numerically sound way to solve least squares.
## 30
read: VMLS 11.1 Left and right inverses
Q: What is a left inverse of A? => A matrix X with X A = I.
Q: When does a left inverse exist? => When A has linearly independent columns (tall or square).
X: Find a left inverse of [[1],[1]] and check it.
R: Left inverses recover x from y = A x when columns are independent; right inverses give solutions when rows are independent.
## 31
read: VMLS 11.2 Inverse, 11.3 Solving linear equations
Q: When is a square matrix invertible? => When its columns are linearly independent (equivalently rows, determinant nonzero).
Q: What is the practical way to solve A x = b? => Use a factorization/solver (QR or LU), not by forming A^{-1}.
X: Solve a 3x3 system with np.linalg.solve and compare with inv(A)@b.
R: Invertible square systems have unique solutions; compute them with factorizations.
## 32
read: VMLS 11.5 Pseudo-inverse
Q: What is the pseudo-inverse of A with independent columns? => A† = (A^T A)^{-1} A^T (a left inverse).
Q: What does A† b give? => The least squares solution of A x ≈ b.
X: Compare np.linalg.pinv(A) @ b to np.linalg.lstsq(A, b) for a tall A.
R: The pseudo-inverse generalizes the inverse to non-square matrices and solves least squares.
## 33
read: VMLS 12.1 Least squares problem, 12.2 Solution, 12.3 Solving least squares problems
Q: What does least squares minimize? => ||A x - b||^2, the sum of squared residuals.
Q: What are the normal equations? => A^T A x = A^T b.
Q: Why is the residual orthogonal to the columns of A at the solution? => The gradient of ||Ax-b||^2 vanishes: A^T(Ax-b)=0.
X: Fit y = a + b t to 3 points by solving the normal equations by hand.
R: Least squares finds the x making A x closest to b; the solution satisfies the normal equations and leaves a residual orthogonal to range(A).
## 34
read: VMLS 12.4 Examples
Q: Give an example of least squares for estimation. => E.g. estimating a position from many noisy range measurements.
Q: Why does having more measurements than unknowns give least squares? => Overdetermined systems have no exact solution, so we minimize the error.
X: Simulate 20 noisy measurements of a 2D point from 3 beacons and solve for the point with lstsq.
R: Least squares is the workhorse for fitting and estimation from redundant noisy data.
## 35
read: VMLS 13.1 Least squares data fitting
Q: What is the model-fitting setup? => Choose a model f(x) = sum theta_j f_j(x) and pick theta minimizing sum of squared prediction errors on data.
Q: What is the RMS error? => sqrt(mean of squared residuals).
X: Fit a line to 50 noisy points with the formula and np.linalg.lstsq; confirm they agree. (Month 1 practice task.)
R: Data fitting is linear in the parameters theta; least squares gives the best fit.
## 36
read: VMLS 13.1 Least squares data fitting (univariate functions)
Q: How can you fit a nonlinear curve with linear least squares? => Use nonlinear basis functions (e.g. polynomial terms); the model is still linear in the coefficients.
Q: What goes wrong with very high-degree polynomials? => Overfitting: low training error but poor generalization.
X: Fit polynomials of degree 1, 3, 9 to noisy sine data and compare residuals.
R: Choose basis functions; the fitting remains a linear least squares problem.
## 37
read: VMLS 13.2 Validation
Q: What is the purpose of a validation set? => To estimate error on unseen data and detect overfitting.
Q: What does it mean if train RMS is small and test RMS is large? => The model is overfit and does not generalize.
X: Split your noisy dataset 80/20 and plot train vs test error vs polynomial degree.
R: Always evaluate on held-out data; generalization, not training fit, is what matters.
## 38
read: VMLS 14.1 Classification
Q: What is a Boolean (two-class) classifier? => A function predicting a label +1/-1 from features.
Q: Name the four outcomes in a confusion matrix. => True positive, false negative, false positive, true negative.
X: Compute error rate, TPR and FPR for a given 2x2 confusion matrix.
R: Classification outputs discrete labels; performance is summarized by the confusion matrix.
## 39
read: VMLS 14.2 Least squares classifier
Q: How does the least squares classifier work? => Fit f(x)=x^T beta + v to +/-1 labels by least squares and predict sign(f(x)).
Q: Why is this not the ideal loss for classification? => It penalizes confidently correct predictions; logistic or hinge losses fit better, but LS is simple and often works.
X: Fit an LS classifier on 2 Gaussian blobs in 2D and plot the boundary.
R: Regress on +/-1 labels and take the sign: a baseline classifier from least squares.
## 40
read: VMLS 14.3 Multi-class classifiers
Q: How does one-versus-others multiclass work? => Train one binary classifier per class and predict the class with the largest score.
Q: What is the confusion matrix for K classes? => A KxK table of predicted versus true counts.
X: Describe how you'd extend your 2-blob classifier to 3 blobs.
R: Multiclass classifiers combine several binary scores via argmax.
## 41
read: VMLS 15.1 Multi-objective least squares
Q: What does multi-objective LS minimize? => A weighted sum J1 + lambda J2 of competing squared objectives.
Q: What does varying lambda trace out? => The trade-off (Pareto) curve between the objectives.
X: Minimize ||Ax-b||^2 + lambda ||x||^2 for several lambda and plot both terms.
R: Weighted sums let you trade off competing goals; the weight lambda sets the balance.
## 42
read: VMLS 15.2 Control
Q: How is control posed as multi-objective LS? => Minimize tracking error of outputs plus lambda times input energy, with y = A u.
Q: Why penalize input size? => To keep actuator effort small and avoid unrealistically large commands.
X: In a 2-input toy system, explore how increasing lambda reduces input effort and increases error.
R: Choosing inputs to trade tracking error against effort is the same idea as optimal control costs, previewing LQR.
## 43
read: VMLS 15.3 Estimation and inversion
Q: What is the inversion/estimation setup? => Measurements y = A x + v; estimate x from y despite noise.
Q: Why add a regularization term? => A prior on x stabilizes the estimate when A is ill-conditioned or noisy.
X: Deblur a 1D signal with and without regularization.
R: Estimation by regularized least squares balances fitting the data with plausibility of x.
## 44
read: VMLS 15.4 Regularized data fitting
Q: How does regularization help data fitting? => Penalizing ||theta||^2 shrinks coefficients and reduces overfitting.
Q: How do you choose lambda? => By validation: pick the lambda with lowest validation error.
X: Fit a degree-9 polynomial with ridge regularization and plot for 4 lambdas.
R: Regularization (ridge) controls model complexity, tuned on a validation set.
## 45
read: VMLS 16.1 Constrained least squares problem
Q: What is the constrained least squares problem? => Minimize ||A x - b||^2 subject to C x = d.
Q: Give an example of a natural equality constraint. => E.g. forcing a trajectory to pass through a specified final position.
X: Fit a line through noisy points that must pass through the origin.
R: Constraints enforce hard requirements; least squares then only trades off the remaining error.
## 46
read: VMLS 16.2 Solution, 16.3 Solving constrained least squares problems
Q: What are the optimality (KKT) conditions here? => A linear system combining 2A^T(Ax-b)+C^T z=0 and C x = d.
Q: How is the problem solved numerically? => Solve the KKT system or use QR factorizations.
X: Solve a small constrained LS problem via the KKT matrix in NumPy.
R: Constrained LS reduces to one linear (KKT) system.
## 48
read: VMLS 17.2 Linear quadratic control
Q: What is the linear quadratic (LQ) control problem? => Choose inputs u_t to minimize a quadratic cost on states and inputs subject to linear dynamics x_{t+1}=A x_t + B u_t.
Q: Why is this a constrained least squares problem? => Dynamics are linear equality constraints; the cost is a sum of squares.
X: Write the cost for a 1D double integrator over 10 steps.
R: Linear dynamics plus quadratic cost lead to a constrained LS problem; this is a first preview of LQR (revisited in AA203 lecture 8).
## 49
read: VMLS 17.3 Linear quadratic state estimation
Q: What is the state-estimation setup? => Given noisy measurements and a dynamics model, find the state trajectory minimizing measurement and process-noise error.
Q: How is this like control? => It has the same constrained LS structure, with unknown states instead of inputs.
X: Estimate a moving point's positions from noisy position measurements with a constant-velocity model.
R: Estimation and control are dual problems with the same least squares structure; Kalman filtering is the recursive version.
## 50
read: VMLS 18.1 Nonlinear equations and least squares
Q: How does nonlinear least squares differ from linear? => The residual f(x) is nonlinear in x, so there is no closed-form solution.
Q: Where does nonlinear LS appear in robotics? => E.g. inverse kinematics, camera calibration, SLAM.
X: Set up residuals for locating a point from 3 range measurements.
R: Nonlinear LS minimizes ||f(x)||^2 for nonlinear f; solved iteratively.
## 51
read: VMLS 18.2 Gauss-Newton algorithm, 18.3 Levenberg-Marquardt algorithm
Q: What does Gauss-Newton do at each step? => Linearizes f around the current x and solves the resulting linear LS problem.
Q: What does Levenberg-Marquardt add? => A damping term lambda ||x - x_k||^2 that keeps steps in the trust region where the linearization is valid.
X: Implement 5 iterations of Levenberg-Marquardt for a simple 2D range-positioning problem.
R: Repeatedly linearize and solve a least squares problem; LM adds damping for robustness. Numerical IK uses exactly this idea.
## 52
read: VMLS 18.4 Nonlinear model fitting
Q: What is nonlinear model fitting? => Fitting parameters that enter the model nonlinearly (e.g. exponentials) by minimizing squared residuals.
Q: Why are initial guesses important? => LM only finds local minima.
X: Fit y = a*exp(b*t) to noisy data using scipy.optimize.least_squares.
R: Nonlinear model fitting = nonlinear LS on parameters, typically solved by LM from a good starting guess.
## 53
read: VMLS 19.1 Constrained nonlinear least squares
Q: What is the problem? => Minimize ||f(x)||^2 subject to g(x)=0.
Q: Why is it harder than the linear case? => Both objective and constraint are nonlinear; algorithms are iterative.
X: Give one robotics example with a nonlinear equality constraint (e.g. gripper must stay at a fixed height).
R: Nonlinear constraints require iterative methods like penalty and augmented Lagrangian.
## 54
read: VMLS 19.2 Penalty algorithm, 19.3 Augmented Lagrangian algorithm
Q: How does the penalty method handle constraints? => Minimize ||f||^2 + mu ||g||^2 with increasing mu.
Q: What advantage does the augmented Lagrangian have? => It converges without driving mu to infinity, which avoids ill-conditioning.
X: Re-read the three Month 1 practice tasks and mark which ones you've completed.
R: Constraints can be handled with penalties or the augmented Lagrangian; both reduce to a sequence of nonlinear LS problems.
