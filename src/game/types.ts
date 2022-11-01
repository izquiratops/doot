import {Entity} from "../entity/types";
import {Player} from "../player/types";

export interface Enemy {}

export interface WorldEntities {
    items: Array<Entity>,
    enemies: Array<Enemy>,
    player: Player
}
