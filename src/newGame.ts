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

    const game_width = window.innerWidth;
    const game_height = window.innerHeight;
    canvas.width = game_width * window.devicePixelRatio;
    canvas.height = game_height * window.devicePixelRatio;
    canvas.style.width = game_width + "px";
    canvas.style.height = game_height + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    await loadSingleImage("skierdown", "img/skier_down.png");

    ctx.clearRect(0, 0, game_width, game_height);
    ctx.drawImage(loadedImages["skierdown"], 0, 0);

    await wait(2000);
    ctx.drawImage(loadedImages["skierdown"], 10, 10);

    await wait(2000);
    ctx.clearRect(0, 0, game_width, game_height);
    ctx.drawImage(loadedImages["skierdown"], 20, 20);
});
