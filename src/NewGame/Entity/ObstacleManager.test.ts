import { Camera } from "../Engine/Camera";
import { IAssetManager, IMAGES } from "../Utils/AssetManager";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { Obstacle, Rock } from "./Obstacle";

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
    constructor(private assetManager: IAssetManager) {}

    placeRandomObstacleOutsideViewport(camera: Camera): Obstacle {
        const { height, width } = camera.area.size;
        const delta = height / 2;
        const center = camera.position.add(new Position(0, delta));

        const placementArea = new Rect(center, { height, width: width + delta });

        let obstacle: Obstacle | undefined;
        while (!obstacle) {
            const newObstacle = this.createRandomObstacle(placementArea);

            if (newObstacle.areaCovered.overlaps(camera.area)) {
                continue;
            }
            obstacle = newObstacle;
        }
        return obstacle;
    }

    fill(placementArea: Rect) {
        const attempts = 999;
        for (let i = 0; i < attempts; i++) {
            const newObstacle = this.createRandomObstacle(placementArea);
            if (this.obstacles.some((obstacle) => obstacle.position.distanceTo(newObstacle.position) < 50)) {
                continue;
            }
            this.obstacles.push(newObstacle);
        }
    }

    private createRandomObstacle(placementArea: Rect) {
        const newObstacle = Rock.random(this.assetManager);
        newObstacle.position = new Position(
            Math.random() * placementArea.size.width,
            Math.random() * placementArea.size.height
        ).add(new Position(placementArea.coordinates.left, placementArea.coordinates.top));
        return newObstacle;
    }
}

describe("ObstacleManager", () => {
    test("initially, we fill with new obstacles placed not so close from each other", () => {
        const obstacleManager = new ObstacleManager(assetManager);
        const placementArea = new Rect(new Position(0, 0), { width: 100, height: 100 });

        obstacleManager.fill(placementArea);

        for (let i = 0; i < obstacleManager.obstacles.length; i++) {
            const obstacle = obstacleManager.obstacles[i];
            for (let j = i + 1; j < obstacleManager.obstacles.length; j++) {
                const otherObstacle = obstacleManager.obstacles[j];
                const distance = obstacle.position.distanceTo(otherObstacle.position);
                expect(distance).toBeGreaterThan(50);
            }
        }
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
        const centre = new Position(0, 0);
        const camera = new Camera(new Rect(centre, { width: 100, height: 100 }));
        const obstacleManager = new ObstacleManager(assetManager);
        const obstacle = obstacleManager.placeRandomObstacleOutsideViewport(camera);

        for (let i = 0; i < 999; i++) {
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
