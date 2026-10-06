/**
 * continuity-exercises.js
 *
 * ALL functions in this file interpret their point arguments as CUBIC BÉZIER
 * control points. That interpretation is a CHOICE, not something the data
 * implies — the same 8 points read as Catmull-Rom would describe different
 * curves and could give different answers. Hence the `Bezier` suffixes.
 *
 * Requires: curves-math.js
 *   (vecAdd, vecSub, vecScale, cubicBezierBernstein, cubicBezierDerivative)
 *
 * CORE:     Exercises 1, 2, 4
 * OPTIONAL: Exercise 3
 */

// const {
// 	vecAdd, vecSub, vecScale,
// 	cubicBezierBernstein, cubicBezierDerivative
// } = require("./curves-math.js");

const EPS = 1e-9;

function assert(cond, msg) {
	if (!cond) throw new Error("ASSERTION FAILED: " + msg);
}

function vecClose(a, b, tol = EPS) {
	return Math.abs(a[0] - b[0]) < tol && Math.abs(a[1] - b[1]) < tol;
}

// ============================================================================
// EXERCISE 1 [CORE]: C⁰ continuity
// ============================================================================

/**
 * Are two cubic BÉZIER segments C⁰ continuous at their seam?
 *
 * Segment 1 is the Bézier defined by p0..p3; segment 2 by q0..q3.
 * C⁰ means the curves meet:  f1(1) == f2(0).
 *
 * Two valid implementations:
 *   (a) evaluate — cubicBezierBernstein(p0,p1,p2,p3, 1) vs (q0,q1,q2,q3, 0)
 *   (b) compare control points — p3 vs q0
 * They agree because a Bézier interpolates its endpoints: f(0)=p0, f(1)=p3.
 * Use (a) if you want this to also exercise your Layer 1 code.
 *
 * @returns {boolean}
 */
function isC0ContinuousBezier(p0, p1, p2, p3, q0, q1, q2, q3) {
	const p_t1 = cubicBezierBernstein(p0, p1, p2, p3, 1);
  const q_t0 = cubicBezierBernstein(q0, q1, q2, q3, 0);

  return vecClose(p_t1, q_t0);
}

function test_C0() {
	const p0 = [0,0], p1 = [3,6], p2 = [8,4], p3 = [10,10];
	const q1 = [12,15], q2 = [18,8], q3 = [20,5];

	assert(isC0ContinuousBezier(p0,p1,p2,p3, p3,q1,q2,q3),
		"q0 == p3 should be C0");

	assert(!isC0ContinuousBezier(p0,p1,p2,p3, [11,11],q1,q2,q3),
		"a gap should fail C0");

	console.log("✓ C0");
}

// ============================================================================
// EXERCISE 2 [CORE]: C¹ continuity
// ============================================================================

/**
 * Are two cubic BÉZIER segments C¹ continuous?
 *
 * C¹ = C⁰ AND matching first derivatives:  f1'(1) == f2'(0).
 * Use cubicBezierDerivative from Layer 1 on each segment.
 *
 * @returns {boolean}
 */
function isC1ContinuousBezier(p0, p1, p2, p3, q0, q1, q2, q3) {
	const p_t1 = cubicBezierDerivative(p0, p1, p2, p3, 1);
	const q_t0 = cubicBezierDerivative(q0, q1, q2, q3, 0);

  return vecClose(p_t1, q_t0);
}

/**
 * Given cubic Bézier segment 1 (p0..p3), return the q0 and q1 that segment 2
 * is FORCED to have for C¹.
 *
 * Derivation:
 *   f1'(1) = 3(p3 - p2)
 *   f2'(0) = 3(q1 - q0)
 *   set equal:        q1 - q0 = p3 - p2
 *   C⁰ gives q0 = p3, so:   q1 = 2*p3 - p2
 *
 * Geometric reading: p2, the joint, and q1 are collinear and evenly spaced —
 * the joint is the midpoint of p2 and q1. This is exactly what a pen tool
 * enforces when you drag one handle and the opposite one swings to match.
 *
 * q2 and q3 remain free.
 *
 * @returns {{q0: Array, q1: Array}}
 */
function solveC1Bezier(p0, p1, p2, p3) {
  const q1 = vecSub(vecScale(2, p3), p2)
  return {
    q0: [p3[0], p3[1]],
    q1,
  }
}

