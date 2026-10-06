# Continuity in Curves

## The Problem: Joining Curve Segments

You have a long curve. You can't represent it as a single cubic — it would be too wiggly or wouldn't have the shape you want. So you break it into **segments**.

Each segment is a cubic Bézier: P0→P1→P2→P3 for segment 1, then Q0→Q1→Q2→Q3 for segment 2, etc.

But when you join them, there's a **seam**. The question is: how smooth is that seam?

---

## Types of Continuity (from weakest to strongest)

### C⁰ Continuity (positional continuity)

**Definition:** The two curves meet at the same point.

Mathematically: `f₁(1) = f₂(0)` (endpoint of segment 1 = start of segment 2)

**What it looks like:** No gap. But the curve can have a sharp corner.

**When you'd use it:** Almost never intentionally. It's the bare minimum.

**Example:** A sharp corner in a path. Visually acceptable if you want that corner.

---

### C¹ Continuity (tangent continuity)

**Definition:** The curves meet AND their tangents point the same direction.

Mathematically:

- `f₁(1) = f₂(0)` (positions match)
- `f₁'(1) = f₂'(0)` (tangents match in direction AND magnitude)

**What it looks like:** Smooth, no corner. But curvature can jump (the curve can "crease" in a way you might notice if you're looking at a reflection).

**When you'd use it:** Animation paths, camera motion, most hand-drawn curves. This is the sweet spot for "looks smooth."

**Example:** A smooth S-curve. Your eye won't detect the seam.

---

### C² Continuity (curvature continuity)

**Definition:** C¹ PLUS the second derivatives match.

Mathematically:

- `f₁(1) = f₂(0)` (positions)
- `f₁'(1) = f₂'(0)` (tangents)
- `f₁''(1) = f₂''(0)` (curvature)

**What it looks like:** The curve is smooth at every level. Reflections on the surface are smooth (no creases).

**When you'd use it:** Car bodies, product design, anything where light reflections need to be perfect.

**Example:** The hood of a car. C¹ would show a reflection crease; C² hides it.

---

## Why These Matter in Graphics

**C⁰:** Gaps are bad. Always avoid.

**C¹:** The default. Most curves in graphics are C¹ continuous. You get smooth motion and smooth-looking paths.

**C²:** The luxury. Expensive to enforce, but necessary for surfaces where reflections matter.

**C³+:** Rarely needed. Overkill for most applications.

---

## The Trade-off: Continuity vs. Control

Here's the key insight:

**Higher continuity = less local control.**

Why? Because enforcing C¹ at a seam means "the tangent at the end of segment 1 must equal the tangent at the start of segment 2." That's a **constraint**. Constraints reduce degrees of freedom.

Example:

- **Bézier:** You have 4 control points per segment. Total freedom. But when you join two Béziers, you get C⁰ (just the positions match).
- **Catmull-Rom:** You specify a list of points. The curve is automatically C¹ continuous. But you can't adjust individual tangents — the tangents are computed from the neighboring points.
- **B-spline:** Automatic C² continuity. But each control point affects multiple segments, so moving one point changes the whole curve.

**You're trading away local control to get continuity for free.**

---

## Practical Decision Tree

Do you want to control individual tangents? → YES: Use Bézier (C⁰) or Hermite (C¹ by hand) → NO: Use Catmull-Rom (C¹ automatic) or B-spline (C² automatic)

Do you need C² (for reflections)? → YES: Use B-spline or NURBS → NO: Use Catmull-Rom or Bézier

Do you want to specify a list of points the curve passes through? → YES: Use Catmull-Rom or Catmull-Rom-like → NO: Use Bézier (points pull, don't pin)

---

## Summary Table

| Curve Type | C⁰ | C¹ | C² | Local Control | Interpolating |
| --- | --- | --- | --- | --- | --- |
| **Bézier** | ✓ | ✗ | ✗ | ✓✓✓ | ✗ |
| **Hermite** | ✓ | ✓ (by hand) | ✗ | ✓✓ | ✓ |
| **Catmull-Rom** | ✓ | ✓ (auto) | ✗ | ✓ | ✓ |
| **B-spline** | ✓ | ✓ (auto) | ✓ (auto) | ✓ | ✗ |

---

# Continuity

## What's being joined

A single cubic can't draw a whole letter or a long path — not enough freedom.
So you **chain segments**. Segment 1 uses control points p0..p3, segment 2 uses
q0..q3. Each has its own `t` running 0→1.

Segment 1 ends at its t=1. Segment 2 begins at its t=0. That meeting place is
the **joint**, and continuity is entirely about what happens there.

f₁ and f₂ are two separate curves. Nothing forces them to relate. Continuity is
a set of increasingly strict conditions you impose on the relationship.

---

## The three levels

Everything reduces to "how many derivatives agree at the joint."

### C⁰ — positions match

    f₁(1) = f₂(0)      →      q0 = p3

No gap. But the curve can still have a sharp corner, like the point of a "V".

### C¹ — velocities match

    f₁'(1) = f₂'(0)

For cubic Bézier, f'(0) = 3(p1−p0) and f'(1) = 3(p3−p2), so:

    3(p3 − p2) = 3(q1 − q0)
    q1 − q0 = p3 − p2
    q1 = 2·p3 − p2            (given q0 = p3)

**Geometric reading: p2, the joint, and q1 must be collinear and evenly
spaced.** The joint is the midpoint of p2 and q1.

That's exactly what a pen tool does — grab one handle at an anchor and the
opposite handle swings to stay opposite. The software is enforcing C¹ for you.

### C² — accelerations match

    f₁''(1) = f₂''(0)

For cubic Bézier, f''(0) = 6(p2 − 2p1 + p0) and f''(1) = 6(p3 − 2p2 + p1).
Solving (with q0, q1 already fixed by C¹):

    q2 = p1 + 4(p3 − p2)

Now p1 is constrained too. Much tighter — you've used up 3 of segment 2's
4 control points. Only q3 is free.

---

## The physical version

A car driving the path:

| | what the driver experiences |
| --- | --- |
| C⁰ fails | teleports — there's a gap |
| C⁰ only | arrives, stops dead, drives off in a new direction (corner) |
| C¹ | turns the wheel smoothly through the joint |
| C² | the *rate* of wheel turning is also smooth — no jerk |

C¹ vs C² is usually invisible on the curve itself. You see it in **reflections**
off a surface built from those curves (a C¹-only joint shows as a faint crease)
or in **motion** (a slight lurch).

---

## G¹ vs C¹

- **C¹** — derivative vectors are *equal*
- **G¹** — derivative vectors are *parallel* (same direction, different length)

G¹ looks perfectly smooth. But the speed jumps at the joint, so an object
animated along the path visibly lurches even though the shape is fine.

Shape work → G¹ is enough. Motion → you want real C¹.

---

## Why the other curve types exist

**This is the payoff.** Enforcing continuity by hand is tedious. With raw
Béziers you get C⁰ free (reuse the endpoint) and then you must manually place
q1 at every single joint for C¹. For a font with 200 segments, unbearable.

So:

| type | you give it | continuity | cost |
| --- | --- | --- | --- |
| **Bézier** | 4 points/segment | C⁰ free, C¹ by hand | full manual control |
| **Hermite** | points + tangents | C¹ if you share tangents | you must supply tangents |
| **Catmull-Rom** | a list of points | **C¹ automatic** | can't set tangents yourself |
| **B-spline** | a list of points | **C² automatic** | curve doesn't pass through them |

**More automatic continuity ⟸ less direct control.** That's the whole trade,
and it's why there isn't one "best" curve type.
