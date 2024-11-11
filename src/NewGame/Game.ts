interface GameEngine {
    setAdvanceGameFunction(next: (gameTime: number) => void): unknown;
}

interface GameOptions {
    gameEngine: GameEngine;
}

export class Game {
    score = 0;

    constructor(private options: GameOptions) {}

    getScore(): number {
        return this.score;
    }

    start() {
        this.options.gameEngine.setAdvanceGameFunction(this.next.bind(this));
    }

    next(gameTime: number) {
        this.score += Math.ceil(gameTime / 100);
    }
}
