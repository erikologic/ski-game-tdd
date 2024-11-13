export class GameTime {
    private lastTime = 0;
    gameFrame = 0;
    static FRAME_PER_SECOND = 60;

    update(time: number) {
        const frameRate = 1000 / GameTime.FRAME_PER_SECOND;
        const timeDiff = time - this.lastTime;
        if (timeDiff > frameRate) {
            this.lastTime = time;
            this.gameFrame++;
        }
    }
}
