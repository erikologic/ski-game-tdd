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

interface Position {
    x: number;
    y: number;
}

class Canvas {
    width: number;
    heigth: number;

    centre: { x: number; y: number };
    ctx: CanvasRenderingContext2D;

    constructor() {
        const canvas = document.getElementById("skiCanvas")! as HTMLCanvasElement; // TODO exclamation mark
        this.ctx = canvas.getContext("2d")!; // TODO exclamation mark

        this.width = window.innerWidth;
        this.heigth = window.innerHeight;
        canvas.width = this.width * window.devicePixelRatio;
        canvas.height = this.heigth * window.devicePixelRatio;
        canvas.style.width = this.width + "px";
        canvas.style.height = this.heigth + "px";
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

        this.centre = {
            x: this.width / 2,
            y: this.heigth / 2,
        };
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.heigth);
    }

    drawImage(image: HTMLImageElement, position: Position) {
        this.ctx.drawImage(
            image,
            this.centre.x + position.x - image.width / 2,
            this.centre.y + position.y - image.height / 2,
            image.width,
            image.height
        );
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // const game = new Game();
    // game.start();
    const canvas = new Canvas();
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
        canvas.clear();

        canvas.drawImage(player.image, player.position);

        canvas.drawImage(tree.image, tree.position);

        const idx = i % 4 >= 2 ? 0 : 1;
        const rhinoFrame = rhino.image[idx];
        canvas.drawImage(rhinoFrame, rhino.position);

        await wait(100);
    }
});
