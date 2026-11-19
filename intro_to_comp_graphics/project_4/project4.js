// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	var translation = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
  var rotateX = [
    1, 0, 0, 0,
    0, Math.cos(rotationX), Math.sin(rotationX), 0,
    0, -Math.sin(rotationX), Math.cos(rotationX), 0,
    0, 0, 0, 1
  ]
  var rotateY = [
    Math.cos(rotationY), 0, -Math.sin(rotationY), 0,
    0, 1, 0, 0,
    Math.sin(rotationY), 0, Math.cos(rotationY), 0,
    0, 0, 0, 1
  ]
  var rotate = MatrixMult(rotateX, rotateY);
  var transform = MatrixMult(translation, rotate)
	var mvp = MatrixMult( projectionMatrix, transform );
	return mvp;
}


var meshVS = `#version 300 es
in vec3 pos;
in vec2 texCoord;

out vec2 vTexCoord;

uniform mat4 mvp;
uniform bool swapYZAxes;
void main()
{
  vTexCoord = texCoord;

  vec3 position = pos;
  if (swapYZAxes) {
    position = vec3(pos.x, pos.z, pos.y);
  }
  gl_Position = mvp * vec4(position,1);
}
`;

var meshFS = `#version 300 es
precision mediump float;

in vec2 vTexCoord;

out vec4 fragColor;

uniform sampler2D textureSampler;
uniform bool showTex;

void main()
{
  if (showTex) {
    fragColor = texture(textureSampler, vTexCoord);
  } else {
    fragColor = vec4(1,gl_FragCoord.z*gl_FragCoord.z,0,1);
  }
}
`;


class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
    // Compile the shader program
		this.prog = InitShaderProgram( meshVS, meshFS );

    // Get the ids of the uniform variables in the shaders
    this.mvp = gl.getUniformLocation(this.prog, 'mvp');
    this.swapYZAxes = gl.getUniformLocation(this.prog, 'swapYZAxes');
    this.textureSampler = gl.getUniformLocation(this.prog, 'textureSampler');
    this.showTex = gl.getUniformLocation(this.prog, 'showTex');

    // Get the ids of the vertex attributes in the shaders
		this.vertPos = gl.getAttribLocation(this.prog, 'pos');
    this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');

    // Create vertex buffer, texture buffer, texture
    this.vertBuffer = gl.createBuffer();
    this.textureBuffer = gl.createBuffer();
    this.texture = gl.createTexture();

    // Defensively initialize other attributes
    this.numTriangles = 0;
    this.hasTexture = false;


		// ==== EXTRA CREDIT HOOK ====
		// After you compile and link your mesh shader program (e.g., after calling
		// InitShaderProgram and storing the result in this.prog), cache the extra
		// credit uniform locations:
		//   if (typeof EC !== 'undefined') EC.ecCacheMeshUniforms(gl, this.prog);
		// This is safe to call even before you paste the shader snippets (it will
		// just log a warning once and no-op on every ecUploadMeshUniforms call).
		// ===========================
	}

	// This method is called every time the user opens an OBJ file.
	// The arguments of this function is an array of 3D vertex positions
	// and an array of 2D texture coordinates.
	// Every item in these arrays is a floating point value, representing one
	// coordinate of the vertex position or texture coordinate.
	// Every three consecutive elements in the vertPos array forms one vertex
	// position and every three consecutive vertex positions form a triangle.
	// Similarly, every two consecutive elements in the texCoords array
	// form the texture coordinate of a vertex.
	// Note that this method can be called multiple times.
	setMesh( vertPos, texCoords )
	{
		this.numTriangles = vertPos.length / 9; // 3 coords per vertex, 3 vertices per triangle

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}

	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox.
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
    gl.useProgram(this.prog);

    gl.uniform1i(this.swapYZAxes, swap ? 1 : 0);
	}

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( transformationMatrix )
	{
    gl.useProgram(this.prog);

    // Upload MVP matrix
    gl.uniformMatrix4fv(this.mvp, false, transformationMatrix);

    // Bind and configure vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
    gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.vertPos);

    // Bind and configure texture buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(this.texCoord);

    // Active + bind the texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles * 3); // 3 vertices per triangle


		// ==== EXTRA CREDIT HOOK ====
		// After you call gl.useProgram(this.prog) and before your gl.drawArrays call,
		// upload the extra credit uniforms:
		//   if (typeof EC !== 'undefined') EC.ecUploadMeshUniforms(gl);
		// This should be called AFTER you bind your texture (so uEcTexSize can query
		// the bound texture's dimensions), and AFTER useProgram (so the uniforms are
		// uploaded to the active program).
		// ===========================

	}

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// Bind the texture
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

		// Set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );

    // Set parameters: what happens at edges
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    // Set parameters: how to simple when texture is small on screen
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set parameters: how to simple when texture is big on screen
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.generateMipmap(gl.TEXTURE_2D);
		// ==== EXTRA CREDIT HOOK ====
		// After you create/bind your texture and upload the image with texImage2D above,
		// call the extra credit filter mode function:
		//   if (typeof EC !== 'undefined') EC.ecApplyFilterMode(gl);
		// This must run AFTER gl.bindTexture(gl.TEXTURE_2D, yourTexture), because
		// texParameteri affects the currently bound texture, not a texture object handle.
		// ===========================

    gl.useProgram(this.prog);
    gl.uniform1i(this.textureSampler, 0);

    // Mark that we now have a loaded texture
    this.hasTexture = true;

    // If "Show Texture" checkbox is already checked, enable texture display
    var showTextureCheckbox = document.getElementById('show-texture');
    if (showTextureCheckbox && showTextureCheckbox.checked) {
      gl.uniform1i(this.showTex, 1);
    }
	}

	// This method is called when the user changes the state of the
	// "Show Texture" checkbox.
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
    // Only enable texture display if we actually have a texture loaded
    if (!this.hasTexture && show) {
      console.warn("Cannot show texture - no texture loaded yet");
      return;
    }

    gl.useProgram(this.prog);
    gl.uniform1i(this.showTex, show ? 1 : 0);
	}

}
