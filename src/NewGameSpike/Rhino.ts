import { IAssetManager } from "./AssetManager";
import { GameTime } from "./GameTime";
import { IEntity } from "./IEntity";
import { Player } from "./Player";
import { Position } from "./Position";
import { Rect } from "./Rect";
import { Animation } from "./Animation";

// TODO - move these to a shared location
const DOWNHILL_SPEED = 4;
const DIAGONAL_SPEED = DOWNHILL_SPEED * 0.7071;
interface IRhinoState {
    nextState(): IRhinoState;
    frame: HTMLImageElement;
    updatePosition(position: Position): Position;
    collidedWith(otherEntity: IEntity): IRhinoState;
}

interface IFrameManager {
    get frame(): HTMLImageElement;
}

class StillFrameManager implements IFrameManager {
    constructor(public frame: HTMLImageElement) {}
}

interface IPositionManager {
    updatePosition(state: IRhinoState, position: Position): Position;
}

interface ICollisionManager {
    collidedWith(state: IRhinoState, otherEntity: IEntity): IRhinoState;
}

interface INextStateManager {
    next(state: IRhinoState): IRhinoState;
}

class BaseState implements IRhinoState {
    constructor(
        private frameManager: IFrameManager,
        private positionManager: IPositionManager,
        private collisionManager: ICollisionManager,
        private nextStateManager: INextStateManager
    ) {}

    get frame(): HTMLImageElement {
        return this.frameManager.frame;
    }

    updatePosition(position: Position): Position {
        return this.positionManager.updatePosition(this, position);
    }

    collidedWith(otherEntity: IEntity): IRhinoState {
        return this.collisionManager.collidedWith(this, otherEntity);
    }

    nextState(): IRhinoState {
        return this.nextStateManager.next(this);
    }
}

class StoppedPositionManager implements IPositionManager {
    updatePosition(state: IRhinoState, position: Position): Position {
        return position;
    }
}

class CollisionManager implements ICollisionManager {
    collidedWith(state: IRhinoState, otherEntity: IEntity): IRhinoState {
        return state;
    }
}

class SameNextStateManager implements INextStateManager {
    next(state: IRhinoState): IRhinoState {
        return state;
    }
}

class ChaseCollisionManager implements ICollisionManager {
    constructor(private assetManager: IAssetManager, private time: GameTime) {}

    collidedWith(state: IRhinoState, otherEntity: IEntity): IRhinoState {
        if (otherEntity instanceof Player) {
            return new RhinoEatState(this.assetManager, this.time);
        }
        return state;
    }
}

class ChasePositionManager implements IPositionManager {
    direction: "down" | "left" | "right" = "down";
    constructor(private time: GameTime, private target: IEntity) {}

    updatePosition(state: IRhinoState, lastPosition: Position): Position {
        const gameSeconds = this.time.gameFrame / GameTime.FRAME_PER_SECOND;
        const speed = Math.pow(4, gameSeconds / 10) + 1;
        const nextPosition = lastPosition.moveTowards(this.target.position, speed * DOWNHILL_SPEED);

        this.updateDirection(nextPosition, lastPosition);

        return nextPosition;
    }

    private updateDirection(nextPosition: Position, lastPosition: Position) {
        const deltaX = nextPosition.x - lastPosition.x;
        if (deltaX < -0.1) {
            this.direction = "left";
            return;
        }
        if (deltaX > 0.1) {
            this.direction = "right";
            return;
        }
        this.direction = "down";
    }
}

class ChaseStateManager implements INextStateManager {
    constructor(
        private chasePositionManager: ChasePositionManager,
        private assetManager: IAssetManager,
        private time: GameTime,
        private target: IEntity,
        private currentChaseDirection: "down" | "left" | "right"
    ) {}

    next(currentState: IRhinoState): IRhinoState {
        if (this.chasePositionManager.direction === this.currentChaseDirection) {
            return currentState;
        }
        if (this.chasePositionManager.direction === "left") {
            return new RhinoChaseLeftState(this.assetManager, this.time, this.target);
        }
        if (this.chasePositionManager.direction === "right") {
            return new RhinoChaseSideState(
                this.assetManager,
                this.time,
                this.target,
                this.chasePositionManager.direction
            );
        }
        return currentState;
    }
}

class RhinoChaseSideState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime, target: IEntity, direction: "right" | "left") {
        const collisionManager = new ChaseCollisionManager(assetManager, time);
        const positionManager = new ChasePositionManager(time, target);
        const chaseAnimationStateManager = new ChaseAnimationStateManager(
            assetManager,
            time,
            target,
            positionManager,
            direction
        );
        super(chaseAnimationStateManager, positionManager, collisionManager, chaseAnimationStateManager);
    }
}

class ChaseAnimationStateManager implements IFrameManager, INextStateManager {
    animation: Animation;

