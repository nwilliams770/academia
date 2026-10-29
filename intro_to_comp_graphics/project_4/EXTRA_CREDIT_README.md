# Extra Credit: Chapter 11 Texture Mapping Explorer

Interactive visualizations and tools for exploring texture mapping concepts from Marschner & Shirley's *Fundamentals of Computer Graphics*, Chapter 11.

## Overview

This scaffolding adds seven optional features to Project 4, all focused on making the abstract math of texture filtering **visible and interactive**. Every feature addresses a specific concept from Chapter 11: how pixel footprints map to texture space, why different filter modes produce different artifacts, and how the image→texture Jacobian varies with depth and viewing angle.

The ground plane is the key pedagogical artifact. It produces high minification (many texels per pixel) at grazing angles, making aliasing, mip-level transitions, and anisotropic footprints dramatically visible in ways a small foreground mesh cannot.

## Features

### F1 — Extra Credit UI Panel
**What it does:** Master enable/disable toggle and collapsible panel containing all extra credit controls.

**Chapter 11 connection:** N/A (UI scaffolding).

**Default behavior:** Panel collapsed, all features disabled. With the panel left untouched, the page renders identically to the stock project (constraint 6).

---

### F2 — Texture Filtering Modes
**What it does:** Runtime-switchable min/mag filter combinations: nearest (point sampling), bilinear, trilinear (mipmapped), and anisotropic (hardware extension). Includes a slider for anisotropy level (1-16x, shows detected GPU max).

**Chapter 11 connection (§11.2–11.3):** Each filter mode is a different strategy for reconstructing a continuous image from discrete texel samples:
- **Nearest**: Pick the closest texel. Fast, but produces blocky magnification and severe aliasing (Moiré, shimmering) during minification.
- **Bilinear**: Interpolate the 4 nearest texels. Smooths magnification but doesn't solve minification aliasing (still sampling a single mip level).
- **Trilinear**: Bilinearly sample two mip levels and lerp between them. The second lerp prevents visible seams where LOD changes. Standard high-quality minification filter.
- **Anisotropic**: Trilinear + elongated footprint sampling. When the texture plane is viewed at a grazing angle, the pixel footprint becomes a long ellipse rather than a square. Anisotropic filtering takes multiple samples along the major axis, preserving detail in that direction.

Try switching between modes with the ground plane tilted to a grazing angle. The difference between nearest (shimmering) and trilinear (smooth blur) is dramatic. Anisotropic filtering keeps the plane sharper than trilinear at grazing angles.

---

### F3 — Debug Ground Plane
**What it does:** A large horizontal textured quad (±50 units in XZ, Y=0) beneath the mesh, drawn with its own shader program. Uses the same texture you loaded, or a procedural checkerboard if no texture is loaded. Fully independent of MeshDrawer.

**Chapter 11 connection (§11.3):** The ground plane produces the conditions that make filtering differences visible:
- **High minification**: Distant pixels map to many texels (large footprints).
- **Grazing angles**: Elongated anisotropic footprints near the horizon.
- **Visible horizon**: Depth range to see mip level transitions.

Without this plane, filter modes look nearly identical on a small mesh. The ground plane is where you see aliasing shimmer, mip-level banding, and anisotropic sharpening.

The ground plane's shaders include all F4-F7 features, so debug views and manual aniso work on it immediately (before you paste snippets into your mesh shader).

---

### F4 — Debug Visualization Modes
**What it does:** Dropdown with five modes that override the fragment shader's output to visualize intermediate values:
- **Off**: Normal rendering (textured surface).
- **UV Coordinates**: Output `fract(UV)` as RGB color, showing how UVs are mapped and tiled.
- **Mip Level** (stub): Color-code which mip level the fragment samples (blue=level 0, red=high levels). Shows LOD transitions with distance/angle.
- **Anisotropy Ratio** (stub): Heat-map how elongated the footprint is (blue=isotropic, red=anisotropic). Shows where anisotropic filtering helps.
- **Texel Grid** (stub): Procedural grid at texel frequency (1 grid cell = 1 texel). Visualizes magnification (large cells) vs. minification (tiny aliased cells).

**Chapter 11 connection (§11.3.3, §11.3.5):** These views make the Jacobian (image→texture mapping derivative) visible. The Jacobian determines the pixel's footprint in texture space, which drives LOD computation and filter selection. Visualizing LOD and anisotropy ratio lets you see how the footprint changes with distance, angle, and projection mode.

