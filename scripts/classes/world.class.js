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
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.chicken);
        this.addObjectsToMap(this.level.cloud);
        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draw a single object on the canvas.
     * @param {MoveableObject} object - The object to be drawn
     */
    addToMap(object) {
        if (object.otherDirection) {
            this.ctx.save();
            this.ctx.translate(object.width, 0);
            this.ctx.scale(-1, 1);
            object.x = object.x * -1;
        }
        this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
        if (object.otherDirection) {
            object.x = object.x * -1;
            this.ctx.restore();
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
}