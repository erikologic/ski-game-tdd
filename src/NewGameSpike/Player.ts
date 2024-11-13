import { IEntityState, IEntity } from ".";
import { AssetManager } from "./AssetManager";
import { Position } from "./Position";
import { Animation } from "./Animation";

class JumpingState implements IEntityState {
    speed = 0.015;
    animation: Animation;

    constructor(private assetManager: AssetManager) {
        this.animation = new Animation(
            [
                assetManager.images["img/skier_jump_1.png"],
                assetManager.images["img/skier_jump_2.png"],
                assetManager.images["img/skier_jump_3.png"],
                assetManager.images["img/skier_jump_4.png"],
                assetManager.images["img/skier_jump_5.png"],
            ],
            false
        );
    }

    nextState(time: number) {
        if (this.animation.complete) {
            return new DownhillState(this.assetManager);
        }
        this.animation.update(time);
        return this;
    }

    do(action: "jump"): IEntityState {
        return this;
    }
}
class DownhillState implements IEntityState {
    speed = 0.03;
    animation: Animation;

    constructor(private assetManager: AssetManager) {
        this.animation = new Animation([assetManager.images["img/skier_down.png"]]);
    }

    nextState(time: number) {
        return this;
    }

    do(command: "jump"): IEntityState {
        return new JumpingState(this.assetManager);
    }
}

export class Player implements IEntity {
    lastTime = 0;
    position = new Position(0, 0);
    assetManager: AssetManager;
    state: IEntityState;

    constructor(assetManager: AssetManager) {
        this.assetManager = assetManager;
        this.state = new DownhillState(assetManager);
    }

    do(action: "jump") {
        this.state = this.state.do(action);
    }

    next(time: number) {
        const timeDiff = time - this.lastTime;
        this.lastTime = time;

        this.state = this.state.nextState(time);
        this.position.y += this.state.speed * timeDiff;
    }

    get frame() {
        return this.state.animation.frame;
    }
}
