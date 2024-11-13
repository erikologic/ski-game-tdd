import { IEntity } from ".";
import { AssetManager } from "./AssetManager";
import { Position } from "./Position";
import { Animation } from "./Animation";
import { GameTime } from "./GameTime";

export type PlayerCommand = "jump" | "turnRight";

interface IEntityState {
    speed: Position;
    nextState(): IEntityState;
    animation: Animation;
    do(command: PlayerCommand): IEntityState;
}

class JumpingState implements IEntityState {
    speed = new Position(0, 1);
    animation: Animation;

    constructor(private assetManager: AssetManager, private time: GameTime) {
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

    nextState() {
        if (this.animation.complete) {
            return new DownhillState(this.assetManager, this.time);
        }
        this.animation.update(this.time);
        return this;
    }

    do(action: PlayerCommand): IEntityState {
        return this;
    }
}

class DownRightState implements IEntityState {
    speed = new Position(1, 1);
    animation: Animation;

    constructor(private assetManager: AssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_right_down.png"]]);
    }

    nextState() {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        if (command === "jump") return new JumpingState(this.assetManager, this.time);
        return this;
    }
}

class DownhillState implements IEntityState {
    speed = new Position(0, 1);
    animation: Animation;

    constructor(private assetManager: AssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_down.png"]]);
    }

    nextState() {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        if (command === "jump") return new JumpingState(this.assetManager, this.time);
        if (command === "turnRight") return new DownRightState(this.assetManager, this.time);
        return this;
    }
}

export class Player implements IEntity {
    lastTime = 0;
    position = new Position(0, 0);
    assetManager: AssetManager;
    state: IEntityState;

    constructor(assetManager: AssetManager, private time: GameTime) {
        this.assetManager = assetManager;
        this.state = new DownhillState(assetManager, time);
    }

    do(action: PlayerCommand) {
        this.state = this.state.do(action);
    }

    next() {
        this.state = this.state.nextState();
        this.position = this.position.add(this.state.speed);
    }

    get frame() {
        return this.state.animation.frame;
    }
}
