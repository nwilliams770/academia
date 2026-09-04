class Matrix3x3 {
  // Values are stored in column-major order.
  #values: Array<number>;

  constructor(values: Array<number>) {
    this.#values = values;
  }

  multiply(other: Matrix3x3): Matrix3x3 {
    const result = new Matrix3x3(new Array(9).fill(0));
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += this.get(k, row) * other.get(col, k);
        }
        result.set(col, row, sum);
      }
    }
    return result;
  }

  get(col: number, row: number): number {
    return this.#values[col * 3 + row];
  }

  set(col: number, row: number, value: number): void {
    this.#values[col * 3 + row] = value;
  }

  toArray(): Array<number> {
    return this.#values.slice();
  }

  static translation(x: number, y: number): Matrix3x3 {
    return new Matrix3x3([
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]);
  }

  static rotation(degrees: number): Matrix3x3 {
    // CSS/Canvas uses Y-down coordinates where positive rotation is clockwise.
    // Standard math rotation matrices assume Y-up where positive is counter-clockwise.
    // Negate the angle to convert from CSS convention to math convention.
    const radians = -degrees * (Math.PI / 180);
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    return new Matrix3x3([
      cos, -sin, 0,
      sin, cos, 0,
      0, 0, 1
    ]);
  }

  static scale(s: number): Matrix3x3 {
    return new Matrix3x3([
      s, 0, 0,
      0, s, 0,
      0, 0, 1
    ]);
  }
}


// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The transformation first applies scale, then rotation, and finally translation.
// The given rotation value is in degrees.
function GetTransform( positionX: number, positionY: number, rotationDegrees: number, scaleFactor: number ): Array<number>
{
	const translation = Matrix3x3.translation(positionX, positionY);
	const rotation = Matrix3x3.rotation(rotationDegrees);
	const scale = Matrix3x3.scale(scaleFactor);
    console.log('Translation matrix:', translation.toArray());
    console.log('Rotation matrix:', rotation.toArray());
    console.log('Scale matrix:', scale.toArray());
	const transform = translation.multiply(rotation).multiply(scale);
    console.log('Final transform:', transform.toArray());
	return transform.toArray();
}

// Returns a 3x3 transformation matrix as an array of 9 values in column-major order.
// The arguments are transformation matrices in the same format.
// The returned transformation first applies trans1 and then trans2.
function ApplyTransform( trans1: Array<number>, trans2: Array<number> ): Array<number>
{
	const mat1 = new Matrix3x3(trans1);
	const mat2 = new Matrix3x3(trans2);
	const result = mat2.multiply(mat1);
	return result.toArray();
}
