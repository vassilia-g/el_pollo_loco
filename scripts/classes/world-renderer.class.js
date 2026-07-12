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
        this.addObjectsToMap(world.level.background, world.camera_x);
        if (world.isGameOver()) {
            this.ctx.translate(-world.camera_x, 0);
            return;
        }
        this.addObjectsToMap(world.level.cloud, world.camera_x);
        this.addObjectsToMap(world.level.coins, world.camera_x);
        this.addObjectsToMap(world.level.salsa, world.camera_x);
        this.addToMap(world.character);
        this.addObjectsToMap(world.level.chicken, world.camera_x);
        this.addObjectsToMap(world.throwableSalsas, world.camera_x);
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
     * @param {number} cameraX - Current horizontal camera offset
     */
    addObjectsToMap(objects, cameraX) {
        objects.forEach(object => {
            if (this.isInViewport(object, cameraX)) {
                this.addToMap(object);
            }
        });
    }

    /**
     * Check whether an object overlaps the visible horizontal canvas area.
     * @param {MoveableObject} object - The object to check
     * @param {number} cameraX - Current horizontal camera offset
     * @returns {boolean} True when the object can be visible
     */
    isInViewport(object, cameraX) {
        const screenX = object.x + cameraX;
        return object.visible && screenX + object.width >= 0 && screenX <= this.ctx.canvas.width;
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
