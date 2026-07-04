/**
 * Class for the endboss character.
 */
class Endboss extends MoveableObject {
    animationState = "walking";
    activeAnimation = "";
    IMAGES_WALKING = [
        "assets/graphics/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/graphics/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/graphics/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/graphics/4_enemie_boss_chicken/1_walk/G4.png"
    ];
    IMAGES_ALERT = [
        "assets/graphics/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G12.png"
    ];
    IMAGES_ATTACK = [
        "assets/graphics/4_enemie_boss_chicken/3_attack/G13.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G14.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G15.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G16.png",
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
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.speed = 0.15;
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
        this.moveLeft();
        this.setManagedInterval(() => {
            this.updateAnimation();
        }, 150);      
    }

    /**
     * Start the endboss encounter with the alert animation.
     */
    startAlert() {
        if (this.animationState === "walking") {
            this.animationState = "alert";
            this.currentImage = 0;
            this.activeAnimation = "alert";
        }
    }

    /**
     * Update the boss animation based on its current state.
     */
    updateAnimation() {
        if (this.isDead()) {
            this.playStateAnimation(this.IMAGES_DEAD, "dead");
            return;
        }
        if (this.isHurt()) {
            this.playStateAnimation(this.IMAGES_HURT, "hurt");
            this.hurt = this.currentImage < this.IMAGES_HURT.length;
            return;
        }
        if (this.animationState === "alert") {
            this.playAlertAnimation();
            return;
        }
        if (this.animationState === "attack") {
            this.playStateAnimation(this.IMAGES_ATTACK, "attack");
            return;
        }
        this.playStateAnimation(this.IMAGES_WALKING, "walking");
    }

    /**
     * Play the alert animation once and then switch to attack.
     */
    playAlertAnimation() {
        this.playStateAnimation(this.IMAGES_ALERT, "alert");
        if (this.currentImage >= this.IMAGES_ALERT.length) {
            this.speed = 0;
            this.animationState = "attack";
            this.currentImage = 0;
            this.activeAnimation = "attack";
        }
    }

    /**
     * Play an animation and reset the frame counter when the animation changes.
     * @param {string[]} images - Animation frames
     * @param {string} state - Current animation state name
     */
    playStateAnimation(images, state) {
        if (this.activeAnimation !== state) {
            this.currentImage = 0;
            this.activeAnimation = state;
        }
        this.playAnimation(images);
    }

    /**
     * Damage the endboss and restart the hurt animation.
     */
    hit() {
        super.hit();
        this.currentImage = 0;
        if (this.isDead()) {
            this.speed = 0;
            this.fadeOut();
        }
    }

    /**
     * Fade the dead endboss out slowly.
     */
    fadeOut() {
        const interval = this.setManagedInterval(() => {
            this.reduceOpacity(interval);
        }, 50);
    }

    /**
     * Lower opacity and hide the endboss once fully transparent.
     * @param {number} interval - Fade interval identifier
     */
    reduceOpacity(interval) {
        this.opacity = Math.max(0, this.opacity - 0.025);
        if (this.opacity === 0) {
            this.visible = false;
            this.clearManagedInterval(interval);
        }
    }
}
