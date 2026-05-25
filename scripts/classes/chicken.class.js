/**
 * Load the chicken image and set a random start x position.
 */
class Chicken extends MoveableObject {
    width = 80;
    height = 60;
    y = 410;
    IMAGES_WALKING = [
        "assets/graphics/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/graphics/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/graphics/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
    ];
    IMAGES_DEAD = "assets/graphics/3_enemies_chicken/chicken_normal/2_dead/dead.png";
    
    /**
     * Create the chicken and preload walk images.
     */
    constructor() {
        super().loadImage("assets/graphics/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = 200 + Math.random() * 2700;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speed = 0.15 + Math.random() * 0.5;
    }

    /**
     * Animate the chicken by changing the image every 100ms
     */
    animate() {
        this.moveLeft();
        setInterval(() => {
            this.updateAnimation();
        }, 150);      
    }

    /**
     * Play walking frames only while the chicken is alive.
     */
    updateAnimation() {
        if (!this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Kill the chicken after it has been jumped on.
     */
    die() {
        this.health = 0;
        this.speed = 0;
        this.loadImage(this.IMAGES_DEAD);
        this.fadeOut();
    }

    /**
     * Fade the dead chicken out over two seconds.
     */
    fadeOut() {
        const interval = setInterval(() => {
            this.reduceOpacity(interval);
        }, 50);
    }

    /**
     * Lower opacity and hide the chicken once fully transparent.
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
