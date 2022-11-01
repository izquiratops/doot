export class Input {
    private WASD = 'wasd'.split('');

    keyState = new Map<string, number>([
        ['w', 0],
        ['a', 0],
        ['s', 0],
        ['d', 0],
        ['leftClick', 0],
        ['rightClick', 0],
    ]);

    mouseCoords = {
        x: 0, y: 0
    }

    runListeners = (canvas: HTMLCanvasElement) => {
        document.onkeydown = (ev) => {
            ev.preventDefault();

            if (this.WASD.includes(ev.key)) {
                this.keyState.set(ev.key, 1);
            }
        }

        document.onkeyup = (ev) => {
            ev.preventDefault();

            if (this.WASD.includes(ev.key)) {
                this.keyState.set(ev.key, 0);
            }
        }

        canvas.onmousemove = (ev) => {
            ev.preventDefault();

            this.mouseCoords.x += ev.movementX;
            this.mouseCoords.y += ev.movementY;
        }

        canvas.onmousedown = (ev) => {
            ev.preventDefault();

            // ev.button -> 0: Left | 1: Middle | 2: Right
            if (ev.button === 0) {
                this.keyState.set('leftClick', 1);
            } else if (ev.button === 2) {
                this.keyState.set('rightClick', 1);
            }
        };

        canvas.onmouseup = (ev) => {
            ev.preventDefault();

            // ev.button -> 0: Left | 1: Middle | 2: Right
            if (ev.button === 0) {
                this.keyState.set('leftClick', 1);
            } else if (ev.button === 2) {
                this.keyState.set('rightClick', 1);
            }
        };
    }
}
