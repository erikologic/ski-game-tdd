import { IAssetManager } from "./AssetManager";
import { GameTime } from "./GameTime";
import { IEntity } from "./IEntity";
import { Player } from "./Player";
import { Position } from "./Position";
import { Rect } from "./Rect";
import { IFrameManager, StillFrameManager } from "./StillFrameManager";
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

class ContinuosMovementPositionManager implements IPositionManager {
    constructor(private time: GameTime, private movement: Position) {}

    updatePosition(state: IRhinoState, position: Position): Position {
        const gameSeconds = this.time.gameFrame / GameTime.FRAME_PER_SECOND;
        const speed = Math.pow(4, gameSeconds / 10) + 1;
        return position.add(this.movement.multiply(speed, speed));
    }
}

class RhinoChaseState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime) {
        const frameManager = new StillFrameManager(assetManager.images["img/rhino_default.png"]);
        const collisionManager = new ChaseCollisionManager(assetManager, time);
        const positionManager = new ContinuosMovementPositionManager(time, new Position(0, DOWNHILL_SPEED));
        const nextStateManager = new SameNextStateManager();
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
        this.animation = new Animation(
            [assetManager.images["img/rhino_celebrate_1.png"], assetManager.images["img/rhino_celebrate_2.png"]],
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

class RhinoCelebrateState extends BaseState {
    constructor(assetManager: IAssetManager, time: GameTime) {
        // const frameManager = new StillFrameManager(assetManager.images["img/rhino_celebrate_1.png"]);
        const frameStateAnimationManager = new CelebratingStateAnimationManager(assetManager, time);
        const collisionManager = new CollisionManager();
        const positionManager = new StoppedPositionManager();
        // const nextStateManager = new EatingStateAnimationManager(assetManager, time);
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

    chase(player: IEntity) {
        this.state = new RhinoChaseState(this.assetManager, this.time);
    }
}
