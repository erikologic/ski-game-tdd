// import { Game } from "./NewGame/Game";

import { Animation } from "./Animation";
import { AssetManager } from "./AssetManager";
import { Canvas } from "./Canvas";
import { Position } from "./Position";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface IEntity {
    get position(): Position;
    get frame(): HTMLImageElement;
    next(time: number): void;
}

export class Player implements IEntity {
    speed = 0.02;
    lastTime = 0;
    position: Position;
    _state: "downhill" | "jumping" = "downhill";
    assetManager: AssetManager;
    animation: Animation;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.assetManager = assetManager;
        this.animation = new Animation([assetManager.images["img/skier_down.png"]]);
    }

    set state(value: "downhill" | "jumping") {
        if (value === this._state) {
            return;
        }
        this._state = value;
        if (value === "jumping") {
            this.animation = new Animation([
                this.assetManager.images["img/skier_jump_1.png"],
                this.assetManager.images["img/skier_jump_2.png"],
                this.assetManager.images["img/skier_jump_3.png"],
                this.assetManager.images["img/skier_jump_4.png"],
                this.assetManager.images["img/skier_jump_5.png"],
            ]);
            this.speed *= 0.5;
        }
        if (value === "downhill") {
            this.animation = new Animation([this.assetManager.images["img/skier_down.png"]]);
            this.speed *= 2;
        }
    }

    next(time: number) {
        const timeDiff = time - this.lastTime;
        this.lastTime = time;

        this.animation.update(time);
        this.position.y += this.speed * timeDiff;
    }

    get frame() {
        return this.animation.frame;
    }
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
        if (time > 2000) {
            player.state = "jumping";
        }

        if (time > 5000) {
            player.state = "downhill";
        }
        entities.forEach((entity) => entity.next(time));

        canvas.camera.next();
        canvas.clear();
        entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