function test_C1() {
	const p0 = [0,0], p1 = [3,6], p2 = [8,4], p3 = [10,10];
	const { q0, q1 } = solveC1Bezier(p0, p1, p2, p3);

	assert(vecClose(q0, p3),       "q0 must equal p3");
	assert(vecClose(q1, [12, 16]), "q1 should be 2*p3 - p2 = [12,16]");

	// collinearity: joint is the midpoint of p2 and q1
	const mid = vecScale(0.5, vecAdd(p2, q1));
	assert(vecClose(mid, p3), "p2, joint, q1 must be collinear + evenly spaced");

	assert(isC1ContinuousBezier(p0,p1,p2,p3, q0,q1,[18,8],[20,5]),
		"solveC1Bezier output should be C1");

	assert(!isC1ContinuousBezier(p0,p1,p2,p3, q0,[13,13],[18,8],[20,5]),
		"wrong tangent should fail C1");

	assert(isC0ContinuousBezier(p0,p1,p2,p3, q0,q1,[18,8],[20,5]),
		"C1 should imply C0");

	console.log("✓ C1");
}

// ============================================================================
// EXERCISE 3 [OPTIONAL]: C² continuity
// ============================================================================

/**
 * Second derivative of a cubic BÉZIER:
 *   f''(t) = 6[(1-t)(p2 - 2*p1 + p0) + t*(p3 - 2*p2 + p1)]
 * so
 *   f''(0) = 6(p2 - 2*p1 + p0)
 *   f''(1) = 6(p3 - 2*p2 + p1)
 *
 * Note it's LINEAR in t — a cubic has linearly-varying acceleration, which is
 * what lets it make an S-shape (acceleration can flip sign partway through).
 *
 * @returns {Array} [x, y]
 */
function cubicBezierSecondDerivative(p0, p1, p2, p3, t) {
	// second difference at the start: p2 - 2*p1 + p0
	const accelStart = vecAdd(vecSub(p2, vecScale(2, p1)), p0);
	// second difference at the end:   p3 - 2*p2 + p1
	const accelEnd   = vecAdd(vecSub(p3, vecScale(2, p2)), p1);

	// f''(t) = 6 * lerp(accelStart, accelEnd, t)
	return vecScale(6, vecAdd(vecScale(1 - t, accelStart), vecScale(t, accelEnd)));
}

/** C² = C¹ AND f1''(1) == f2''(0). Cubic Bézier interpretation. */
function isC2ContinuousBezier(p0, p1, p2, p3, q0, q1, q2, q3) {
  return isC1ContinuousBezier(p0, p1, p2, p3, q0, q1, q2, q3) &&
  vecClose(
    cubicBezierSecondDerivative(p0, p1, p2, p3, 1),
    cubicBezierSecondDerivative(q0, q1, q2, q3, 0),
  );
}

/**
 * Given cubic Bézier segment 1, return the q0, q1, q2 forced by C².
 * q0 and q1 come straight from solveC1Bezier. Then:
 *   f2''(0) = f1''(1)
 *   6(q2 - 2*q1 + q0) = 6(p3 - 2*p2 + p1)
 * Substituting q0 = p3 and q1 = 2*p3 - p2 collapses to:
 *   q2 = p1 + 4*(p3 - p2)
 *
 * Only q3 stays free. C² eats 3 of segment 2's 4 control points — that's the
 * "more continuity = less control" trade, made concrete.
 *
 * @returns {{q0: Array, q1: Array, q2: Array}}
 */
function solveC2Bezier(p0, p1, p2, p3) {
	const { q0, q1 } = solveC1Bezier(p0, p1, p2, p3);

  const q2 = vecAdd(p1, vecScale(4, vecSub(p3, p2)));

  return {q0, q1, q2};

}

function test_C2() {
	const p0 = [0,0], p1 = [2,8], p2 = [8,8], p3 = [10,0];
	const { q0, q1, q2 } = solveC2Bezier(p0, p1, p2, p3);
	const q3 = [20, 5]; // free

	assert(isC2ContinuousBezier(p0,p1,p2,p3, q0,q1,q2,q3),
		"solveC2Bezier output should be C2");

	assert(isC1ContinuousBezier(p0,p1,p2,p3, q0,q1,q2,q3), "C2 implies C1");
	assert(isC0ContinuousBezier(p0,p1,p2,p3, q0,q1,q2,q3), "C2 implies C0");

	// THE POINT: q2 is invisible to C1 but decisive for C2.
	const q2bad = vecAdd(q2, [5, 5]);
	assert(isC1ContinuousBezier(p0,p1,p2,p3, q0,q1,q2bad,q3),
		"moving q2 should NOT break C1");
	assert(!isC2ContinuousBezier(p0,p1,p2,p3, q0,q1,q2bad,q3),
		"moving q2 SHOULD break C2");

	console.log("✓ C2");
}

