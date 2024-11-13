// import { Game } from "./NewGame/Game";

import { Game } from "../Core/Game";
import { Animation } from "./Animation";
import { AssetManager } from "./AssetManager";
import { Canvas } from "./Canvas";
import { GameTime } from "./GameTime";
import { Player, PlayerCommand } from "./Player";
import { Position } from "./Position";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface IEntity {
    get position(): Position;
    get frame(): HTMLImageElement;
    next(): void;
}

class Tree implements IEntity {
    position: Position;
    frame: HTMLImageElement;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.frame = assetManager.images["img/tree_1.png"];
    }

    next() {}
}

class Rhino implements IEntity {
    position: Position;
    animation: Animation;

    constructor(assetManager: AssetManager, private time: GameTime) {
        this.position = new Position(0, 0);
        this.animation = new Animation([
            assetManager.images["img/rhino_celebrate_1.png"],
            assetManager.images["img/rhino_celebrate_2.png"],
        ]);
    }

    next() {
        this.animation.update(this.time);
    }

    get frame() {
        return this.animation.frame;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const canvas = new Canvas();
    const assetManager = await AssetManager.create();

    const gameTime = new GameTime();
    const player = new Player(assetManager, gameTime);

    document.addEventListener("keydown", (event) => {
        if (player.handleInput(event.code)) {
            event.preventDefault();
        }
    });

    const tree = new Tree(assetManager);
    tree.position.x = -100;

    const rhino = new Rhino(assetManager, gameTime);
    rhino.position.x = 100;

    canvas.camera.follow(player);

    const entities = [player, tree, rhino];

    async function next(time: number) {
        gameTime.update(time);

        entities.forEach((entity) => entity.next());

        canvas.camera.next();
        canvas.clear();
        entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
