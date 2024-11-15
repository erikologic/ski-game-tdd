import { AssetManager } from "./AssetManager";
import { Canvas } from "./Canvas";
import { EntityManager } from "./EntityManager";
import { GameTime } from "./GameTime";
import { Player } from "./Player";
import { Rhino } from "./Rhino";
import { Tree } from "./Tree";


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
