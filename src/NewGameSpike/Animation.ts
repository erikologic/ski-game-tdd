import { GameTime } from "./GameTime";

export class Animation {
    frameIndex: number = 0;
    complete: boolean = false;

    static ANIMATION_FRAME_RATE = 5;
    static ANIMATION_TO_GAME_FRAME_RATE = GameTime.FRAME_PER_SECOND / Animation.ANIMATION_FRAME_RATE;

    constructor(public images: HTMLImageElement[], private isLoop = true) {}

    update(time: GameTime) {
        const nextFrame = Math.floor(time.gameFrame / Animation.ANIMATION_TO_GAME_FRAME_RATE) % this.images.length;
        const isAnimationRestarting = nextFrame < this.frameIndex;
        if (isAnimationRestarting && !this.isLoop) {
            this.complete = true;
        }
        this.frameIndex = nextFrame;
    }

    get frame(): HTMLImageElement {
        return this.images[this.frameIndex];
    }
}
