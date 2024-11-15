import { IAssetManager } from "../Utils/AssetManager";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { IEntity } from "./IEntity";

const ROCK_IMAGES = ["img/rock_1.png", "img/rock_2.png"] as const;
const TREE_IMAGES = ["img/tree_1.png", "img/tree_cluster.png"] as const;

export class Obstacle implements IEntity {
    position = new Position(0, 0);

    constructor(public frame: HTMLImageElement, public height: number) {}

    get areaCovered(): Rect {
        return new Rect(this.position, this.frame);
    }

    collidedWith(otherEntity: IEntity): void {}

    next() {}

    static random(assetManager: IAssetManager): Obstacle {
        const isRock = Math.round(Math.random());
        if (isRock) {
            return Rock.random(assetManager);
        } else {
            return Tree.random(assetManager);
        }
    }
}

export class Rock extends Obstacle {
    constructor(frame: HTMLImageElement) {
        super(frame, 100);
    }

    static random(assetManager: IAssetManager): Rock {
        const image = ROCK_IMAGES[Math.floor(Math.random() * ROCK_IMAGES.length)];
        const frame = assetManager.images[image];
        return new Rock(frame);
    }
}

export class Tree extends Obstacle {
    constructor(frame: HTMLImageElement) {
        super(frame, 200);
    }

    static random(assetManager: IAssetManager): Tree {
        const image = TREE_IMAGES[Math.floor(Math.random() * TREE_IMAGES.length)];
        const frame = assetManager.images[image];
        return new Tree(frame);
    }
}
