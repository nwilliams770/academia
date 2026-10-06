/**
 * curves-math.test.js
 * Rigorous tests for curve math functions.
 *
 * Run with: node curves-math.test.js
 * Or paste into browser console.
 */

const {
	lerp,
	vecAdd,
	vecSub,
	vecScale,
	distance,
	quadBezierDecasteljau,
	quadBezierBernstein,
	cubicBezierDecasteljau,
	cubicBezierBernstein,
	cubicBernsteinWeights,
	cubicBezierDerivative
} = require('./curves-math.js');

// Simple assertion helper
function assert(condition, message) {
	if (!condition) {
		throw new Error(`ASSERTION FAILED: ${message}`);
	}
}

function assertClose(actual, expected, tolerance = 1e-10, message = "") {
	if (typeof actual === "number") {
		if (Math.abs(actual - expected) > tolerance) {
			throw new Error(
				`ASSERTION FAILED: ${message}\n` +
				`  Expected: ${expected}\n` +
				`  Got:      ${actual}\n` +
				`  Diff:     ${Math.abs(actual - expected)}`
			);
		}
	} else if (Array.isArray(actual)) {
		for (let i = 0; i < actual.length; i++) {
			if (Math.abs(actual[i] - expected[i]) > tolerance) {
				throw new Error(
					`ASSERTION FAILED: ${message}\n` +
					`  Expected: [${expected}]\n` +
					`  Got:      [${actual}]\n` +
					`  Diff at [$${i}]: $${Math.abs(actual[i] - expected[i])}`
				);
			}
		}
	}
}

// ============================================================================
// TEST SUITE 1: Basic vector operations
// ============================================================================

console.log("=== TEST SUITE 1: Vector Operations ===");

function test_vecAdd() {
	const result = vecAdd([1, 2], [3, 4]);
	assertClose(result, [4, 6], 1e-10, "vecAdd([1,2], [3,4])");
	console.log("✓ vecAdd");
}

function test_vecSub() {
	const result = vecSub([5, 7], [2, 3]);
	assertClose(result, [3, 4], 1e-10, "vecSub([5,7], [2,3])");
	console.log("✓ vecSub");
}

function test_vecScale() {
	const result = vecScale(2, [3, 4]);
	assertClose(result, [6, 8], 1e-10, "vecScale(2, [3,4])");
	console.log("✓ vecScale");
}

function test_distance() {
	const d = distance([0, 0], [3, 4]);
	assertClose(d, 5, 1e-10, "distance([0,0], [3,4]) should be 5");
	console.log("✓ distance");
}

// ============================================================================
// TEST SUITE 2: lerp (linear interpolation)
// ============================================================================

console.log("\n=== TEST SUITE 2: Linear Interpolation (lerp) ===");

function test_lerp_scalars() {
	assertClose(lerp(0, 10, 0), 0, 1e-10, "lerp(0, 10, 0) = 0");
	assertClose(lerp(0, 10, 1), 10, 1e-10, "lerp(0, 10, 1) = 10");
	assertClose(lerp(0, 10, 0.5), 5, 1e-10, "lerp(0, 10, 0.5) = 5");
	console.log("✓ lerp with scalars");
}

function test_lerp_vectors() {
	const result = lerp([0, 0], [10, 20], 0.5);
	assertClose(result, [5, 10], 1e-10, "lerp([0,0], [10,20], 0.5) = [5,10]");
	console.log("✓ lerp with vectors");
}

function test_lerp_extrapolation() {
	// t can be outside [0, 1]
	assertClose(lerp(0, 10, 2), 20, 1e-10, "lerp(0, 10, 2) = 20 (extrapolate)");
	assertClose(lerp(0, 10, -1), -10, 1e-10, "lerp(0, 10, -1) = -10 (extrapolate)");
	console.log("✓ lerp extrapolation");
}

// ============================================================================
// TEST SUITE 3: Quadratic Bézier equivalence
// ============================================================================

console.log("\n=== TEST SUITE 3: Quadratic Bézier (de Casteljau vs Bernstein) ===");

function test_quadBezier_endpoints() {
	const p0 = [0, 0], p1 = [5, 10], p2 = [10, 0];

	// de Casteljau
	let result = quadBezierDecasteljau(p0, p1, p2, 0);
	assertClose(result, p0, 1e-10, "quad decasteljau at t=0 should be p0");

	result = quadBezierDecasteljau(p0, p1, p2, 1);
	assertClose(result, p2, 1e-10, "quad decasteljau at t=1 should be p2");

	// Bernstein
	result = quadBezierBernstein(p0, p1, p2, 0);
	assertClose(result, p0, 1e-10, "quad bernstein at t=0 should be p0");

	result = quadBezierBernstein(p0, p1, p2, 1);
	assertClose(result, p2, 1e-10, "quad bernstein at t=1 should be p2");

	console.log("✓ quad bezier endpoints");
}

