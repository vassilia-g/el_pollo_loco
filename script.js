const CANVAS = document.querySelector("canvas");
let world;
let KEYBOARD = new Keyboard();

CANVAS.width = 960;
CANVAS.height = 540;

/**
 * This function initializes the game by creating a new instance of the World class and passing the canvas and keyboard instances to it.
 */
function init() {
    world = new World(CANVAS, KEYBOARD);
}

/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
window.addEventListener("keydown", (event) => {
     if (KEYBOARD.blocked) {
        return;
    }
    if (event.keyCode == 39 || event.keyCode == 68) {
        KEYBOARD.RIGHT = true;
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
        KEYBOARD.LEFT = true;
    }
    if (event.keyCode == 38 || event.keyCode == 87) {
        if (!KEYBOARD.UP) {
            KEYBOARD.UP_PRESSED = true;
        }
        KEYBOARD.UP = true;
    }
    if (event.keyCode == 40 || event.keyCode == 83) {
        KEYBOARD.DOWN = true;
    }
    if (event.keyCode == 32) {
        if (!KEYBOARD.SPACE) {
            KEYBOARD.SPACE_PRESSED = true;
        }
        KEYBOARD.SPACE = true;
    }
});

/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
window.addEventListener("keyup", (event) => {
     if (KEYBOARD.blocked) {
        return;
    }
    if (event.keyCode == 39 || event.keyCode == 68) {
        KEYBOARD.RIGHT = false;
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
        KEYBOARD.LEFT = false;
    }
    if (event.keyCode == 38 || event.keyCode == 87) {
        KEYBOARD.UP = false;
        KEYBOARD.UP_PRESSED = false;
    }
    if (event.keyCode == 40 || event.keyCode == 83) {
        KEYBOARD.DOWN = false;
    }
    if (event.keyCode == 32) {
        KEYBOARD.SPACE = false;
        KEYBOARD.SPACE_PRESSED = false;
    }
});
