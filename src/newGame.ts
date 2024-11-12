/**
 * The entry point for the game. Creates the game, kicks off any loading that's needed and then starts the game running.
 */

import "../css/game.css";
// import { Game } from "./NewGame/Game";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const SCALE: number = 0.5;

async function loadSingleImage(name: string, url: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve) => {
        const loadedImage = new Image();
        loadedImage.onload = () => {
            loadedImage.width *= SCALE;
            loadedImage.height *= SCALE;

            resolve(loadedImage);
        };
        loadedImage.src = url;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // const game = new Game();
    // game.start();
    const canvas = document.getElementById("skiCanvas")! as HTMLCanvasElement; // TODO exclamation mark
    const ctx = canvas.getContext("2d")!; // TODO exclamation mark

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const canvasCentre = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
    };

    const player = {
        position: { x: 0, y: 0 },
        image: await loadSingleImage("skierdown", "img/skier_down.png"),
    };
    const tree = {
        position: { x: -100, y: 0 },
        image: await loadSingleImage("tree", "img/tree_1.png"),
    };
    const rhino = {
        position: { x: 100, y: 0 },
        image: [
            await loadSingleImage("tree", "img/rhino_celebrate_1.png"),
            await loadSingleImage("tree", "img/rhino_celebrate_2.png"),
        ],
    };

    const cameraPosition = { ...player.position };

    for (let i = 0; i < 300; i++) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(
            player.image,
            canvasCentre.x + player.position.x - cameraPosition.x - player.image.width / 2,
            canvasCentre.y + player.position.y - cameraPosition.y - player.image.height / 2,
            player.image.width,
            player.image.height
        );

        ctx.drawImage(
            tree.image,
            canvasCentre.x + tree.position.x - cameraPosition.x - tree.image.width / 2,
            canvasCentre.y + tree.position.y - cameraPosition.y - tree.image.height / 2,
            tree.image.width,
            tree.image.height
        );

        const idx = i % 4 >= 2 ? 0 : 1;
        ctx.drawImage(
            rhino.image[idx],
            canvasCentre.x + rhino.position.x - cameraPosition.x - rhino.image[idx].width / 2,
            canvasCentre.y + rhino.position.y - cameraPosition.y - rhino.image[idx].height / 2,
            rhino.image[idx].width,
            rhino.image[idx].height
        );
        await wait(100);
        // player.position.y += 2;
        // cameraPosition.y = player.position.y;

        // if (i % 40 > 20) {
        //     player.position.x += 2;
        //     cameraPosition.x = player.position.x;
        // }
    }
});
