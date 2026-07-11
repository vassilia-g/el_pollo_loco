/**
 * Draws world objects on the canvas.
 */
class WorldRenderer {
    /**
     * Create the renderer for a canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    /**
     * Draw the visible game objects with the current camera offset.
     * @param {World} world - The current game world
     */
    drawGameObjects(world) {
        this.ctx.translate(world.camera_x, 0);
        this.addObjectsToMap(world.level.background);
        this.addObjectsToMap(world.level.cloud);
        this.addObjectsToMap(world.level.coins);
        this.addObjectsToMap(world.level.salsa);
        this.addToMap(world.character);
        this.addObjectsToMap(world.level.chicken);
        this.addObjectsToMap(world.throwableSalsas);
        this.ctx.translate(-world.camera_x, 0);
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
     * @param {MoveableObject[]} objects - The objects to be drawn
     */
    addObjectsToMap(objects) {
        objects.forEach(object => this.addToMap(object));
    }

    /**
     * Flip the image of an object horizontally.
     * @param {MoveableObject} object - The object to flip
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Flip the image back to its original orientation.
     * @param {MoveableObject} object - The object to restore
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }
}
