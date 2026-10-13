// Complete the implementation of the following class and the vertex shader below.


// EXTRA CREDIT? Lateral offset from a curve? think of the width
class CurveDrawer {
	constructor()
	{
		this.prog   = InitShaderProgram( curvesVS, curvesFS );

    // Other initializations should be done here.
    // This is a good place to get the locations of attributes and uniform variables.
    this.t = gl.getAttribLocation( this.prog, 't' )

    this.mvp = gl.getUniformLocation( this.prog, 'mvp' );
    this.p0 = gl.getUniformLocation( this.prog, 'p0' );
    this.p1 = gl.getUniformLocation( this.prog, 'p1' );
    this.p2 = gl.getUniformLocation( this.prog, 'p2' );
    this.p3 = gl.getUniformLocation( this.prog, 'p3' );

		// Initialize the attribute buffer
		this.steps = 100;
		var tv = [];
		for ( var i=0; i<this.steps; ++i ) {
			tv.push( i / (this.steps-1) );
		}

		// This is where you can create and set the contents of the vertex buffer object
		// for the vertex attribute we need.
    this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tv), gl.STATIC_DRAW);


	}
	setViewport( width, height )
	{
		// This is where we should set the transformation matrix.
		// Do not forget to bind the program before you set a uniform variable value.
		var trans = [ 2/width,0,0,0,  0,-2/height,0,0, 0,0,1,0, -1,1,0,1 ];
    gl.useProgram( this.prog );	// Bind the program
    gl.uniformMatrix4fv( this.mvp, false, trans );
	}
	updatePoints( pt )
	{
		// The control points have changed, we must update corresponding uniform variables.
		// Do not forget to bind the program before you set a uniform variable value.
		// We can access the x and y coordinates of the i^th control points using
		// var x = pt[i].getAttribute("cx");
		// var y = pt[i].getAttribute("cy");

    gl.useProgram( this.prog );	// Bind the program

    const x0 = pt[0].getAttribute("cx");
    const y0 = pt[0].getAttribute("cy");
    gl.uniform2f(this.p0, x0, y0);

    const x1 = pt[1].getAttribute("cx");
    const y1 = pt[1].getAttribute("cy");
    gl.uniform2f(this.p1, x1, y1);

    const x2 = pt[2].getAttribute("cx");
    const y2 = pt[2].getAttribute("cy");
    gl.uniform2f(this.p2, x2, y2);

    const x3 = pt[3].getAttribute("cx");
    const y3 = pt[3].getAttribute("cy");
    gl.uniform2f(this.p3, x3, y3);
	}
	draw()
	{
		// This is where we give the command to draw the curve.
		// Do not forget to bind the program and set the vertex attribute.
    gl.useProgram( this.prog );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );

    gl.vertexAttribPointer( this.t, 1, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( this.t );

		gl.drawArrays( gl.LINE_STRIP, 0, this.steps );
	}
}

// Vertex Shader
var curvesVS = `
	attribute float t;
	uniform mat4 mvp;
	uniform vec2 p0;
	uniform vec2 p1;
	uniform vec2 p2;
	uniform vec2 p3;
	void main()
	{
    vec2 bezier_position = pow((1.0 - t), 3.0) * p0 + 3.0 * pow((1.0 - t), 2.0) * t * p1 + 3.0 * (1.0 - t) * pow(t, 2.0) * p2 + pow(t, 3.0) * p3;

		gl_Position = mvp * vec4(bezier_position,0,1);
	}
`;

// Fragment Shader
var curvesFS = `
	precision mediump float;
	void main()
	{
		gl_FragColor = vec4(1,0,0,1);
	}
`;
