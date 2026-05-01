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
        console.log("Move right");
    }

    /**
     * Move the object to the left
     */
    moveLeft() {
        console.log("Move left");
    }
}