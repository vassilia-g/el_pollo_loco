/**
 * Create a cloud with a random x position and fixed y position.
 */
class Cloud extends MoveableObject {
    height = 400;
    width = 500;
    
    /**
     * Initialize the cloud image and set a random x position.
     */
    constructor(x) {
        super().loadImage("assets/graphics/5_background/layers/4_clouds/1.png");
        this.x = x !== undefined ? x : -500 + Math.random() * 3000;
        this.y = 40;
        this.animate();
    }

    /**
     * Animate the cloud by moving it to the left every frame
     */
    animate() {
        this.moveLeft();
    }
}