**Implementation status:**
- UV visualization is **fully implemented** (ground plane and mesh, after snippets).
- Mip Level, Anisotropy Ratio, and Texel Grid are **stubbed** (student exercise). The plumbing (uniforms, switch statement, color ramp helper) is fully functional; only the math is missing.

---

### F5 — Orthographic / Perspective Projection Toggle
**What it does:** Dropdown to switch between perspective and orthographic projection. Uses the same near/far planes and aspect ratio as perspective, so the comparison is apples-to-apples.

**Chapter 11 connection (§11.3.3):** Under perspective projection, the texture footprint varies with depth (small near, large far) because of perspective foreshortening. This makes the computed LOD depth-dependent. Under orthographic projection, there is no perspective divide (w=1 always), so the footprint size is **constant across depth** for a planar surface. Only the viewing angle matters.

**What to observe:** Switch to orthographic with the ground plane visible. The key observation is NOT that aliasing disappears—at grazing angles, the footprints are still large and anisotropic, so the plane still aliases or blurs depending on the filter mode. The key observation is that the aliasing/blur is now **uniform across the entire plane** instead of graded by depth. With perspective, distant parts of the plane are blurrier (higher LOD) than near parts. With ortho, the entire plane samples the same LOD (for a given angle). If you implement the Mip Level debug view (F4 case 2), you'll see depth-graded color bands under perspective flatten to a single color under ortho.

**The lesson:** Perspective projection makes the Jacobian vary with depth. Orthographic projection makes the Jacobian constant per planar surface (but not necessarily small—grazing angles still produce large footprints).

---

### F6 — Mip Bias Slider
**What it does:** Slider to add a manual LOD bias (-4 to +4) to the automatically computed mip level. Positive bias = blurrier (higher mip), negative bias = sharper (lower mip, more aliasing).

**Chapter 11 connection (§11.3.3):** LOD is computed from the derivatives dFdx(UV) and dFdy(UV). The bias shifts the computed LOD by a constant, letting you intentionally over-blur or under-filter. This is useful for observing mip transitions (slide the bias to make the bands move) or for artistic control (e.g., intentionally blurring a background texture).

**Requirements:** WebGL2 only. The `texture(sampler, uv, bias)` form is not available in WebGL1 without EXT_shader_texture_lod (which is not implemented here). The slider is disabled in WebGL1 with a tooltip explaining why.

**Implementation status:** Fully functional on the ground plane. Works on the mesh after you paste Snippet 2 and integrate the conditional bias sampling shown in Snippet 5b.

---

### F7 — Hand-Rolled Anisotropic Filtering
**What it does:** Checkbox to enable a manual anisotropic filtering implementation (student exercise, currently stubbed). Includes a sample count slider (1-16).

**Chapter 11 connection (§11.3.5):** Hardware anisotropic filtering (F2) is a black box—the GPU does it for you. Implementing it yourself forces you to:
1. Compute the Jacobian from dFdx(UV) and dFdy(UV).
2. Decompose it into major/minor axes of the footprint ellipse.
3. Take multiple samples along the major axis at the appropriate LOD.

This is the deepest dive into the math of texture filtering in the project.

**Implementation status:** The plumbing is fully functional (uniforms uploaded, shader switch in place). The `ecManualAnisoSample` function is **stubbed** per the specification (TODO comment, placeholder passthrough). Implementing the body is the student's exercise. See Marschner & Shirley §11.3.5.

---

## File and Marker Reference

Quick-reference table for locating or removing any feature. To remove a feature, delete every block between its BEGIN/END markers.

