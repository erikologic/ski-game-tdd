// import { Game } from "./NewGame/Game";

import { Game } from "../Core/Game";
import { Animation } from "./Animation";
import { AssetManager } from "./AssetManager";
import { Canvas } from "./Canvas";
import { EntityManager } from "./EntityManager";
import { GameTime } from "./GameTime";
import { Player, PlayerCommand } from "./Player";
import { Position } from "./Position";
import { Rhino } from "./Rhino";
import { Tree } from "./Tree";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
    rhino.position.y = -200;
    rhino.chase(player);

    canvas.camera.follow(player);

    const entityManager = new EntityManager([player, tree, rhino]);

    for (let i = 0; i < 500; i++) {
        const tree = new Tree(assetManager);
        tree.position = new Position(-100, i * 100);
        entityManager.entities.push(tree);
    }

    async function next(time: number) {
        gameTime.update(time);

        // entities.forEach((entity) => entity.next());
        entityManager.next();

        canvas.camera.next();
        canvas.clear();
        // entities.forEach((entity) => canvas.drawEntity(entity));
        entityManager.entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
