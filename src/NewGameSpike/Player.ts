import { IEntity } from ".";
import { AssetManager } from "./AssetManager";
import { Position } from "./Position";
import { Animation } from "./Animation";
import { GameTime } from "./GameTime";

export type PlayerCommand = "jump" | "turnRight" | "turnLeft" | "goDown";

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
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return this; // TODO
            case "turnLeft":
                return this; // TODO
            case "goDown":
                return new DownhillState(this.assetManager, this.time);
        }
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
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return new DownRightState(this.assetManager, this.time);
            case "turnLeft":
                return this; // TODO
            case "goDown":
                return this;
        }
    }
}

export class Player implements IEntity {
    lastTime = 0;
    position = new Position(0, 0);
    assetManager: AssetManager;
    state: IEntityState;
    keybindings: Record<string, PlayerCommand>;

    constructor(assetManager: AssetManager, private time: GameTime) {
        this.assetManager = assetManager;
        this.state = new DownhillState(assetManager, time);
        this.keybindings = {
            Space: "jump",
            ArrowRight: "turnRight",
            ArrowLeft: "turnLeft",
            ArrowDown: "goDown",
        };
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

    handleInput(code: string) {
        const playerAction = this.keybindings[code];
        if (playerAction) {
            this.do(playerAction);
            return true;
        }
        return false;
    }
}
