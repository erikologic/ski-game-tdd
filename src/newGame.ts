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

class Position {
    constructor(public x: number, public y: number) {}

    add(other: Position) {
        return new Position(this.x + other.x, this.y + other.y);
    }
}

class Canvas {
    width: number;
    heigth: number;

    centre: Position;
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

        this.centre = new Position(this.width / 2, this.heigth / 2);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.heigth);
    }

    drawImage(image: HTMLImageElement, position: Position) {
        const imageZero = new Position(-image.width / 2, -image.height / 2);
        const imageCentre = position.add(imageZero).add(this.centre);
        this.ctx.drawImage(image, imageCentre.x, imageCentre.y, image.width, image.height);
    }
}

class Rhino {
    position: Position;
    images: HTMLImageElement[];

    constructor(position: Position, images: HTMLImageElement[]) {
        this.position = position;
        this.images = images;
    }

    getNextFrame(frame: number) {
        const idx = Math.floor(frame / 10) % 2;
        return this.images[idx];
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // const game = new Game();
    // game.start();
    const canvas = new Canvas();
    const player = {
        position: new Position(0, 0),
        image: await loadSingleImage("skierdown", "img/skier_down.png"),
    };
    const tree = {
        position: new Position(-100, 0),
        image: await loadSingleImage("tree", "img/tree_1.png"),
    };
    const rhino = new Rhino(new Position(100, 0), [
        await loadSingleImage("tree", "img/rhino_celebrate_1.png"),
        await loadSingleImage("tree", "img/rhino_celebrate_2.png"),
    ]);

    const cameraPosition = { ...player.position };

    let frame = 0;
    async function gameLoop() {
        frame++;
        canvas.clear();

        canvas.drawImage(player.image, player.position);

        canvas.drawImage(tree.image, tree.position);

        canvas.drawImage(rhino.getNextFrame(frame), rhino.position);

        player.position.y += 1;
        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});
