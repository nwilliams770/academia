/**
 * curves-viz.js
 * Full Bézier visualizer. Drag control points; watch the basis functions.
 *
 * Reuses: curves-math.js (Layer 1), draw-helpers.js (generic canvas primitives)
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let P = [
	[150, 450],
	[250, 100],
	[550, 100],
	[650, 450]
];

let selectedPoint = null;

// --- Basis function plot: a second coordinate system in the corner ---------
const PLOT = { x: 560, y: 420, w: 210, h: 150 };

const showCurve           = document.getElementById("showCurve");
const showControlPolygon  = document.getElementById("showControlPolygon");
const showConvexHull      = document.getElementById("showConvexHull");
const showBasisFunctions  = document.getElementById("showBasisFunctions");

[showCurve, showControlPolygon, showConvexHull, showBasisFunctions]
	.forEach(cb => cb.addEventListener("change", draw));

canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup",   () => { selectedPoint = null; });
canvas.addEventListener("mouseleave",() => { selectedPoint = null; });

function handleMouseDown(e) {
	const m = mousePos(e, canvas);
	for (let i = 0; i < P.length; i++) {
		if (pointInCircle(m, P[i], 10)) { selectedPoint = i; return; }
	}
}

function handleMouseMove(e) {
	if (selectedPoint === null) return;
	P[selectedPoint] = mousePos(e, canvas);
	draw();
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (showConvexHull.checked)     drawPolygon(P, "#eeeeee");
	if (showControlPolygon.checked) drawControlPolygonFor(P, "black", true);
	if (showCurve.checked)          drawPolyline(sampleCubic(P, 200), "darkred", 2);
	if (showBasisFunctions.checked) drawBasisFunctions();

	drawControlPoints();
	updateInfo();
}

function drawControlPoints() {
	// anchors filled, handles hollow — reinforces which ones the curve touches
	drawPoint(P[0], 6, "black");
	drawPoint(P[3], 6, "black");
	drawPoint(P[1], 6, "white");
	drawPoint(P[2], 6, "white");
	if (selectedPoint !== null) drawPoint(P[selectedPoint], 8, "red");
}

function updateInfo() {
	for (let i = 0; i < 4; i++) {
		document.getElementById(`p${i}Info`).textContent =
			`P\${"₀₁₂₃"[i]}: (\${P[i][0].toFixed(0)}, ${P[i][1].toFixed(0)})`;
	}
}

/**
 * CONCEPT: plot the four Bernstein basis functions b0..b3 against t.
 *   These depend ONLY on t — not on P. Drag the control points and this
 *   plot does not move. The recipe is fixed; only the points you blend change.
 *   Look for: b0/b3 run 1->0 and 0->1; b1/b2 are humps that are ZERO at both
 *   ends (hence the curve never touches P1, P2); heights always sum to 1.
 *
 * IMPLEMENTATION DETAIL (ignore conceptually): PLOT and plotToCanvas exist
 *   only because this graph shares a canvas with the curve, so [0,1]x[0,1]
 *   math coords must be mapped into a pixel box. Nothing to do with curves.
 */
function drawBasisFunctions() {
  let steps = 100;
  const curves = [[], [], [], []];


  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);

    const weights = cubicBernsteinWeights(t);
		for (let j = 0; j < weights.length; j++) {
			curves[j].push(plotToCanvas(t, weights[j]));
		}
  }

  const colors = ["red", "green", "blue", "orange"];
  for (let i = 0; i < curves.length; i++) {
    drawPolyline(curves[i], colors[i], 2);
  }
}

/**
 * [TODO] Map (t, weight) from [0,1]x[0,1] into canvas coords inside PLOT.
 * Remember to flip y.
 */
function plotToCanvas(t, weight) {
		return [
		PLOT.x + t * PLOT.w,
		PLOT.y + PLOT.h - weight * PLOT.h
	];
}

// ===========================================================================

draw();
