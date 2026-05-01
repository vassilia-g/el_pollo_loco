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
    // console.log("My character is", world.character);
    
}

/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
window.addEventListener("keydown", (event) => {
    if (event.keyCode == 39 || event.keyCode == 68) {
        KEYBOARD.RIGHT = true;
        console.log("Right key pressed");
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
        KEYBOARD.LEFT = true;
        console.log("Left key pressed");
    }
    if (event.keyCode == 38 || event.keyCode == 87) {
        KEYBOARD.UP = true;
        console.log("Up key pressed");
    }
    if (event.keyCode == 40 || event.keyCode == 83) {
        KEYBOARD.DOWN = true;
        console.log("Down key pressed");
    }
    if (event.keyCode == 32) {
        KEYBOARD.SPACE = true;
        console.log("Space key pressed");
    }
});

/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
window.addEventListener("keyup", (event) => {
    if (event.keyCode == 39 || event.keyCode == 68) {
        KEYBOARD.RIGHT = false;
        console.log("Right key released");
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
        KEYBOARD.LEFT = false;
        console.log("Left key released");
    }
    if (event.keyCode == 38 || event.keyCode == 87) {
        KEYBOARD.UP = false;
        console.log("Up key released");
    }
    if (event.keyCode == 40 || event.keyCode == 83) {
        KEYBOARD.DOWN = false;
        console.log("Down key released");
    }
    if (event.keyCode == 32) {
        KEYBOARD.SPACE = false;
        console.log("Space key released");
    }
});