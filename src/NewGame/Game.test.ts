import { Game } from "./Game";

class MockedGameEngine {
    private next!: () => void;

    nextTick() {
        this.next();
    }

    setAdvanceGameFunction(next: () => void) {
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

        [1, 2, 4, 8].map((expectedScore) => {
            const gotScore = game.getScore();
            expect(gotScore).toBe(expectedScore);
            mockedGameEngine.nextTick();
        });
    });
});

// player can hit obstacles
// rhino can eat player character
// player can jump over rocks
// player cannot jump over trees

//   Provide a way to reset the game once it's over
//   Provide a way to pause and resume the game

//   Deploy the game to a server so that we can play it without having to install it locally
