import { mat4, vec3 } from 'gl-matrix';
import { Buffers, ProgramInfo, WorldAxis } from './types';
import { MathTools } from '../utils/math';
import { Object3D } from '../map/types';

export class Renderer {
    readonly position: WorldAxis = {
        x: 0,
        y: 0,
        z: -100,
    };

    readonly rotation: WorldAxis = {
        x: 0,
        y: 0,
        z: 0,
    };

    private programInfo: ProgramInfo;
    private bufferInfo: Buffers;

    constructor(private gl: WebGL2RenderingContext) {}

    initProgram(VERTEX: string, FRAGMENT: string): void {
        const shaderProgram = this.createProgramFromGlsl(VERTEX, FRAGMENT);

        this.programInfo = {
            program: shaderProgram,
            attribLocations: {
                vertexPosition: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_position',
                ),
                /* TODO color
                vertexColor: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_color',
                ), */
                vertexNormal: this.gl.getAttribLocation(
                    shaderProgram,
                    'a_normal',
                ),
            },
            uniformLocations: {
                matrix: this.gl.getUniformLocation(shaderProgram, 'u_matrix'),
                // TODO color
                color: this.gl.getUniformLocation(shaderProgram, 'u_color'),
                reverseLightDirection: this.gl.getUniformLocation(
                    shaderProgram,
                    'u_reverseLightDirection',
                ),
            },
        };
    }

    createBufferInfo(mesh: Object3D): void {
        const { gl } = this;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(mesh.position),
            gl.STATIC_DRAW,
        );

        /* TODO color
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Uint8Array(mesh.colors),
            gl.STATIC_DRAW,
        ); */

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(mesh.normal),
            gl.STATIC_DRAW,
        );

        this.bufferInfo = {
            numElements: mesh.position.length,
            position: positionBuffer,
            normal: normalBuffer,
        };
    }

    runFrames() {
        const gameFrame = (now: number) => {
            now *= 0.001; // from ms to s

            // Check if canvas has to be resized
            this.resizeCanvasToDisplaySize();

            // Clear canvas before drawing on top
            this.clearScene(255, 255, 255);

            // Draw scene on canvas
            this.drawScene();

            // Move to the following frame
            requestAnimationFrame(gameFrame);
        };

        requestAnimationFrame(gameFrame);
    }

    private clearScene(r = 0, g = 0, b = 0) {
        const { gl } = this;

        gl.clearColor(r, g, b, 1); // Clear black
        gl.clearDepth(1.0); // Clear everything

        gl.enable(gl.DEPTH_TEST); // Enable depth
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    /**
     * Old method to draw stuff on the screen.
     * Unused in order to start rendering maps instead of the webGL demo object.
     * @private
     */
    private drawScene() {
        const { gl, programInfo, bufferInfo } = this;

        gl.useProgram(programInfo.program);

        const projectionMatrix = ((): mat4 => {
            const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
            const fieldOfView = MathTools.degToRad(90);
            const zNear = 0.1;
            const zFar = 100.0;

            const projection = mat4.create();
            mat4.perspective(projection, fieldOfView, aspect, zNear, zFar);

            // TODO: would be nice to have a 'lookAt' function to avoid this translate/rotate lines
            mat4.translate(
                projection,
                projection,
                // prettier-ignore
                [this.position.x, this.position.y, this.position.z],
            );

            mat4.rotate(projection, projection, this.rotation.x, [1, 0, 0]);
            mat4.rotate(projection, projection, this.rotation.y, [0, 1, 0]);
            mat4.rotate(projection, projection, this.rotation.z, [0, 0, 1]);

            return projection;
        })();

        // Set VERTEX buffer position
        {
            const buffer = bufferInfo.position;
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

        /* TODO color
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
        } */

        // Set NORMALS buffer array
        {
            const buffer = bufferInfo.normal;
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

        // Calls gl.uniform
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.matrix,
            false,
            projectionMatrix,
        );

        const lightDirection = vec3.fromValues(0.5, 0.7, 1.0);
        gl.uniform3fv(
            programInfo.uniformLocations.reverseLightDirection,
            lightDirection,
        );

        gl.drawArrays(gl.TRIANGLES, 0, this.bufferInfo.numElements);
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
