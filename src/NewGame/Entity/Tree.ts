import { IAssetManager } from "../Utils/AssetManager";
import { Position } from "../Utils/Position";
import { Rect } from "../Utils/Rect";
import { IEntity } from "./IEntity";

// export class Tree implements IEntity {
//     position: Position;
//     frame: HTMLImageElement;
//     height = 200;

//     constructor(assetManager: IAssetManager) {
//         this.position = new Position(0, 0);
//         this.frame = assetManager.images["img/tree_1.png"];
//     }

//     get areaCovered(): Rect {
//         return new Rect(this.position, this.frame);
//     }

//     collidedWith(_otherEntity: IEntity): void {}

//     next() {}
// }
