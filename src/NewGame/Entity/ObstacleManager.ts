import { Camera } from "../Engine/Camera";
import { IAssetManager } from "../Utils/AssetManager";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { IEntity } from "./IEntity";
import { Obstacle, Rock } from "./Obstacle";

export class ObstacleManager {
    obstacles: Obstacle[] = [];
    cameraMovedTimes = 0;
    maxCameraMovedTimes = 2;
    difficulty = 0;
    distanceBetweenObstacles = 300;

    constructor(private assetManager: IAssetManager, private player: IEntity, private camera: Camera) {
        this.fillInitial();
    }

    private shouldGenerateNewObstacle() {
        if (this.camera.hasMoved) {
            this.cameraMovedTimes++;
        }
        if (this.cameraMovedTimes > this.maxCameraMovedTimes) {
            this.difficulty = Math.min(1, this.difficulty + 0.0001);
            this.distanceBetweenObstacles = Math.max(10, this.distanceBetweenObstacles * (1 - this.difficulty));
            this.cameraMovedTimes = 0;
            return true;
        }
        return false;
    }

    fillOutsideViewport() {
        const placementArea = this.generateExtendedPlacementArea();

        const newObstacle = this.createRandomObstacle(placementArea, 999, this.camera.area);
        if (newObstacle) {
            this.obstacles.push(newObstacle);
        }
    }

    update() {
        this.cullObstacles();

        if (this.shouldGenerateNewObstacle()) this.fillOutsideViewport();
    }

    private cullObstacles() {
        this.obstacles = this.obstacles.filter((obstacle) => obstacle.position.y > this.camera.area.coordinates.top);
    }

    private generateExtendedPlacementArea() {
        // create a placement area that extends around the bottom half of the viewport
        const { height, width } = this.camera.area.size;
        const verticalExtension = height / 2;
        const center = this.camera.position.add(new Position(0, verticalExtension));
        const extendedPlacementArea = new Rect(center, { height, width: width + verticalExtension });
        return extendedPlacementArea;
    }

    private fillInitial() {
        const { height: oldHeight, width } = this.camera.area.size;
        const newHeight = oldHeight / 2;
        const newCentre = this.player.position.add(new Position(0, newHeight / 2));
        const placementArea = new Rect(newCentre, {
            width,
            height: newHeight,
        });
        for (let i = 0; i < 20; i++) {
            const newObstacle = this.createRandomObstacle(placementArea, 1_000);
            if (newObstacle) {
                this.obstacles.push(newObstacle);
            }
        }
    }

    private createRandomObstacle(placementArea: Rect, attempts: number, exclusionArea?: Rect): Obstacle | void {
        for (let i = 0; i < attempts; i++) {
            const newObstacle = Obstacle.random(this.assetManager);
            newObstacle.position = new Position(
                Math.random() * placementArea.size.width,
                Math.random() * placementArea.size.height
            ).add(new Position(placementArea.coordinates.left, placementArea.coordinates.top));

            if (exclusionArea && newObstacle.areaCovered.overlaps(exclusionArea)) {
                continue;
            }

            if (
                this.obstacles.some(
                    (obstacle) => obstacle.position.distanceTo(newObstacle.position) < this.distanceBetweenObstacles
                )
            ) {
                continue;
            }
            return newObstacle;
        }
    }
}