// ============================================================================
// EXERCISE 4 [CORE]: build a C¹ spline through a list of points
// ============================================================================

/**
 * Given N waypoints, produce N-1 cubic Bézier segments forming a C¹ spline
 * that passes through every waypoint.
 *
 * Two different things get called "points", which is the main source of
 * confusion:
 *   - waypoints       : the locations you want the curve to hit (the input)
 *   - control points  : the 4 values each Bézier segment needs (the output)
 * Each waypoint becomes an ANCHOR (p0 or p3). The handles (p1, p2) are
 * invented by this function. So "Bézier doesn't interpolate its control
 * points" still holds — the waypoints only ever land on anchors.
 *
 * @param {Array<Array>} waypoints  N points, each [x, y]
 * @returns {Array<{p0,p1,p2,p3}>}  N-1 segments
 */
function buildC1BezierSpline(waypoints) {
	const n = waypoints.length;
	if (n < 2) return [];   // no gaps, nothing to draw

	// ---- STEP 1: one tangent per WAYPOINT (n of them, not n-1) -------------
	// Interior tangents point from the previous waypoint to the next one —
	// that's the "which way is this curve heading through here" direction.
	// Endpoints have no neighbour on one side, so just use the single edge.
	const T = [];
	for (let i = 0; i < n; i++) {
		if (i === 0) {
			T.push(vecSub(waypoints[1], waypoints[0]));
		} else if (i === n - 1) {
			T.push(vecSub(waypoints[n - 1], waypoints[n - 2]));
		} else {
			T.push(vecScale(0.5, vecSub(waypoints[i + 1], waypoints[i - 1])));
		}
	}

	// ---- STEP 2: one segment per GAP (n-1 of them) ------------------------
	// The /3 converts a desired tangent into a handle offset, because
	// f'(0) = 3(p1 - p0)  =>  p1 = p0 + T/3  gives  f'(0) = T.
	const segments = [];
	for (let i = 0; i < n - 1; i++) {
		const p0 = [waypoints[i][0],     waypoints[i][1]];
		const p3 = [waypoints[i + 1][0], waypoints[i + 1][1]];
		const p1 = vecAdd(p0, vecScale(1 / 3, T[i]));
		const p2 = vecSub(p3, vecScale(1 / 3, T[i + 1]));
		segments.push({ p0, p1, p2, p3 });
	}

	return segments;

	// WHY C¹ IS FREE: segment i uses T[i+1] for its END tangent, and segment
	// i+1 uses that SAME T[i+1] for its START tangent. One shared vector, so
	// the derivatives agree at the joint by construction. Note there is no
	// call to isC1ContinuousBezier anywhere above — that's what "automatic
	// C¹" means. Catmull-Rom isn't a different kind of continuity, it's a
	// rule for placing Bézier handles that happens to satisfy the condition.
}

function test_C1Spline() {
	const pts = [[50,100], [150,50], [250,150], [350,100]];
	const segs = buildC1BezierSpline(pts);

	assert(segs.length === pts.length - 1, "N points -> N-1 segments");

	for (let i = 0; i < segs.length; i++) {
		assert(vecClose(segs[i].p0, pts[i],   1e-6), `seg \$\${i} starts at pts[$${i}]`);
		assert(vecClose(segs[i].p3, pts[i+1], 1e-6), `seg $${i} ends at pts[$${i+1}]`);
	}

	for (let i = 0; i < segs.length - 1; i++) {
		const a = segs[i], b = segs[i+1];
		assert(isC1ContinuousBezier(a.p0,a.p1,a.p2,a.p3, b.p0,b.p1,b.p2,b.p3),
			`joint ${i} should be C1`);
	}

	console.log("✓ C1 spline");
}

// ============================================================================

function runContinuityTests() {
	const tests = [test_C0, test_C1, test_C2, test_C1Spline];
	for (const t of tests) {
		try { t(); }
		catch (e) { console.error("✗ " + t.name + ": " + e.message); return; }
	}
	console.log("\nALL CONTINUITY TESTS PASSED ✓");
}

runContinuityTests();

if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		isC0ContinuousBezier, isC1ContinuousBezier, isC2ContinuousBezier,
		solveC1Bezier, solveC2Bezier, cubicBezierSecondDerivative,
		buildC1BezierSpline
	};
}
