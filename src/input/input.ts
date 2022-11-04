import { KeyCharacter } from './types';

export class Input {
    private readonly WASD = 'wasd'.split('');

    readonly keyState = Object.seal({
        w: 0,
        a: 0,
        s: 0,
        d: 0,
        leftClick: 0,
        rightClick: 0,
    });

    readonly mouseCoords = Object.seal({
        x: 0,
        y: 0,
    });

    runListeners = (canvas: HTMLCanvasElement) => {
        document.onkeydown = (ev) => {
            ev.preventDefault();

            if (this.WASD.includes(ev.key)) {
                this.keyState[ev.key as KeyCharacter] = 1;
            }
        };

        document.onkeyup = (ev) => {
            ev.preventDefault();

            if (this.WASD.includes(ev.key)) {
                this.keyState[ev.key as KeyCharacter] = 0;
            }
        };

        canvas.onmousemove = (ev) => {
            ev.preventDefault();

            this.mouseCoords.x += ev.movementX;
            this.mouseCoords.y += ev.movementY;
        };

        canvas.onmousedown = (ev) => {
            ev.preventDefault();

            // ev.button -> 0: Left | 1: Middle | 2: Right
            if (ev.button === 0) {
                this.keyState['leftClick'] = 1;
            } else if (ev.button === 2) {
                this.keyState['rightClick'] = 1;
            }
        };

        canvas.onmouseup = (ev) => {
            ev.preventDefault();

            // ev.button -> 0: Left | 1: Middle | 2: Right
            if (ev.button === 0) {
                this.keyState['leftClick'] = 0;
            } else if (ev.button === 2) {
                this.keyState['rightClick'] = 0;
            }
        };
    };
}
