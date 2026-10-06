/**
 * curves-math.js
 * Pure mathematical implementations of curve operations.
 * No side effects, no graphics, no DOM.
 */

/**
 * Linear interpolation between two points.
 * @param {number|Array} a - Start point (scalar or [x, y])
 * @param {number|Array} b - End point
 * @param {number} t - Parameter in [0, 1] (and beyond)
 * @returns {number|Array} - Interpolated point, same type as input
 */
function lerp(a, b, t) {
  // We assume our input is sanitized for these exercises

	// First check if the inputs are scalars
	if (typeof a === "number" && typeof b === "number") {
    return (1 - t) * a + t * b;
	}

  return [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]];
}

/**
 * Quadratic Bézier curve using de Casteljau's algorithm (nested lerps).
 * @param {Array} p0 - [x, y]
 * @param {Array} p1 - [x, y]
 * @param {Array} p2 - [x, y]
 * @param {number} t - Parameter in [0, 1]
 * @returns {Array} - [x, y] point on curve
 */
function quadBezierDecasteljau(p0, p1, p2, t) {
  return lerp(lerp(p0, p1, t), lerp(p1, p2, t), t);
}

/**
 * Quadratic Bézier curve using direct Bernstein weights.
 * f(t) = (1-t)²·p0 + 2(1-t)t·p1 + t²·p2
 * @param {Array} p0 - [x, y]
 * @param {Array} p1 - [x, y]
 * @param {Array} p2 - [x, y]
 * @param {number} t - Parameter in [0, 1]
 * @returns {Array} - [x, y] point on curve
 */
function quadBezierBernstein(p0, p1, p2, t) {
  /**
    * This is de Casteljau expanded algebraically.
    * Start with nested lerps:
    *   p01 = (1-t)·p0 + t·p1
    *   p12 = (1-t)·p1 + t·p2
    *   result = (1-t)·p01 + t·p12
    *
    * Substitute and expand:
    *   result = (1-t)·[(1-t)·p0 + t·p1] + t·[(1-t)·p1 + t·p2]
    *          = (1-t)²·p0 + 2(1-t)t·p1 + t²·p2
    */
  return vecAdd(
    vecAdd(
      vecScale((1-t)**2, p0),
      vecScale(2 * (1-t) * t, p1)
    ),
    vecScale(t**2, p2)
  );
}

/**
 * Cubic Bézier curve using de Casteljau's algorithm.
 * @param {Array} p0 - [x, y]
 * @param {Array} p1 - [x, y]
 * @param {Array} p2 - [x, y]
 * @param {Array} p3 - [x, y]
 * @param {number} t - Parameter in [0, 1]
 * @returns {Array} - [x, y] point on curve
 */
function cubicBezierDecasteljau(p0, p1, p2, p3, t) {
	const q0 = lerp(p0, p1, t);
	const q1 = lerp(p1, p2, t);
	const q2 = lerp(p2, p3, t);

	return quadBezierDecasteljau(q0, q1, q2, t);
}

/**
 * Cubic Bézier curve using direct Bernstein weights.
 * f(t) = (1-t)³·p0 + 3(1-t)²t·p1 + 3(1-t)t²·p2 + t³·p3
 * @param {Array} p0 - [x, y]
 * @param {Array} p1 - [x, y]
 * @param {Array} p2 - [x, y]
 * @param {Array} p3 - [x, y]
 * @param {number} t - Parameter in [0, 1]
 * @returns {Array} - [x, y] point on curve
 */
function cubicBezierBernstein(p0, p1, p2, p3, t) {
  return vecAdd(
    vecAdd(
      vecAdd(
        vecScale((1-t)**3, p0),
        vecScale(3 * (1-t)**2 * t, p1)
      ),
      vecScale(3 * (1-t) * t**2, p2)
    ),
    vecScale(t**3, p3)
  );
}

/**
 * Compute the four cubic Bernstein basis weights for a given t.
 * b0(t) = (1-t)³
 * b1(t) = 3(1-t)²t
 * b2(t) = 3(1-t)t²
 * b3(t) = t³
 * @param {number} t - Parameter
 * @returns {Array} - [b0, b1, b2, b3]
 */
function cubicBernsteinWeights(t) {
	return [
    (1 - t)**3,
    3 * (1 - t)**2 * t,
    3 * (1 - t) * t**2,
    t**3
  ];
}

/**
 * First derivative of cubic Bézier curve.
 * f'(t) = 3(1-t)²(p1-p0) + 6(1-t)t(p2-p1) + 3t²(p3-p2)
 * Or equivalently: f'(t) = 3[(1-t)²(p1-p0) + 2(1-t)t(p2-p1) + t²(p3-p2)]
 * @param {Array} p0 - [x, y]
 * @param {Array} p1 - [x, y]
 * @param {Array} p2 - [x, y]
 * @param {Array} p3 - [x, y]
 * @param {number} t - Parameter
 * @returns {Array} - [dx, dy] tangent vector
 */
function cubicBezierDerivative(p0, p1, p2, p3, t) {
  return vecAdd(
    vecAdd(
      vecScale(3 * (1 - t)**2, vecSub(p1, p0)),
      vecScale(6 * (1 - t) * t, vecSub(p2, p1))
    ),
    vecScale(3 * t**2, vecSub(p3, p2))
  );
}

/**
 * Vector subtraction: a - b
 * Helper function.
 * @param {Array} a - [x, y]
 * @param {Array} b - [x, y]
 * @returns {Array} - [x, y]
 */
function vecSub(a, b) {
	return [a[0] - b[0], a[1] - b[1]];
}

/**
 * Vector addition: a + b
 * Helper function.
 * @param {Array} a - [x, y]
 * @param {Array} b - [x, y]
 * @returns {Array} - [x, y]
 */
function vecAdd(a, b) {
	return [a[0] + b[0], a[1] + b[1]];
}

/**
 * Scalar multiplication: s * v
 * Helper function.
 * @param {number} s - Scalar
 * @param {Array} v - [x, y]
 * @returns {Array} - [x, y]
 */
function vecScale(s, v) {
	return [v[0] * s, v[1] * s];
}

/**
 * Euclidean distance between two points.
 * Helper function.
 * @param {Array} a - [x, y]
 * @param {Array} b - [x, y]
 * @returns {number}
 */
function distance(a, b) {
	return Math.sqrt((b[0] - a[0])**2 + (b[1] - a[1])**2);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
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
  };
}
