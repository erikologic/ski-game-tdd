import { IMAGES } from "./AssetManager";
import { GameTime } from "./GameTime";
import { Player } from "./Player";
import { EntityManager } from "./EntityManager";
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

describe("Rhino", () => {
    test("can chase player", () => {
        const gameTime = new GameTime();

        // GIVEN a player and a rhino
        const player = new Player(assetManager, gameTime);
        const rhino = new Rhino(assetManager, gameTime);
        rhino.position.y = -100;

        const entityManager = new EntityManager([player, rhino]);

        // THEN the rhino is idle
        gameTime.gameFrame++;
        entityManager.next();
        expect(rhino.frame.alt).toEqual("img/rhino_default.png");
        expect(rhino.position.y).toEqual(-100);

        // WHEN the rhino is instructed to chase the player
        rhino.chase(player);
        for (let i = 0; i < 50; i++) {
            gameTime.gameFrame++;
            entityManager.next();
        }
        gameTime.gameFrame++;
        entityManager.next();

        // THEN it moves towards the player
        expect(rhino.position.y).toBeGreaterThan(-100);

        // AND is faster then player
        let playerY1 = player.position.y;
        let rhinoY1 = rhino.position.y;
        gameTime.gameFrame++;
        entityManager.next();
        let playerY2 = player.position.y;
        let rhinoY2 = rhino.position.y;
        let playerSpeed = playerY2 - playerY1;
        let rhinoSpeed = rhinoY2 - rhinoY1;
        expect(rhinoSpeed).toBeGreaterThan(playerSpeed);

        // GIVEN the rhino is close to the player
        while (rhino.frame.alt === "img/rhino_default.png") {
            gameTime.gameFrame++;
            entityManager.next();
        }

        // THEN the rhino eats the player
        expect(rhino.frame.alt).toEqual("img/rhino_eat_1.png");
        const rhinoEatPosition = rhino.position;

        let eatFrame = 0;
        while (eatFrame < 48) {
            eatFrame++;
            gameTime.gameFrame++;
            entityManager.next();

            if (eatFrame <= 12) {
                expect(rhino.frame.alt).toEqual("img/rhino_eat_1.png");
                continue;
            }

            if (eatFrame <= 24) {
                expect(rhino.frame.alt).toEqual("img/rhino_eat_2.png");
                continue;
            }

            if (eatFrame <= 36) {
                expect(rhino.frame.alt).toEqual("img/rhino_eat_3.png");
                continue;
            }

            expect(rhino.frame.alt).toEqual("img/rhino_eat_4.png");
        }

        // THEN the rhino celebrates
        let celebrateFrame = -1;
        while (celebrateFrame < 48) {
            celebrateFrame++;
            gameTime.gameFrame++;
            entityManager.next();

            if (celebrateFrame <= 12) {
                expect(rhino.frame.alt).toEqual("img/rhino_celebrate_1.png");
                continue;
            }
            if (celebrateFrame <= 24) {
                expect(rhino.frame.alt).toEqual("img/rhino_celebrate_2.png");
                continue;
            }
            if (celebrateFrame <= 36) {
                expect(rhino.frame.alt).toEqual("img/rhino_celebrate_1.png");
                continue;
            }
            expect(rhino.frame.alt).toEqual("img/rhino_celebrate_2.png");
        }

        gameTime.gameFrame++;
        entityManager.next();
        expect(rhino.frame.alt).toEqual("img/rhino_celebrate_1.png");

        // AND rhino hasn't moved since eating
        expect(rhino.position.y).toEqual(rhinoEatPosition.y);
    });

    test.each(["left", "right"])("chase player %s", (chaseDirection) => {
        // GIVEN a player and a rhino
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);
        const rhino = new Rhino(assetManager, gameTime);
        rhino.chase(player);
        rhino.position.x = chaseDirection === "left" ? 300 : -300;
        rhino.position.y = -1000;
        const entityManager = new EntityManager([player, rhino]);

        // THEN the rhino will chase the player left
        let runLeftFrame = -1;
        gameTime.gameFrame++;
        entityManager.next();
        expect(rhino.position.x).toBeLessThan(300);
        expect(rhino.position.y).toBeGreaterThan(-1000);

        while (runLeftFrame < 47) {
            runLeftFrame++;
            gameTime.gameFrame++;
            entityManager.next();

            if (runLeftFrame <= 12) {
                expect(rhino.frame.alt).toEqual(`img/rhino_run_${chaseDirection}.png`);
                continue;
            }
            if (runLeftFrame <= 24) {
                expect(rhino.frame.alt).toEqual(`img/rhino_run_${chaseDirection}_2.png`);
                continue;
            }
            if (runLeftFrame <= 36) {
                expect(rhino.frame.alt).toEqual(`img/rhino_run_${chaseDirection}.png`);
                continue;
            }
            expect(rhino.frame.alt).toEqual(`img/rhino_run_${chaseDirection}_2.png`);
        }

        // AND will catch the player
        for (let i = 0; i < 999; i++) {
            gameTime.gameFrame++;
            entityManager.next();
        }
        expect(rhino.frame.alt).toMatch("rhino_celebrate");
    });
});
