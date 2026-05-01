/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
class Character extends MoveableObject {
    height = 200;
    width = 100;
    y = 275;
    IMAGES_WALKING = [
            "assets/graphics/2_character_pepe/2_walk/W-21.png",
            "assets/graphics/2_character_pepe/2_walk/W-22.png",
            "assets/graphics/2_character_pepe/2_walk/W-23.png",
            "assets/graphics/2_character_pepe/2_walk/W-24.png",
            "assets/graphics/2_character_pepe/2_walk/W-25.png",
            "assets/graphics/2_character_pepe/2_walk/W-26.png"
    ];
    currentImage = 0;

    /**
     * Create the character and preload walk images.
     */
    constructor() {
        super().loadImage("assets/graphics/2_character_pepe/2_walk/W-22.png");
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }
    
    /**
     * Make the character jump
     */
    jump() {
        console.log("Jump function called");
    }

    /**
     * Animate the character by changing the image every 100ms
     */
    animate() {
        setInterval(() => {
            let path = this.IMAGES_WALKING[this.currentImage];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 1000);      
    }

}