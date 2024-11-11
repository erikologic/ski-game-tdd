interface Skier {
    position: { x: number; y: number };
}

export class Game {
    skier: Skier;
    constructor() {
        this.skier = {
            position: { x: 0, y: 0 },
        };
    }

    next() {
        this.skier.position.y--;
    }

    start() {
        throw new Error("Method not implemented.");
    }
}
