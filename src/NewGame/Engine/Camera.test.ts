import { IEntity } from "../Entity/IEntity";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { Camera } from "./Camera";

describe("Camera", () => {
    test("when target moves then camera follows", () => {
        // GIVEN a camera and an entity
        const entity = { position: new Position(0, 0) };
        const camera = new Camera(new Rect(new Position(0, 0), { width: 100, height: 100 }));
        camera.follow(entity as IEntity);

        // WHEN the entity moves
        entity.position = new Position(50, 50);

        // THEN the camera follows the entity
        camera.update();
        expect(camera.position).toEqual(entity.position);

        // AND the camera area is updated
        expect(camera.area.coordinates).toEqual({ top: 0, left: 0, right: 100, bottom: 100 });
    });
});
