import { IAssetManager } from "./AssetManager";
import { IEntity } from "./IEntity";
import { Position } from "./Position";
import { Rect } from "./Rect";

export class Rock implements IEntity {
    position: Position;
    frame: HTMLImageElement;

    constructor(assetManager: IAssetManager) {
        this.position = new Position(0, 0);
        this.frame = assetManager.images["img/rock_1.png"];
    }

    get areaCovered(): Rect {
        return new Rect(this.position, this.frame);
    }

    collidedWith(otherEntity: IEntity): void {}

    next() {}
}
