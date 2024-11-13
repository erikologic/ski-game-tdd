import { AssetManager } from "./AssetManager";
import { GameTime } from "./GameTime";
import { IEntity } from "./IEntity";
import { Position } from "./Position";
import { Rect } from "./Rect";
import { Animation } from "./Animation";

export class Rhino implements IEntity {
    position: Position;
    animation: Animation;

    constructor(assetManager: AssetManager, private time: GameTime) {
        this.position = new Position(0, 0);
        this.animation = new Animation([
            assetManager.images["img/rhino_celebrate_1.png"],
            assetManager.images["img/rhino_celebrate_2.png"],
        ]);
    }

    collidedWith(otherEntity: IEntity): unknown {
        throw new Error("Method not implemented on Rhino.");
    }

    get areaCovered(): Rect {
        return new Rect(this.position, this.frame);
    }

    next() {
        this.animation.update(this.time);
    }

    get frame() {
        return this.animation.frame;
    }
}
