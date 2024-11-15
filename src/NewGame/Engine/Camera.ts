import { IEntity } from "../Entity/IEntity";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";

export class Camera {
    position: Position = new Position(0, 0);
    target?: IEntity;

    constructor(public area: Rect) {}

    next() {
        if (this.target) {
            this.position = this.target.position;
            this.area = new Rect(this.position, this.area.size);
            return;
        }
        return this.position;
    }

    follow(entity: IEntity) {
        this.target = entity;
    }
}
