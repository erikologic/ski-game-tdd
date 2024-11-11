import { Game } from "./Game";

describe("Game", () => {
    test("game has a player controlled skier character that moves down", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.next();
        expect(game.skier.position).toEqual({ x: 0, y: -1 });
    });

    test("player skier moves down faster when game time passes", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.next();
        expect(game.skier.position.y).toEqual(-1);
        [...Array(100)].forEach(() => game.next());
        expect(game.skier.position.y).toEqual(-101);
    });

    test("player skier can downfall towards the right side", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.sendInput("right");
        game.next();
        expect(game.skier.position).toEqual({ x: 1, y: -1 });
    });

    test("player skier can downfall towards the right side faster when game time passes", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.sendInput("right");
        game.next();
        expect(game.skier.position).toEqual({ x: 1, y: -1 });
        [...Array(100)].forEach(() => game.next());
        expect(game.skier.position).toEqual({ x: 101, y: -101 });
    });

    test("when going further right, the skier stops and moves sideways", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.sendInput("right");
        game.next();
        expect(game.skier.position).toEqual({ x: 1, y: -1 });
        game.sendInput("right");
        game.next();
        expect(game.skier.position).toEqual({ x: 2, y: -1 });
    });

    test("when going further left, the skier stops and moves sideways", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.sendInput("left");
        game.next();
        expect(game.skier.position).toEqual({ x: -1, y: -1 });
        game.sendInput("left");
        game.next();
        expect(game.skier.position).toEqual({ x: -2, y: -1 });
    });

    test("player skier can downfall towards the left side, going faster when time passes", () => {
        const game = new Game();
        expect(game.skier.position).toEqual({ x: 0, y: 0 });
        game.sendInput("left");
        game.next();
        expect(game.skier.position).toEqual({ x: -1, y: -1 });
        [...Array(100)].forEach(() => game.next());
        expect(game.skier.position).toEqual({ x: -101, y: -101 });
    });

    // TODO direction state machine

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
