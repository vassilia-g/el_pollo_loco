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
    health = 100;
    damage = 20;
    hurt = false;
    opacity = 1;
    visible = true;
    intervals = [];

    /**
     * Draw the object on the canvas.
     * @param {*} ctx - The canvas context to draw on
     */
    draw(ctx) {
        if (!this.visible) {
            return;
        }
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    /**
     * draw a blue frame around the object for debugging purposes only if the object is an instance of Character, Chicken, Endboss, Salsa or Coins.
     * @param {*} ctx - The canvas context to draw on
     */
    drawFrame(ctx) {
        if (!this.visible || !this.hasFrame()) {
            return;
        }
        ctx.save();
        ctx.globalAlpha = this.opacity;
        this.drawBorder(ctx);
        ctx.restore();
    }

    hasFrame() {
        return this instanceof Character || this instanceof Chicken ||
               this instanceof Endboss || this instanceof Salsa || this instanceof Coins;
    }

    drawBorder(ctx) {
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "transparent";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Reduce the health of the object by the damage value.
    */
    hit() {
        this.health = Math.max(this.health - this.damage, 0);
        this.hurt = true;
    }

    /**
     * Check whether the object should display its hurt state.
     * @returns {boolean} True if the object is hurt, false otherwise.
     */
    isHurt() {
        return this.hurt;
    }

    /**
     * Check if the object is dead (i.e., its health is 0).
     * @returns {boolean} True if the object is dead, false otherwise.
     */
    isDead() {
        return this.health === 0;
    }

    /**
     * Apply acceleration to the object, making it fall down if it's above the ground level.
     */
    applyacceleration() {
        this.setManagedInterval(() => {
            if (this.y < 271) {
                this.speedY += this.acceleration;
                this.y += this.speedY;
            }
        }, 1000 / 45);
    }

    /**
     * Check if the object is colliding with another moveable object.
     * @param {MoveableObject} mo - The other moveable object to check collision with
     * @returns {boolean} True if there is a collision, false otherwise.
     */
    isColliding(mo) {
        return this.x + this.width > mo.x &&
               this.x < mo.x + mo.width &&
               this.y + this.height > mo.y &&
               this.y < mo.y + mo.height;
    }

    /**
     * Check whether this object is falling onto another object's upper half.
     * @param {MoveableObject} mo - The object being landed on
     * @returns {boolean} True if this is a stomp collision
     */
    isJumpingOn(mo) {
        const bottom = this.y + this.height;
        return this.speedY > 0 && bottom <= mo.y + mo.height / 2;
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
        this.setManagedInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Move the object to the left
     */
    moveLeft() {
        this.setManagedInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);   
    }

    /**
     * Start an interval that can be cleaned up when the object is destroyed.
     * @param {Function} callback - Function to run repeatedly
     * @param {number} delay - Interval delay in milliseconds
     * @returns {number} The interval identifier
     */
    setManagedInterval(callback, delay) {
        const interval = setInterval(callback, delay);
        this.intervals.push(interval);
        return interval;
    }

    /**
     * Clear one managed interval.
     * @param {number} interval - Interval identifier
     */
    clearManagedInterval(interval) {
        clearInterval(interval);
        this.intervals = this.intervals.filter(activeInterval => activeInterval !== interval);
    }

    /**
     * Clear all running intervals owned by this object.
     */
    clearIntervals() {
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];
    }

    /**
     * Stop all runtime work owned by this object.
     */
    destroy() {
        this.clearIntervals();
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
