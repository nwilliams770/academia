/**
 * single-point-viz.js
 * Visualize a single point on a cubic Bézier curve in detail.
 * Shows: the point, basis weights, de Casteljau construction, derivative.
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Control points (hardcoded for now)
const P = [
	[100, 300],
	[150, 50],
	[450, 50],
	[500, 300]
];

// Get UI elements
const tSlider = document.getElementById("tSlider");
const tValue = document.getElementById("tValue");
const showDecasteljau = document.getElementById("showDecasteljau");
const showDerivative = document.getElementById("showDerivative");

// Update handlers
tSlider.addEventListener("input", () => {
	draw();
	updateInfo();
});
showDecasteljau.addEventListener("change", draw);
showDerivative.addEventListener("change", draw);

function updateInfo() {
	const t = parseFloat(tSlider.value);

	// Update t display
	tValue.textContent = t.toFixed(2);
	document.getElementById("infoT").textContent = t.toFixed(2);

	// Compute point on curve
	const pt = cubicBezierBernstein(P[0], P[1], P[2], P[3], t);
	document.getElementById("infoX").textContent = pt[0].toFixed(1);
	document.getElementById("infoY").textContent = pt[1].toFixed(1);

	// Compute and display weights
	const weights = cubicBernsteinWeights(t);
	document.getElementById("w0").textContent = weights[0].toFixed(3);
	document.getElementById("w1").textContent = weights[1].toFixed(3);
	document.getElementById("w2").textContent = weights[2].toFixed(3);
	document.getElementById("w3").textContent = weights[3].toFixed(3);
	const wsum = weights[0] + weights[1] + weights[2] + weights[3];
	document.getElementById("weightSum").textContent = wsum.toFixed(3);

	// Compute derivative
	const deriv = cubicBezierDerivative(P[0], P[1], P[2], P[3], t);
	document.getElementById("derivX").textContent = deriv[0].toFixed(1);
	document.getElementById("derivY").textContent = deriv[1].toFixed(1);
	const mag = Math.sqrt(deriv[0] * deriv[0] + deriv[1] * deriv[1]);
	document.getElementById("derivMag").textContent = mag.toFixed(1);
}

function draw() {
	const t = parseFloat(tSlider.value);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawControlPolygon();
	drawCurve();

	if (showDecasteljau.checked) drawDecasteljauConstruction(t);
	if (showDerivative.checked)  drawDerivative(t);

  drawPoint(P[0], 5, "black");   // anchor
  drawPoint(P[3], 5, "black");   // anchor
  drawPoint(P[1], 5, "white");   // handle
  drawPoint(P[2], 5, "white");   // handle

	drawCurrentPoint(t);   // last so it's above everything
}

function drawControlPolygon() {
	// Style: dashed gray lines, thin
	ctx.lineWidth = 1;
	for (let i = 0; i < P.length - 1; i++) {
		drawLine(P[i], P[i + 1], "gray", true);  // dashed gray
	}
}

function drawCurve() {
	// Style: solid red line, medium thickness
  const steps = 100; // t
  ctx.beginPath();
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const point = cubicBezierBernstein(P[0], P[1], P[2], P[3], t);
    // Move cursor if we're just starting to draw
    if (i === 0) {
      ctx.moveTo(point[0], point[1])
    // Else we start 'drawing'
    } else {
      ctx.lineTo(point[0], point[1])
    }
  }
  ctx.strokeStyle = "darkred";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawDecasteljauConstruction(t) {
  // Level 1: lerp(P0,P1,t), lerp(P1,P2,t), lerp(P2,P3,t)
	// Level 2: lerp(q0,q1,t), lerp(q1,q2,t)
	// Level 3: lerp(r0,r1,t)
	// Each level in a different color
  const q0 = lerp(P[0], P[1], t);
  const q1 = lerp(P[1], P[2], t);
  const q2 = lerp(P[2], P[3], t);

  const r0 = lerp(q0, q1, t);
  const r1 = lerp(q1, q2, t);

  	// Level 1
	drawLine(q0, q1, "green");
	drawLine(q1, q2, "green");

	// Level 2 — this one is tangent to the curve
	drawLine(r0, r1, "blue");

	[q0, q1, q2].forEach(p => drawPoint(p, 4, "green"));
	[r0, r1].forEach(p => drawPoint(p, 4, "blue"));
}

function drawCurrentPoint(t) {
  const pt = cubicBezierBernstein(P[0], P[1], P[2], P[3], t);
  drawPoint(pt, 7, "red", "black");
}

function drawDerivative(t) {
	const point = cubicBezierBernstein(P[0], P[1], P[2], P[3], t);
	const velocity = cubicBezierDerivative(P[0], P[1], P[2], P[3], t);
	const scale = .25;  // proportional to speed, so you can see it vary
	const tip = [point[0] + velocity[0] * scale, point[1] + velocity[1] * scale];
	drawLine(point, tip, "blue");
}

function drawPoint(pt, radius, fillColor, strokeColor = "black") {
  ctx.beginPath();
  ctx.arc(pt[0], pt[1], radius, 0, 2 * Math.PI);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
}

function drawLine(p1, p2, color, dashed = false) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.setLineDash(dashed ? [5, 5] : []);
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.stroke();
  ctx.setLineDash([]); // reset so later solid lines aren't accidentally dashed
}

// Initialize
updateInfo();
draw();
