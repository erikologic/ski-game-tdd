// import { Game } from "./NewGame/Game";

import { AssetManager } from "./AssetManager";
import { Position } from "./Position";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

    constructor(position: Position, assetManager: AssetManager) {
        this.position = position;
        this.images = [
            assetManager.images["img/rhino_celebrate_1.png"],
            assetManager.images["img/rhino_celebrate_2.png"],
        ];
    }

    getImage(frame: number) {
        const idx = Math.floor(frame / 10) % 2;
        return this.images[idx];
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // const game = new Game();
    // game.start();
    const canvas = new Canvas();
    const assetManager = await AssetManager.create();
    const player = {
        position: new Position(0, 0),
        image: assetManager.images["img/skier_down.png"],
    };
    const tree = {
        position: new Position(-100, 0),
        image: assetManager.images["img/tree_1.png"],
    };

    const rhino = new Rhino(new Position(100, 0), assetManager);

    const cameraPosition = { ...player.position };

    let frame = 0;
    async function gameLoop() {
        frame++;
        player.position.y += 0.2;

        canvas.clear();
        canvas.drawImage(player.image, player.position);
        canvas.drawImage(tree.image, tree.position);
        canvas.drawImage(rhino.getImage(frame), rhino.position);

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});
