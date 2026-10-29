// ==== EXTRA CREDIT: Concept Map and State — BEGIN ====
//
// TEXTURE MAPPING SPACES (Marschner & Shirley Ch.11)
// ====================================================
// Three spaces and two mappings connect a screen pixel to a texture texel:
//
//   1. IMAGE SPACE (screen/window): integer pixel coordinates (x, y)
//      |
//      | π (pi): rasterizer + perspective divide → fragments with interpolated varyings
//      ↓
//   2. OBJECT SURFACE: 3D point on the mesh, with interpolated UV attribute
//      |
//      | φ (phi): the UV mapping (stored per-vertex, interpolated by rasterizer)
//      ↓
//   3. TEXTURE SPACE: 2D texel coordinates (u, v) or (s, t)
//
// The JACOBIAN of the composite mapping (image→texture) describes how a pixel's
// area in screen space maps to an area (the "footprint") in texture space.
// This footprint can be smaller than a texel (magnification), larger (minification),
// or elongated in one direction (anisotropic). All aliasing, blurring, and
// shimmering artifacts arise from how we sample this footprint.
//
// WHAT EACH FEATURE LETS YOU OBSERVE:
// ====================================
// F1 - UI Panel: master control for all exploration features
// F2 - Filter Modes: compare point/bilinear/trilinear/anisotropic sampling strategies
// F3 - Ground Plane: large horizontal surface producing high minification + grazing angles
// F4 - Debug Views: visualize UV coords, computed mip level, anisotropy ratio, texel grid
// F5 - Ortho/Perspective: watch mip-level banding flatten under orthographic projection
// F6 - Mip Bias: manually shift LOD to see mipmap transitions and intentional blur/sharpen
// F7 - Manual Anisotropic: implement footprint-aware sampling (student exercise, stubbed)
//
// START HERE: Enable the Extra Credit panel, turn on the Ground Plane, tilt the view
// to a grazing angle (mouse drag), and switch between Nearest and Trilinear filtering.
//
// ==== EXTRA CREDIT: Concept Map and State — END ====


// ==== EXTRA CREDIT: Global State Object — BEGIN ====
//
// WHAT: Single source of truth for all extra credit feature toggles and parameters.
//
// WHY (design): Centralized state prevents scattered globals and makes it trivial
//       to serialize/restore the UI state or reset to defaults.
//
// WHERE: Updated by UI controls (wired in Batch C), read by render/upload functions.
//
var EC = {
	enabled: false,               // Master toggle for all extra credit features
	filterMode: 'spec',           // 'spec'|'nearest'|'bilinear'|'trilinear'|'aniso'
	anisoLevel: 1,                // Anisotropy level (1-16), only used when filterMode='aniso'
	debugView: 'off',             // 'off'|'uv'|'miplevel'|'anisoratio'|'texelgrid'
	projection: 'perspective',    // 'perspective'|'ortho'
	groundPlane: false,           // Show/hide the debug ground plane
	groundTiling: 20.0,           // How many times the texture repeats across the ground plane
	mipBias: 0.0,                 // Manual LOD bias (-4 to +4)
	manualAniso: false,           // Enable hand-rolled anisotropic filtering (student exercise)
	manualAnisoSamples: 8,        // Sample count for manual aniso (1-16)

	// Internal state (not directly set by user)
	_anisoExtension: null,        // EXT_texture_filter_anisotropic, queried once
	_maxAnisotropy: 1,            // Max supported anisotropy level
	_filterModeWarned: false,     // Have we warned once about missing texture binding?
	_meshUniformsAvailable: false,// Do mesh shader uniforms exist (snippets pasted)?
	_meshUniforms: {},            // Cached uniform locations for mesh shader
};
// ==== EXTRA CREDIT: Global State Object — END ====


// ==== EXTRA CREDIT: F1 UI Panel — BEGIN ====
//
// WHAT: Master enable/disable toggle and control wiring for all extra credit features.
//
// WHY (design): Single entry point ensures all features start disabled (constraint 6:
//       default behavior must match spec behavior). Disabling the master toggle cleanly
//       reverts to stock project behavior.
//
// WHERE: Called from window.onload after the DOM is ready.
//

EC.onEnableChange = function(checkbox) {
	EC.enabled = checkbox.checked;

	// Enable/disable child controls based on master toggle.
	// All features F2-F7 are now functional (F6 WebGL2-only, F7 stubbed).
	const childControls = [
		'ec-filter-mode',   // F2 (Batch C)
		'ec-ground-plane',  // F3 (Batch D)
		'ec-debug-view',    // F4 (Batch E)
		'ec-projection',    // F5 (Batch E)
		'ec-manual-aniso',  // F7 (Batch F - stubbed)
		// F6 mip bias has conditional enable (WebGL2 only), handled below
	];

	childControls.forEach(id => {
		const elem = document.getElementById(id);
		if (elem && !elem.disabled) { // Don't override permanent disables (e.g., shader compile failure)
			elem.disabled = !EC.enabled;
		}
	});

	// F6 (mip bias): Only enable in WebGL2, disable in WebGL1 with tooltip
	const mipBiasSlider = document.getElementById('ec-mip-bias');
	if (mipBiasSlider) {
		if (window.EC_IS_WEBGL2) {
			mipBiasSlider.disabled = !EC.enabled;
			mipBiasSlider.title = EC.enabled ? '' : 'Enable Extra Credit to use';
		} else {
			mipBiasSlider.disabled = true;
			mipBiasSlider.title = 'Requires WebGL2 (texture() with bias parameter unavailable in WebGL1)';
		}
	}

	// If disabling, revert filter mode to 'spec' to restore original behavior
	if (!EC.enabled && EC.filterMode !== 'spec') {
		EC.filterMode = 'spec';
		document.getElementById('ec-filter-mode').value = 'spec';
		// Reapply to clear any filter state we set
		if (typeof gl !== 'undefined') EC.ecApplyFilterMode(gl);
	}

	// If disabling, also turn off ground plane to restore original behavior
	if (!EC.enabled && EC.groundPlane) {
		EC.groundPlane = false;
		document.getElementById('ec-ground-plane').checked = false;
	}

	// If disabling, reset mip bias and manual aniso to defaults
	if (!EC.enabled) {
		if (EC.mipBias !== 0.0) {
			EC.mipBias = 0.0;
			document.getElementById('ec-mip-bias').value = 0;
			document.getElementById('ec-mip-bias-value').textContent = '0.0';
		}
		if (EC.manualAniso) {
			EC.manualAniso = false;
			document.getElementById('ec-manual-aniso').checked = false;
			document.getElementById('ec-manual-aniso-samples-control').style.display = 'none';
		}
	}

	DrawScene();
};

