/**
 * Manages game objects and draws them on the canvas.
 */
class World {
    cloud = [new Cloud()];
    character = new Character();
    chicken = [new Chicken(), new Chicken(), new Chicken()];
    background = [
        new BackgroundObject("assets/graphics/5_background/layers/air.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/1.png", 0)
    ];

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
    
        this.addObjectsToMap(this.background);
        this.addToMap(this.character);
        this.addObjectsToMap(this.chicken);
        this.addObjectsToMap(this.cloud);
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draw a single object on the canvas.
     * @param {MoveableObject} object - The object to be drawn
     */
    addToMap(object) {
    this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
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