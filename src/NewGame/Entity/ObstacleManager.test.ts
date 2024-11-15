import { Camera } from "../Engine/Camera";
import { GameTime } from "../Engine/GameTime";
import { IMAGES } from "../Utils/AssetManager";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { ObstacleManager } from "./ObstacleManager";
import { Player } from "./Player";

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
const repeatToDealWithRandomness = Array(50).fill(null);

describe("ObstacleManager", () => {
    describe("initially", () => {
        test("when generating obstacles, we randomly place rocks and trees", () => {
            let obstacleImages = new Set();

            for (const _ of repeatToDealWithRandomness) {
                const gameTime = new GameTime();
                const player = new Player(assetManager, gameTime);
                const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));
                const obstacleManager = new ObstacleManager(assetManager, player, camera);

                obstacleManager.obstacles.map((o) => o.frame.alt).forEach((img) => obstacleImages.add(img));
            }
            expect(obstacleImages).toEqual(
                new Set(["img/rock_1.png", "img/rock_2.png", "img/tree_1.png", "img/tree_cluster.png"])
            );
        });

        test("we fill with new obstacles placed not so close from each other", () => {
            for (const _ of repeatToDealWithRandomness) {
                const gameTime = new GameTime();
                const player = new Player(assetManager, gameTime);
                const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));
                const obstacleManager = new ObstacleManager(assetManager, player, camera);

                for (let i = 0; i < obstacleManager.obstacles.length; i++) {
                    const obstacle = obstacleManager.obstacles[i];
                    for (let j = i + 1; j < obstacleManager.obstacles.length; j++) {
                        const otherObstacle = obstacleManager.obstacles[j];
                        const distance = obstacle.position.distanceTo(otherObstacle.position);
                        expect(distance).toBeGreaterThan(50);
                    }
                }
            }
        });

        test("we fill obstacles only inside the camera viewport, south of player", () => {
            for (const _ of repeatToDealWithRandomness) {
                const gameTime = new GameTime();
                const player = new Player(assetManager, gameTime);
                const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));

                const obstacleManager = new ObstacleManager(assetManager, player, camera);

                expect(obstacleManager.obstacles.length).toBeGreaterThan(0);
                expect(obstacleManager.obstacles.length).toBeLessThanOrEqual(20);
                for (const obstacle of obstacleManager.obstacles) {
                    expect(obstacle.position.y).toBeGreaterThanOrEqual(player.position.y);
                    expect(obstacle.position.y).toBeLessThanOrEqual(camera.area.coordinates.bottom);
                    expect(obstacle.position.x).toBeGreaterThan(camera.area.coordinates.left);
                    expect(obstacle.position.x).toBeLessThan(camera.area.coordinates.right);
                }
            }
        });
    });

    test("while playing, new obstacles are placed just outside the camera viewport, south of the centre", () => {
        /**
         * C = camera viewport
         * O = obstacle placement area
         * X = centre of the camera
         *
         *   C C C C C
         * O C C X C C O
         * O C C C C C O
         * O O O O O O O
         */
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);
        const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));
        const obstacleManager = new ObstacleManager(assetManager, player, camera);
        obstacleManager.obstacles = [];

        for (let i = 0; i < 999; i++) {
            obstacleManager.fillOutsideViewport();
        }

        expect(obstacleManager.obstacles.length).toBeGreaterThan(0);

        for (const obstacle of obstacleManager.obstacles) {
            // obstacle is not inside the viewport
            expect(obstacle.areaCovered.overlaps(camera.area)).toBeFalsy();

            // obstacle is in an area that extends around the bottom half of the viewport
            const extendedArea = new Rect(new Position(0, 50), { width: 150, height: 100 });
            expect(obstacle.areaCovered.overlaps(extendedArea)).toBeTruthy();
        }
    });

    test("more obstacles are placed as the camera moves", () => {
        const gameTime = new GameTime();
        const player = new Player(assetManager, gameTime);
        const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));
        const obstacleManager = new ObstacleManager(assetManager, player, camera);
        obstacleManager.obstacles = [];
        obstacleManager.update();

        // WHEN the camera initially moves
        for (let i = 0; i < 1000; i++) {
            const diff = Math.floor(i / 3);
            camera.update(new Position(diff, diff));
            obstacleManager.update();
        }

        // THEN we should see a limited number of obstacles
        expect(obstacleManager.obstacles.length).toBeLessThan(3);

        // GIVEN the camera moves more
        for (let i = 0; i < 99999; i++) {
            const diff = Math.floor(i / 3);
            camera.update(new Position(diff, diff));
            obstacleManager.update();
        }

        // THEN we should see much more obstacles being placed
        obstacleManager.obstacles = [];
        for (let i = 0; i < 1000; i++) {
            const diff = Math.floor(i / 3);
            camera.update(new Position(diff, diff));
            obstacleManager.update();
        }
        expect(obstacleManager.obstacles.length).toBeGreaterThanOrEqual(3);
    });
});