// Batch C: F2 Filter Mode callbacks
EC.onFilterModeChange = function(select) {
	EC.filterMode = select.value;

	// Show/hide anisotropy slider based on mode
	const anisoControl = document.getElementById('ec-aniso-control');
	if (EC.filterMode === 'aniso') {
		anisoControl.style.display = 'block';
		document.getElementById('ec-aniso-level').disabled = !EC.enabled;
	} else {
		anisoControl.style.display = 'none';
	}

	// Apply immediately if a texture is bound (via hook in student's setTexture)
	if (typeof gl !== 'undefined') EC.ecApplyFilterMode(gl);
	DrawScene();
};

EC.onAnisoLevelChange = function(slider) {
	EC.anisoLevel = parseInt(slider.value);
	document.getElementById('ec-aniso-value').textContent = EC.anisoLevel;

	if (typeof gl !== 'undefined') EC.ecApplyFilterMode(gl);
	DrawScene();
};

// Batch D: F3 Ground Plane callbacks
EC.onGroundPlaneChange = function(checkbox) {
	EC.groundPlane = checkbox.checked;

	// Show/hide the tiling slider when ground plane is enabled/disabled
	const tilingControl = document.getElementById('ec-ground-tiling-control');
	const tilingSlider = document.getElementById('ec-ground-tiling');
	if (EC.groundPlane) {
		tilingControl.style.display = 'block';
		tilingSlider.disabled = false;
	} else {
		tilingControl.style.display = 'none';
	}

	// Update projection matrix because far plane extends when ground plane is visible
	UpdateProjectionMatrix();
	DrawScene();
};

EC.onGroundTilingChange = function(slider) {
	EC.groundTiling = parseFloat(slider.value);
	document.getElementById('ec-ground-tiling-value').textContent = EC.groundTiling.toFixed(0);
	DrawScene();
};

// Batch E: F4 Debug View callback (placeholder)
EC.onDebugViewChange = function(select) {
	EC.debugView = select.value;
	DrawScene();
};

// Batch E: F5 Projection callback (placeholder)
EC.onProjectionChange = function(select) {
	EC.projection = select.value;
	UpdateProjectionMatrix();
	DrawScene();
};

// Batch F: F6 Mip Bias callback (placeholder)
EC.onMipBiasChange = function(slider) {
	EC.mipBias = parseFloat(slider.value);
	document.getElementById('ec-mip-bias-value').textContent = EC.mipBias.toFixed(1);
	DrawScene();
};

// Batch F: F7 Manual Aniso callbacks
EC.onManualAnisoChange = function(checkbox) {
	EC.manualAniso = checkbox.checked;

	// Show/hide the samples slider when manual aniso is enabled/disabled
	const samplesControl = document.getElementById('ec-manual-aniso-samples-control');
	const samplesSlider = document.getElementById('ec-manual-aniso-samples');
	if (EC.manualAniso) {
		samplesControl.style.display = 'block';
		samplesSlider.disabled = false;
	} else {
		samplesControl.style.display = 'none';
	}

	DrawScene();
};

EC.onManualAnisoSamplesChange = function(slider) {
	EC.manualAnisoSamples = parseInt(slider.value);
	document.getElementById('ec-manual-aniso-samples-value').textContent = EC.manualAnisoSamples;
	DrawScene();
};

// ==== EXTRA CREDIT: F1 UI Panel — END ====


// ==== EXTRA CREDIT: F2 Texture Filtering Modes — BEGIN ====
//
// WHAT: Runtime switchable min/mag filter combinations applied to the active texture.
//
// WHY (Ch.11): Texture filtering determines how to reconstruct a continuous image from
//       discrete texel samples. The choice of filter trades off between aliasing
//       (undersampling artifacts like Moiré patterns and shimmering) and blur
//       (oversampling that loses high-frequency detail). Different filters handle
//       the magnification vs. minification cases differently:
//         - Magnification: pixel footprint SMALLER than a texel (close-up view)
//         - Minification: pixel footprint LARGER than a texel (distant view)
//       Mipmaps prefilter for minification; anisotropy handles elongated footprints.
//
// WHERE: Called from the student's setTexture() method via the hook comment, and
//       whenever the user changes the filter mode dropdown.
//
// GOTCHA: texParameteri affects the CURRENTLY BOUND texture (GL_TEXTURE_2D binding).
//       This function must be called AFTER gl.bindTexture, not before. If no texture
//       is bound, getParameter(TEXTURE_BINDING_2D) returns null and we no-op.
//

