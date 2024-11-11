import { Game } from "./Game";

class MockedGameEngine {
    ticks = 0;
    private next!: (gameTime: number) => void;

    nextTicks(n: number) {
        [...Array(n)].forEach(() => {
            this.ticks++;
            this.next(this.ticks);
        });
    }

    setAdvanceGameFunction(next: (gameTime: number) => void) {
        this.next = next;
    }
}

describe("Game", () => {
    // game has obstacles: rocks, tree, trees cluster+
    // game has a player controlled ski character
    // game has a rhino character

    test("game difficulty increases the longer the skier skis", () => {
        const mockedGameEngine = new MockedGameEngine();
        const game = new Game({ gameEngine: mockedGameEngine });
        game.start();

        expect(game.getScore()).toEqual(0);
        mockedGameEngine.nextTicks(1);
        expect(game.getScore()).toEqual(1);
        mockedGameEngine.nextTicks(100);
        expect(game.getScore()).toBeGreaterThan(101);
    });
});

// player can hit obstacles
// rhino can eat player character
// player can jump over rocks
// player cannot jump over trees

//   Provide a way to reset the game once it's over
//   Provide a way to pause and resume the game

//   Deploy the game to a server so that we can play it without having to install it locally
