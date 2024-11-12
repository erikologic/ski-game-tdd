/**
 * The entry point for the game. Creates the game, kicks off any loading that's needed and then starts the game running.
 */

import "../css/game.css";
// import { Game } from "./NewGame/Game";

const SCALE: number = 0.5;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    const skierImage = await loadSingleImage("skierdown", "img/skier_down.png");
    const treeImage = await loadSingleImage("tree", "img/tree_1.png");

    const playerPosition = { x: 0, y: 0 };
    const treePosition = { x: -100, y: 0 };
    const canvasCentre = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
    };
    const cameraPosition = { ...playerPosition };

    for (let i = 0; i < 300; i++) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(
            skierImage,
            canvasCentre.x + playerPosition.x - cameraPosition.x - skierImage.width / 2,
            canvasCentre.y + playerPosition.y - cameraPosition.y - skierImage.height / 2,
            skierImage.width,
            skierImage.height
        );

        ctx.drawImage(
            treeImage,
            canvasCentre.x + treePosition.x - cameraPosition.x - treeImage.width / 2,
            canvasCentre.y + treePosition.y - cameraPosition.y - treeImage.height / 2,
            skierImage.width,
            skierImage.height
        );
        await wait(100);
        playerPosition.y += 2;
        cameraPosition.y = playerPosition.y;

        if (i % 40 > 20) {
            playerPosition.x += 2;
            cameraPosition.x = playerPosition.x;
        }
    }
});
