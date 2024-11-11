import { Game } from "./Game";

describe("Game", () => {
    test("start", () => {
        const game = new Game();
        game.run();
    });
});
