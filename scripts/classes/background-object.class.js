/**
 * Represents a background object in the game.
 */
class BackgroundObject extends MoveableObject {
    height = 540;
    width = 960;
    x = 0;
    y = 0;
    constructor(imgPath) {
        super().loadImage(imgPath);
    }
}