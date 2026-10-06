/**
 * draw-helpers.js
 * Generic Canvas 2D primitives. No knowledge of curves or globals.
 * Assumes a global `ctx` exists in the including page.
 */

function drawLine(p1, p2, color, lineWidth = 1, dashed = false) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.setLineDash(dashed ? [5, 5] : []);
	ctx.moveTo(p1[0], p1[1]);
	ctx.lineTo(p2[0], p2[1]);
	ctx.stroke();
	ctx.setLineDash([]);
}

function drawPoint(pt, radius, fillColor, strokeColor = "black") {
	ctx.beginPath();
	ctx.arc(pt[0], pt[1], radius, 0, 2 * Math.PI);
	ctx.fillStyle = fillColor;
	ctx.fill();
	if (strokeColor) {
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = 1;
		ctx.stroke();
	}
}

function drawPolygon(points, fillColor, strokeColor = null) {
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
	ctx.closePath();
	if (fillColor)   { ctx.fillStyle   = fillColor;   ctx.fill();   }
	if (strokeColor) { ctx.strokeStyle = strokeColor; ctx.stroke(); }
}

/** Stroke a polyline through an array of [x,y] points. */
function drawPolyline(points, color, lineWidth = 2) {
	if (points.length < 2) return;
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.setLineDash([]);
	ctx.stroke();
}

/** Sample a cubic Bezier into an array of points. */
function sampleCubic(pts, steps = 200) {
	const out = [];
	for (let i = 0; i < steps; i++) {
		const t = i / (steps - 1);
		out.push(cubicBezierBernstein(pts[0], pts[1], pts[2], pts[3], t));
	}
	return out;
}

/** Control polygon for an array of points. */
function drawControlPolygonFor(pts, color = "black", dashed = true) {
	for (let i = 0; i < pts.length - 1; i++) drawLine(pts[i], pts[i + 1], color, 1, dashed);
}

function pointInCircle(pt, center, radius) {
	const dx = pt[0] - center[0], dy = pt[1] - center[1];
	return dx * dx + dy * dy <= radius * radius;
}

/** Convert a mouse event to canvas-local coordinates. */
function mousePos(e, canvasEl) {
	const r = canvasEl.getBoundingClientRect();
	return [e.clientX - r.left, e.clientY - r.top];
}