| Feature | File | Marker Name |
|---------|------|-------------|
| **Batch B: WebGL2 Migration** | | |
| Context creation | `project4.html` | `EXTRA CREDIT: WEBGL2 MIGRATION` |
| boxVS/boxFS port | `project4.html` | `EXTRA CREDIT: WEBGL2 MIGRATION` (lines ~60-95) |
| Enhanced shader errors | `project4.html` | `EXTRA CREDIT: WEBGL2 MIGRATION` (CompileShader) |
| **Batch C: F1 + F2** | | |
| Script tag | `project4.html` | `EXTRA CREDIT: F1 UI Panel` |
| UI panel HTML | `project4.html` | `EXTRA CREDIT: F1 UI Panel` (lines ~483+) |
| Concept map | `extracredit.js` | `EXTRA CREDIT: Concept Map and State` |
| Global state object | `extracredit.js` | `EXTRA CREDIT: Global State Object` |
| F1 callbacks | `extracredit.js` | `EXTRA CREDIT: F1 UI Panel` |
| F2 filter modes | `extracredit.js` | `EXTRA CREDIT: F2 Texture Filtering Modes` |
| F2 hook (setTexture) | `project4.js` | `EXTRA CREDIT HOOK` (in setTexture) |
| Initialization | `extracredit.js` | `EXTRA CREDIT: Initialization` |
| **Batch D: F3** | | |
| ECGroundPlane class | `extracredit.js` | `EXTRA CREDIT: F3 Ground Plane` |
| DrawScene integration | `project4.html` | `EXTRA CREDIT: F3 Ground Plane` (DrawScene) |
| Far plane extension | `project4.html` | `EXTRA CREDIT: F3 Ground Plane` (UpdateProjectionMatrix) |
| **Batch E: F4 + F5** | | |
| Shader snippets file | `extracredit_shader_snippets.glsl` | (entire file) |
| F4 mesh plumbing | `extracredit.js` | `EXTRA CREDIT: F4 Mesh Shader Uniform Plumbing` |
| F4 hook (constructor) | `project4.js` | `EXTRA CREDIT HOOK` (in constructor) |
| F4 hook (draw) | `project4.js` | `EXTRA CREDIT HOOK` (in draw) |
| F5 ortho matrix | `extracredit.js` | `EXTRA CREDIT: F5 Orthographic Projection Matrix` |
| F5 projection toggle | `project4.html` | `EXTRA CREDIT: F5 Orthographic Projection Toggle` (UpdateProjectionMatrix) |

All extra credit code in `extracredit.js` is wrapped in feature-specific markers. Ground plane shader code (the worked example) is heavily commented per the C5 standard.

---

## Requirements and Graceful Degradation

