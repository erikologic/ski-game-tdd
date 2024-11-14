import { IEntity } from "./IEntity";
import { IAssetManager } from "./AssetManager";
import { Position } from "./Position";
import { Animation } from "./Animation";
import { GameTime } from "./GameTime";
import { Rect } from "./Rect";

export type PlayerCommand = "jump" | "turnRight" | "turnLeft" | "goDown";

const DOWNHILL_SPEED = 4;
const DIAGONAL_SPEED = DOWNHILL_SPEED * 0.7071;
const JUMP_SPEED = DOWNHILL_SPEED * 0.7;
const SIDE_SPEED = DOWNHILL_SPEED * 0.5;

interface IEntityState {
    nextState(): IEntityState;
    frame: HTMLImageElement;
    do(command: PlayerCommand): IEntityState;
    updatePosition(position: Position): Position;
    collidedWith(otherEntity: IEntity): IEntityState;
}

interface IFrameManager {
    get frame(): HTMLImageElement;
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
        private frameManager: IFrameManager,
        private commandManager: ICommandManager,
        private positionManager: IPositionManager,
        private collisionManager: ICollisionManager,
        private nextStateManager: INextStateManager
    ) {}

    get frame(): HTMLImageElement {
        return this.frameManager.frame;
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

class StillFrameManager implements IFrameManager {
    constructor(public frame: HTMLImageElement) {}
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
        const frameManager = new StillFrameManager(assetManager.images["img/skier_crash.png"]);
        const commandManager = new SimpleCommandManager({
            jump: () => undefined,
            goDown: () => undefined,
            turnRight: () => new SideRightState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        });
        const positionManager = new StoppedPositionManager();
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(frameManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class DownhillState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const frameManager = new StillFrameManager(assetManager.images["img/skier_down.png"]);
        const commandManager = new SimpleCommandManager({
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => undefined,
            turnRight: () => new DownRightState(this.assetManager, this.time),
            turnLeft: () => new DownLeftState(this.assetManager, this.time),
        });
        const positionManager = new ContinuosMovementPositionManager(time, new Position(0, DOWNHILL_SPEED));
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(frameManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class DownLeftState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const frameManager = new StillFrameManager(assetManager.images["img/skier_left_down.png"]);
        const commandManager = new SimpleCommandManager({
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => new DownhillState(this.assetManager, this.time),
            turnRight: () => new DownhillState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        });
        const positionManager = new ContinuosMovementPositionManager(
            time,
            new Position(-DIAGONAL_SPEED, DIAGONAL_SPEED)
        );
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(frameManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class SideLeftState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const frameManager = new StillFrameManager(assetManager.images["img/skier_left.png"]);
        const commandManager = new SimpleCommandManager({
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => new DownhillState(this.assetManager, this.time),
            turnRight: () => new DownLeftState(this.assetManager, this.time),
            turnLeft: () => new SideLeftState(this.assetManager, this.time),
        });
        const positionManager = new MoveOncePositionManager(new Position(-SIDE_SPEED, 0));
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(frameManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class DownRightState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const frameManager = new StillFrameManager(assetManager.images["img/skier_right_down.png"]);
        const commandManager = new SimpleCommandManager({
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => new DownhillState(this.assetManager, this.time),
            turnRight: () => new SideRightState(this.assetManager, this.time),
            turnLeft: () => new DownhillState(this.assetManager, this.time),
        });
        const positionManager = new ContinuosMovementPositionManager(
            time,
            new Position(DIAGONAL_SPEED, DIAGONAL_SPEED)
        );
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(frameManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class SimpleCommandManager implements ICommandManager {
    constructor(private actions: Record<PlayerCommand, () => IEntityState | undefined>) {}

    do(currentState: IEntityState, command: PlayerCommand): IEntityState {
        return this.actions[command]() || currentState;
    }
}

class MoveOncePositionManager implements IPositionManager {
    hasMovedOnce = false;

    constructor(private movement: Position) {}

    updatePosition(state: IEntityState, position: Position): Position {
        if (!this.hasMovedOnce) {
            this.hasMovedOnce = true;
            return position.add(this.movement);
        }
        return position;
    }
}
class SideRightState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const frameManager = new StillFrameManager(assetManager.images["img/skier_right.png"]);
        const commandManager = new SimpleCommandManager({
            jump: () => new JumpingState(this.assetManager, this.time),
            goDown: () => new DownhillState(this.assetManager, this.time),
            turnRight: () => new SideRightState(this.assetManager, this.time),
            turnLeft: () => new DownRightState(this.assetManager, this.time),
        });
        const positionManager = new MoveOncePositionManager(new Position(SIDE_SPEED, 0));
        const collisionManager = new CollisionManager(assetManager, time);
        const nextStateManager = new SameNextStateManager();
        super(frameManager, commandManager, positionManager, collisionManager, nextStateManager);
    }
}

class JumpingStateAnimationManager implements IFrameManager, INextStateManager {
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

    get frame(): HTMLImageElement {
        return this.animation.frame;
    }

    next(currentState: IEntityState): IEntityState {
        if (this.animation.complete) {
            return new DownhillState(this.assetManager, this.time);
        }
        this.animation.update(this.time);
        return currentState;
    }
}

class DoNothingCommandManager implements ICommandManager {
    do(currentState: IEntityState, command: PlayerCommand): IEntityState {
        return currentState;
    }
}

class ContinuosMovementPositionManager implements IPositionManager {
    constructor(private time: GameTime, private movement: Position) {}

    updatePosition(state: IEntityState, position: Position): Position {
        // speed should double every 60 seconds
        const gameSeconds = this.time.gameFrame / GameTime.FRAME_PER_SECOND;
        const speed = Math.pow(2, gameSeconds / 60);
        return position.add(this.movement.multiply(speed, speed));
    }
}

class JumpingCollisionManager implements ICollisionManager {
    constructor(private assetManager: IAssetManager, private time: GameTime) {}

    collidedWith(state: IEntityState, otherEntity: IEntity): IEntityState {
        if (otherEntity.height > 100) {
            return new CrashState(this.assetManager, this.time);
        }
        return state;
    }
}

class JumpingState extends BaseState {
    constructor(private assetManager: IAssetManager, private time: GameTime) {
        const stateAnimationManager = new JumpingStateAnimationManager(assetManager, time);
        const commandManager = new DoNothingCommandManager();
        const positionManager = new ContinuosMovementPositionManager(time, new Position(0, JUMP_SPEED));
        const collisionManager = new JumpingCollisionManager(assetManager, time);
        super(stateAnimationManager, commandManager, positionManager, collisionManager, stateAnimationManager);
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
        return this.state.frame; // TODO: this is a bit of a leaky abstraction
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
