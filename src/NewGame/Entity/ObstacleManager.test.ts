import { Camera } from "../Engine/Camera";
import { GameTime } from "../Engine/GameTime";
import { IAssetManager, IMAGES } from "../Utils/AssetManager";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { IEntity } from "./IEntity";
import { Obstacle, Rock } from "./Obstacle";
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
class ObstacleManager {
    obstacles: Obstacle[] = [];
    constructor(private assetManager: IAssetManager, private player: IEntity, private camera: Camera) {}

    fillOutsideViewport(): Obstacle {
        const { height, width } = this.camera.area.size;
        const delta = height / 2;
        const center = this.camera.position.add(new Position(0, delta));

        const placementArea = new Rect(center, { height, width: width + delta });

        let obstacle: Obstacle | undefined;
        while (!obstacle) {
            const newObstacle = this.createRandomObstacle(placementArea);

            if (!newObstacle || newObstacle.areaCovered.overlaps(this.camera.area)) {
                continue;
            }
            obstacle = newObstacle;
        }
        return obstacle;
    }

    fillInitial() {
        const { height: oldHeight, width } = this.camera.area.size;
        const newHeight = oldHeight / 2;
        const newCentre = this.player.position.add(new Position(0, newHeight / 2));
        const placementArea = new Rect(newCentre, {
            width,
            height: newHeight,
        });
        for (let i = 0; i < 20; i++) {
            const newObstacle = this.createRandomObstacle(placementArea);
            if (newObstacle) {
                this.obstacles.push(newObstacle);
            }
        }
    }

    private createRandomObstacle(placementArea: Rect): Obstacle | void {
        const attempts = 999;
        for (let i = 0; i < attempts; i++) {
            const newObstacle = Rock.random(this.assetManager);
            newObstacle.position = new Position(
                Math.random() * placementArea.size.width,
                Math.random() * placementArea.size.height
            ).add(new Position(placementArea.coordinates.left, placementArea.coordinates.top));
            if (this.obstacles.some((obstacle) => obstacle.position.distanceTo(newObstacle.position) < 50)) {
                continue;
            }
            return newObstacle;
        }
    }
}

const repeatToDealWithRandomness = Array(50).fill(null);

describe("ObstacleManager", () => {
    describe("initially", () => {
        test.each(repeatToDealWithRandomness)("we fill with new obstacles placed not so close from each other", () => {
            const gameTime = new GameTime();
            const player = new Player(assetManager, gameTime);
            const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));
            const obstacleManager = new ObstacleManager(assetManager, player, camera);
            obstacleManager.fillInitial();

            for (let i = 0; i < obstacleManager.obstacles.length; i++) {
                const obstacle = obstacleManager.obstacles[i];
                for (let j = i + 1; j < obstacleManager.obstacles.length; j++) {
                    const otherObstacle = obstacleManager.obstacles[j];
                    const distance = obstacle.position.distanceTo(otherObstacle.position);
                    expect(distance).toBeGreaterThan(50);
                }
            }
        });

        test.each(repeatToDealWithRandomness)("we fill obstacles only inside the camera viewport, south of player", () => {
            const gameTime = new GameTime();
            const player = new Player(assetManager, gameTime);
            const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));

            const obstacleManager = new ObstacleManager(assetManager, player, camera);
            obstacleManager.fillInitial();

            expect(obstacleManager.obstacles.length).toBeGreaterThan(0);
            expect(obstacleManager.obstacles.length).toBeLessThanOrEqual(20);
            for (const obstacle of obstacleManager.obstacles) {
                expect(obstacle.position.y).toBeGreaterThanOrEqual(player.position.y);
                expect(obstacle.position.y).toBeLessThanOrEqual(camera.area.coordinates.bottom);
                expect(obstacle.position.x).toBeGreaterThan(camera.area.coordinates.left);
                expect(obstacle.position.x).toBeLessThan(camera.area.coordinates.right);
            }
        });
    });

    test.each(repeatToDealWithRandomness)("while playing, new obstacles are placed just outside the camera viewport, south of the centre", () => {
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
        obstacleManager.fillOutsideViewport();

        for (const obstacle of obstacleManager.obstacles) {
            // below the camera centre
            expect(obstacle.position.y).toBeGreaterThanOrEqual(camera.position.y);
            // just south the camera viewport
            expect(obstacle.position.y).toBeLessThanOrEqual(camera.area.coordinates.bottom + 50);

            // just west or east the camera viewport
            expect(obstacle.position.x).toBeGreaterThan(camera.area.coordinates.left - 50);
            expect(obstacle.position.x).toBeLessThan(camera.area.coordinates.right + 50);

            // either left
            if (obstacle.position.x < camera.area.coordinates.left) {
                expect(obstacle.position.x).toBeGreaterThan(camera.area.coordinates.left - 50);
                return;
            }

            // or right
            if (obstacle.position.x > camera.area.coordinates.right) {
                expect(obstacle.position.x).toBeLessThan(camera.area.coordinates.right + 50);
                return;
            }
        }
    });
});
