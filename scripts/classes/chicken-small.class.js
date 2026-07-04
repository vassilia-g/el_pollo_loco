/**
 * Represents a small chicken enemy in the game.
 * Inherits from the Chicken class and has unique properties and behaviors.
 */
class ChickenSmall extends Chicken {
    width = 50;
    height = 40;
    y = 430;
    IMAGES_WALKING = [
        "assets/graphics/3_enemies_chicken/chicken_small/1_walk/1_w.png",
        "assets/graphics/3_enemies_chicken/chicken_small/1_walk/2_w.png",
        "assets/graphics/3_enemies_chicken/chicken_small/1_walk/3_w.png"
    ];
    IMAGES_DEAD = "assets/graphics/3_enemies_chicken/chicken_small/2_dead/dead.png";
    
    /**
     * Create the small chicken and preload walk images.
     */
    constructor() {
        super().loadImage("assets/graphics/3_enemies_chicken/chicken_small/1_walk/1_w.png");
        this.x = 500 + Math.random() * 2700;
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
        this.speed = 0.15 + Math.random() * 0.5;
    }

    /**
     * Animate the small chicken by changing the image every 100ms
     */
    animate() {
        this.moveLeft();
        this.setManagedInterval(() => {
            this.updateAnimation();
        }, 150);      
    }

    /**
     * Play walking frames only while the small chicken is alive.
     */
    updateAnimation() {
        if (!this.isDead()) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Make the small chicken die and fade out.
     */
    die() {
        this.health = 0;
        this.speed = 0;
        this.loadImage(this.IMAGES_DEAD);
        this.fadeOut();
    }

    /**
     * Fade the dead small chicken out over two seconds.
     */
    fadeOut() {
        const interval = this.setManagedInterval(() => {
            this.reduceOpacity(interval);
        }, 50);
    }
}   
