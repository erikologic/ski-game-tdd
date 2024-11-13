export class AssetManager {
    static IMAGES = [
        "img/tree_1.png",
        "img/skier_down.png",
        "img/rhino_celebrate_1.png",
        "img/rhino_celebrate_2.png",
        "img/skier_jump_1.png",
        "img/skier_jump_2.png",
        "img/skier_jump_3.png",
        "img/skier_jump_4.png",
        "img/skier_jump_5.png",
    ] as const;
    static SCALE: number = 0.5;

    images!: Record<typeof AssetManager.IMAGES[number], HTMLImageElement>;

    // hiding the constructor so to force an async object
    private constructor() {}

    static async create() {
        const assetManager = new AssetManager();
        await assetManager.load();
        return assetManager;
    }

    async load() {
        this.images = Object.fromEntries(
            await Promise.all(
                AssetManager.IMAGES.map(async (url) => {
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