EC.ecQueryExtensions = function(gl) {
	// Query EXT_texture_filter_anisotropic (works in both WebGL1 and WebGL2).
	// This extension provides hardware anisotropic filtering, which samples the texture
	// footprint more accurately when it's elongated in one direction (grazing angles).
	EC._anisoExtension = gl.getExtension('EXT_texture_filter_anisotropic');

	if (EC._anisoExtension) {
		// MAX_TEXTURE_MAX_ANISOTROPY_EXT is the maximum anisotropy level this GPU supports.
		// Typical values: 4x (low-end), 8x (mid), 16x (high-end). Clamping to this prevents
		// requesting unsupported levels, which would be silently clamped anyway but better
		// to be explicit.
		EC._maxAnisotropy = gl.getParameter(EC._anisoExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		console.log(`EXT_texture_filter_anisotropic available. Max anisotropy: ${EC._maxAnisotropy}x`);

		// Update UI to show max level and clamp slider
		document.getElementById('ec-aniso-max').textContent = `(max: ${EC._maxAnisotropy}x)`;
		document.getElementById('ec-aniso-level').max = EC._maxAnisotropy;
	} else {
		// Extension unavailable: disable the aniso filter option entirely rather than
		// leaving it as a broken control. This follows constraint 7 (fail soft).
		console.warn('EXT_texture_filter_anisotropic not available. Anisotropic filtering disabled.');
		const anisoOption = document.getElementById('ec-filter-aniso-option');
		if (anisoOption) {
			anisoOption.disabled = true;
			anisoOption.textContent += ' (unsupported)';
		}
		EC._maxAnisotropy = 1; // No anisotropy
	}
};

EC.ecApplyFilterMode = function(gl) {
	// NO-OP if extra credit is disabled: constraint 6 requires default behavior == spec behavior.
	if (!EC.enabled || EC.filterMode === 'spec') {
		return;
	}

	// DEFENSIVE: Check if a texture is currently bound to GL_TEXTURE_2D.
	// texParameteri operates on the binding, not a texture object handle. If the student
	// hasn't implemented texture creation yet, or if this is called at the wrong time,
	// TEXTURE_BINDING_2D will be null and we should no-op rather than error.
	const boundTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
	if (!boundTexture) {
		if (!EC._filterModeWarned) {
			console.warn('EC.ecApplyFilterMode: No texture bound to TEXTURE_2D. Skipping filter setup. (This warning shown once.)');
			EC._filterModeWarned = true;
		}
		return;
	}

	// Apply the selected filter mode. Each mode sets MIN_FILTER and MAG_FILTER.
	//
	// MIN_FILTER: applies when the texture footprint is LARGER than a texel (minification).
	//   Common case: viewing a large textured surface from a distance. Without mipmaps,
	//   many texels map to one pixel, causing aliasing. With mipmaps, we sample a
	//   prefiltered lower-resolution level.
	//
	// MAG_FILTER: applies when the texture footprint is SMALLER than a texel (magnification).
	//   Common case: close-up view of a surface. One pixel maps to a fraction of a texel.
	//   Only NEAREST and LINEAR are valid (mipmaps don't help here; there's no smaller level).

	switch (EC.filterMode) {
		case 'nearest':
			// Point sampling: pick the nearest texel, no interpolation. Fastest, but produces
			// blocky magnification and severe aliasing (shimmering, Moiré) during minification.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			break;

		case 'bilinear':
			// LINEAR: bilinearly interpolate the 4 nearest texels. Smooths magnification
			// (no blocky pixels) but doesn't solve minification aliasing because we're still
			// sampling a single mip level (level 0). The footprint can still span many texels.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			break;

		case 'trilinear':
			// LINEAR_MIPMAP_LINEAR (trilinear): bilinearly sample TWO mip levels bracketing
			// the computed LOD, then linearly interpolate (lerp) between them. The second lerp
			// prevents visible seams where LOD changes. This is the standard high-quality filter
			// for minification. Requires mipmaps to exist.
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			// MAG_FILTER stays LINEAR because mipmaps are irrelevant during magnification
			// (we're already at the highest resolution level).
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

			// Generate mipmaps: recursively downsample the base level (level 0) by 2x in each
			// dimension until we reach 1x1. Each level is a box-filtered (simple average) version
			// of the level above. This is a one-time operation; if the texture image changes,
			// generateMipmap must be called again.
			//
			// WebGL1 NPOT restriction: If the texture dimensions are not power-of-two (NPOT),
			// generateMipmap throws INVALID_OPERATION. WebGL2 lifts this restriction.
			if (!window.EC_IS_WEBGL2) {
				// We can't query the texture dimensions without keeping track of the img element
				// that was uploaded. As a pragmatic fallback: attempt generateMipmap and catch
				// the error. A more robust approach would check img.width/img.height in setTexture.
				// For now, we'll just call it and warn if it fails (GL errors are async, so we
				// can't try/catch, but the student will see the error in their setTexture testing).
				console.warn('WebGL1: generateMipmap may fail on NPOT textures. Use power-of-two dimensions (e.g., 512x512) or upgrade to WebGL2.');
			}
			gl.generateMipmap(gl.TEXTURE_2D);
			break;

		case 'aniso':
			// Anisotropic filtering: trilinear + elongated footprint sampling.
			// When the texture plane is viewed at a grazing angle, the pixel footprint in texture
			// space becomes elongated (anisotropic) rather than roughly square (isotropic).
			// Trilinear assumes a square footprint and blurs excessively in the long direction.
			// Anisotropic filtering takes multiple samples along the major axis of the footprint,
			// preserving detail in that direction. The anisotropy level (e.g., 16x) controls how
			// many samples can be taken.
			if (!EC._anisoExtension) {
				console.warn('Anisotropic filtering selected but extension unavailable. Falling back to trilinear.');
			}

			// Start with trilinear as the base
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.generateMipmap(gl.TEXTURE_2D);

			// Add anisotropy if extension is available
			if (EC._anisoExtension) {
				// TEXTURE_MAX_ANISOTROPY_EXT: maximum anisotropy ratio for this texture.
				// 1.0 = isotropic (no anisotropic filtering, equivalent to trilinear).
				// Higher values allow more samples along the major axis. Clamped to the
				// GPU's MAX_TEXTURE_MAX_ANISOTROPY_EXT to avoid requesting unsupported levels.
				const level = Math.min(EC.anisoLevel, EC._maxAnisotropy);
				gl.texParameteri(gl.TEXTURE_2D, EC._anisoExtension.TEXTURE_MAX_ANISOTROPY_EXT, level);
			}
			break;
	}
};

// ==== EXTRA CREDIT: F2 Texture Filtering Modes — END ====


// ==== EXTRA CREDIT: Initialization — BEGIN ====
//
// WHAT: One-time setup called after the DOM and WebGL context are ready.
//
// WHERE: Hooked into window.onload (appended to existing onload, not replacing).
//

EC.ecInit = function() {
	if (typeof gl === 'undefined') {
		console.error('EC.ecInit: WebGL context (gl) not found. Extra credit features disabled.');
		return;
	}

	// Query extensions (F2)
	EC.ecQueryExtensions(gl);

	// F3: Initialize ground plane
	// The ground plane object is created once and reused. Its shaders and geometry are set up
	// in the constructor, so this is a one-time cost.
	EC.groundPlaneObj = new ECGroundPlane(gl);
	if (!EC.groundPlaneObj.prog) {
		console.error('EC.ecInit: Ground plane shader program failed to compile. Ground plane disabled.');
		EC.groundPlaneObj = null;
		// Disable the checkbox if shader compilation failed
		const checkbox = document.getElementById('ec-ground-plane');
		if (checkbox) {
			checkbox.disabled = true;
			checkbox.title = 'Ground plane shader compilation failed (check console)';
		}
	} else {
		// Enable the ground plane checkbox now that it's ready
		const checkbox = document.getElementById('ec-ground-plane');
		if (checkbox) {
			checkbox.disabled = false;
			checkbox.title = '';
		}
	}

	// F6: Enable mip bias slider only in WebGL2
	const mipBiasSlider = document.getElementById('ec-mip-bias');
	if (mipBiasSlider) {
		if (window.EC_IS_WEBGL2) {
			mipBiasSlider.disabled = false;
			mipBiasSlider.title = '';
			console.log('EC.ecInit: Mip bias slider enabled (WebGL2).');
		} else {
			mipBiasSlider.disabled = true;
			mipBiasSlider.title = 'Requires WebGL2 (texture() with bias parameter unavailable in WebGL1)';
			console.warn('EC.ecInit: Mip bias slider disabled (WebGL1). Upgrade to WebGL2 to use this feature.');
		}
	}

	// F7: Enable manual aniso controls (feature is stubbed but UI is functional)
	const manualAnisoCheckbox = document.getElementById('ec-manual-aniso');
	if (manualAnisoCheckbox) {
		manualAnisoCheckbox.disabled = false;
		manualAnisoCheckbox.title = '';
		console.log('EC.ecInit: Manual anisotropic filtering controls enabled (implementation stubbed).');
	}
};

// Append to existing window.onload rather than replacing it.
// The original onload (project4.html) calls InitWebGL, sets up mouse handlers, and DrawScene.
(function() {
	const originalOnload = window.onload;
	window.onload = function() {
		if (originalOnload) originalOnload();
		EC.ecInit();
	};
})();

// ==== EXTRA CREDIT: Initialization — END ====


// ==== EXTRA CREDIT: F3 Ground Plane — BEGIN ====
//
// WHAT: A large horizontal textured quad beneath the mesh, drawn with its own shader
//       program and VBOs. Completely independent of MeshDrawer.
//
// WHY (Ch.11): The ground plane is the key pedagogical artifact. It produces:
//       - HIGH MINIFICATION: distant pixels map to many texels (aliasing without mipmaps)
//       - GRAZING ANGLES: elongated anisotropic footprints near the horizon
//       - VISIBLE HORIZON: depth range to see mip level transitions and filter differences
//       Without this plane, filter modes look nearly identical on a small foreground mesh.
//
// WHERE: Instantiated in EC.ecInit(), drawn from DrawScene() via direct marked edit.
//
// GOTCHA: This class's shaders are your ONLY worked example of the full WebGL pipeline
//       in this project. Read them to understand attribute binding, varyings, texture
//       sampling, and uniform upload. Your mesh shaders (homework) will follow the same
//       structure, plus the extra credit snippet insertions.
//

class ECGroundPlane {
	constructor(gl) {
		this.gl = gl;

		// Compile and link the ground plane's shader program.
		// These shaders are FULLY IMPLEMENTED (not student homework) and serve as a
		// reference example. They include all F4-F7 features so you can see them working
		// immediately, before you paste snippets into your own mesh shader.
		this.prog = this.initShaderProgram(gl);

		// Cache uniform locations. getUniformLocation returns the location of a uniform
		// variable in the linked program. We cache these to avoid repeated lookups in
		// the draw loop (minor optimization, but also clearer code).
		this.mvpLoc = gl.getUniformLocation(this.prog, 'uMVP');
		this.texLoc = gl.getUniformLocation(this.prog, 'uTexture');
		this.tilingLoc = gl.getUniformLocation(this.prog, 'uTiling');
		this.debugViewLoc = gl.getUniformLocation(this.prog, 'uEcDebugView');
		this.texSizeLoc = gl.getUniformLocation(this.prog, 'uEcTexSize');
		this.mipBiasLoc = gl.getUniformLocation(this.prog, 'uEcMipBias');
		this.manualAnisoLoc = gl.getUniformLocation(this.prog, 'uEcManualAniso');
		this.manualAnisoSamplesLoc = gl.getUniformLocation(this.prog, 'uEcManualAnisoSamples');

		// Cache attribute location. Attributes are per-vertex inputs (position, UV, normal).
		// We only have position here; UVs are computed procedurally in the vertex shader.
		this.posLoc = gl.getAttribLocation(this.prog, 'aPos');

		// Create the vertex buffer object (VBO) and upload the quad geometry.
		this.initGeometry(gl);

		// Create a fallback checkerboard texture in case the user hasn't loaded a texture yet.
		// This ensures the ground plane always shows something meaningful.
		this.fallbackTexture = this.createCheckerboardTexture(gl);
	}

	initShaderProgram(gl) {
		// Vertex shader: transforms positions to clip space, computes UVs.
		// This shader is written for WebGL2 (#version 300 es). The version directive MUST
		// be the literal first line with no preceding whitespace, or compilation fails with
		// cryptic "unexpected token" errors.
		const vs = `#version 300 es
// VERTEX SHADER for ground plane
// INPUT SPACE: aPos is in world space (Y=0 plane, X and Z in range [-size, +size])
// OUTPUT SPACE: gl_Position is in clip space (after MVP transform)

in vec3 aPos;           // Vertex position attribute (world space, Y=0 plane)

uniform mat4 uMVP;      // Combined Model-View-Projection matrix (column-major)
uniform float uTiling;  // How many times the texture repeats across the plane

out vec2 vTexCoord;     // UV coordinates for fragment shader (normalized [0,1] range per tile)

void main() {
	// MATRIX CONVENTION: Column-major storage, M * v multiplication order.
	// The matrix is passed as a flat array [m0, m1, ..., m15] where the first 4 elements
	// are column 0, next 4 are column 1, etc. mat4(array) in GLSL reads it correctly.
	// Multiplication: uMVP * vec4(aPos, 1.0) transforms from world space → clip space.
	gl_Position = uMVP * vec4(aPos, 1.0);

	// TEXTURE COORDINATES: The ground plane extends from (-size, 0, -size) to (+size, 0, +size)
	// in world space (see initGeometry for size = 50). We map X and Z to UV in [0, uTiling].
	// The tiling parameter controls how many times the texture repeats. For example, if the
	// plane is 100 units wide and uTiling = 20, each tile is 5 units wide.
	// Division by 50.0: converts world space [-50, +50] to normalized [0, 1], then * uTiling.
	vTexCoord = (aPos.xz / 50.0 + 0.5) * uTiling;
	// Why +0.5? aPos.xz ranges [-50, +50], so aPos.xz / 50.0 is [-1, +1]. Adding 0.5 shifts
	// to [0, 1], which we then scale by uTiling for repeating.
}
`;

		// Fragment shader: samples the texture and applies debug views.
		const fs = `#version 300 es
// FRAGMENT SHADER for ground plane
// This shader demonstrates the full texture sampling pipeline and all extra credit debug views.

precision mediump float;  // Precision qualifier: required in GLSL ES. mediump is sufficient for
                          // most rendering (16-bit floats, ~3 decimal digits). highp would be
                          // 32-bit but is slower and often unsupported in fragment shaders on mobile.

in vec2 vTexCoord;        // UV coordinates from vertex shader (interpolated per-fragment)
                          // INTERPOLATION: The rasterizer performs PERSPECTIVE-CORRECT interpolation,
                          // dividing by gl_Position.w before interpolating, then multiplying back.
                          // This prevents texture swimming on surfaces viewed at an angle.

uniform sampler2D uTexture;   // The texture to sample (bound to texture unit 0)
uniform int uEcDebugView;     // Which debug visualization mode is active (0-4)
uniform vec2 uEcTexSize;      // Texture dimensions in texels (e.g., vec2(512, 512) for 512x512)
uniform float uEcMipBias;     // Manual LOD bias added to computed mip level (-4 to +4)
uniform int uEcManualAniso;   // Is hand-rolled anisotropic filtering enabled? (0 or 1)
uniform int uEcManualAnisoSamples; // Number of samples for manual aniso (1-16)

out vec4 fragColor;           // Output color (replaces gl_FragColor in GLSL 300 es)

// HELPER: Color ramp for visualizing scalar values.
// Maps t in [0, 1] to a blue → green → yellow → red gradient.
// Used by miplevel and anisoratio debug views to make numbers visible as colors.
vec3 ecColorRamp(float t) {
	// Clamp to [0, 1] to avoid out-of-range colors
	t = clamp(t, 0.0, 1.0);

	// Three-stop gradient: blue (t=0) → green (t=0.5) → red (t=1.0)
	// lerp(a, b, s) = a + s * (b - a), done component-wise
	vec3 blue = vec3(0.0, 0.0, 1.0);
	vec3 green = vec3(0.0, 1.0, 0.0);
	vec3 red = vec3(1.0, 0.0, 0.0);

	if (t < 0.5) {
		// First half: blue to green
		return mix(blue, green, t * 2.0);
	} else {
		// Second half: green to red
		return mix(green, red, (t - 0.5) * 2.0);
	}
}

// F7: MANUAL ANISOTROPIC FILTERING (STUDENT EXERCISE - STUBBED)
// GOAL (Marschner & Shirley 11.3.5): Approximate an elongated texture-space footprint
//       better than a single square mipmap lookup can. When the surface is viewed at
//       a grazing angle, the pixel's footprint in texture space becomes a long, thin
//       ellipse. Trilinear filtering assumes a square footprint and blurs excessively.
//       Anisotropic filtering takes multiple samples along the major axis of the ellipse.
//
// Available to you:
//   vTexCoord                 - this fragment's UV, normalized [0,1] per tile
//   uEcTexSize                - texture dimensions in texels (vec2)
//   dFdx(expr) / dFdy(expr)   - partial derivatives of expr w.r.t. screen-space x and y
//                               The rasterizer executes fragments in 2x2 quads to enable this.
//   texture(sampler, uv)      - standard texture sampling at computed LOD
//   textureLod(sampler, uv, lod) - explicit LOD sampling (WebGL2 only)
//   uEcManualAnisoSamples     - loop count (1-16)
//
// MECHANICAL CONSTRAINT: GLSL requires compile-time constant loop bounds. Loop to a
// const MAX_ANISO_SAMPLES (16) and break once i >= uEcManualAnisoSamples.
//
// TODO (student): implement the body of this function. See Marschner & Shirley 11.3.5.
vec4 ecManualAnisoSample(sampler2D tex, vec2 uv) {
	// Placeholder: just pass through standard trilinear sampling.
	return texture(tex, uv);
}

void main() {
	// DEFAULT PATH: sample the texture normally (trilinear if mipmaps exist, bilinear otherwise).
	// The texture() function (GLSL 300 es, replaces texture2D from GLSL 100 es) automatically
	// computes the LOD based on dFdx/dFdy of vTexCoord, then samples accordingly.
	vec4 texColor = texture(uTexture, vTexCoord);

	// F6: Manual mip bias. If uEcMipBias is non-zero, we use the explicit-bias form of texture().
	// This adds the bias to the automatically computed LOD. Positive bias = blurrier (higher mip),
	// negative bias = sharper (lower mip, more aliasing). Only supported in WebGL2.
	if (abs(uEcMipBias) > 0.001) {
		texColor = texture(uTexture, vTexCoord, uEcMipBias);
	}

	// F7: Manual anisotropic filtering. If enabled, replace the standard sample with the
	// hand-rolled version (currently stubbed, returns same as texture()).
	if (uEcManualAniso != 0) {
		texColor = ecManualAnisoSample(uTexture, vTexCoord);
	}

	// F4: Debug view switch. Allows visualizing intermediate values instead of the final color.
	// Case 0 (off) falls through to output texColor normally. Other cases override fragColor.

	if (uEcDebugView == 1) {
		// F4 CASE 1: UV visualization (FULLY IMPLEMENTED)
		// Output the UV coordinates as RG color channels, with B=0 and A=1.
		// This creates a gradient: black at (0,0), red at (1,0), green at (0,1), yellow at (1,1).
		// Useful for verifying that UVs are interpolated correctly and wrap as expected.
		fragColor = vec4(fract(vTexCoord), 0.0, 1.0);
		// fract() wraps to [0,1] so we see the pattern repeat with tiling.
		return;
	}

	if (uEcDebugView == 2) {
		// F4 CASE 2: Mip level visualization (STUB)
		// GOAL: Color-code which mip level this fragment would sample at the computed LOD.
		//       Level 0 (base) = blue, higher levels (1, 2, ...) ramp through green/yellow/red.
		//       This makes mipmap transitions visible as color bands, and shows how LOD changes
		//       with distance and viewing angle.
		//
		// Available: vTexCoord (normalized UV), uEcTexSize (texel dimensions), dFdx/dFdy for
		//            computing derivatives, ecColorRamp(t) to convert LOD to color.
		//
		// See Marschner & Shirley §11.3.3 for the LOD computation formula.
		//
		// TODO (student): compute LOD and output a color based on it.
		fragColor = vec4(1.0, 0.0, 1.0, 1.0); // Placeholder: magenta
		return;
	}

	if (uEcDebugView == 3) {
		// F4 CASE 3: Anisotropy ratio visualization (STUB)
		// GOAL: Heat-map how elongated (anisotropic) the pixel footprint is in texture space.
		//       Isotropic (square-ish) = blue, highly anisotropic (long ellipse) = red.
		//       This shows where hardware/manual anisotropic filtering helps most (grazing angles).
		//
		// Available: vTexCoord, uEcTexSize, dFdx/dFdy, ecColorRamp(t).
		//
		// See Marschner & Shirley §11.3.5.
		//
		// TODO (student): compute the ratio and output a color encoding it.
		fragColor = vec4(1.0, 1.0, 0.0, 1.0); // Placeholder: yellow
		return;
	}

	if (uEcDebugView == 4) {
		// F4 CASE 4: Texel grid overlay (STUB)
		// GOAL: Draw a procedural grid at texel frequency (one grid cell = one texel).
		//       Helps visualize magnification (grid cells larger than pixels) vs. minification
		//       (grid cells smaller than pixels, causing aliasing).
		//
		// Available: vTexCoord, uEcTexSize.
		//
		// TODO (student): blend grid lines onto texColor.
		fragColor = vec4(0.0, 1.0, 1.0, 1.0); // Placeholder: cyan
		return;
	}

	// Default: output the sampled texture color (possibly with mip bias or manual aniso applied).
	fragColor = texColor;
}
`;

		// Compile shaders and link program using the existing helper functions from project4.html.
		// InitShaderProgram calls CompileShader (which has our enhanced error logging) and linkProgram.
		const prog = InitShaderProgram(vs, fs);
		if (!prog) {
			console.error('ECGroundPlane: Failed to initialize shader program.');
			return null;
		}
		return prog;
	}

	initGeometry(gl) {
		// Create a horizontal quad in the XZ plane (Y=0) extending far enough to produce
		// a visible horizon when viewed at grazing angles.
		//
		// WHY THIS SIZE: The quad extends from (-50, 0, -50) to (+50, 0, +50) in world space,
		// a 100x100 unit square. This is much larger than the unit mesh (which fits in [-1, +1]).
		// When the camera tilts toward the horizon, the far edge of the plane recedes deep into
		// the view frustum, producing high minification (many texels per pixel) and elongated
		// footprints (anisotropy). Without this depth range, filtering differences are invisible.
		//
		// TRADEOFF: Larger plane = more depth = more Z-fighting risk due to reduced depth buffer
		// precision (see UpdateProjectionMatrix for far plane extension). 100 units is enough to
		// see the horizon without severe precision loss on typical 24-bit depth buffers.

		const size = 50.0; // Half-extent in X and Z
		const y = -0.01;   // Slightly below Y=0 to avoid Z-fighting with a mesh that touches Y=0.
		                   // This offset is negligible visually but prevents flickering.

		// Quad vertices: two triangles forming a rectangle.
		// Winding order: CCW when viewed from above (+Y). Positions are in world space.
		const positions = new Float32Array([
			// Triangle 1
			-size, y, -size,  // Bottom-left
			 size, y, -size,  // Bottom-right
			 size, y,  size,  // Top-right
			// Triangle 2
			-size, y, -size,  // Bottom-left
			 size, y,  size,  // Top-right
			-size, y,  size,  // Top-left
		]);

		// Create a buffer object and upload the position data.
		// BUFFER LIFECYCLE: createBuffer() allocates a name, bindBuffer() makes it current,
		// bufferData() uploads data to GPU memory. STATIC_DRAW hints that we won't modify it.
		this.vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

		// Unbind to avoid accidental modification. Not strictly necessary (draw() will bind again),
		// but defensive: leaving buffers bound is a common source of bugs when multiple objects
		// share the context.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		this.vertexCount = 6; // Two triangles = 6 vertices
	}

	createCheckerboardTexture(gl) {
		// Generate a procedural 256x256 checkerboard texture as a fallback for when the user
		// hasn't loaded a texture yet. This ensures the ground plane always shows something
		// meaningful (and the checkerboard pattern makes aliasing very obvious).

		const size = 256;
		const checkSize = 32; // Each checker square is 32x32 pixels

		// Create an off-screen canvas to draw the checkerboard pattern.
		// We use 2D canvas API because it's simpler than building a pixel array by hand,
		// and the one-time cost is negligible.
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');

		// Draw alternating black and white squares
		for (let y = 0; y < size; y += checkSize) {
			for (let x = 0; x < size; x += checkSize) {
				// Checkerboard logic: (x/checkSize + y/checkSize) % 2 determines color
				const isWhite = (Math.floor(x / checkSize) + Math.floor(y / checkSize)) % 2 === 0;
				ctx.fillStyle = isWhite ? '#FFFFFF' : '#000000';
				ctx.fillRect(x, y, checkSize, checkSize);
			}
		}

		// Upload the canvas content as a WebGL texture.
		const texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);

		// texImage2D: upload the canvas as the base mip level (level 0).
		// RGB internal format: we don't need alpha. UNSIGNED_BYTE: 8 bits per channel.
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, canvas);

		// Generate mipmaps: 256 is power-of-two, so this works in both WebGL1 and WebGL2.
		// Mipmaps are essential for the ground plane to avoid aliasing in the distance.
		gl.generateMipmap(gl.TEXTURE_2D);

		// Wrap mode: REPEAT allows UVs > 1.0 to tile the texture.
		// S and T are texture coordinate axes (equivalent to U and V).
		// REPEAT means fract(UV) is applied automatically, wrapping [0,1] infinitely.
		// Without this, UVs outside [0,1] would clamp to the edge color (CLAMP_TO_EDGE).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

		// Filter mode: Start with trilinear for smooth rendering. F2's ecApplyFilterMode()
		// will override this when the user changes filter modes (it affects all bound textures).
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

		gl.bindTexture(gl.TEXTURE_2D, null); // Unbind

		return texture;
	}

	draw(mvp) {
		const gl = this.gl;

		// Use the ground plane's shader program.
		// useProgram() makes this program active; subsequent uniform/attribute calls and
		// draw calls will use it until another useProgram() call.
		gl.useProgram(this.prog);

		// Upload the MVP matrix uniform.
		// uniformMatrix4fv: upload a 4x4 matrix. Second parameter (transpose) is false because
		// our matrices are already in column-major order (the format GLSL expects).
		// The mvp array is the same one passed to BoxDrawer.draw() and MeshDrawer.draw().
		gl.uniformMatrix4fv(this.mvpLoc, false, mvp);

		// Upload tiling parameter (how many times the texture repeats across the plane).
		gl.uniform1f(this.tilingLoc, EC.groundTiling);

		// Bind the texture to texture unit 0.
		// TEXTURE UNITS: WebGL has multiple "slots" (units) for binding textures simultaneously.
		// We use unit 0 here. activeTexture() selects the unit, bindTexture() binds to it.
		// The sampler uniform (uTexture) is set to 0 to read from this unit.
		gl.activeTexture(gl.TEXTURE0);

		// Use the user's loaded texture if available, otherwise the checkerboard fallback.
		// We check if meshDrawer has a texture by looking at the global texture-img element.
		// This is a bit hacky but avoids coupling to MeshDrawer internals.
		const userTextureImg = document.getElementById('texture-img');
		const hasUserTexture = userTextureImg && userTextureImg.src && userTextureImg.complete;

		if (hasUserTexture && window.meshDrawer && window.meshDrawer.texture) {
			// Use the mesh's texture (assumes student implemented setTexture and stored it).
			// This is defensive: if the student hasn't implemented texture storage yet,
			// we fall back to checkerboard.
			gl.bindTexture(gl.TEXTURE_2D, window.meshDrawer.texture);
		} else {
			// No user texture loaded yet: use the checkerboard fallback.
			gl.bindTexture(gl.TEXTURE_2D, this.fallbackTexture);
		}

		// Apply filter mode to the currently bound texture (checkerboard or user texture).
		// This ensures the ground plane respects the F2 filter mode selection.
		if (typeof EC !== 'undefined') {
			EC.ecApplyFilterMode(gl);
		}

		// Get the bound texture's dimensions for the uEcTexSize uniform.
		// getTexParameter() queries properties of the currently bound texture.
		// TEXTURE_WIDTH/HEIGHT return the dimensions of mip level 0 (the base level).
		const texWidth = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WIDTH);
		const texHeight = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_HEIGHT);
		gl.uniform2f(this.texSizeLoc, texWidth, texHeight);

		// Upload the sampler uniform: tells the shader to read from texture unit 0.
		// uniform1i sets an integer uniform. Samplers are bound to integer unit numbers.
		gl.uniform1i(this.texLoc, 0);

		// Upload extra credit debug/feature uniforms (F4, F6, F7).
		// These uniforms exist in the shader even though some features are stubbed, so the
		// plumbing is fully functional and students can see partial results immediately.
		const debugViewMap = { 'off': 0, 'uv': 1, 'miplevel': 2, 'anisoratio': 3, 'texelgrid': 4 };
		gl.uniform1i(this.debugViewLoc, debugViewMap[EC.debugView] || 0);
		gl.uniform1f(this.mipBiasLoc, EC.mipBias);
		gl.uniform1i(this.manualAnisoLoc, EC.manualAniso ? 1 : 0);
		gl.uniform1i(this.manualAnisoSamplesLoc, EC.manualAnisoSamples);

		// Bind the VBO and set up the position attribute.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

		// vertexAttribPointer: describe how to read the position attribute from the VBO.
		// Parameters: (location, size, type, normalized, stride, offset)
		//   - location: attribute location (this.posLoc, from getAttribLocation)
		//   - size: 3 components per vertex (x, y, z)
		//   - type: FLOAT (each component is a 32-bit float)
		//   - normalized: false (don't normalize to [0,1] or [-1,1])
		//   - stride: 0 (tightly packed, no interleaved attributes)
		//   - offset: 0 (start at the beginning of the buffer)
		gl.vertexAttribPointer(this.posLoc, 3, gl.FLOAT, false, 0, 0);

		// enableVertexAttribArray: enable the attribute so the shader can read it.
		// IMPORTANT: This is per-attribute state that persists until explicitly disabled.
		// Leaving attributes enabled can cause bugs in other draw calls (see cleanup below).
		gl.enableVertexAttribArray(this.posLoc);

		// Draw the quad: 6 vertices, starting at index 0.
		// drawArrays: non-indexed draw (vertices are in order in the VBO).
		// TRIANGLES: every 3 vertices form one triangle.
		gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

		// CLEANUP: Restore GL state to avoid corrupting subsequent draws.
		// GOTCHA: Leaving vertex attrib arrays enabled is one of the most common and confusing
		// WebGL bugs. If we leave this.posLoc enabled, and the next draw call (BoxDrawer or
		// MeshDrawer) doesn't explicitly disable it before setting up its own attributes, it
		// may try to read from our VBO with the wrong format, producing garbage geometry.
		// The symptom (broken rendering in a different object) appears far from the cause
		// (here), making it hard to debug. Always clean up.
		gl.disableVertexAttribArray(this.posLoc);

		// Unbind the VBO. Not strictly necessary for correctness (the next draw will bind its
		// own), but defensive programming: don't leave the context in an unexpected state.
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// Unbind the texture. Same reasoning: the next draw should bind what it needs, but
		// leaving a texture bound can cause confusion (e.g., ecApplyFilterMode() might affect
		// the wrong texture if called at the wrong time).
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