function test_quadBezier_equivalence() {
	const p0 = [1, 2], p1 = [5, 8], p2 = [9, 3];

	// Test at many t values
	for (let i = 0; i <= 10; i++) {
		const t = i / 10;
		const dc = quadBezierDecasteljau(p0, p1, p2, t);
		const bn = quadBezierBernstein(p0, p1, p2, t);
		assertClose(dc, bn, 1e-9, `quad at t=${t}: decasteljau should equal bernstein`);
	}
	console.log("✓ quad bezier de casteljau ≡ bernstein");
}

// ============================================================================
// TEST SUITE 4: Cubic Bézier equivalence
// ============================================================================

console.log("\n=== TEST SUITE 4: Cubic Bézier (de Casteljau vs Bernstein) ===");

function test_cubicBezier_endpoints() {
	const p0 = [0, 0], p1 = [2, 8], p2 = [8, 8], p3 = [10, 0];

	// de Casteljau
	let result = cubicBezierDecasteljau(p0, p1, p2, p3, 0);
	assertClose(result, p0, 1e-10, "cubic decasteljau at t=0 should be p0");

	result = cubicBezierDecasteljau(p0, p1, p2, p3, 1);
	assertClose(result, p3, 1e-10, "cubic decasteljau at t=1 should be p3");

	// Bernstein
	result = cubicBezierBernstein(p0, p1, p2, p3, 0);
	assertClose(result, p0, 1e-10, "cubic bernstein at t=0 should be p0");

	result = cubicBezierBernstein(p0, p1, p2, p3, 1);
	assertClose(result, p3, 1e-10, "cubic bernstein at t=1 should be p3");

	console.log("✓ cubic bezier endpoints");
}

function test_cubicBezier_equivalence() {
	const p0 = [1, 2], p1 = [3, 7], p2 = [8, 5], p3 = [10, 1];

	// Test at many t values
	for (let i = 0; i <= 20; i++) {
		const t = i / 20;
		const dc = cubicBezierDecasteljau(p0, p1, p2, p3, t);
		const bn = cubicBezierBernstein(p0, p1, p2, p3, t);
		assertClose(dc, bn, 1e-9, `cubic at t=${t}: decasteljau should equal bernstein`);
	}
	console.log("✓ cubic bezier de casteljau ≡ bernstein");
}

// ============================================================================
// TEST SUITE 5: Partition of Unity (weights sum to 1)
// ============================================================================

console.log("\n=== TEST SUITE 5: Partition of Unity ===");

function test_quadBernstein_weights_sum_to_one() {
	for (let i = 0; i <= 20; i++) {
		const t = i / 20;
		const w0 = (1 - t) * (1 - t);
		const w1 = 2 * (1 - t) * t;
		const w2 = t * t;
		const sum = w0 + w1 + w2;
		assertClose(sum, 1, 1e-10, `quad weights at t=${t} should sum to 1`);
	}
	console.log("✓ quadratic bernstein weights sum to 1");
}

function test_cubicBernsteinWeights() {
	for (let i = 0; i <= 20; i++) {
		const t = i / 20;
		const weights = cubicBernsteinWeights(t);
		const sum = weights[0] + weights[1] + weights[2] + weights[3];
		assertClose(sum, 1, 1e-10, `cubic weights at t=${t} should sum to 1`);
	}
	console.log("✓ cubicBernsteinWeights sums to 1");
}

function test_cubicBernstein_weights_match() {
	// Verify that cubicBernsteinWeights returns the correct values
	const t = 0.3;
	const weights = cubicBernsteinWeights(t);
	const expected = [
		Math.pow(1 - t, 3),
		3 * Math.pow(1 - t, 2) * t,
		3 * (1 - t) * Math.pow(t, 2),
		Math.pow(t, 3)
	];
	assertClose(weights, expected, 1e-10, "cubicBernsteinWeights at t=0.3");
	console.log("✓ cubicBernsteinWeights values correct");
}

// ============================================================================
// TEST SUITE 6: Translation Invariance
// ============================================================================

console.log("\n=== TEST SUITE 6: Translation Invariance ===");

function test_translation_invariance_quad() {
	const p0 = [1, 2], p1 = [5, 8], p2 = [9, 3];
	const t = 0.4;

	// Original curve point
	const pt1 = quadBezierBernstein(p0, p1, p2, t);

	// Translate all points
	const d = [100, 100];
	const p0t = vecAdd(p0, d);
	const p1t = vecAdd(p1, d);
	const p2t = vecAdd(p2, d);

	// Evaluate translated curve
	const pt2 = quadBezierBernstein(p0t, p1t, p2t, t);

	// Should be: pt2 = pt1 + d
	const expected = vecAdd(pt1, d);
	assertClose(pt2, expected, 1e-9, "quad translation invariance at t=0.4");

	console.log("✓ quadratic bezier translation invariant");
}

