import { Animation } from "./Animation";
import { GameTime } from "./GameTime";

const createImage = (name: string) => {
    const image = new Image();
    image.alt = name;
    return image;
};

const range = (to: number, from = 0) => Array.from({ length: to }, (_, i) => (i + from).toString());

describe("Animation", () => {
    test("when 5 frames", () => {
        // GIVEN an animation with 5 frames
        const animation = new Animation(
            range(5).map((i) => createImage(i)),
            false
        );

        // WHEN the animation starts at game frame 100
        animation.update({ gameFrame: 100 } as GameTime);
        expect(animation.frame.alt).toEqual("0");

        animation.update({ gameFrame: 101 } as GameTime);
        expect(animation.frame.alt).toEqual("0");

        for (let i = 100; i <= 111; i++) {
            animation.update({ gameFrame: i } as GameTime);
            expect(animation.frame.alt).toEqual("0");
        }

        for (let i = 112; i <= 123; i++) {
            animation.update({ gameFrame: i } as GameTime);
            expect(animation.frame.alt).toEqual("1");
        }

        for (let i = 124; i <= 135; i++) {
            animation.update({ gameFrame: i } as GameTime);
            expect(animation.frame.alt).toEqual("2");
        }

        for (let i = 136; i <= 147; i++) {
            animation.update({ gameFrame: i } as GameTime);
            expect(animation.frame.alt).toEqual("3");
        }

        for (let i = 148; i <= 159; i++) {
            animation.update({ gameFrame: i } as GameTime);
            expect(animation.frame.alt).toEqual("4");
        }

        // THEN the animation is complete
        animation.update({ gameFrame: 160 } as GameTime);
        expect(animation.complete).toEqual(true);
    });
});
