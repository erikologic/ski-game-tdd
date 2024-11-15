export const IMAGES = [
    "img/tree_1.png",
    "img/tree_cluster.png",
    "img/skier_down.png",
    "img/rhino_celebrate_1.png",
    "img/rhino_celebrate_2.png",
    "img/skier_jump_1.png",
    "img/skier_jump_2.png",
    "img/skier_jump_3.png",
    "img/skier_jump_4.png",
    "img/skier_jump_5.png",
    "img/skier_right_down.png",
    "img/skier_left_down.png",
    "img/skier_left.png",
    "img/skier_right.png",
    "img/skier_crash.png",
    "img/rock_1.png",
    "img/rock_2.png",
    "img/rhino_default.png",
    "img/rhino_eat_1.png",
    "img/rhino_eat_2.png",
    "img/rhino_eat_3.png",
    "img/rhino_eat_4.png",
    "img/rhino_run_left.png",
    "img/rhino_run_left_2.png",
    "img/rhino_run_right.png",
    "img/rhino_run_right_2.png",
] as const;

export interface IAssetManager {
    images: Record<typeof IMAGES[number], HTMLImageElement>;
}
export class AssetManager {
    static SCALE: number = 0.5;

    images!: Record<typeof IMAGES[number], HTMLImageElement>;

    // hiding the constructor so to force an async object
    private constructor() {}

    static async create() {
        const assetManager = new AssetManager();
        await assetManager.load();
        return assetManager;
    }

    private async load() {
        this.images = Object.fromEntries(
            await Promise.all(
                IMAGES.map(async (url) => {
                    const image = await this.loadSingleImage(url);
                    return [url, image];
                })
            )
        );
    }

    private async loadSingleImage(url: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve) => {
            const loadedImage = new Image();
            loadedImage.onload = () => {
                loadedImage.width *= AssetManager.SCALE;
                loadedImage.height *= AssetManager.SCALE;

                resolve(loadedImage);
            };
            loadedImage.src = url;
        });
    }
}
