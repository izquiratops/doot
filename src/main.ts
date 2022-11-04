// Utils
import { Renderer } from './renderer/renderer';

// Scene data
import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './renderer/shaders';
import { Box } from './objects/box';
import { Input } from './input/input';

window.onload = () => {
    // Get Canvas DOM reference
    const glCanvasRef = document.getElementById(
        'glCanvas',
    ) as HTMLCanvasElement;

    // Get WebGL2 context
    const gl: WebGL2RenderingContext = glCanvasRef.getContext('webgl2');
    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    // Setup input listeners
    const input = new Input();
    input.runListeners(glCanvasRef);

    // Run an instance of the Renderer with WebGL Context and the state of the GUI
    const scene = new Renderer(gl);
    scene.initProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
    scene.initBuffers(new Box());
    scene.runFrames();
};
