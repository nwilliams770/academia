/**
 * basis-matrices-exercises.js
 *
 * Requires: curves-math.js (vecAdd, vecSub, vecScale, cubicBezierBernstein)
 *
 * The idea: f(t) = u · B · p.  u is always [1,t,t²,t³]. p is your points.
 * B is the interpretation — it's what makes four numbers mean "Bézier"
 * rather than "Hermite" or "Catmull-Rom".
 */

function assert(c, m) { if (!c) throw new Error("ASSERTION FAILED: " + m); }

function assertClose(a, b, tol, msg) {
	const arr = Array.isArray(a) ? a : [a];
	const brr = Array.isArray(b) ? b : [b];
	for (let i = 0; i < arr.length; i++) {
		if (Math.abs(arr[i] - brr[i]) > tol) {
			throw new Error(`\$\${msg}\n  expected $${brr}\n  got      ${arr}`);
		}
	}
}

// ============================================================================
// EXERCISE 1: matrix × vector-of-points
// ============================================================================

/**
 * Multiply a 4×4 matrix by a column of four 2D POINTS.
 *
 *   result[i] = sum over j of  M[i][j] * pts[j]     (a 2D point)
 *
 * This is how you apply a basis matrix: it takes four points and returns four
 * polynomial coefficient VECTORS.
 *
 * @param {Array<Array<number>>} M    4×4
 * @param {Array<Array<number>>} pts  four [x,y]
 * @returns {Array<Array<number>>}    four [x,y] coefficients
 */
function matMulPoints(M, pts) {
	throw new Error("TODO");
}

function test_matMulPoints() {
	const I = [[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]];
	const pts = [[1,2],[3,4],[5,6],[7,8]];
	const out = matMulPoints(I, pts);
	for (let i = 0; i < 4; i++) assertClose(out[i], pts[i], 1e-12, `identity row ${i}`);

	// row that sums all four points
	const S = [[1,1,1,1],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	assertClose(matMulPoints(S, pts)[0], [16, 20], 1e-12, "sum row");

	console.log("✓ matMulPoints");
}

// ============================================================================
// EXERCISE 2 [THE IMPORTANT ONE]: derive the Bézier basis matrix
// ============================================================================

/**
 * Return the cubic Bézier basis matrix B such that
 *   [a0,a1,a2,a3]ᵀ = B · [p0,p1,p2,p3]ᵀ
 * where f(t) = a0 + a1·t + a2·t² + a3·t³.
 *
 * DERIVE IT, don't look it up. Expand
 *   (1-t)³p0 + 3(1-t)²t·p1 + 3(1-t)t²·p2 + t³·p3
 * and collect by power of t. Row i of B is the coefficient of tⁱ, written in
 * terms of p0..p3.
 *
 * You already did the quadratic version of exactly this expansion back in
 * Layer 1 when you showed de Casteljau ≡ Bernstein. Same move, degree 3.
 *
 * Sanity checks before you trust your answer:
 *   - row 0 must be [1,0,0,0]  (f(0) = p0)
 *   - every row must sum to 0 except row 0, which sums to 1
 *     (that's partition of unity in matrix form — at t=1 the column sums give
 *      f(1) = p3)
 *
 * @returns {Array<Array<number>>} 4×4
 */
function bezierBasisMatrix() {
	throw new Error("TODO");
}

function test_bezierBasisMatrix() {
	const B = bezierBasisMatrix();
	const expected = [
		[ 1,  0,  0, 0],
		[-3,  3,  0, 0],
		[ 3, -6,  3, 0],
		[-1,  3, -3, 1]
	];
	for (let i = 0; i < 4; i++)
		for (let j = 0; j < 4; j++)
			assertClose(B[i][j], expected[i][j], 1e-12, `B[$${i}][$${j}]`);

	console.log("✓ bezierBasisMatrix");
}

// ============================================================================
// EXERCISE 3: evaluate via u·B·p, prove it equals Bernstein
// ============================================================================

/**
 * Evaluate a cubic Bézier using the basis matrix instead of the weights.
 *
 *   coeffs = B · p                      (four 2D coefficient vectors)
 *   f(t)   = c0 + c1·t + c2·t² + c3·t³
 *
 * Getting the same answer as cubicBezierBernstein is the whole point: the
 * matrix form and the blending-function form are the same thing.
 *
 * @returns {Array} [x,y]
 */
function evaluateWithBasisMatrix(p0, p1, p2, p3, t) {
	throw new Error("TODO");
}

function test_evaluateWithBasisMatrix() {
	const P = [[0,0],[2,8],[8,8],[10,0]];
	for (let i = 0; i <= 20; i++) {
		const t = i / 20;
		assertClose(
			evaluateWithBasisMatrix(...P, t),
			cubicBezierBernstein(...P, t),
			1e-9, `u·B·p vs Bernstein at t=${t}`
		);
	}
	console.log("✓ evaluateWithBasisMatrix ≡ Bernstein");
}

// ============================================================================
// EXERCISE 4: u·B IS the blending functions
// ============================================================================

/**
 * Compute [1,t,t²,t³] · B and return the four resulting scalars.
 *
 * These should come out equal to cubicBernsteinWeights(t) — the exact four
 * curves you plotted in Layer 3. The basis matrix and the blending functions
 * are the same object wearing different clothes. Swap B and you swap those
 * four shapes, and that IS the difference between Bézier /```javascript
 * Hermite / Catmull-Rom / B-spline.
 *
 * @returns {Array<number>} [b0, b1, b2, b3]
 */
function blendingFunctionsFromMatrix(t) {
	throw new Error("TODO");
	// u = [1, t, t*t, t*t*t]
	// result[j] = sum over i of  u[i] * B[i][j]
}

function test_blendingFunctionsFromMatrix() {
	for (let i = 0; i <= 20; i++) {
		const t = i / 20;
		const fromMatrix = blendingFunctionsFromMatrix(t);
		const fromFormula = cubicBernsteinWeights(t);
		for (let j = 0; j < 4; j++) {
			assertClose(fromMatrix[j], fromFormula[j], 1e-12,
				`b$${j} at t=$${t}`);
		}
		// and they still sum to 1
		const sum = fromMatrix.reduce((a, b) => a + b, 0);
		assertClose(sum, 1, 1e-12, `weights sum to 1 at t=${t}`);
	}
	console.log("✓ u·B ≡ Bernstein weights");
}

// ============================================================================

function runBasisMatrixTests() {
	const tests = [
		test_matMulPoints,
		test_bezierBasisMatrix,
		test_evaluateWithBasisMatrix,
		test_blendingFunctionsFromMatrix
	];
	for (const t of tests) {
		try { t(); }
		catch (e) { console.error("✗ " + t.name + ": " + e.message); return; }
	}
	console.log("\nALL BASIS MATRIX TESTS PASSED ✓");
}

runBasisMatrixTests();

if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		matMulPoints, bezierBasisMatrix,
		evaluateWithBasisMatrix, blendingFunctionsFromMatrix
	};
}
