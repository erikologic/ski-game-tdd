import { IMAGES } from "./AssetManager";
import { GameTime } from "./GameTime";
import { Player } from "./Player";

const createImage = (url: string) => {
    const image = new Image();
    image.alt = url;
    return image;
};

const assetManager = {
    images: Object.fromEntries(IMAGES.map((url) => [url, createImage(url)])) as Record<
        typeof IMAGES[number],
        HTMLImageElement
    >,
};

describe("Player", () => {
    test("on start, it will go downhill", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);
        expect(player.position.y).toEqual(0);
        gameTime.gameFrame++;
        player.next();
        expect(player.position.y).toEqual(4);

        expect(player.frame.alt).toEqual("img/skier_down.png");
    });

    test("jumping", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        expect(player.position.y).toEqual(0);

        // WHEN the skier is downhill
        while (gameTime.gameFrame < 5) {
            gameTime.gameFrame++;
            player.next();
            expect(player.position.y).toEqual(gameTime.gameFrame * 4);
        }

        // GIVEN the skier receives a jump command
        player.do("jump");
        const jumpFrame = gameTime.gameFrame;

        // THEN the skier starts jumping
        let prevPositionY = player.position.y;
        gameTime.gameFrame++;
        player.next();
        expect(player.frame.alt).toEqual("img/skier_jump_1.png");

        // AND the skier will slow down
        expect(player.position.y).toBe(prevPositionY + 2.8);
    });

    test("jump animation", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        expect(player.position.y).toEqual(0);

        // GIVEN the skier receives a jump command
        gameTime.gameFrame++;
        player.handleInput("Space");
        player.next();

        // THEN the skier starts jumping
        while (gameTime.gameFrame <= 60) {
            gameTime.gameFrame++;
            player.next();

            if (gameTime.gameFrame < 12) {
                expect(player.frame.alt).toEqual(`img/skier_jump_1.png`);
                continue;
            }
            if (gameTime.gameFrame < 24) {
                expect(player.frame.alt).toEqual(`img/skier_jump_2.png`);
                continue;
            }
            if (gameTime.gameFrame < 36) {
                expect(player.frame.alt).toEqual(`img/skier_jump_3.png`);
                continue;
            }
            if (gameTime.gameFrame < 48) {
                expect(player.frame.alt).toEqual(`img/skier_jump_4.png`);
                continue;
            }
            if (gameTime.gameFrame < 60) {
                expect(player.frame.alt).toEqual(`img/skier_jump_5.png`);
                continue;
            }
        }

        // AND the skier goes back downhill
        gameTime.gameFrame++;
        player.next();
        expect(player.frame.alt).toEqual("img/skier_down.png");
    });

    test("turning", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        expect(player.position.y).toEqual(0);

        // GIVEN the skier receives a turn right command
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();

        // THEN the skier goes right downhill
        expect(player.frame.alt).toEqual("img/skier_right_down.png");
        expect(player.position.y).toBe(2.8284);
        expect(player.position.x).toBe(2.8284); // speed is different then downhill speed!

        // GIVEN the skier receives a turn right command
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();

        // THEN the skier goes right on the side
        expect(player.frame.alt).toEqual("img/skier_right.png");
        expect(player.position.y).toBe(2.8284);
        expect(player.position.x).toBe(4.8284);

        // AND it stops
        gameTime.gameFrame++;
        player.next();
        expect(player.position.y).toBe(2.8284);
        expect(player.position.x).toBe(4.8284);

        // AND pressing right again will make the skier go right again
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();
        expect(player.position.y).toBe(2.8284);
        expect(player.position.x).toBe(6.8284);

        // AND pressing left will make the skier go downhill right
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame.alt).toEqual("img/skier_right_down.png");

        // AND pressing left will make the skier go downhill
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame.alt).toEqual("img/skier_down.png");

        // AND pressing left will make the skier go downhill left
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame.alt).toEqual("img/skier_left_down.png");

        // AND pressing left will make the skier go left
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame.alt).toEqual("img/skier_left.png");

        // AND pressing down will make the skier go downhill
        gameTime.gameFrame++;
        player.handleInput("ArrowDown");
        player.next();
        expect(player.frame.alt).toEqual("img/skier_down.png");

        // AND pressing right will make the skier go downhill right
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();
        expect(player.frame.alt).toEqual("img/skier_right_down.png");

        // WHEN pressing jump
        gameTime.gameFrame++;
        player.handleInput("Space");
        player.next();

        // THEN the skier will jump
        expect(player.frame.alt).toEqual("img/skier_jump_1.png");

        // UNTIL finally going downhill again
        for (let i = 0; i < 60; i++) {
            gameTime.gameFrame++;
            player.next();
        }
        expect(player.frame.alt).toEqual("img/skier_down.png");
    });
});
