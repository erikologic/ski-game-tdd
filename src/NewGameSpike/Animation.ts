export class Animation {
    frameIndex: number = 0;
    complete: boolean = false;

    constructor(public images: HTMLImageElement[], private isLoop = true) {}

    update(time: number) {
        this.frameIndex = Math.floor(time / 200) % this.images.length;
    }

    get frame(): HTMLImageElement {
        if (!this.isLoop && this.frameIndex === this.images.length - 1) {
            this.complete = true;
        }

        return this.images[this.frameIndex];
    }
}
