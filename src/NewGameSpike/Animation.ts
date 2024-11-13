export class Animation {
    frameIndex: number = 0;

    constructor(public images: HTMLImageElement[]) {}

    update(time: number) {
        this.frameIndex = Math.floor(time / 200) % this.images.length;
    }

    get frame(): HTMLImageElement {
        return this.images[this.frameIndex];
    }
}
