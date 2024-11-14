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

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

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

        while (rhino.frame.alt === "img/rhino_default.png") {
            gameTime.gameFrame++;
            entityManager.next();
        }

        expect(rhino.frame.alt).toEqual("img/rhino_eat_1.png");

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

        // AND rhino so far hasn't moved
        //...
    });
});
