interface ISize {
    width: number;
    height: number;
}

interface IPosition {
    x: number;
    y: number;
}

export class Rect {
    coordinates: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };

    constructor(public center: IPosition, public size: ISize) {
        this.coordinates = {
            top: center.y - size.height / 2,
            bottom: center.y + size.height / 2,
            left: center.x - size.width / 2,
            right: center.x + size.width / 2,
        };
    }

    overlaps(areaCovered: Rect): boolean {
        const me = this.coordinates;
        const other = areaCovered.coordinates;

        if (me.right < other.left || me.left > other.right) return false;
        if (me.bottom < other.top || me.top > other.bottom) return false;

        return true;
    }
}
