/**
 * Manages game objects and draws them on the canvas.
 */
class World {
    character = new Character();
    level = level1;
    camera_x_float = 0;
    camera_x = 0;
    activeEnemyCollisions = new Set();
    

    /**
     * The constructor of the World class. It initializes the canvas context and starts the drawing loop.
     * @param {HTMLCanvasElement} canvas - The canvas element where the game will be drawn
     * @param {Keyboard} keyboard - The keyboard instance to handle input
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    /**
     * Check for collisions between the character and other game objects (chickens, coins, salsa) at regular intervals.
     */
    checkCollisions() {
        setInterval(() => this.checkChickenCollisions(), 1000 / 60);
        setInterval(() => {
            this.checkCoinCollisions();
            this.checkSalsaCollisions();
        }, 100);
    }

    /**
     * Check for collisions between the character and chickens. If a collision is detected, handle it accordingly (e.g., damage the character or kill the chicken).
     */
    checkChickenCollisions() {
        this.level.chicken.forEach(chicken => this.handleChickenCollision(chicken));
    }

    /**
     * Handle the collision between the character and a chicken. If the chicken is dead or there is no collision, remove it from the active collisions set. If the character is jumping on the chicken, kill the chicken. Otherwise, damage the character.
     * @param {Chicken} chicken - The chicken to check for collision with the character
     */
    handleChickenCollision(chicken) {
        if (chicken.isDead() || !this.character.isColliding(chicken)) {
            this.activeEnemyCollisions.delete(chicken);
            return;
        }
        if (chicken instanceof Chicken && this.character.isJumpingOn(chicken)) {
            chicken.die();
            return;
        }
        this.damageCharacterOnce(chicken);
    }

    /**
     * Damage the character if it collides with a chicken and hasn't already been damaged by that chicken in the current collision.
     * @param {Chicken} chicken - The chicken that is colliding with the character
     */
    damageCharacterOnce(chicken) {
        if (!this.activeEnemyCollisions.has(chicken)) {
            this.character.hit();
        }
        this.activeEnemyCollisions.add(chicken);
    }

    /**
     * Check for collisions between the character and coins. If a collision is detected, log it to the console.
     */
    checkCoinCollisions() {
        this.level.coins.forEach(coin => {
            if (this.character.isColliding(coin)) {
                console.log("Collision with coin!");
            }
        });
    }

    /**
     * Check for collisions between the character and salsa. If a collision is detected, log it to the console.
     */
    checkSalsaCollisions() {
        this.level.salsa.forEach(salsa => {
            if (this.character.isColliding(salsa)) {
                console.log("Collision with salsa!");
            }
        });
    }

    /**
     * Set the world property of the character to this instance of the World class.
     */
    setWorld() {
        this.character.world = this;
    }
    
    /**
     * Draw all game objects on the canvas and request the next animation frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        this.camera_x = Math.round(this.camera_x_float || this.camera_x);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.background);
        this.addObjectsToMap(this.level.cloud);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.salsa);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.chicken);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draw a single object on the canvas.
     * @param {MoveableObject} object - The object to be drawn
     */
    addToMap(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
        object.draw(this.ctx);
        object.drawFrame(this.ctx);

        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    /**
     * Draw multiple objects on the canvas.
     * @param {MoveableObject[]} objects - An array of objects to be drawn
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Flip the image of an object horizontally.
     * @param {MoveableObject} object - The object whose image needs to be flipped
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Flip the image back to its original orientation.
     * @param {MoveableObject} object - The object whose image needs to be flipped back
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }
}
