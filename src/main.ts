import { FRAGMENT_SOURCE, VERTEX_SOURCE } from './renderer/shaders';
import { Renderer } from './renderer/renderer';
import { MapLoader } from './map/map-loader';
import { Input } from './input/input';
import { Game } from './game/game';

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

    MapLoader.parse('./assets/maps/example.obj').then((data) =>
        console.log('map loaded', data),
    );

    // Run an instance of the Renderer with WebGL Context and the state of the GUI
    const scene = new Renderer(gl);
    scene.initProgram(VERTEX_SOURCE, FRAGMENT_SOURCE);
    // scene.initBuffers();
    scene.runFrames();
};
