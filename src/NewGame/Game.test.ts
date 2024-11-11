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

    test("game has a score that increments as the skier skis further", () => {
        const mockedGameEngine = new MockedGameEngine();
        const game = new Game({ gameEngine: mockedGameEngine });
        game.start();

        const prevScore = game.getScore();

        mockedGameEngine.nextTick();

        const newScore = game.getScore();
        expect(newScore).toBeGreaterThan(prevScore);
    });
});

// game has a score that increments as the skier skis further
// game difficulty increases the longer the skier skis

// player can hit obstacles
// rhino can eat player character
// player can jump over rocks
// player cannot jump over trees

//   Provide a way to reset the game once it's over
//   Provide a way to pause and resume the game

//   Deploy the game to a server so that we can play it without having to install it locally
