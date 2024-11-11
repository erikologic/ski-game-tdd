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
}

export class Game {
    skier: Skier; // TODO horrible
    rock?: Coordinates;

    constructor() {
        this.skier = new Skier();
    }

    start() {
        throw new Error("Method not implemented.");
    }

    next() {
        if (this.skier.state === "downhill") {
            this.skier.position.y--;
        }
        if (this.skier.state === "downhill-right") {
            this.skier.position.y--;
            this.skier.position.x++;
        }
        if (this.skier.state === "sidestepping-right") {
            if (!this.skier.hasSidestepped) {
                this.skier.position.x++;
                this.skier.hasSidestepped = true;
            }
        }
        if (this.skier.state === "downhill-left") {
            this.skier.position.y--;
            this.skier.position.x--;
        }
        if (this.skier.state === "sidestepping-left") {
            if (!this.skier.hasSidestepped) {
                this.skier.position.x--;
                this.skier.hasSidestepped = true;
            }
        }

        if (this.rock && this.skier.position.x === this.rock.x && this.skier.position.y === this.rock.y) {
            this.skier.state = "hit-obstacle";
        }
    }

    sendInput(input: "right" | "left" | "down") {
        if (input === "right") {
            if (this.skier.state === "downhill-right" || this.skier.state === "hit-obstacle") {
                this.skier.state = "sidestepping-right";
                this.skier.hasSidestepped = false;
                return;
            }
            this.skier.state = "downhill-right";
            return;
        }
        if (input === "left") {
            if (this.skier.state === "downhill-left" || this.skier.state === "hit-obstacle") {
                this.skier.state = "sidestepping-left";
                this.skier.hasSidestepped = false;
                return;
            }
            this.skier.state = "downhill-left";
            return;
        }

        if (input === "down") {
            if (this.skier.state === "hit-obstacle") {
                return;
            }
            this.skier.state = "downhill";
        }
    }
}