    constructor(
        private assetManager: IAssetManager,
        private time: GameTime,
        private target: IEntity,
        private chasePositionManager: ChasePositionManager,
        private currentChaseDirection: "right" | "left"
    ) {
        this.animation = new Animation([
            assetManager.images[`img/rhino_run_${currentChaseDirection}.png`],
            assetManager.images[`img/rhino_run_${currentChaseDirection}_2.png`],
        ]);
    }

    get frame(): HTMLImageElement {
        return this.animation.frame;
    }

    next(currentState: IRhinoState): IRhinoState {
        this.animation.update(this.time);
        if (this.chasePositionManager.direction === this.currentChaseDirection) {
            return currentState;
        }
        if (this.chasePositionManager.direction === "left") {
            return new RhinoChaseLeftState(this.assetManager, this.time, this.target);
        }
        if (this.chasePositionManager.direction === "right") {
            return new RhinoChaseSideState(
                this.assetManager,
                this.time,
                this.target,
                this.chasePositionManager.direction
            );
        }
        return currentState;
    }
}

class RhinoChaseLeftState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime, target: IEntity) {
        const collisionManager = new ChaseCollisionManager(assetManager, time);
        const positionManager = new ChasePositionManager(time, target);
        const chaseAnimationStateManager = new ChaseAnimationStateManager(
            assetManager,
            time,
            target,
            positionManager,
            "left"
        );
        super(chaseAnimationStateManager, positionManager, collisionManager, chaseAnimationStateManager);
    }
}

class RhinoChaseState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime, target: IEntity) {
        const frameManager = new StillFrameManager(assetManager.images["img/rhino_default.png"]);
        const collisionManager = new ChaseCollisionManager(assetManager, time);
        const positionManager = new ChasePositionManager(time, target);
        const nextStateManager = new ChaseStateManager(positionManager, assetManager, time, target, "down");
        super(frameManager, positionManager, collisionManager, nextStateManager);
    }
}

class EatingStateAnimationManager implements IFrameManager, INextStateManager {
    animation: Animation;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation(
            [
                assetManager.images["img/rhino_eat_1.png"],
                assetManager.images["img/rhino_eat_2.png"],
                assetManager.images["img/rhino_eat_3.png"],
                assetManager.images["img/rhino_eat_4.png"],
            ],
            false
        );
    }

    get frame(): HTMLImageElement {
        return this.animation.frame;
    }

    next(currentState: IRhinoState): IRhinoState {
        this.animation.update(this.time);
        if (this.animation.complete) {
            return new RhinoCelebrateState(this.assetManager, this.time);
        }
        return currentState;
    }
}

class CelebratingStateAnimationManager implements IFrameManager, INextStateManager {
    animation: Animation;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.animation = new Animation([
            assetManager.images["img/rhino_celebrate_1.png"],
            assetManager.images["img/rhino_celebrate_2.png"],
        ]);
    }

    get frame(): HTMLImageElement {
        return this.animation.frame;
    }

    next(currentState: IRhinoState): IRhinoState {
        this.animation.update(this.time);
        if (this.animation.complete) {
            return new RhinoCelebrateState(this.assetManager, this.time);
        }
        return currentState;
    }
}

class RhinoCelebrateState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime) {
        const frameStateAnimationManager = new CelebratingStateAnimationManager(assetManager, time);
        const collisionManager = new CollisionManager();
        const positionManager = new StoppedPositionManager();
        super(frameStateAnimationManager, positionManager, collisionManager, frameStateAnimationManager);
    }
}

class RhinoEatState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime) {
        const eatingStateAnimationManager = new EatingStateAnimationManager(assetManager, time);
        const collisionManager = new CollisionManager();
        const positionManager = new StoppedPositionManager();
        super(eatingStateAnimationManager, positionManager, collisionManager, eatingStateAnimationManager);
    }
}

class RhinoIdleState extends BaseState {
    constructor(assetManager: IAssetManager) {
        const frameManager = new StillFrameManager(assetManager.images["img/rhino_default.png"]);
        const collisionManager = new CollisionManager();
        const positionManager = new StoppedPositionManager();
        const nextStateManager = new SameNextStateManager();
        super(frameManager, positionManager, collisionManager, nextStateManager);
    }
}

export class Rhino implements IEntity {
    position: Position;
    height = 0;
    state: IRhinoState;

    constructor(private assetManager: IAssetManager, private time: GameTime) {
        this.position = new Position(0, 0);
        this.state = new RhinoIdleState(assetManager);
    }

    collidedWith(otherEntity: IEntity) {
        this.state = this.state.collidedWith(otherEntity);
    }

    get areaCovered(): Rect {
        return new Rect(this.position, this.frame);
    }

    next() {
        this.state = this.state.nextState();
        this.position = this.state.updatePosition(this.position);
    }

    get frame() {
        return this.state.frame;
    }

    chase(entity: IEntity) {
        this.state = new RhinoChaseState(this.assetManager, this.time, entity);
    }
}
