/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
class Character extends MoveableObject {
    height = 200;
    width = 100;
    y = 275;
    speed = 10;
    IMAGES_WALKING = [
            "assets/graphics/2_character_pepe/2_walk/W-21.png",
            "assets/graphics/2_character_pepe/2_walk/W-22.png",
            "assets/graphics/2_character_pepe/2_walk/W-23.png",
            "assets/graphics/2_character_pepe/2_walk/W-24.png",
            "assets/graphics/2_character_pepe/2_walk/W-25.png",
            "assets/graphics/2_character_pepe/2_walk/W-26.png"
    ];
    world;

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
        // console.log("Jump function called");
    }

    /**
     * Animate the character by changing the image every 100ms
     */
    animate() {
        setInterval(() => {
            if (this.world.keyboard.LEFT) {
                this.x -= this.speed;
                this.otherDirection = true;
            }        
        }, 1000 / 60); 

        setInterval(() => {
            if (this.world.keyboard.RIGHT) {
                this.x += this.speed;
                this.otherDirection = false;
            }        
        }, 1000 / 60);

        setInterval(() => {
            if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                let index = this.currentImage % this.IMAGES_WALKING.length;
                let path = this.IMAGES_WALKING[index];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 50);      
    }

}