// ==== EXTRA CREDIT: F3 Ground Plane — END ====


// ==== EXTRA CREDIT: Placeholder Functions (implemented in later batches) — BEGIN ====

// Batch D: F3 Ground Plane - implemented below
EC.groundPlaneObj = null; // Will hold ECGroundPlane instance when enabled

// ==== EXTRA CREDIT: F4 Mesh Shader Uniform Plumbing — BEGIN ====
//
// WHAT: Cache and upload extra credit uniform locations to the student's mesh shader.
//
// WHY (design): The student's mesh shader won't have the extra credit uniforms until
//       they paste the snippets from extracredit_shader_snippets.glsl. These functions
//       must handle the case where the uniforms don't exist yet (getUniformLocation
//       returns null) without breaking the render loop.
//
// WHERE: ecCacheMeshUniforms is called once after the student links their mesh shader
//       program (see hook comment in MeshDrawer constructor). ecUploadMeshUniforms is
//       called every frame in MeshDrawer.draw() before the drawArrays call.
//
// GOTCHA: getUniformLocation returns null if the uniform doesn't exist. This is NOT
//       an error (the student hasn't pasted snippets yet), so we store null and skip
//       uniform uploads until the uniforms are available. Warn once, not per frame.
//

EC.ecCacheMeshUniforms = function(gl, program) {
	if (!program) {
		console.warn('EC.ecCacheMeshUniforms: program is null. Skipping.');
		EC._meshUniformsAvailable = false;
		return;
	}

	// Query all extra credit uniform locations from the mesh shader.
	// getUniformLocation returns null if the uniform doesn't exist in the shader
	// (either because the snippets haven't been pasted, or because the uniform was
	// optimized out by the compiler if it's unused).
	EC._meshUniforms = {
		uEcDebugView: gl.getUniformLocation(program, 'uEcDebugView'),
		uEcTexSize: gl.getUniformLocation(program, 'uEcTexSize'),
		uEcMipBias: gl.getUniformLocation(program, 'uEcMipBias'),
		uEcManualAniso: gl.getUniformLocation(program, 'uEcManualAniso'),
		uEcManualAnisoSamples: gl.getUniformLocation(program, 'uEcManualAnisoSamples'),
	};

	// Check if at least the core uniforms (debugView, texSize) exist.
	// If they're all null, the student hasn't pasted the snippets yet.
	const hasAnyUniforms = EC._meshUniforms.uEcDebugView !== null ||
	                       EC._meshUniforms.uEcTexSize !== null;

	EC._meshUniformsAvailable = hasAnyUniforms;

	if (!EC._meshUniformsAvailable) {
		console.warn('EC.ecCacheMeshUniforms: Extra credit uniforms not found in mesh shader. ' +
		             'Paste snippets from extracredit_shader_snippets.glsl into your fragment shader. ' +
		             '(This warning shown once.)');
	} else {
		console.log('EC.ecCacheMeshUniforms: Extra credit uniforms found and cached.');
	}
};

