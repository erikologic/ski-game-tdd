import { GameTime } from "../Engine/GameTime";

export class Animation {
    animationStartFrame?: number;
    frameIndex: number = 0;
    complete: boolean = false;

    static ANIMATION_FRAME_RATE = 5;
    static ANIMATION_TO_GAME_FRAME_RATE = GameTime.FRAME_PER_SECOND / Animation.ANIMATION_FRAME_RATE;

    constructor(public images: HTMLImageElement[], private isLoop = true) {}

    update(time: GameTime) {
        if (this.animationStartFrame === undefined) {
            this.animationStartFrame = time.gameFrame;
        }

        const animationFrame = time.gameFrame - this.animationStartFrame;
        const nextFrame = Math.floor(animationFrame / Animation.ANIMATION_TO_GAME_FRAME_RATE) % this.images.length;
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
