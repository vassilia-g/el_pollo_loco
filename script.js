const CANVAS = document.querySelector("canvas");
let world;

CANVAS.width = 960;
CANVAS.height = 540;


function init() {
    world = new World(CANVAS);
    console.log("My character is", world.character);
    
}

