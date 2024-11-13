import { IEntity } from ".";
import { IAssetManager } from "./AssetManager";
import { Position } from "./Position";
import { Animation } from "./Animation";
import { GameTime } from "./GameTime";

export type PlayerCommand = "jump" | "turnRight" | "turnLeft" | "goDown";

interface IEntityState {
    nextState(): IEntityState;
    animation: Animation;
    do(command: PlayerCommand): IEntityState;
    updatePosition(position: Position): Position;
}

class JumpingState implements IEntityState {
    private movement = new Position(0, 0.7);
    animation: Animation;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
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

    nextState(): IEntityState {
        if (this.animation.complete) {
            return new DownhillState(this.assetManager, this.time);
        }
        this.animation.update(this.time);
        return this;
    }

    do(action: PlayerCommand): IEntityState {
        return this;
    }

    updatePosition(position: Position): Position {
        return position.add(this.movement);
    }
}

class SideRightState implements IEntityState {
    private movement = new Position(3, 0);
    animation: Animation;
    hasMovedOnce = false;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_right.png"]]);
    }

    nextState(): IEntityState {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return new SideRightState(this.assetManager, this.time);
            case "turnLeft":
                return new DownRightState(this.assetManager, this.time);
            case "goDown":
                return new DownhillState(this.assetManager, this.time);
        }
    }

    updatePosition(position: Position): Position {
        if (!this.hasMovedOnce) {
            this.hasMovedOnce = true;
            return position.add(this.movement);
        }
        return position;
    }
}

class DownRightState implements IEntityState {
    private movement = new Position(1, 1);
    animation: Animation;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_right_down.png"]]);
    }

    nextState(): IEntityState {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return new SideRightState(this.assetManager, this.time);
            case "turnLeft":
                return new DownhillState(this.assetManager, this.time);
            case "goDown":
                return new DownhillState(this.assetManager, this.time);
        }
    }

    updatePosition(position: Position): Position {
        return position.add(this.movement);
    }
}

class SideLeftState implements IEntityState {
    movement = new Position(-3, 0);
    animation: Animation;
    hasMovedOnce = false;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_left.png"]]);
    }

    nextState(): IEntityState {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return new DownLeftState(this.assetManager, this.time);
            case "turnLeft":
                return new SideLeftState(this.assetManager, this.time);
            case "goDown":
                return new DownhillState(this.assetManager, this.time);
        }
    }

    updatePosition(position: Position): Position {
        if (!this.hasMovedOnce) {
            this.hasMovedOnce = true;
            return position.add(this.movement);
        }
        return position;
    }
}

class DownLeftState implements IEntityState {
    private movement = new Position(-1, 1);
    animation: Animation;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_left_down.png"]]);
    }

    nextState(): IEntityState {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return new DownhillState(this.assetManager, this.time);
            case "turnLeft":
                return new SideLeftState(this.assetManager, this.time);
            case "goDown":
                return new DownhillState(this.assetManager, this.time);
        }
    }

    updatePosition(position: Position): Position {
        return position.add(this.movement);
    }
}

class DownhillState implements IEntityState {
    private movement = new Position(0, 1);
    animation: Animation;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation([assetManager.images["img/skier_down.png"]]);
    }

    nextState(): IEntityState {
        return this;
    }

    do(command: PlayerCommand): IEntityState {
        switch (command) {
            case "jump":
                return new JumpingState(this.assetManager, this.time);
            case "turnRight":
                return new DownRightState(this.assetManager, this.time);
            case "turnLeft":
                return new DownLeftState(this.assetManager, this.time);
            case "goDown":
                return this;
        }
    }

    updatePosition(position: Position): Position {
        return position.add(this.movement);
    }
}

export class Player implements IEntity {
    lastTime = 0;
    position = new Position(0, 0);
    assetManager: IAssetManager;
    state: IEntityState;
    keybindings: Record<string, PlayerCommand>;

    constructor(assetManager: IAssetManager, private time: GameTime) {
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
        this.position = this.state.updatePosition(this.position);
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
