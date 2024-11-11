interface Coordinates {
    x: number;
    y: number;
}

class Skier {
    position: Coordinates;
    direction: "down" | "down-right" | "side-right" | "down-left" | "side-left";

    constructor() {
        this.position = { x: 0, y: 0 };
        this.direction = "down";
    }
}

export class Game {
    gameFrame = 1;

    skier: Skier;

    constructor() {
        this.skier = new Skier();
    }

    start() {
        throw new Error("Method not implemented.");
    }

    next() {
        if (this.skier.direction === "down") {
            this.skier.position.y -= Math.ceil(this.gameFrame / 100);
        }
        if (this.skier.direction === "down-right") {
            this.skier.position.y -= Math.ceil(this.gameFrame / 100);
            this.skier.position.x += Math.ceil(this.gameFrame / 100);
        }
        if (this.skier.direction === "side-right") {
            this.skier.position.x += Math.ceil(this.gameFrame / 100);
        }
        if (this.skier.direction === "down-left") {
            this.skier.position.y -= Math.ceil(this.gameFrame / 100);
            this.skier.position.x -= Math.ceil(this.gameFrame / 100);
        }
        if (this.skier.direction === "side-left") {
            this.skier.position.x -= Math.ceil(this.gameFrame / 100);
        }
    }

    sendInput(input: "right" | "left" | "down") {
        if (input === "right") {
            if (this.skier.direction === "down-right") {
                this.skier.direction = "side-right";
                return;
            }
            this.skier.direction = "down-right";
            return;
        }
        if (input === "left") {
            if (this.skier.direction === "down-left") {
                this.skier.direction = "side-left";
                return;
            }
            this.skier.direction = "down-left";
            return;
        }

        if (input === "down") {
            this.skier.direction = "down";
        }
    }
}
