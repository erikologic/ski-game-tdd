import { IEntity } from "../Entity/IEntity";
import { Position } from "../Utils/Position";

export class Camera {
    position: Position = new Position(0, 0);
    target?: IEntity;

    next() {
        if (this.target) return (this.position = this.target.position);
        return this.position;
    }

    follow(entity: IEntity) {
        this.target = entity;
    }
}
