class Character extends MoveableObject {
    height = 200;
    width = 100;
    y = 275;

    constructor() {
        super().loadImage("assets/graphics/2_character_pepe/2_walk/W-22.png");
    }
    
    jump() {
        console.log("Jump");
    }
}