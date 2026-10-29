// This function takes the projection matrix, the translation, and two rotation angles (in radians) as input arguments.
// The two rotations are applied around x and y axes.
// It returns the combined 4x4 transformation matrix as an array in column-major order.
// The given projection matrix is also a 4x4 matrix stored as an array in column-major order.
// You can use the MatrixMult function defined in project4.html to multiply two 4x4 matrices in the same format.
function GetModelViewProjection( projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY )
{
	// [TO-DO] Modify the code below to form the transformation matrix.
	var trans = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var mvp = MatrixMult( projectionMatrix, trans );
	return mvp;
}


// [TO-DO] Complete the implementation of the following class.

class MeshDrawer
{
	// The constructor is a good place for taking care of the necessary initializations.
	constructor()
	{
		// [TO-DO] initializations

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
		// [TO-DO] Update the contents of the vertex buffer objects.
		this.numTriangles = vertPos.length / 9;
	}
	
	// This method is called when the user changes the state of the
	// "Swap Y-Z Axes" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	swapYZ( swap )
	{
		// [TO-DO] Set the uniform parameter(s) of the vertex shader
	}
	
	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw( trans )
	{
		// [TO-DO] Complete the WebGL initializations before drawing

		// ==== EXTRA CREDIT HOOK ====
		// After you call gl.useProgram(this.prog) and before your gl.drawArrays call,
		// upload the extra credit uniforms:
		//   if (typeof EC !== 'undefined') EC.ecUploadMeshUniforms(gl);
		// This should be called AFTER you bind your texture (so uEcTexSize can query
		// the bound texture's dimensions), and AFTER useProgram (so the uniforms are
		// uploaded to the active program).
		// ===========================

		gl.drawArrays( gl.TRIANGLES, 0, this.numTriangles );
	}
	
	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture( img )
	{
		// [TO-DO] Bind the texture

		// You can set the texture image data using the following command.
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img );

		// ==== EXTRA CREDIT HOOK ====
		// After you create/bind your texture and upload the image with texImage2D above,
		// call the extra credit filter mode function:
		//   if (typeof EC !== 'undefined') EC.ecApplyFilterMode(gl);
		// This must run AFTER gl.bindTexture(gl.TEXTURE_2D, yourTexture), because
		// texParameteri affects the currently bound texture, not a texture object handle.
		// ===========================

		// [TO-DO] Now that we have a texture, it might be a good idea to set
		// some uniform parameter(s) of the fragment shader, so that it uses the texture.
	}
	
	// This method is called when the user changes the state of the
	// "Show Texture" checkbox. 
	// The argument is a boolean that indicates if the checkbox is checked.
	showTexture( show )
	{
		// [TO-DO] set the uniform parameter(s) of the fragment shader to specify if it should use the texture.
	}
	
}
