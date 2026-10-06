/**
 * continuity-viz.js — demo tool, not an exercise.
 * Requires: curves-math.js, draw-helpers.js, continuity-exercises.js
 */

let ctx;  // draw-helpers.js reads this global; reassigned per panel

// Segment 1 — identical in all four panels. Joint is S1[3].
const S1 = [[30, 210], [70, 110], [150, 115], [185, 150]];

function withCanvas(id) {
	const c = document.getElementById(id);
	ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	return c;
}

function drawSeg(seg, color) {
	drawControlPolygonFor(seg, "#ddd", true);
	drawPolyline(sampleCubic(seg, 120), color, 2);
	seg.forEach((p, i) => drawPoint(p, 3.5, (i === 0 || i === 3) ? "black" : "white"));
}

function setStatus(id, ok, okText, badText) {
	const el = document.getElementById(id);
	el.textContent = ok ? okText : badText;
	el.style.color = ok ? "green" : "red";
}

// ------------------------------------------------------------------ C0 ----
const c0Slider = document.getElementById("c0-gap");
c0Slider.addEventListener("input", drawC0);

function drawC0() {
	const gap = parseFloat(c0Slider.value);
	const joint = S1[3];
	const q0 = [joint[0] + gap * 0.7, joint[1] + gap * 0.7];
	const S2 = [q0, [230, 240], [310, 130], [345, 195]];

	withCanvas("c0-canvas");
	drawSeg(S1, "darkred");
	drawSeg(S2, "darkgreen");

	if (gap > 0) { drawLine(joint, q0, "red", 2); drawPoint(q0, 5, "red"); }
	drawPoint(joint, 5, "red");

	document.getElementById("c0-val").textContent = gap;
	setStatus("c0-status", isC0ContinuousBezier(...S1, ...S2),
		"✓ C⁰ — connected (but still a corner)", "✗ not C⁰ — gap");
}

// ------------------------------------------------------------------ C1 ----
const c1Slider = document.getElementById("c1-angle");
c1Slider.addEventListener("input", drawC1);

function drawC1() {
	const deg = parseFloat(c1Slider.value);
	const rad = deg * Math.PI / 180;

	const { q0, q1: ideal } = solveC1Bezier(...S1);
	const v = vecSub(ideal, q0);
	const q1 = vecAdd(q0, [
		v[0] * Math.cos(rad) - v[1] * Math.sin(rad),
		v[0] * Math.sin(rad) + v[1] * Math.cos(rad)
	]);
	const S2 = [q0, q1, [300, 120], [345, 190]];

	withCanvas("c1-canvas");
	drawSeg(S1, "darkred");
	drawSeg(S2, "darkgreen");

	// these two legs are collinear iff C1
	drawLine(S1[2], q0, "blue", 2);
	drawLine(q0, q1, "blue", 2);
	drawPoint(q0, 5, "red");

	document.getElementById("c1-val").textContent = deg + "°";
	setStatus("c1-status", isC1ContinuousBezier(...S1, ...S2),
		"✓ C¹ — smooth", "✗ C⁰ only — corner");
}

// ------------------------------------------------------------------ C2 ----
const c2Slider = document.getElementById("c2-off");
c2Slider.addEventListener("input", drawC2);

function drawC2() {
	const off = parseFloat(c2Slider.value);

	const { q0, q1, q2 } = solveC2Bezier(...S1);
	const q2moved = vecAdd(q2, [0, off]);
	const S2 = [q0, q1, q2moved, [345, 175]];

	withCanvas("c2-canvas");
	drawSeg(S1, "darkred");
	drawSeg(S2, "darkgreen");
	drawPoint(q0, 5, "red");
	drawPoint(q2moved, 5, "orange");   // the point being moved

	const c1ok = isC1ContinuousBezier(...S1, ...S2);
	const c2ok = isC2ContinuousBezier(...S1, ...S2);

	document.getElementById("c2-val").textContent = off;
	document.getElementById("c2-status").innerHTML =
		(c1ok ? '<span style="color:green">✓ C¹</span>'
		      : '<span style="color:red">✗ C¹</span>') + " &nbsp; " +
		(c2ok ? '<span style="color:green">✓ C²</span>'
		      : '<span style="color:red">✗ C²</span>');
}

// ------------------------------------------------------------------ G1 ----
// Scale the second segment's tangent MAGNITUDE while keeping its DIRECTION.
// Shape stays smooth (G1 holds); speed jumps at the joint (C1 breaks).

const g1Slider = document.getElementById("g1-scale");
g1Slider.addEventListener("input", drawG1);

function drawG1() {
	const scale = parseFloat(g1Slider.value);

	const { q0, q1: ideal } = solveC1Bezier(...S1);
	const q1 = vecAdd(q0, vecScale(scale, vecSub(ideal, q0)));
	const S2 = [q0, q1, [300, 120], [345, 190]];

	withCanvas("g1-canvas");
	drawSeg(S1, "darkred");
	drawSeg(S2, "darkgreen");

	// dots at uniform steps of t — spacing reveals speed
	for (let i = 0; i <= 12; i++) {
		const t = i / 12;
		drawPoint(cubicBezierBernstein(...S1, t), 2.5, "black", null);
		drawPoint(cubicBezierBernstein(...S2, t), 2.5, "black", null);
	}
	drawPoint(q0, 5, "red");

	document.getElementById("g1-val").textContent = scale.toFixed(2) + "×";
	setStatus("g1-status", Math.abs(scale - 1) < 1e-6,
		"✓ C¹ (and G¹) — dot spacing matches across the joint",
		"✓ G¹ only — still smooth, but dot spacing jumps");
}

drawC0();
drawC1();
drawC2();
drawG1();
