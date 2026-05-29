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
    IMAGES_HURT = [
        "assets/graphics/4_enemie_boss_chicken/4_hurt/G21.png",
        "assets/graphics/4_enemie_boss_chicken/4_hurt/G22.png",
        "assets/graphics/4_enemie_boss_chicken/4_hurt/G23.png"
    ];
    IMAGES_DEAD = [
        "assets/graphics/4_enemie_boss_chicken/5_dead/G24.png",
        "assets/graphics/4_enemie_boss_chicken/5_dead/G25.png",
        "assets/graphics/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    /**
     * Create the endboss and preload walk images.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
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
            this.updateAnimation();
        }, 150);      
    }

    /**
     * Update the boss animation based on its current state.
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playAnimation(this.IMAGES_DEAD);
            return;
        }
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURT);
            this.hurt = this.currentImage < this.IMAGES_HURT.length;
            return;
        }
        this.playAnimation(this.IMAGES_WALKING);
    }

    /**
     * Damage the endboss and restart the hurt animation.
     */
    hit() {
        super.hit();
        this.currentImage = 0;
        if (this.isDead()) {
            this.fadeOut();
        }
    }

    /**
     * Fade the dead endboss out slowly.
     */
    fadeOut() {
        const interval = setInterval(() => {
            this.reduceOpacity(interval);
        }, 80);
    }

    /**
     * Lower opacity and hide the endboss once fully transparent.
     * @param {number} interval - Fade interval identifier
     */
    reduceOpacity(interval) {
        this.opacity = Math.max(0, this.opacity - 0.025);
        if (this.opacity === 0) {
            this.visible = false;
            clearInterval(interval);
        }
    }
}
