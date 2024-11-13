import { IEntity, Player } from ".";
import { Position } from "./Position";

export class Camera {
    target?: IEntity;

    next() {
        if (this.target) return (this.position = this.target.position);
        return this.position;
    }

    follow(player: Player) {
        this.target = player;
    }

    position: Position = new Position(0, 0);
}
