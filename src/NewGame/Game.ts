interface Coordinates {
    x: number;
    y: number;
}

class Skier {
    position: Coordinates;
    state:
        | "downhill"
        | "downhill-right"
        | "sidestepping-right"
        | "downhill-left"
        | "sidestepping-left"
        | "hit-obstacle";
    hasSidestepped = false;

    constructor() {
        this.position = { x: 0, y: 0 };
        this.state = "downhill";
    }

    move() {
        if (this.state === "downhill") {
            this.position.y--;
        }
        if (this.state === "downhill-right") {
            this.position.y--;
            this.position.x++;
        }
        if (this.state === "sidestepping-right") {
            if (!this.hasSidestepped) {
                this.position.x++;
                this.hasSidestepped = true;
            }
        }
        if (this.state === "downhill-left") {
            this.position.y--;
            this.position.x--;
        }
        if (this.state === "sidestepping-left") {
            if (!this.hasSidestepped) {
                this.position.x--;
                this.hasSidestepped = true;
            }
        }
    }

    receiveInput(input: "right" | "left" | "down") {
        if (this.state === "hit-obstacle") {
            if (input === "down") return;

            if (input === "left") {
                this.state = "sidestepping-left";
            }
            if (input === "right") {
                this.state = "sidestepping-right";
            }
            this.hasSidestepped = false;
            return;
        }

        if (input === "down") {
            this.state = "downhill";
            return;
        }

        const states = [
            "sidestepping-left",
            "downhill-left",
            "downhill",
            "downhill-right",
            "sidestepping-right",
        ] as const;
        const currentState = this.state;
        const currentIndex = states.indexOf(currentState);
        const stateDiff = input === "left" ? -1 : 1;
        let newStateIndex = currentIndex + stateDiff;
        if (newStateIndex < 0 || newStateIndex >= states.length) {
            this.hasSidestepped = false;
            newStateIndex = currentIndex;
        }
        this.state = states[newStateIndex];
    }
}

export class Obstacle {
    constructor(public position: Coordinates) {
        this.position = position;
    }

    checkCollision(entity: { position: Coordinates }) {
        return this.position.x === entity.position.x && this.position.y === entity.position.y;
    }
}

export class Game {
    skier: Skier; // TODO horrible
    obstacles: Obstacle[] = [];

    constructor() {
        this.skier = new Skier();
    }

    start() {
        throw new Error("Method not implemented.");
    }

    next() {
        this.skier.move();

        if (this.obstacles.some((obstacle) => obstacle.checkCollision(this.skier))) {
            this.skier.state = "hit-obstacle";
        }
    }

    sendInput(input: "right" | "left" | "down") {
        this.skier.receiveInput(input);
    }
}
