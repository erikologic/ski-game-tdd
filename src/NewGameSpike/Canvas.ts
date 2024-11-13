import { IEntity } from "./IEntity";
import { Camera } from "./Camera";
import { Position } from "./Position";

export class Canvas {
    width: number;
    heigth: number;

    centre: Position;
    ctx: CanvasRenderingContext2D;
    camera: Camera;

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

        this.camera = new Camera();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.heigth);
    }

    drawEntity(entity: IEntity) {
        const image = entity.frame;
        const position = entity.position;

        const imageZero = new Position(-image.width / 2, -image.height / 2);
        const imageCentre = position.add(imageZero).add(this.centre).minus(this.camera.position);

        this.ctx.drawImage(image, imageCentre.x, imageCentre.y, image.width, image.height);
    }
}
