// import { Game } from "./NewGame/Game";

import { Animation } from "./Animation";
import { AssetManager } from "./AssetManager";
import { Canvas } from "./Canvas";
import { Player } from "./Player";
import { Position } from "./Position";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface IEntity {
    get position(): Position;
    get frame(): HTMLImageElement;
    next(time: number): void;
}

class Tree implements IEntity {
    position: Position;
    frame: HTMLImageElement;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.frame = assetManager.images["img/tree_1.png"];
    }

    next(time: number) {}
}

class Rhino implements IEntity {
    position: Position;
    animation: Animation;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.animation = new Animation([
            assetManager.images["img/rhino_celebrate_1.png"],
            assetManager.images["img/rhino_celebrate_2.png"],
        ]);
    }

    next(time: number) {
        this.animation.update(time);
    }

    get frame() {
        return this.animation.frame;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // const game = new Game();
    // game.start();
    const canvas = new Canvas();
    const assetManager = await AssetManager.create();

    const player = new Player(assetManager);

    const tree = new Tree(assetManager);
    tree.position.x = -100;

    const rhino = new Rhino(assetManager);
    rhino.position.x = 100;

    canvas.camera.follow(player);

    const entities = [player, tree, rhino];

    async function next(time: number) {
        if (time > 2000 && time < 2050) {
            player.do("jump");
        }

        if (time > 4000 && time < 4050) {
            player.do("turnRight");
        }

        entities.forEach((entity) => entity.next(time));

        canvas.camera.next();
        canvas.clear();
        entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
