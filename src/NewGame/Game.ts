interface Skier {
    position: { x: number; y: number };
}

export class Game {
    gameFrame = 1;

    skier: Skier;
    constructor() {
        this.skier = {
            position: { x: 0, y: 0 },
        };
    }

    next() {
        this.skier.position.y -= Math.ceil(this.gameFrame / 100);
    }

    start() {
        throw new Error("Method not implemented.");
    }
}