function test_translation_invariance_cubic() {
	const p0 = [0, 0], p1 = [2, 8], p2 = [8, 8], p3 = [10, 0];
	const t = 0.6;

	// Original
	const pt1 = cubicBezierBernstein(p0, p1, p2, p3, t);

	// Translate
	const d = [50, -30];
	const p0t = vecAdd(p0, d);
	const p1t = vecAdd(p1, d);
	const p2t = vecAdd(p2, d);
	const p3t = vecAdd(p3, d);

	// Evaluate translated
	const pt2 = cubicBezierBernstein(p0t, p1t, p2t, p3t, t);

	// Check
	const expected = vecAdd(pt1, d);
	assertClose(pt2, expected, 1e-9, "cubic translation invariance at t=0.6");

	console.log("✓ cubic bezier translation invariant");
}

// ============================================================================
// TEST SUITE 7: Derivatives
// ============================================================================

console.log("\n=== TEST SUITE 7: Derivatives ===");

function test_derivative_at_start() {
	const p0 = [0, 0], p1 = [3, 6], p2 = [8, 4], p3 = [10, 0];

	// f'(0) should be parallel to (p1 - p0)
	const deriv = cubicBezierDerivative(p0, p1, p2, p3, 0);
	const expected = vecScale(3, vecSub(p1, p0)); // 3(p1 - p0)

	assertClose(deriv, expected, 1e-9, "derivative at t=0");
	console.log("✓ derivative at t=0 is 3(p1-p0)");
}

function test_derivative_at_end() {
	const p0 = [0, 0], p1 = [3, 6], p2 = [8, 4], p3 = [10, 0];

	// f'(1) should be 3(p3 - p2)
	const deriv = cubicBezierDerivative(p0, p1, p2, p3, 1);
	const expected = vecScale(3, vecSub(p3, p2));

	assertClose(deriv, expected, 1e-9, "derivative at t=1");
	console.log("✓ derivative at t=1 is 3(p3-p2)");
}

function test_derivative_midpoint() {
	const p0 = [0, 0], p1 = [5, 10], p2 = [10, 10], p3 = [15, 0];
	const t = 0.5;

	// Just verify it computes without error and is a 2D vector
	const deriv = cubicBezierDerivative(p0, p1, p2, p3, t);
	assert(Array.isArray(deriv) && deriv.length === 2, "derivative returns [x, y]");
	assert(typeof deriv[0] === "number" && typeof deriv[1] === "number", "derivative components are numbers");

	console.log("✓ derivative at t=0.5 computes");
}

// ============================================================================
// TEST SUITE 8: Broken Weights (for intuition)
// ============================================================================

console.log("\n=== TEST SUITE 8: Broken Weights (Non-Partition of Unity) ===");

function test_broken_weights_not_translation_invariant() {
	// Use weights (1-t)^2 and t^2 only (missing the middle term)
	// These sum to less than 1

	function brokenCubic(p0, p1, p2, p3, t) {
		const w0 = (1 - t) * (1 - t);
		const w3 = t * t;
		// Missing: 3(1-t)^2*t and 3(1-t)*t^2
		// So weights sum to w0 + w3, not 1
		return vecAdd(vecScale(w0, p0), vecScale(w3, p3));
	}

	const p0 = [0, 0], p1 = [3, 6], p2 = [8, 4], p3 = [10, 0];
	const t = 0.5;

	// Original
	const pt1 = brokenCubic(p0, p1, p2, p3, t);

	// Translate
	const d = [100, 100];
	const p0t = vecAdd(p0, d);
	const p1t = vecAdd(p1, d);
	const p2t = vecAdd(p2, d);
	const p3t = vecAdd(p3, d);

	const pt2 = brokenCubic(p0t, p1t, p2t, p3t, t);

	// These should NOT be equal (broken weights are not translation invariant)
	const expected = vecAdd(pt1, d);
	const diff = Math.sqrt(Math.pow(pt2[0] - expected[0], 2) + Math.pow(pt2[1] - expected[1], 2));

	assert(diff > 0.1, "broken weights are NOT translation invariant (diff = " + diff + ")");
	console.log("✓ broken weights fail translation invariance (as expected)");
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

function runAllTests() {
	try {
		// Suite 1
		test_vecAdd();
		test_vecSub();
		test_vecScale();
		test_distance();

		// Suite 2
		test_lerp_scalars();
		test_lerp_vectors();
		test_lerp_extrapolation();

		// Suite 3
		test_quadBezier_endpoints();
		test_quadBezier_equivalence();

		// Suite 4
		test_cubicBezier_endpoints();
		test_cubicBezier_equivalence();

		// Suite 5
		test_quadBernstein_weights_sum_to_one();
		test_cubicBernsteinWeights();
		test_cubicBernstein_weights_match();

		// Suite 6
		test_translation_invariance_quad();
		test_translation_invariance_cubic();

		// Suite 7
		test_derivative_at_start();
		test_derivative_at_end();
		test_derivative_midpoint();

		// Suite 8
		test_broken_weights_not_translation_invariant();

		console.log("\n" + "=".repeat(60));
		console.log("ALL TESTS PASSED ✓");
		console.log("=".repeat(60));

	} catch (e) {
		console.error("\n" + "=".repeat(60));
		console.error("TEST FAILED ✗");
		console.error("=".repeat(60));
		console.error(e.message);
		console.error(e.stack);
	}
}

// Run on load
runAllTests();
