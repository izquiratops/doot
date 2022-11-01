export class Box {
    // prettier-ignore
    private _vertices = [
		// Front face
		-1.0, -1.0,  1.0,
		 1.0, -1.0,  1.0,
		 1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,

  		// Back face
  		-1.0, -1.0, -1.0,
  		-1.0,  1.0, -1.0,
    	 1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0,

  		// Top face
  		-1.0,  1.0, -1.0,
  		-1.0,  1.0,  1.0,
    	 1.0,  1.0,  1.0,
    	 1.0,  1.0, -1.0,

  		// Bottom face
  		-1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
  		-1.0, -1.0,  1.0,

  		// Right face
  	     1.0, -1.0, -1.0,
  	     1.0,  1.0, -1.0,
  	     1.0,  1.0,  1.0,
  	     1.0, -1.0,  1.0,

  		// Left face
  		-1.0, -1.0, -1.0,
  		-1.0, -1.0,  1.0,
  		-1.0,  1.0,  1.0,
  		-1.0,  1.0, -1.0,
  	];

    // prettier-ignore
    private _colors = [
	    [0, 255, 0, 255],
	    [0, 255, 0, 255],
	    [0, 255, 0, 255],
	    [0, 255, 0, 255],
	    [0, 255, 0, 255],
	    [0, 255, 0, 255],
    ];

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    // prettier-ignore
    private _indices = [
		  0,  1,  2,      0,  2,  3,    // Front
		  4,  5,  6,      4,  6,  7,    // Back
		  8,  9,  10,     8,  10, 11,   // Top
		  12, 13, 14,     12, 14, 15,   // Bottom
		  16, 17, 18,     16, 18, 19,   // Right
		  20, 21, 22,     20, 22, 23,   // Left
    ];

    // [0, 0, 1] facing forward
    // [0, 0, -1] facing away
    // [1, 0, 0] facing  right
    // [0, 1, 0] facing up
    // prettier-ignore
    private _normals = [
		// Front face
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,

  		// Back face
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,
		0, 0, -1,

  		// Top face
  		0, 1, 0,
  		0, 1, 0,
    	0, 1, 0,
    	0, 1, 0,

  		// Bottom face
  		0, -1, 0,
  		0, -1, 0,
    	0, -1, 0,
    	0, -1, 0,

  		// Right face
  		1, 0, 0,
  		1, 0, 0,
    	1, 0, 0,
    	1, 0, 0,

  		// Left face
  		-1, 0, 0,
  		-1, 0, 0,
    	-1, 0, 0,
    	-1, 0, 0,
	];

    get vertices() {
        return this._vertices;
    }

    get colors() {
        return this._colors.reduce(
            (acc, curr) => acc.concat(curr, curr, curr, curr),
            [],
        );
    }

    get indices() {
        return this._indices;
    }

    get normals() {
        return this._normals;
    }
}
