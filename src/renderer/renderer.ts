import { glMatrix, mat4, vec3 } from 'gl-matrix';
import { Buffers, ProgramInfo, RotationAxis } from "./types";
import { Box } from '../objects/box';

export class Renderer {
    readonly rotation: RotationAxis = {
        x: 0,
        y: 0,
        z: 0,
    };

    private programInfo: ProgramInfo;
    private buffers: Buffers;

    constructor(private gl: WebGL2RenderingContext) {}

    initProgram(VERTEX_SOURCE: string, FRAGMENT_SOURCE: string): void {
        const shaderProgram = this.createProgramFromGlsl(
            VERTEX_SOURCE,
            FRAGMENT_SOURCE,
        );

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_vertex',
                ),
                vertexColor: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_color',
                ),
                vertexNormal: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_normal',
                ),
            },
            uniformLocations: {
                matrix: this.gl.getUniformLocation(shaderProgram, 'u_matrix'),
                reverseLightDirection: this.gl.getUniformLocation(
                    shaderProgram,
                    'u_reverseLightDirection',
                ),
            },
        };
    }

    initBuffers(mesh: Box): void {
        // This way I avoid to get a horde of ugly this.gl everywhere
        const { gl } = this;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(mesh.vertices),
            gl.STATIC_DRAW,
        );

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Uint8Array(mesh.colors),
            gl.STATIC_DRAW,
        );

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(mesh.indices),
            gl.STATIC_DRAW,
        );

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(mesh.normals),
            gl.STATIC_DRAW,
        );

        this.buffers = {
            position: positionBuffer,
            color: colorBuffer,
            index: indexBuffer,
            normal: normalBuffer,
        };
    }

    runFrames() {
        const render = (now: number) => {
            now *= 0.001;

            this.clearScene(255, 255, 255);

            // Check if canvas has to be resized
            this.resizeCanvasToDisplaySize();

            // Draw scene on canvas
            this.drawScene();

            // Move to the following frame
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    private clearScene(r = 0, g = 0, b = 0) {
        const { gl } = this;

        gl.clearColor(r, g, b, 1); // Clear black
        gl.clearDepth(1.0); // Clear everything

        gl.enable(gl.DEPTH_TEST); // Enable depth
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // TODO: Num lights to 0 & clear light buffer
    }

    private drawScene() {
        const { gl, programInfo, buffers } = this;

        gl.useProgram(programInfo.program);

        const projectionMatrix = ((): mat4 => {
            const fieldOfView = glMatrix.toRadian(90);
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const zNear = 0.1;
            const zFar = 100.0;

            const matrix = mat4.create();
            mat4.perspective(matrix, fieldOfView, aspect, zNear, zFar);

            mat4.translate(
                matrix,
                matrix,
                // prettier-ignore
                [0.0, 0.0, -3.0],
            );

            mat4.rotate(matrix, matrix, this.rotation.x, [1, 0, 0]);
            mat4.rotate(matrix, matrix, this.rotation.y, [0, 1, 0]);
            mat4.rotate(matrix, matrix, this.rotation.z, [0, 0, 1]);

            return matrix;
        })();

        // Set VERTEX buffer position
        {
            const buffer = buffers.position;
            const bufferPosition = programInfo.attribLocations.vertexPosition;
            const size = 3;
            const type = gl.FLOAT;
            const normalized = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.vertexAttribPointer(
                bufferPosition,
                size,
                type,
                normalized,
                stride,
                offset,
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        // Set COLOR buffer position
        {
            const buffer = buffers.color;
            const bufferPosition = programInfo.attribLocations.vertexColor;
            const size = 4;
            const type = gl.UNSIGNED_BYTE;
            const normalized = true;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.vertexAttribPointer(
                bufferPosition,
                size,
                type,
                normalized,
                stride,
                offset,
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        // Set INDICES buffer array
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);

        // Set NORMALS buffer array
        {
            const buffer = buffers.normal;
            const bufferPosition = programInfo.attribLocations.vertexNormal;
            const size = 3;
            const type = gl.FLOAT;
            const normalized = false;
            const stride = 0;
            const offset = 0;

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            gl.vertexAttribPointer(
                bufferPosition,
                size,
                type,
                normalized,
                stride,
                offset,
            );

            gl.enableVertexAttribArray(bufferPosition);
        }

        // TODO: Learn about matrix types
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.matrix,
            false,
            projectionMatrix,
        );

        // Setting the light direction
        const lightDirection = vec3.fromValues(0.5, 0.7, 1.0);
        gl.uniform3fv(
            programInfo.uniformLocations.reverseLightDirection,
            lightDirection,
        );

        {
            const vertexCount = 6 * 6; // 6 faces --> Every face has 2 triangles --> Every tri has 3 vertices
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    private loadShader(shaderType: GLenum, shaderSource: string): WebGLShader {
        const { gl } = this;

        const shader = gl.createShader(shaderType);

        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            gl.deleteShader(shader);
            throw new Error(
                `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
                    shader,
                )}`,
            );
        }

        return shader;
    }

    private createProgramFromGlsl(
        vertexSource: string,
        fragmentSource: string,
    ): WebGLProgram {
        const { gl } = this;

        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.loadShader(
            gl.FRAGMENT_SHADER,
            fragmentSource,
        );

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Completes the process of preparing the GPU code for the shaders.
        gl.linkProgram(shaderProgram);

        const linked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
        if (!linked) {
            gl.deleteProgram(shaderProgram);
            throw new Error(
                `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                    shaderProgram,
                )}`,
            );
        }

        return shaderProgram;
    }

    private resizeCanvasToDisplaySize() {
        const { gl } = this;

        // Lookup the size the browser is displaying the canvas in CSS pixels.
        const displayWidth = gl.canvas.clientWidth;
        const displayHeight = gl.canvas.clientHeight;

        // Check if the canvas is not the same size.
        const needResize =
            gl.canvas.width !== displayWidth ||
            gl.canvas.height !== displayHeight;

        if (needResize) {
            // Make the canvas the same size
            gl.canvas.width = displayWidth;
            gl.canvas.height = displayHeight;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        }
    }
}
