import { IEntity } from "./IEntity";

export class EntityManager {
    entities: IEntity[] = [];

    constructor(entities: IEntity[]) {
        this.entities = entities;
    }

    next() {
        this.entities.forEach((entity) => entity.next());

        for (let i = 0; i < this.entities.length; i++) {
            const entity = this.entities[i];
            const areaCovered = entity.areaCovered;

            for (let j = i + 1; j < this.entities.length; j++) {
                const otherEntity = this.entities[j];
                if (areaCovered.overlaps(otherEntity.areaCovered)) {
                    entity.collidedWith(otherEntity);
                    otherEntity.collidedWith(entity);
                }
            }
        }
    }
}
