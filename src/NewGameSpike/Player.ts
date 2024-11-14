import { IEntity } from "./IEntity";
import { IAssetManager } from "./AssetManager";
import { Position } from "./Position";
import { Animation } from "./Animation";
import { GameTime } from "./GameTime";
import { Rect } from "./Rect";
import { Rock } from "./Rock";

export type PlayerCommand = "jump" | "turnRight" | "turnLeft" | "goDown";

const DOWNHILL_SPEED = 4;
const DIAGONAL_SPEED = DOWNHILL_SPEED * 0.7071;
const JUMP_SPEED = DOWNHILL_SPEED * 0.7;
const SIDE_SPEED = DOWNHILL_SPEED * 0.5;

interface IEntityState {
    nextState(): IEntityState;
    animation: Animation;
    do(command: PlayerCommand): IEntityState;
    updatePosition(position: Position): Position;
    collidedWith(otherEntity: IEntity): IEntityState;
}

class JumpingState implements IEntityState {
    private movement = new Position(0, JUMP_SPEED);
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

    collidedWith(otherEntity: IEntity): IEntityState {
        if (otherEntity.height > 100) {
            return new CrashState(this.assetManager, this.time);
        }
        return this;
    }
}

class SideRightState implements IEntityState {
    private movement = new Position(SIDE_SPEED, 0);
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

    collidedWith(otherEntity: IEntity): IEntityState {
        return new CrashState(this.assetManager, this.time);
    }
}

class DownRightState implements IEntityState {
    private movement = new Position(DIAGONAL_SPEED, DIAGONAL_SPEED);
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

    collidedWith(otherEntity: IEntity): IEntityState {
        return new CrashState(this.assetManager, this.time);
    }
}

class SideLeftState implements IEntityState {
    private movement = new Position(-SIDE_SPEED, 0);
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

    collidedWith(otherEntity: IEntity): IEntityState {
        return new CrashState(this.assetManager, this.time);
    }
}

class DownLeftState implements IEntityState {
    private movement = new Position(-DIAGONAL_SPEED, DIAGONAL_SPEED);
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

    collidedWith(otherEntity: IEntity): IEntityState {
        return new CrashState(this.assetManager, this.time);
    }
}

class DownhillState implements IEntityState {
    private movement = new Position(0, DOWNHILL_SPEED);
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

    collidedWith(otherEntity: IEntity): IEntityState {
        return new CrashState(this.assetManager, this.time);
    }
}

function noOp(this: IEntityState, ...any: any): IEntityState {
    return this;
}

function dontMove(this: IEntityState, position: Position): Position {
    return position;
}

class CrashState implements IEntityState {
    nextState: () => IEntityState;
    animation: Animation;
    updatePosition: (position: Position) => Position;
    collidedWith: (otherEntity: IEntity) => IEntityState;
    actions: Record<PlayerCommand, () => IEntityState>;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.collidedWith = noOp.bind(this);
        this.nextState = noOp.bind(this);
        this.updatePosition = dontMove.bind(this);
        this.animation = new Animation([assetManager.images["img/skier_crash.png"]]);
        this.actions = {
            jump: () => this,
            goDown: () => this,
            turnRight: () => new SideRightState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        };
    }

    do(command: PlayerCommand): IEntityState {
        return this.actions[command]();
    }
}

export class Player implements IEntity {
    lastTime = 0;
    position = new Position(0, 0);
    assetManager: IAssetManager;
    state: IEntityState;
    keybindings: Record<string, PlayerCommand>;
    height = 0;

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

    collidedWith(otherEntity: IEntity): void {
        this.state = this.state.collidedWith(otherEntity);
    }

    do(action: PlayerCommand) {
        this.state = this.state.do(action);
    }

    next() {
        this.state = this.state.nextState();
        this.position = this.state.updatePosition(this.position);
    }

    get areaCovered(): Rect {
        return new Rect(this.position, this.frame);
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
