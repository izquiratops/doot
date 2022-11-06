export interface WorldAxis {
    x: number;
    y: number;
    z: number;
}

export interface Buffers {
    position: WebGLBuffer;
    numElements: number;
    color?: WebGLBuffer;
    index?: WebGLBuffer;
    normal?: WebGLBuffer;
}

export interface ProgramInfo {
    program: WebGLProgram;
    attribLocations: {
        vertexPosition: GLint;
        vertexColor?: GLint;
        vertexNormal?: GLint;
    };
    uniformLocations: {
        matrix: WebGLUniformLocation;
        color?: WebGLUniformLocation;
        reverseLightDirection?: WebGLUniformLocation;
    };
}

export interface VertexAttribute {
    buffer: WebGLBuffer;
    bufferPosition: GLuint;
    size: GLint;
    type: GLenum;
    normalized: GLboolean;
    stride: GLsizei;
    offset: GLintptr;
}
