# Basis Matrices

## Four control points are not a curve

They're coordinates. You also need to know what coordinate system you're in.
"10" is ten in decimal and two in binary — same symbols, different basis. Same
deal here.

    f(t) = u · B · p

    u = [1, t, t², t³]   the power vector — always the same
    B = 4×4 constant     THE INTERPRETATION — this is what names the curve type
    p = your 4 points    the data

Bézier, Hermite, Catmull-Rom, B-spline are the same cubic polynomial with
different B. That is the only difference between them.

## Why two representations exist at all

| form | good at | bad at |
|---|---|---|
| control points | **authoring** — drag them, endpoints obvious, convex hull | more work to evaluate |
| power basis a₀+a₁t+a₂t²+a₃t³ | **evaluating** — Horner, 3 mul 3 add | coefficients are visually meaningless |

So real pipelines store control points, convert once via B, and evaluate in
power form in the inner loop. B is a compile-time constant.

## Where B comes from

You don't look it up — you *state your constraints* and invert.

1. Write what you want, in words. ("curve starts at p0", "tangent at the end
   is 3(p3−p2)", etc.) Four constraints for a cubic.
2. Evaluate the generic cubic at those constraints → that's the matrix **C**.
   C is literally your constraints transcribed into a grid.
3. **B = C⁻¹**. C maps coefficients→points; you want the other direction.

That's the factory. Every curve family in the chapter comes out of it by
choosing different constraints in step 1.

## And u·B is the blending functions

Multiply out `[1,t,t²,t³] · B` for the Bézier matrix and you get

    [(1-t)³, 3(1-t)²t, 3(1-t)t², t³]

— the four curves you plotted in Layer 3. The basis matrix and the blending
functions are the same object in different clothing. Swap B and you swap those
four shapes.
