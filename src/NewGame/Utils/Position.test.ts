import { Position } from "./Position";

describe("Position", () => {
    test("move towards a new position at speed", () => {
        const from = new Position(0, 0);
        const to = new Position(10, 20);
        const speed = 22.36;
        const newPosition = from.moveTowards(to, speed);
        expect(newPosition.x).toBeCloseTo(10);
        expect(newPosition.y).toBeCloseTo(20);
    });
});