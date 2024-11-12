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

    drawEntity(entity: IEntity) {
        const image = entity.frame;
        const position = entity.position;

        const imageZero = new Position(-image.width / 2, -image.height / 2);
        const imageCentre = position.add(imageZero).add(this.centre);

        this.ctx.drawImage(image, imageCentre.x, imageCentre.y, image.width, image.height);
    }
}

interface IEntity {
    get position(): Position;
    get frame(): HTMLImageElement;
    update(time: number): void;
}

class Player implements IEntity {
    speed = 0.02;
    lastTime = 0;
    position: Position;
    frame: HTMLImageElement;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.frame = assetManager.images["img/skier_down.png"];
    }

    update(time: number) {
        const timeDiff = time - this.lastTime;
        this.lastTime = time;
        this.position.y += this.speed * timeDiff;
    }
}

class Tree implements IEntity {
    position: Position;
    frame: HTMLImageElement;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.frame = assetManager.images["img/tree_1.png"];
    }

    update(time: number) {}
}

class Animation {
    images: HTMLImageElement[];
    frameIndex: number = 0;

    constructor(assetManager: AssetManager) {
        this.images = [
            assetManager.images["img/rhino_celebrate_1.png"],
            assetManager.images["img/rhino_celebrate_2.png"],
        ];
    }

    update(time: number) {
        this.frameIndex = Math.floor(time / 200) % this.images.length;
    }

    get frame() {
        return this.images[this.frameIndex];
    }
}

class Rhino implements IEntity {
    position: Position;
    animation: Animation;

    constructor(assetManager: AssetManager) {
        this.position = new Position(0, 0);
        this.animation = new Animation(assetManager);
    }

    update(time: number) {
        this.animation.update(time);
    }

    get frame() {
        return this.animation.frame;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // const game = new Game();
    // game.start();
    const canvas = new Canvas();
    const assetManager = await AssetManager.create();

    const player = new Player(assetManager);

    const tree = new Tree(assetManager);
    tree.position.x = -100;

    const rhino = new Rhino(assetManager);
    rhino.position.x = 100;

    const cameraPosition = { ...player.position };

    const entities = [player, tree, rhino];

    async function gameLoop(time: number) {
        entities.forEach((entity) => entity.update(time));

        canvas.clear();
        entities.forEach((entity) => canvas.drawEntity(entity));

        requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
});