EC.ecUploadMeshUniforms = function(gl) {
	// NO-OP if extra credit is disabled or uniforms don't exist yet.
	if (!EC.enabled || !EC._meshUniformsAvailable) {
		return;
	}

	const u = EC._meshUniforms;

	// Upload each uniform if its location is valid (not null).
	// Even if the student pasted some snippets but not others, we handle partial availability.

	if (u.uEcDebugView !== null) {
		// Map debug view string to integer for the shader.
		const debugViewMap = { 'off': 0, 'uv': 1, 'miplevel': 2, 'anisoratio': 3, 'texelgrid': 4 };
		const debugViewInt = debugViewMap[EC.debugView] || 0;
		gl.uniform1i(u.uEcDebugView, debugViewInt);
	}

	if (u.uEcTexSize !== null) {
		// Get the currently bound texture's dimensions.
		// This assumes the student has bound their texture before calling this function
		// (which they should, since this is called inside draw() after useProgram and
		// texture binding). If no texture is bound, getTexParameter returns 0, which is
		// harmless (debug views will compute LOD=infinity or similar, showing as solid color).
		const texWidth = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_WIDTH) || 0;
		const texHeight = gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_HEIGHT) || 0;
		gl.uniform2f(u.uEcTexSize, texWidth, texHeight);
	}

	if (u.uEcMipBias !== null) {
		gl.uniform1f(u.uEcMipBias, EC.mipBias);
	}

	if (u.uEcManualAniso !== null) {
		gl.uniform1i(u.uEcManualAniso, EC.manualAniso ? 1 : 0);
	}

	if (u.uEcManualAnisoSamples !== null) {
		gl.uniform1i(u.uEcManualAnisoSamples, EC.manualAnisoSamples);
	}
};

