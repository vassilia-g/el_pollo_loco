/**
 * Represents a background object in the game.
 */
class BackgroundObject extends MoveableObject {
    height = 540;
    width = 960;
    x = 0;
    y = 0;

    /**
     * Create a background object with the specified image path and x position.
     * @param {string} imgPath - Path to the background image
     * @param {number} x - X position of the background object
     */
    constructor(imgPath, x) {
        super().loadImage(imgPath);
        this.x = x;
    }
}