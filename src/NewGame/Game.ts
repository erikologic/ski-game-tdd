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
        this.skier.receiveInput(input);
    }
}