// ==== EXTRA CREDIT: F4 Mesh Shader Uniform Plumbing — END ====

// ==== EXTRA CREDIT: F5 Orthographic Projection Matrix — BEGIN ====
//
// WHAT: Builds an orthographic projection matrix as an alternative to perspective.
//
// WHY (Ch.11): Under perspective projection, the texture footprint (pixel area in
//       texture space) varies with depth: distant surfaces have higher minification.
//       Under orthographic projection, footprint size is constant with depth (no
//       perspective foreshortening). This makes mip level selection independent of
//       distance—only the viewing angle matters. Switching between ortho and perspective
//       lets you isolate the effect of depth on LOD computation and see mip-level banding
//       flatten out. It's also a useful comparison for understanding how perspective
//       divide affects interpolated varyings.
//
// WHERE: Called from UpdateProjectionMatrix() when EC.projection === 'ortho'.
//       Replaces perspectiveMatrix with an orthographic projection.
//
// CONVENTION (C4 - read carefully):
//   - MATRIX STORAGE: Column-major, same as the perspective matrix in UpdateProjectionMatrix.
//     The array [m0, m1, ..., m15] stores columns: [m0,m1,m2,m3] is column 0,
//     [m4,m5,m6,m7] is column 1, etc. This matches GLSL's mat4 constructor and WebGL's
//     uniformMatrix4fv expectations.
//   - MULTIPLICATION ORDER: M * v (matrix on the left, column vector on the right).
//     In GLSL: gl_Position = uMVP * vec4(pos, 1.0).
//     When composing transforms: MVP = P * V * M (projection last in the chain, applied first
//     to the vector due to right-to-left associativity).
//   - COORDINATE SPACES:
//       Input: View space (after modelview transform, camera at origin looking down -Z)
//       Output: Clip space (x, y, z, w), where NDC is obtained by perspective divide (x/w, y/w, z/w)
//     For ortho, w=1 always (no perspective divide), so clip space = NDC directly.
//   - NDC MAPPING:
//       Perspective: z maps to [(n+f)/(f-n), ...] nonlinearly; depth precision is higher near n.
//       Ortho: z maps to [2/(f-n)] linearly; depth precision is uniform across the range.
//     Both map x/y to [-1,+1] for the visible region, but ortho does it without the divide.
//
// PARAMETERS:
//   r: aspect ratio (width / height), same as perspective
//   n: near plane distance (positive, in view space), same as perspective
//   f: far plane distance (positive, >n), same as perspective
//      NOTE: f is already extended by UpdateProjectionMatrix when the ground plane is on
//      (f = transZ + 200 instead of transZ + 1.74). Using the same f here ensures the
//      ortho and perspective views clip the same depth range (apples-to-apples comparison).
//

