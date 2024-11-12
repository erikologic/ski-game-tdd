/**
 * The entry point for the game. Creates the game, kicks off any loading that's needed and then starts the game running.
 */

import "../css/game.css";
// import { Game } from "./NewGame/Game";

const SCALE: number = 0.5;

const loadedImages: { [key: string]: HTMLImageElement } = {};
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function loadSingleImage(name: string, url: string): Promise<void> {
    return new Promise((resolve) => {
        const loadedImage = new Image();
        loadedImage.onload = () => {
            loadedImage.width *= SCALE;
            loadedImage.height *= SCALE;

            loadedImages[name] = loadedImage;
            resolve();
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

    await loadSingleImage("skierdown", "img/skier_down.png");
    await loadSingleImage("tree", "img/tree_1.png");

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const playerPosition = { x: 0, y: 0 };
    const relativeZero = {
        x: canvasWidth / 2,
        y: canvasHeight / 2,
    };
    const image = loadedImages["skierdown"];
    ctx.drawImage(
        image,
        relativeZero.x - image.width / 2,
        relativeZero.y - image.height / 2,
        image.width,
        image.height
    );

    const treePosition = { x: -100, y: 0 };
    const treeImage = loadedImages["tree"];
    ctx.drawImage(
        treeImage,
        relativeZero.x + treePosition.x - treeImage.width / 2,
        relativeZero.y + treePosition.y - treeImage.height / 2,
        image.width,
        image.height
    );
});
