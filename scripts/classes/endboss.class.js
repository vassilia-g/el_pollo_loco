/**
 * Class for the endboss character.
 */
class Endboss extends MoveableObject {

    IMAGES_WALKING = [
        "assets/graphics/4_enemie_boss_chicken/3_attack/G17.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G18.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G19.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G20.png"
    ];

    /**
     * Create the endboss and preload walk images.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.x = 2550;
        this.y = 150;
        this.width = 250;
        this.height = 350;
        this.animate();
    }

    /**
     * Animate the endboss by changing the image every 150ms
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);      
    }
}