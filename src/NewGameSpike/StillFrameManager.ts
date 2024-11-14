export interface IFrameManager {
    get frame(): HTMLImageElement;
}

export class StillFrameManager implements IFrameManager {
    constructor(public frame: HTMLImageElement) {}
}
