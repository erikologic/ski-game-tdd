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

interface IEntityState {
    speed: number;
    nextState(time: number): IEntityState;
    animation: Animation;
    do(command: "jump"): IEntityState;
}

class JumpingState implements IEntityState {
    speed = 0.015;
    animation: Animation;

    constructor(private assetManager: AssetManager) {
        this.animation = new Animation(
            [
                assetManager.images["img/skier_jump_1.png"],
                assetManager.images["img/skier_jump_2.png"],
                assetManager.images["img/skier_jump_3.png"],
                assetManager.images["img/skier_jump_4.png"],
                assetManager.images["img/skier_jump_5.png"],
            ],
            false
        );
    }

    nextState(time: number) {
        if (this.animation.complete) {
            return new DownhillState(this.assetManager);
        }
        this.animation.update(time);
        return this;
    }

    do(action: "jump"): IEntityState {
        return this;
    }
}

class DownhillState implements IEntityState {
    speed = 0.03;
    animation: Animation;

    constructor(private assetManager: AssetManager) {
        this.animation = new Animation([assetManager.images["img/skier_down.png"]]);
    }

    nextState(time: number) {
        return this;
    }

    do(command: "jump"): IEntityState {
        return new JumpingState(this.assetManager);
    }
}

export class Player implements IEntity {
    lastTime = 0;
    position = new Position(0, 0);
    assetManager: AssetManager;
    state: IEntityState;

    constructor(assetManager: AssetManager) {
        this.assetManager = assetManager;
        this.state = new DownhillState(assetManager);
    }

    do(action: "jump") {
        this.state = this.state.do(action);
    }

    next(time: number) {
        const timeDiff = time - this.lastTime;
        this.lastTime = time;

        this.state = this.state.nextState(time);
        this.position.y += this.state.speed * timeDiff;
    }

    get frame() {
        return this.state.animation.frame;
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
        if (time > 2000 && time < 2050) {
            player.do("jump");
        }

        entities.forEach((entity) => entity.next(time));

        canvas.camera.next();
        canvas.clear();
        entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
