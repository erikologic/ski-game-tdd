import { IEntity } from "../Entity/IEntity";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";

export class Camera {
    position: Position = new Position(0, 0);
    target?: IEntity;
    hasMoved: boolean = false;

    constructor(public area: Rect) {}

    update(position?: Position) {
        const trackedPosition = this.target ? this.target.position : position;
        if (!trackedPosition) {
            return this.position;
        }

        if (!trackedPosition.equals(this.position)) {
            this.hasMoved = true;
            this.position = trackedPosition;
            this.area = new Rect(this.position, this.area.size);
            return;
        }
        this.hasMoved = false;
        return this.position;
    }

    follow(entity: IEntity) {
        this.target = entity;
    }
}
