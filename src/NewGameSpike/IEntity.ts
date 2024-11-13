import { Position } from "./Position";
import { Rect } from "./Rect";

export interface IEntity {
    collidedWith(otherEntity: IEntity): void;
    get areaCovered(): Rect;
    get position(): Position;
    get frame(): HTMLImageElement;
    next(): void;
}
