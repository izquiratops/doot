import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './renderer/shaders';
import { Renderer } from './renderer/renderer';
import { ObjLoader } from './utils/obj-loader';
import { Input } from './input/input';
import { Object3D } from './map/types';

window.onload = async () => {
    // Get Canvas DOM reference
    const glCanvasRef = document.getElementById(
        'glCanvas',
    ) as HTMLCanvasElement;

    glCanvasRef.onclick = () => {
        console.debug('Pointer locked on canvas');
        glCanvasRef.requestPointerLock();
    }

    // Get WebGL2 context
    const gl: WebGL2RenderingContext = glCanvasRef.getContext('webgl2');
    if (gl === null) {
        throw new Error(
            'Unable to initialize WebGL. Your browser or machine may not support it.',
        );
    }

    // Setup input listeners
    const input = new Input();
    input.listenEvents(glCanvasRef);

    // Load game level
    const map: Object3D = await ObjLoader.parse('./assets/maps/box.obj');

    // Run an instance of the Renderer with WebGL Context and the state of the GUI
    const scene = new Renderer(gl);
    scene.initProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
    scene.createBufferInfo(map);
    scene.runFrames();
};
