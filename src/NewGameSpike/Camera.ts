import { IEntity } from ".";
import { Position } from "./Position";

export class Camera {
    target?: IEntity;

    next() {
        if (this.target) return (this.position = this.target.position);
        return this.position;
    }

    follow(entity: IEntity) {
        this.target = entity;
    }

    position: Position = new Position(0, 0);
}
