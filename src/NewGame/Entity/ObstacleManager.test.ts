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
    constructor(private camera: Camera, private assetManager: IAssetManager) {}

    placeRandomObstacle(): Obstacle {
        const { height, width } = this.camera.area.size;
        const delta = height / 2;
        const center = this.camera.position.add(new Position(0, delta));

        const placementArea = new Rect(center, { height, width: width + delta });

        let obstacle: Obstacle | undefined;
        while (!obstacle) {
            const newObstacle = Rock.random(this.assetManager);
            newObstacle.position = new Position(
                Math.random() * placementArea.size.width,
                Math.random() * placementArea.size.height
            ).add(new Position(placementArea.coordinates.left, placementArea.coordinates.top));
            if (newObstacle.areaCovered.overlaps(this.camera.area)) {
                continue;
            }
            obstacle = newObstacle;
        }
        return obstacle;
    }
}

describe("ObstacleManager", () => {
    test("new obstacles are placed just outside the camera viewport, south of the center", () => {
        /**
         *   C C C C C
         * O C C X C C O
         * O C C C C C O
         * O O O O O O O
         */
        const centre = new Position(0, 0);
        const camera = new Camera(new Rect(centre, { width: 100, height: 100 }));
        const obstacleManager = new ObstacleManager(camera, assetManager);
        const obstacle = obstacleManager.placeRandomObstacle();

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
