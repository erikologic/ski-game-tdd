import { EntityManager } from "./EntityManager";
import { IMAGES } from "./AssetManager";
import { GameTime } from "./GameTime";
import { Player } from "./Player";
import { Tree } from "./Tree";
import { Rock } from "./Rock";
import { Rhino } from "./Rhino";

const createImage = (url: string) => {
    const image = new Image();
    image.alt = url;
    image.width = 5;
    image.height = 5;
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
        expect(player.position.y).toBeGreaterThan(0);

        expect(player.frame!.alt).toEqual("img/skier_down.png");
    });

    test("jumping", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        expect(player.position.y).toEqual(0);

        // WHEN the skier is downhill
        while (gameTime.gameFrame < 5) {
            gameTime.gameFrame++;
            player.next();
        }

        let y1 = player.position.y;
        gameTime.gameFrame++;
        player.next();
        let y2 = player.position.y;
        let downHillSpeed = y2 - y1;

        // GIVEN the skier receives a jump command
        player.do("jump");
        const jumpFrame = gameTime.gameFrame;

        // THEN the skier starts jumping
        let prevPositionY = player.position.y;
        gameTime.gameFrame++;
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_jump_1.png");

        // AND the skier will slow down
        expect(player.position.y).toBeLessThan(prevPositionY + downHillSpeed);
    });

    test("jump animation", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        expect(player.position.y).toEqual(0);

        // GIVEN the skier goes downhill
        while (gameTime.gameFrame < 5) {
            gameTime.gameFrame++;
            player.next();
        }

        // WHEN the player jumps
        player.handleInput("Space");

        // THEN the skier starts jumping
        let jumpFrame = 0;
        while (jumpFrame <= 60) {
            jumpFrame++;
            gameTime.gameFrame++;
            player.next();

            if (jumpFrame <= 12) {
                expect(player.frame!.alt).toEqual(`img/skier_jump_1.png`);
                continue;
            }
            if (jumpFrame <= 24) {
                expect(player.frame!.alt).toEqual(`img/skier_jump_2.png`);
                continue;
            }
            if (jumpFrame <= 36) {
                expect(player.frame!.alt).toEqual(`img/skier_jump_3.png`);
                continue;
            }
            if (jumpFrame <= 48) {
                expect(player.frame!.alt).toEqual(`img/skier_jump_4.png`);
                continue;
            }
            if (jumpFrame <= 60) {
                expect(player.frame!.alt).toEqual(`img/skier_jump_5.png`);
                continue;
            }
        }

        // AND the skier goes back downhill
        gameTime.gameFrame++;
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_down.png");
    });

    test("turning", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        expect(player.position.y).toEqual(0);

        let y1 = player.position.y;
        gameTime.gameFrame++;
        player.next();
        let y2 = player.position.y;
        let downhillSpeed = y2 - y1;

        let lastPosition = player.position;
        // GIVEN the skier receives a turn right command
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();

        // THEN the skier goes right downhill
        expect(player.frame!.alt).toEqual("img/skier_right_down.png");
        // speed is different then downhill speed!
        expect(player.position.y).toBeLessThan(player.position.y + downhillSpeed);
        // and the skier goes right
        expect(player.position.x).toBeGreaterThan(lastPosition.x);

        // GIVEN the skier receives a turn right command
        lastPosition = player.position;
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();

        // THEN the skier goes right on the side
        expect(player.frame!.alt).toEqual("img/skier_right.png");
        expect(player.position.x).toBeGreaterThan(lastPosition.x);
        expect(player.position.y).toBe(lastPosition.y);

        // AND it stops
        lastPosition = player.position;
        gameTime.gameFrame++;
        player.next();
        expect(player.position.x).toBe(lastPosition.x);
        expect(player.position.y).toBe(lastPosition.y);

        // AND pressing right again will make the skier go right again
        lastPosition = player.position;
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();
        expect(player.position.x).toBeGreaterThan(lastPosition.x);
        expect(player.position.y).toBe(lastPosition.y);

        // AND pressing left will make the skier go downhill right
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_right_down.png");

        // AND pressing left will make the skier go downhill
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_down.png");

        // AND pressing left will make the skier go downhill left
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_left_down.png");

        // AND pressing left will make the skier go left
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_left.png");

        // AND pressing down will make the skier go downhill
        gameTime.gameFrame++;
        player.handleInput("ArrowDown");
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_down.png");

        // AND pressing right will make the skier go downhill right
        gameTime.gameFrame++;
        player.handleInput("ArrowRight");
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_right_down.png");

        // WHEN pressing jump
        gameTime.gameFrame++;
        player.handleInput("Space");
        player.next();

        // THEN the skier will jump
        expect(player.frame!.alt).toEqual("img/skier_jump_1.png");

        // UNTIL finally going downhill again
        for (let i = 0; i <= 60; i++) {
            gameTime.gameFrame++;
            player.next();
        }
        expect(player.frame!.alt).toEqual("img/skier_down.png");
    });

    test("hitting a tree", () => {
        const gameTime = new GameTime();

        const player = new Player(assetManager, gameTime);

        // GIVEN a tree in front of the skier
        const tree = new Tree(assetManager);
        tree.position.y = 7;

        const entityManager = new EntityManager([player, tree]);
        // WHEN the skier goes downhill
        gameTime.gameFrame++;
        entityManager.next();
        const y = player.position.y;

        // THEN the skier will hit the tree
        expect(player.frame!.alt).toEqual("img/skier_crash.png");

        // AND the skier will not move anymore
        gameTime.gameFrame++;
        entityManager.next();
        expect(player.position.y).toBe(y);

        // AND the skier cannot go downhill anymore
        gameTime.gameFrame++;
        player.handleInput("ArrowDown");
        entityManager.next();
        expect(player.frame!.alt).toEqual("img/skier_crash.png");

        // AND the skier cannot jump anymore
        gameTime.gameFrame++;
        player.handleInput("Space");
        entityManager.next();
        expect(player.frame!.alt).toEqual("img/skier_crash.png");

        // AND the skier needs to go left until exiting the obstacle
        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        entityManager.next();
        expect(player.frame!.alt).toEqual("img/skier_crash.png");

        gameTime.gameFrame++;
        player.handleInput("ArrowDown");
        entityManager.next();
        expect(player.frame!.alt).toEqual("img/skier_crash.png");

        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        entityManager.next();

        gameTime.gameFrame++;
        player.handleInput("ArrowLeft");
        entityManager.next();

        expect(player.frame!.alt).toEqual("img/skier_left.png");

        // AND can finally go downhill again
        gameTime.gameFrame++;
        player.handleInput("ArrowDown");
        entityManager.next();
        expect(player.frame!.alt).toEqual("img/skier_down.png");
    });

    test("player can jump over a rock", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        // GIVEN a rock is in front of the skier
        const rock = new Rock(assetManager);
        rock.position.y = 100;

        const entityManager = new EntityManager([player, rock]);

        // WHEN the skier jumps
        gameTime.gameFrame++;
        entityManager.next();
        player.handleInput("Space");

        for (let i = 0; i <= 60; i++) {
            gameTime.gameFrame++;
            player.next();
            expect(player.frame!.alt).not.toEqual("img/skier_crash.png");
        }

        // THEN the skier will land safely
        gameTime.gameFrame++;
        player.next();
        expect(player.frame!.alt).toEqual("img/skier_down.png");

        // GIVEN another rock is in front
        const rock2 = new Rock(assetManager);
        rock2.position.y = 500;
        entityManager.entities.push(rock2);

        // WHEN the skier goes downhill
        for (let i = 0; i <= 200; i++) {
            gameTime.gameFrame++;
            entityManager.next();
        }

        // THEN the skier will eventually crash on the rock
        expect(player.frame!.alt).toEqual("img/skier_crash.png");
    });

    test("player go faster over time", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        const frameRate = 1000 / GameTime.FRAME_PER_SECOND;

        // GIVEN the skier goes downhill
        gameTime.gameFrame++;
        player.next();
        const y1 = player.position.y;

        gameTime.gameFrame++;
        player.next();
        const y2 = player.position.y;

        // THEN the speed is not linear
        expect(y2 - y1).toBeGreaterThan(y2 / 2);

        gameTime.gameFrame++;
        player.next();
        const y3 = player.position.y;
        expect(y3 - y2).toBeGreaterThan(y3 / 3);
    });

    test("player dies when caught by rhino", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);

        // GIVEN the rhino is behind the player
        const rhino = new Rhino(assetManager, gameTime);
        rhino.chase(player);
        rhino.position.y = -50;

        const entityManager = new EntityManager([player, rhino]);

        // WHEN rhino catches the player
        for (let i = 0; i < 999; i++) {
            gameTime.gameFrame++;
            entityManager.next();
        }

        // THEN the player dies
        expect(player.frame).toBeUndefined();

        // AND the player stay still
        const lastPosition = player.position;
        gameTime.gameFrame++;
        entityManager.next();
        expect(player.position.x).toBe(lastPosition.x);
        expect(player.position.y).toBe(lastPosition.y);
    });
});