### WebGL2 (strongly recommended)
- **Required for:** Derivative functions (dFdx/dFdy) in fragment shaders, textureLod, texture() with bias, textureSize, NPOT mipmaps.
- **Fallback behavior:** The page tries WebGL2 first and falls back to WebGL1 if unavailable. Most features work in WebGL1, but F6 (mip bias) is disabled (the `texture(sampler, uv, bias)` form doesn't exist in GLSL 1.00).

### Extensions
- **EXT_texture_filter_anisotropic** (WebGL1 and WebGL2): Required for F2's anisotropic filter mode. If unavailable, the "Anisotropic" dropdown option is disabled and marked "(unsupported)". Console warns once. Trilinear is still available as a fallback.

### Browser compatibility
Tested in Chrome, Firefox, Safari. All modern browsers support WebGL2. If you encounter issues:
- Check the console for the WebGL version message ("WebGL2 context created successfully" or "WebGL1 fallback").
- If shaders fail to compile, the console will show the full error log with numbered source lines. Common mistake: writing GLSL 1.00 syntax (`attribute`, `varying`, `gl_FragColor`) in a WebGL2 context. The version directive `#version 300 es` MUST be the literal first line of the shader string.

---

## How to Remove All Extra Credit Code

1. Delete the following files:
   - `extracredit.js`
   - `extracredit_shader_snippets.glsl`
   - `EXTRA_CREDIT_README.md` (this file)

2. In `project4.html`, `project4.js`, and any other modified files, delete every block between `==== EXTRA CREDIT: ... — BEGIN ====` and `==== EXTRA CREDIT: ... — END ====` markers. Use your editor's search function to find all instances of `EXTRA CREDIT:`.

3. Revert the WebGL context request to `webgl` if you want WebGL1, or leave it as `webgl2` (it's harmless and will be useful for your mesh shaders).

After removal, the page will render identically to the original project template.

---

## How to Use This Scaffolding

### Ground Plane Works Immediately
All F2-F7 features work on the **ground plane** as soon as you enable them, because the ground plane has its own complete shader program with all extra credit features already integrated.

### Mesh Requires Your Shaders + Snippets
Features will work on the **mesh** only after you:

1. **Write your mesh shaders** (MeshDrawer constructor + vertex/fragment shader strings). This is your homework (steps 2 & 3 of the assignment). Your shaders must be `#version 300 es` to match the WebGL2 context (mixing GLSL versions across programs is fine, but the box shaders are already ported to 300 es, so follow that lead).

2. **Paste the snippets** from `extracredit_shader_snippets.glsl` into your mesh fragment shader, in the order listed:
   - Snippet 1: F4 uniforms (`uEcDebugView`, `uEcTexSize`)
   - Snippet 2: F6 uniform (`uEcMipBias`)
   - Snippet 3: F7 uniforms (`uEcManualAniso`, `uEcManualAnisoSamples`)
   - Snippet 4: Helper function `ecColorRamp`
   - Snippet 5a: F7 stub function `ecManualAnisoSample`
   - Snippet 5b: F4 debug view switch + F6/F7 integration

3. **Call the hook functions** shown in the `EXTRA CREDIT HOOK` comments in `project4.js`:
   - In `MeshDrawer` constructor (after linking your shader program): call `EC.ecCacheMeshUniforms(gl, this.prog)`
   - In `MeshDrawer.draw()` (after `useProgram`, after binding texture, before `drawArrays`): call `EC.ecUploadMeshUniforms(gl)`

4. **(Optional) Implement the stubs** (F4 cases 2/3/4, F7). See the TODO stubs section below.

Until you do steps 1-3, the console will warn once: "Extra credit uniforms not found in mesh shader. Paste snippets..." This is expected and harmless—the mesh just won't have debug views until you paste the snippets.

---

## Things to Try

### Start Here: The Aliasing Demonstration
1. Expand the Extra Credit panel.
2. Check "Enable Extra Credit Features".
3. Check "Ground Plane" → a large checkerboard plane appears.
4. Mouse-drag to tilt the view toward a **grazing angle** (nearly horizontal, looking along the plane toward the horizon).
5. Filter mode is "Spec Default" (whatever your setTexture implementation sets, probably no mipmaps yet).
6. **Observe:** Severe shimmering, Moiré patterns, and flickering in the distance. This is **aliasing**—many texels mapping to one pixel, undersampled.

### The Trilinear Fix
1. With the ground plane at a grazing angle, switch "Texture Filter" to **"Nearest"** → aliasing gets worse (blocky pixels, no interpolation).
2. Switch to **"Bilinear"** → magnification smooths, but distant aliasing remains (we're still sampling level 0, which is too detailed for the footprint size).
3. Switch to **"Trilinear"** → distant plane blurs smoothly instead of shimmering. The blur is the mipmap doing its job: prefiltering the texture at lower resolutions.
4. Adjust the **Tiling slider** (1-50). High tiling = tiny checkers = more aliasing even with trilinear. Low tiling = large checkers = less aliasing.

### The Anisotropic Improvement
1. With the ground plane at a grazing angle and filter mode "Trilinear", notice the plane is blurry in the distance.
2. Switch to **"Anisotropic"** and slide the anisotropy level to your GPU's max (e.g., 16x).
3. **Observe:** The distant plane is now **sharper** than with trilinear, especially along one axis. Anisotropic filtering follows the elongated footprint instead of averaging over a square region.

### The Orthographic Comparison (Perspective vs. Constant Jacobian)
1. Enable the ground plane, set filter mode to "Trilinear", tilt to a moderate angle (not too grazing).
2. **Perspective mode (default):** Notice the distant parts of the plane are blurrier than the near parts. The texture LOD increases with depth.
3. Switch "Projection" to **"Orthographic"**.
4. **Observe:** The plane now has **uniform filtering** across its entire surface—the near and far edges sample the same mip level (for this viewing angle). The blur (or aliasing, if you switch to Nearest) is constant, not graded by depth.
5. **The lesson:** Perspective projection makes the Jacobian (footprint size) vary with depth due to perspective foreshortening. Orthographic projection removes the depth term, making the Jacobian constant per planar surface. The footprint is still large at grazing angles (so you still see blur or aliasing), but it doesn't **change** with distance. If you implement F4 case 2 (Mip Level visualization), you'll see color bands under perspective flatten to a single color under ortho.

### Mip Bias (Observing LOD Transitions)
1. WebGL2 required. Enable ground plane, filter mode "Trilinear", perspective projection.
2. Tilt to a grazing angle. The distant plane is blurred (high LOD).
3. Slide **"Mip Bias"** to **+2.0** → the plane blurs even more (you forced it to sample higher mip levels).
4. Slide to **-2.0** → the plane sharpens and may start aliasing (you forced it to sample lower mip levels, which are too detailed for the footprint).
5. **Use case:** If you implement F4 case 2 (Mip Level), slide the bias to make the color bands move. This lets you see exactly where mip transitions happen.

### UV Visualization (Debug View)
1. Enable ground plane, set "Debug View" to **"UV Coordinates"**.
2. The plane shows a repeating gradient: black → red → yellow → green (fract(UV) as RGB).
3. Adjust the **Tiling slider** → the gradient repeats more times (higher frequency).
4. **Verifies:** UVs are interpolated correctly and wrap mode is REPEAT.

### Stubbed Debug Views (Placeholders Until You Implement Them)
1. "Mip Level" → plane turns **magenta** (placeholder).
2. "Anisotropy Ratio" → plane turns **yellow** (placeholder).
3. "Texel Grid" → plane turns **cyan** (placeholder).
4. These are **your exercises**—see the TODO stubs section below.

---

## TODO Stubs (Student Exercises)

The following features have all plumbing, uniforms, and UI fully functional, but the core math is stubbed for you to implement. Each stub includes a comment block with:
- **GOAL**: What the feature should do.
- **Available inputs**: Variables/functions you can use.
- **Textbook reference**: Marschner & Shirley section number.
- **NO formulas or step sequences** (per the stub policy).

### F4 Case 2: Mip Level Visualization
- **File:** `extracredit.js` (ground plane shader, line ~590) and `extracredit_shader_snippets.glsl` (Snippet 5b, mesh shader)
- **Goal:** Color-code the computed LOD (blue=level 0, red=high levels).
- **Inputs:** `vTexCoord`, `uEcTexSize`, `dFdx`, `dFdy`, `ecColorRamp`
- **Reference:** Marschner & Shirley §11.3.3
- **Placeholder:** Outputs magenta

### F4 Case 3: Anisotropy Ratio Visualization
- **File:** `extracredit.js` (ground plane shader, line ~609) and `extracredit_shader_snippets.glsl` (Snippet 5b, mesh shader)
- **Goal:** Heat-map the anisotropy ratio (major axis / minor axis of footprint ellipse). Blue=isotropic, red=highly anisotropic.
- **Inputs:** `vTexCoord`, `uEcTexSize`, `dFdx`, `dFdy`, `ecColorRamp`
- **Reference:** Marschner & Shirley §11.3.5
- **Placeholder:** Outputs yellow

### F4 Case 4: Texel Grid Overlay
- **File:** `extracredit.js` (ground plane shader, line ~624) and `extracredit_shader_snippets.glsl` (Snippet 5b, mesh shader)
- **Goal:** Procedural grid at texel frequency (1 grid cell = 1 texel).
- **Inputs:** `vTexCoord`, `uEcTexSize`
- **Reference:** N/A (procedural graphics technique)
- **Placeholder:** Outputs cyan

### F7: Manual Anisotropic Filtering
- **File:** `extracredit.js` (ground plane shader, line ~547) and `extracredit_shader_snippets.glsl` (Snippet 5a, mesh shader)
- **Goal:** Approximate an elongated footprint with multiple samples along the major axis.
- **Inputs:** `vTexCoord`, `uEcTexSize`, `dFdx`, `dFdy`, `textureLod`, `uEcManualAnisoSamples`
- **Reference:** Marschner & Shirley §11.3.5
- **Mechanical constraint:** Loop to `const MAX_ANISO_SAMPLES = 16` and `break` when `i >= uEcManualAnisoSamples`.
- **Placeholder:** Passthrough (`return texture(tex, uv);`)

All four stubs are present in both the ground plane shader (where you can see them working after you implement them) and the snippet file (for your mesh shader). Implementing them is optional extra credit within extra credit.

---

## Common Issues

### "Extra credit uniforms not found in mesh shader"
This warning appears once when you load the page, before you've written your mesh shaders or pasted the snippets. It's expected. Once you paste Snippets 1-3 into your fragment shader and call `EC.ecCacheMeshUniforms(gl, this.prog)`, the warning will change to "Extra credit uniforms found and cached."

### Shader compile errors with "undeclared identifier" for `attribute`, `varying`, or `gl_FragColor`
You wrote GLSL 1.00 syntax in a WebGL2 context. Your shaders must start with `#version 300 es` (literal first line, no preceding whitespace). Change `attribute` → `in`, `varying` → `out` (VS) or `in` (FS), `gl_FragColor` → `out vec4 fragColor`, and `texture2D()` → `texture()`.

### Ground plane doesn't reach the horizon (clips at a hard edge)
The far plane extension (F3) should handle this automatically when the ground plane is enabled. If you see clipping, check that `EC.enabled && EC.groundPlane` is true, and that the far plane is extended to `transZ + 200.0` in `UpdateProjectionMatrix`.

### Mip bias slider is disabled
WebGL1 doesn't support the `texture(sampler, uv, bias)` form. Upgrade to WebGL2 or live without this feature. The tooltip on the slider explains this.

### Anisotropic filter mode is disabled / marked "(unsupported)"
Your GPU or driver doesn't expose `EXT_texture_filter_anisotropic`. This is rare on desktop but can happen on older mobile devices. Trilinear is a good fallback.

---

## Credits

Scaffolding generated by Claude (Anthropic). Original assignment and course framework by Prof. Cem Yuksel, University of Utah, CS 4600.
