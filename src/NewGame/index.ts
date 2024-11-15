import "../../css/game.css";

import { AssetManager } from "./Utils/AssetManager";
import { Canvas } from "./Engine/Canvas";
import { GameTime } from "./Engine/GameTime";
import { EntityManager } from "./Entity/EntityManager";
import { Player } from "./Entity/Player";
import { Rhino } from "./Entity/Rhino";
import { Tree } from "./Entity/Obstacle";
import { ObstacleManager } from "./Entity/ObstacleManager";

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

    const rhino = new Rhino(assetManager, gameTime);
    rhino.position.y = -200;
    // rhino.chase(player);

    const obstacleManager = new ObstacleManager(assetManager, player, canvas.camera);
    canvas.camera.follow(player);

    const entityManager = new EntityManager([player, rhino]);

    async function next(time: number) {
        obstacleManager.update();
        entityManager.entities = [player, rhino, ...obstacleManager.obstacles];
        gameTime.update(time);

        entityManager.next();

        canvas.camera.update();
        canvas.clear();
        entityManager.entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(next);
    }

    requestAnimationFrame(next);
});