EC.ecOrthographicMatrix = function(r, n, f) {
	// FRAMING: Choose the visible region in X and Y to match what the perspective view shows
	// at the mesh's center (Z=0 after translation, which is Z=transZ in view space).
	//
	// For perspective, the half-height visible at distance d is: h = d * tan(fov/2).
	// We use the same FOV as the perspective matrix (60 degrees = π/3 radians, so fov/2 = π/6).
	// The camera is at Z=transZ (in view space, the mesh is at Z=0, which is d=transZ from camera).
	//
	// CHOICE: Frame the ortho view to show the same region at the mesh's center as perspective does.
	// This makes the two projections directly comparable: the mesh appears the same size, only
	// the depth variation (and mip selection) changes.

	const fov = 3.145 * 60 / 180;  // Same FOV as perspective (60 degrees in radians)
	const transZ = window.transZ || 3;  // Current camera distance (default 3 if not set)

	// Half-height and half-width of the visible region at distance transZ
	const halfHeight = transZ * Math.tan(fov / 2);  // ≈ transZ * 0.577
	const halfWidth = halfHeight * r;               // Account for aspect ratio

	// Ortho projection bounds: left, right, bottom, top
	// These define a rectangular prism (box) in view space that maps to NDC [-1,+1]^3.
	const left = -halfWidth;
	const right = halfWidth;
	const bottom = -halfHeight;
	const top = halfHeight;
	// Near and far are already passed in (same as perspective, possibly extended for ground plane).

	// ORTHO MATRIX FORMULA (column-major):
	// Maps [left, right] → [-1, +1] in X, [bottom, top] → [-1, +1] in Y, [n, f] → [-1, +1] in Z.
	// The standard ortho matrix is:
	//   [ 2/(r-l),        0,          0,  0 ]   column 0
	//   [       0,  2/(t-b),          0,  0 ]   column 1
	//   [       0,        0,  -2/(f-n),  0 ]   column 2  (note the negative sign for OpenGL convention)
	//   [ -(r+l)/(r-l), -(t+b)/(t-b), -(f+n)/(f-n), 1 ]   column 3 (translation)
	//
	// WHY THE SIGNS: OpenGL uses a right-handed coordinate system in NDC with Z pointing into
	// the screen (after clip→NDC). The -2/(f-n) coefficient inverts Z so that near maps to -1
	// and far maps to +1 (matching the depth buffer's convention). The translation terms center
	// the box at the origin in NDC.

	const width = right - left;
	const height = top - bottom;
	const depth = f - n;

	return [
		// Column 0: X scaling
		2.0 / width, 0, 0, 0,

		// Column 1: Y scaling
		0, 2.0 / height, 0, 0,

		// Column 2: Z scaling (note the negative for OpenGL convention)
		0, 0, -2.0 / depth, 0,

		// Column 3: Translation to center the box in NDC
		-(right + left) / width,   // X translation (0 for symmetric bounds)
		-(top + bottom) / height,  // Y translation (0 for symmetric bounds)
		-(f + n) / depth,          // Z translation
		1                          // Homogeneous coordinate (w component stays 1)
	];
};

// ==== EXTRA CREDIT: F5 Orthographic Projection Matrix — END ====

// ==== EXTRA CREDIT: Placeholder Functions — END ====
