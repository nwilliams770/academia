// ============================================================
// EXTRA CREDIT SHADER SNIPPETS
// ============================================================
//
// This file is NOT loaded by the page. It is a reference document containing
// paste-ready GLSL blocks for your mesh fragment shader.
//
// USAGE:
// 1. Write your own mesh vertex and fragment shaders (homework steps 2 & 3).
// 2. After your shaders compile and render the mesh correctly, paste these
//    snippets into your fragment shader IN THE ORDER LISTED BELOW.
// 3. Call the hook functions in project4.js (see HOOK comments in MeshDrawer).
//
// REQUIREMENTS:
// - Your mesh shaders must be #version 300 es (WebGL2).
//   Mixing GLSL versions across programs in one context is fine, but mixing
//   within a program (e.g., #version 300 es vertex + GLSL 1.00 fragment) fails.
// - These snippets assume you have a varying named `vTexCoord` holding normalized
//   UV coordinates [0,1]. If you named it differently (e.g., `vUV`), rename
//   all occurrences of `vTexCoord` in the snippets below before pasting.
// - The debug view switch (Snippet 3) must be pasted BEFORE your final
//   `fragColor = ...` assignment, so it can override the output.
//
// ============================================================


// ============================================================
// SNIPPET 1 of 5 — F4 Debug View Uniforms
// PASTE INTO: Your mesh FRAGMENT shader, in the uniform declarations
//             section near the top, AFTER your sampler2D declaration.
// REQUIRES: Nothing. These are standalone uniform declarations.
// BREAKS IF: Pasted into the vertex shader (uniforms are per-program, but
//            these are only used in the fragment shader, so declare them there).
// ============================================================

uniform int uEcDebugView;    // Which debug visualization mode (0=off, 1=uv, 2=miplevel, etc.)
uniform vec2 uEcTexSize;     // Texture dimensions in texels (e.g., vec2(512.0, 512.0))


// ============================================================
// SNIPPET 2 of 5 — F6 Mip Bias Uniform
// PASTE INTO: Your mesh FRAGMENT shader, in the uniform declarations,
//             right after Snippet 1.
// REQUIRES: Nothing.
// BREAKS IF: Used in WebGL1 without EXT_shader_texture_lod (shader will
//            compile but texture() with bias will be ignored or error).
// ============================================================

uniform float uEcMipBias;    // Manual LOD bias (-4.0 to +4.0)


// ============================================================
// SNIPPET 3 of 5 — F7 Manual Anisotropic Filtering Uniforms
// PASTE INTO: Your mesh FRAGMENT shader, in the uniform declarations,
//             right after Snippet 2.
// REQUIRES: Nothing.
// BREAKS IF: N/A (standalone uniforms).
// ============================================================

uniform int uEcManualAniso;         // Enable hand-rolled aniso filtering (0 or 1)
uniform int uEcManualAnisoSamples;  // Sample count (1-16)


// ============================================================
// SNIPPET 4 of 5 — F4 Helper Function (Color Ramp)
// PASTE INTO: Your mesh FRAGMENT shader, in the global scope, AFTER the
//             uniform declarations and BEFORE main().
// REQUIRES: Nothing. This is a standalone helper function.
// BREAKS IF: Pasted inside main() (syntax error). Must be at global scope.
// ============================================================

// Maps a scalar value t in [0,1] to a blue → green → red color gradient.
// Used by debug views to visualize numbers (LOD, anisotropy ratio) as colors.
vec3 ecColorRamp(float t) {
	t = clamp(t, 0.0, 1.0);
	vec3 blue = vec3(0.0, 0.0, 1.0);
	vec3 green = vec3(0.0, 1.0, 0.0);
	vec3 red = vec3(1.0, 0.0, 0.0);
	if (t < 0.5) {
		return mix(blue, green, t * 2.0);
	} else {
		return mix(green, red, (t - 0.5) * 2.0);
	}
}


// ============================================================
// SNIPPET 5a of 5 — F7 Manual Anisotropic Filtering Function (STUB)
// PASTE INTO: Your mesh FRAGMENT shader, in the global scope, AFTER
//             Snippet 4 (ecColorRamp) and BEFORE main().
// REQUIRES: Snippets 1, 2, 3 (uniforms) already pasted.
// BREAKS IF: Pasted inside main() (syntax error). Must be at global scope.
// ============================================================

// ==== EXTRA CREDIT: F7 manual anisotropic filtering — BEGIN ====
// GOAL (Marschner & Shirley 11.3.5): approximate an elongated texture-space
// footprint better than a single square mipmap lookup can.
//
// Available to you:
//   vTexCoord                 - this fragment's UV, normalized [0,1]
//   uEcTexSize                - texture dimensions in texels (vec2)
//   dFdx(...) / dFdy(...)     - the two columns of the Jacobian J
//   textureLod(tex, uv, lod)  - explicit-LOD sampling
//   uEcManualAnisoSamples     - loop count
//
// MECHANICAL CONSTRAINT: GLSL requires a compile-time constant loop bound. Loop
// to a const MAX_ANISO_SAMPLES (16) and break once i >= uEcManualAnisoSamples.
vec4 ecManualAnisoSample(sampler2D tex, vec2 uv) {
    // TODO (student): implement me.
    return texture(tex, uv);   // placeholder passthrough
}
// ==== EXTRA CREDIT: F7 manual anisotropic filtering — END ====


