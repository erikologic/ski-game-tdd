import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";

export interface IEntity {
    collidedWith(otherEntity: IEntity): void;
    get areaCovered(): Rect;
    get position(): Position;
    get frame(): HTMLImageElement | undefined;
    next(): void;
    get height(): number;
}
