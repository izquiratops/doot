import { WorldEntities } from './types';

export class Game {
    readonly TICK = 1 / 60;
    readonly WORLD_ENTITIES: WorldEntities = {
        items: null,
        enemies: null,
        player: null,
    };

    initializeNewGame() {
        this.WORLD_ENTITIES.items = [];
        this.WORLD_ENTITIES.enemies = [];
    }
}