// ============================================================
// SNIPPET 5b of 5 — F4 Debug View Switch + F6 Mip Bias + F7 Call Site
// PASTE INTO: Your mesh FRAGMENT shader, inside main(), BEFORE the final
//             `fragColor = ...` assignment that outputs your shaded color.
//
// REQUIRES:
//   - A varying vec2 vTexCoord (normalized UV from vertex shader)
//   - A sampler2D uniform (your texture, e.g., `uTexture`)
//   - Snippets 1, 2, and 3 already pasted above
//
// INTEGRATION POINT:
//   You have some code that computes the final shaded color, e.g.:
//       vec4 texColor = texture(uTexture, vTexCoord);
//       vec3 finalColor = texColor.rgb * lighting;  // or whatever
//       fragColor = vec4(finalColor, 1.0);
//
//   Insert this snippet BEFORE the final fragColor assignment. The snippet
//   will override fragColor for debug modes, or fall through for normal rendering.
//
// BREAKS IF:
//   - Pasted after `fragColor = ...` (debug views won't work; code is unreachable)
//   - `vTexCoord` is not defined (compilation error)
//   - Your sampler is named differently (replace `uTexture` below with your name)
//
// ============================================================

// MODIFICATIONS for F6 and F7:
//
// F6 (Mip Bias): If you want mip bias to affect your normal texture sampling
// (not just debug views), replace your existing texture() call with this pattern:
//
//     vec4 texColor;
//     if (abs(uEcMipBias) > 0.001) {
//         texColor = texture(uTexture, vTexCoord, uEcMipBias);
//     } else {
//         texColor = texture(uTexture, vTexCoord);
//     }
//
// The conditional ensures that when uEcMipBias is zero (default), your code is
// byte-identical to the stock project (constraint 6).
//
// F7 (Manual Aniso): To enable the hand-rolled anisotropic filtering, replace
// your texture sampling with:
//
//     vec4 texColor;
//     if (uEcManualAniso != 0) {
//         texColor = ecManualAnisoSample(uTexture, vTexCoord);
//     } else if (abs(uEcMipBias) > 0.001) {
//         texColor = texture(uTexture, vTexCoord, uEcMipBias);
//     } else {
//         texColor = texture(uTexture, vTexCoord);
//     }
//
// This cascades: manual aniso overrides bias overrides normal sampling.

// F4: Debug view switch
if (uEcDebugView == 1) {
	// CASE 1: UV Visualization (FULLY IMPLEMENTED)
	// Output UV coordinates as RG color. This creates a gradient showing how
	// UVs are mapped: (0,0)=black, (1,0)=red, (0,1)=green, (1,1)=yellow.
	// fract() wraps UVs to [0,1] so tiling textures show repeating color patterns.
	fragColor = vec4(fract(vTexCoord), 0.0, 1.0);
	return;
}

if (uEcDebugView == 2) {
	// CASE 2: Mip Level Visualization (STUB)
	//
	// GOAL: Color-code which mip level this fragment would sample at the
	//       automatically computed LOD. Blue = level 0 (base/highest detail),
	//       green/yellow/red = higher levels (lower detail). Shows how LOD
	//       changes with distance and viewing angle.
	//
	// Available to you:
	//   vTexCoord       - normalized UV coordinates [0,1]
	//   uEcTexSize      - texture dimensions in texels (vec2, e.g., vec2(512, 512))
	//   dFdx(vTexCoord) - partial derivative of vTexCoord w.r.t. screen-space x
	//   dFdy(vTexCoord) - partial derivative of vTexCoord w.r.t. screen-space y
	//   ecColorRamp(t)  - maps t in [0,1] to blue→green→red gradient
	//
	// The derivatives dFdx/dFdy give the Jacobian of the screen→texture mapping.
	// They tell you how much the UV changes per pixel in X and Y directions.
	//
	// See Marschner & Shirley §11.3.3 for LOD computation.
	//
	// TODO (student): Compute the LOD and output a color based on it.
	fragColor = vec4(1.0, 0.0, 1.0, 1.0); // Placeholder: magenta
	return;
}

if (uEcDebugView == 3) {
	// CASE 3: Anisotropy Ratio Visualization (STUB)
	//
	// GOAL: Heat-map how elongated (anisotropic) the pixel's texture-space
	//       footprint is. Blue = isotropic (roughly square), red = highly
	//       anisotropic (long ellipse). Shows where anisotropic filtering helps.
	//
	// Available to you:
	//   vTexCoord       - normalized UV coordinates [0,1]
	//   uEcTexSize      - texture dimensions in texels (vec2)
	//   dFdx(vTexCoord) - partial derivative of vTexCoord w.r.t. screen x
	//   dFdy(vTexCoord) - partial derivative of vTexCoord w.r.t. screen y
	//   ecColorRamp(t)  - maps t in [0,1] to blue→green→red gradient
	//
	// See Marschner & Shirley §11.3.5 for anisotropic filtering and footprint
	// ellipse computation.
	//
	// TODO (student): Compute the ratio and output a color encoding it.
	fragColor = vec4(1.0, 1.0, 0.0, 1.0); // Placeholder: yellow
	return;
}

if (uEcDebugView == 4) {
	// CASE 4: Texel Grid Overlay (STUB)
	//
	// GOAL: Draw a procedural grid at texel frequency (one grid cell = one texel).
	//       Helps visualize magnification (grid cells larger than pixels) vs.
	//       minification (grid cells smaller than pixels, aliased).
	//
	// Available to you:
	//   vTexCoord       - normalized UV coordinates [0,1]
	//   uEcTexSize      - texture dimensions in texels (vec2)
	//
	// You likely already sampled the texture earlier in main(). Blend grid lines
	// onto that color.
	//
	// TODO (student): Generate grid lines and blend them onto the texture color.
	fragColor = vec4(0.0, 1.0, 1.0, 1.0); // Placeholder: cyan
	return;
}

// If uEcDebugView is 0 (or any unhandled value), fall through to your normal
// rendering path below. The debug view switch does NOT set fragColor for case 0.
