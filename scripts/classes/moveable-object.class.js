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
    acceleration = 0.8;

    /**
     * Draw the object on the canvas.
     * @param {*} ctx - The canvas context to draw on
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * draw a blue frame around the object for debugging purposes only if the object is an instance of Character, Chicken, Endboss, Salsa or Coins.
     * @param {*} ctx - The canvas context to draw on
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Salsa || this instanceof Coins) {
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.strokeStyle = "blue";
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    }

    /**
     * Apply acceleration to the object, making it fall down if it's above the ground level.
     */
    applyacceleration() {
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
     * this method is used to play an animation by changing the image of the object based on the current frame index.
     * @param {*} images 
     */
    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}