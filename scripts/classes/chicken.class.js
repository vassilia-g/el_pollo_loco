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
    
    /**
     * Create the chicken and preload walk images.
     */
    constructor() {
        super().loadImage("assets/graphics/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = 200 + Math.random() * 1200;
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
            this.playAnimation(this.IMAGES_WALKING);
        }, 150);      
    }
}