import { Rect } from "./Rect";

describe("Rect", () => {
    test("do not overlap", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: 30, y: 30 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeFalsy();
    });

    test("overlaps top right", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: 5, y: 5 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeTruthy();
    });

    test("overlaps bottom left", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: -5, y: -5 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeTruthy();
    });

    test("overlaps bottom right", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: 5, y: -5 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeTruthy();
    });

    test("overlaps top left", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: -5, y: 5 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeTruthy();
    });

    test("to the right", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: 30, y: 0 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeFalsy();
    });

    test("to the left", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: -30, y: 0 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeFalsy();
    });

    test("above", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: 0, y: 30 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeFalsy();
    });

    test("below", () => {
        const rect1 = new Rect({ x: 0, y: 0 }, { width: 10, height: 10 });
        const rect2 = new Rect({ x: 0, y: -30 }, { width: 10, height: 10 });
        expect(rect1.overlaps(rect2)).toBeFalsy();
    });
});
