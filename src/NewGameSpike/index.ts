// import { Game } from "./NewGame/Game";

import { Game } from "../Core/Game";
import { Animation } from "./Animation";
import { AssetManager } from "./AssetManager";
import { Canvas } from "./Canvas";
import { EntityManager } from "./EntityManager";
import { GameTime } from "./GameTime";
import { Player, PlayerCommand } from "./Player";
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
    tree.position.y = 500;

    const rhino = new Rhino(assetManager, gameTime);
    rhino.position.x = 100;

    canvas.camera.follow(player);

    const entityManager = new EntityManager([player, tree, rhino]);
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
