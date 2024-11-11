interface GameEngine {
    setAdvanceGameFunction(next: () => void): unknown;
}

interface GameOptions {
    gameEngine: GameEngine;
}

export class Game {
    score = 1;

    constructor(private options: GameOptions) {}

    getScore(): number {
        return this.score;
    }

    start() {
        this.options.gameEngine.setAdvanceGameFunction(this.next.bind(this));
    }

    next() {
        this.score = this.score * 2;
    }
}
