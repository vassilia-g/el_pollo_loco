/**
 * Canvas status bar that switches image based on a percentage value.
 */
class StatusBar extends MoveableObject {
    width = 150;
    height = 40;
    percentage = 100;

    /**
     * Create a status bar from a list of percentage image paths.
     * @param {string[]} images - Image paths ordered from 0 to 100 percent
     * @param {number} x - X-position on the canvas
     * @param {number} y - Y-position on the canvas
     * @param {number} percentage - Initial percentage
     */
    constructor(images, x, y, percentage = 100) {
        super();
        this.IMAGES = images;
        this.x = x;
        this.y = y;
        this.loadImages(this.IMAGES);
        this.setPercentage(percentage);
    }

    /**
     * Update the bar image to the closest available percentage step.
     * @param {number} percentage - New percentage from 0 to 100
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.IMAGES[this.resolveImageIndex()]];
    }

    /**
     * Resolve the image index for the current percentage.
     * @returns {number} Image index
     */
    resolveImageIndex() {
        return Math.ceil(this.percentage / 20);
    }
}
