import { Game } from "./Game";

describe("Game", () => {
    test("game has a player controlled ski character that moves down", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.next();
        expect(game.skier.position).toEqual({ x: 0, y: -1 });
    });

    test("player moves down faster when game time passes", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.next();
        expect(game.skier.position.y).toEqual(-1);
        [...Array(100)].forEach(() => game.next());
        expect(game.skier.position.y).toEqual(-101);
    });

    // game has obstacles: rocks, tree, trees cluster+
    // player can hit obstacles

    // game has a rhino character
    // rhino chase player
    // rhino can eat player character

    // player can jump over rocks
    // player cannot jump over trees

    // Add a score that increments as the skier skis further
    // Increase the difficulty the longer the skier skis (increase speed, increase obstacle frequency, etc.)

    // Provide a way to reset the game once it's over
    // Provide a way to pause and resume the game
});

//   Deploy the game to a server so that we can play it without having to install it locally
