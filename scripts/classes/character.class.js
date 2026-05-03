/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
class Character extends MoveableObject {
    height = 200;
    width = 100;
    y = 275;
    speed = 7.5;
    jumpSpeed = 26;
    velocityY = 0;
    groundY = 275;
    isJumping = false;
    gravity = 1.5;
    world;
    lastMoveTime;
    IMAGES_WALKING = [
        "assets/graphics/2_character_pepe/2_walk/W-21.png",
        "assets/graphics/2_character_pepe/2_walk/W-22.png",
        "assets/graphics/2_character_pepe/2_walk/W-23.png",
        "assets/graphics/2_character_pepe/2_walk/W-24.png",
        "assets/graphics/2_character_pepe/2_walk/W-25.png",
        "assets/graphics/2_character_pepe/2_walk/W-26.png"
    ];
    IMAGES_IDLE = [
        "assets/graphics/2_character_pepe/1_idle/idle/I-1.png",
        "assets/graphics/2_character_pepe/1_idle/idle/I-2.png",
        "assets/graphics/2_character_pepe/1_idle/idle/I-3.png",
        "assets/graphics/2_character_pepe/1_idle/idle/I-4.png",
        "assets/graphics/2_character_pepe/1_idle/idle/I-5.png",
        "assets/graphics/2_character_pepe/1_idle/idle/I-6.png"
    ];
    IMAGES_LONG_IDLE = [ 
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-11.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-12.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-13.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-14.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-15.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-16.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-17.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-18.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-19.png",
        "assets/graphics/2_character_pepe/1_idle/long_idle/I-20.png",    
    ];
    IMAGES_JUMPING = [ 
        "assets/graphics/2_character_pepe/3_jump/J-31.png",
        "assets/graphics/2_character_pepe/3_jump/J-32.png",
        "assets/graphics/2_character_pepe/3_jump/J-33.png",
        "assets/graphics/2_character_pepe/3_jump/J-34.png",
        "assets/graphics/2_character_pepe/3_jump/J-35.png",
        "assets/graphics/2_character_pepe/3_jump/J-36.png",
        "assets/graphics/2_character_pepe/3_jump/J-37.png",
        "assets/graphics/2_character_pepe/3_jump/J-38.png",
        "assets/graphics/2_character_pepe/3_jump/J-39.png"
    ];

    /**
     * Create the character and preload walk images.
     */
    constructor() {
        super().loadImage("assets/graphics/2_character_pepe/2_walk/W-22.png");
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        this.lastMoveTime = Date.now();
        this.animate();
    }
    
    /**
     * Make the character jump
     */
    jump() {
        
    }

    /**
     * Animate the character by changing the image every 100ms
     */
    animate() {
        /**
         * Move the character left or right and update the camera position every 16ms (60 frames per second)
         */
        setInterval(() => {
            if (this.world.keyboard.LEFT && this.x > -500) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.lastMoveTime = Date.now();
            }        

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                this.lastMoveTime = Date.now();
            }
            
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60); 

        setInterval(() => {
            const bothHorizontal = this.world.keyboard.LEFT && this.world.keyboard.RIGHT;

            if (!bothHorizontal && this.world.keyboard.LEFT && this.x > -500) {
                this.x -= this.speed;
                this.otherDirection = true;
                this.lastMoveTime = Date.now();
            }

            if (!bothHorizontal && this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
                this.lastMoveTime = Date.now();
            }

            if (this.world.keyboard.UP_PRESSED && !this.isJumping) {
                this.velocityY = -this.jumpSpeed;
                this.isJumping = true;
                this.lastMoveTime = Date.now();
                this.world.keyboard.UP_PRESSED = false;
            }

            if (this.isJumping) {
                this.y += this.velocityY;
                this.velocityY += this.gravity;

                if (this.y >= this.groundY) {
                    this.y = this.groundY;
                    this.isJumping = false;
                    this.velocityY = 0;
                }
            }

            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);

        /**
         * Play walking animation or jumping animation based on current state.
         */
        setInterval(() => {
            const bothHorizontal = this.world.keyboard.LEFT && this.world.keyboard.RIGHT;

            if (this.isJumping) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else if (!bothHorizontal && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 150);
        
        /** Play idle animation only when not moving or jumping. */
        setInterval(() => {
            const bothHorizontal = this.world.keyboard.LEFT && this.world.keyboard.RIGHT;

            if ((!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT || bothHorizontal) && !this.isJumping) {
                if (Date.now() - this.lastMoveTime > 7000) {
                    this.playAnimation(this.IMAGES_LONG_IDLE);
                } else {
                    this.playAnimation(this.IMAGES_IDLE);
                }
            }
        }, 250);
    }

}