export class Position {
    constructor(public x: number, public y: number) {}

    add(other: Position) {
        return new Position(this.x + other.x, this.y + other.y);
    }

    minus(other: Position) {
        return new Position(this.x - other.x, this.y - other.y);
    }

    multiply(x: number, y: number): Position {
        return new Position(this.x * x, this.y * y);
    }

    moveTowards(to: Position, speed: number) {
        const angle = Math.atan2(to.y - this.y, to.x - this.x);
        const x = Math.cos(angle) * speed;
        const y = Math.sin(angle) * speed;
        return new Position(this.x + x, this.y + y);
    }
}