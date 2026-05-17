/**
 * Manages game objects and draws them on the canvas.
 */
class World {

    character = new Character();
    level = level1;
    camera_x = 0;
    

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