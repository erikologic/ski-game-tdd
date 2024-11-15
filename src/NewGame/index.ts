import "../../css/game.css";

import { AssetManager } from "./Utils/AssetManager";
import { Canvas } from "./Engine/Canvas";
import { GameTime } from "./Engine/GameTime";
import { EntityManager } from "./Entity/EntityManager";
import { Player } from "./Entity/Player";
import { Rhino } from "./Entity/Rhino";
import { Tree } from "./Entity/Obstacle";

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

    const tree = Tree.random(assetManager);
    tree.position.x = -100;

    const rhino = new Rhino(assetManager, gameTime);
    rhino.position.y = -200;
    rhino.chase(player);

    canvas.camera.follow(player);

    const entityManager = new EntityManager([player, tree, rhino]);

    async function next(time: number) {
        gameTime.update(time);

        entityManager.next();

        canvas.camera.next();
        canvas.clear();
        entityManager.entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
