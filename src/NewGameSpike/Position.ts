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
}
