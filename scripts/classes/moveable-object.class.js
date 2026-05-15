/**
 * Base class for all movable game objects.
 */
class MoveableObject {
    x = 100;
    y = 300;
    height = 150;
    width = 100;
    img;
    imageCache = []; 
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;

    /**
     * Apply gravity to the object, making it fall down if it's above the ground level.
     */
    applyGravity() {
        setInterval(() => {
            if (this.y < 271) {
                this.speedY += this.acceleration;
                this.y += this.speedY;
            }
        }, 1000 / 45);
    }

    /**
     * Check if the object is above the ground level.
     * @returns {boolean} True if the object is above the ground, false otherwise.
     */
    isAboveGround() {
        return this.y < 271;
    }

    /**
     * Load a single image from a path.
     * @param {string} path - Path to the image file
     * @returns {void}
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Load multiple images from an array of paths.
     * @param {string[]} array - Array of image file paths
     * @returns {void}
     */
    loadImages(array) {
        array.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }); 
    }

    /**
     * Move the object to the right
     */
    moveRight() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Move the object to the left
     */
    moveLeft() {
        setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);   
    }

    /**
     * 
     * @param {*} images 
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}