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



interface IAnimationManager {
    animation: Animation;
}

interface ICommandManager {
    do(state: IEntityState, command: PlayerCommand): IEntityState;
}

interface IPositionManager {
    updatePosition(state: IEntityState, position: Position): Position;
}

interface ICollisionManager {
    collidedWith(state: IEntityState, otherEntity: IEntity): IEntityState;
}

interface INextStateManager {
    next(state: IEntityState): IEntityState;
}

class BaseState implements IEntityState {
    constructor(
        private animationManager: IAnimationManager,
        private commandManager: ICommandManager,
        private positionManager: IPositionManager,
        private collisionManager: ICollisionManager,
        private nextStateManager: INextStateManager
    ) {}

    get animation(): Animation {
        return this.animationManager.animation;
    }
    do(command: PlayerCommand): IEntityState {
        return this.commandManager.do(this, command);
    }
    updatePosition(position: Position): Position {
        return this.positionManager.updatePosition(this, position);
    }
    collidedWith(otherEntity: IEntity): IEntityState {
        return this.collisionManager.collidedWith(this, otherEntity);
    }
    nextState(): IEntityState {
        return this.nextStateManager.next(this);
    }
}

class CrashAnimationManager implements IAnimationManager {
    animation: Animation;

    constructor(private assetManager: IAssetManager) {
        this.animation = new Animation([assetManager.images["img/skier_crash.png"]]);
    }
}

class CrashCommandManager implements ICommandManager {
    actions: Record<PlayerCommand, () => IEntityState | undefined>;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.actions = {
            jump: () => undefined,
            goDown: () => undefined,
            turnRight: () => new SideRightState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        };
    }
    do(currentState: IEntityState, command: PlayerCommand): IEntityState {
        return this.actions[command]() || currentState;
    }
}

class StoppedPositionManager implements IPositionManager {
    updatePosition(state: IEntityState, position: Position): Position {
        return position;
    }
}

class CollisionManager implements ICollisionManager {
    constructor(private assetManager: IAssetManager, private time: GameTime) {}

    collidedWith(state: IEntityState, otherEntity: IEntity): IEntityState {
        return new CrashState(this.assetManager, this.time);
    }
}

class SameNextStateManager implements INextStateManager {
    next(state: IEntityState): IEntityState {
        return state;
    }
}

class CrashState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const animationManager = new CrashAnimationManager(assetManager);
        const commandManager = new CrashCommandManager(assetManager, time);
        const positionManager = new StoppedPositionManager();
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(animationManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class DownhillAnimationManager implements IAnimationManager {
    animation: Animation;

    constructor(private assetManager: IAssetManager) {
        this.animation = new Animation([assetManager.images["img/skier_down.png"]]);
    }
}

class DownhillCommandManager implements ICommandManager {
    actions: Record<PlayerCommand, () => IEntityState | undefined>;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.actions = {
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => undefined,
            turnRight: () => new DownRightState(this.assetManager, this.time),
            turnLeft: () => new DownLeftState(this.assetManager, this.time),
        };
    }
    do(currentState: IEntityState, command: PlayerCommand): IEntityState {
        return this.actions[command]() || currentState;
    }
}

class ContinuosMovementPositionManager implements IPositionManager {
    updatePosition(state: IEntityState, position: Position): Position {
        return position.add(new Position(0, DOWNHILL_SPEED));
    }
}

class DownhillState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const animationManager = new DownhillAnimationManager(assetManager);
        const commandManager = new DownhillCommandManager(assetManager, time);
        const positionManager = new ContinuosMovementPositionManager();
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(animationManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class DownLeftAnimationManager implements IAnimationManager {
    animation: Animation;

    constructor(private assetManager: IAssetManager) {
        this.animation = new Animation([assetManager.images["img/skier_left_down.png"]]);
    }
}

class DownLeftCommandManager implements ICommandManager {
    actions: Record<PlayerCommand, () => IEntityState | undefined>;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.actions = {
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => undefined,
            turnRight: () => new DownhillState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        };
    }
    do(currentState: IEntityState, command: PlayerCommand): IEntityState {
        return this.actions[command]() || currentState;
    }
}

class DownLeftContinuosMovementPositionManager implements IPositionManager {
    updatePosition(state: IEntityState, position: Position): Position {
        return position.add(new Position(-DIAGONAL_SPEED, DIAGONAL_SPEED));
    }
}
class DownLeftState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const animationManager = new DownLeftAnimationManager(assetManager);
        const commandManager = new DownLeftCommandManager(assetManager, time);
        const positionManager = new DownLeftContinuosMovementPositionManager();
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(animationManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class SideLeftAnimationManager implements IAnimationManager {
    animation: Animation;

    constructor(private assetManager: IAssetManager) {
        this.animation = new Animation([assetManager.images["img/skier_left.png"]]);
    }
}

class SideLeftCommandManager implements ICommandManager {
    actions: Record<PlayerCommand, () => IEntityState | undefined>;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.actions = {
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => undefined,
            turnRight: () => new DownLeftState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        };
    }
    do(currentState: IEntityState, command: PlayerCommand): IEntityState {
        return this.actions[command]() || currentState;
    }
}

class SideLeftPositionManager implements IPositionManager {
    updatePosition(state: IEntityState, position: Position): Position {
        return position.add(new Position(-SIDE_SPEED, 0));
    }
}

class SideLeftState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const animationManager = new SideLeftAnimationManager(assetManager);
        const commandManager = new SideLeftCommandManager(assetManager, time);
        const positionManager = new SideLeftPositionManager();
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(animationManager, commandManager, positionManager, collisionManager, nextStateManager);
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
        return this.state.animation.frame; // TODO: this is a bit of a leaky abstraction
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
