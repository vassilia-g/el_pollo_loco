/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
class Character extends MoveableObject {
    height = 200;
    width = 100;
    y = 140;
    speed = 5.5;
    jumpSpeed = 20;
    groundY = 275;
    isJumping = false;
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
        this.applyacceleration();
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_JUMPING);
        
        this.lastMoveTime = Date.now();
        
        this.animate();
    }

    /**
     * Animate the character by changing the image every 100ms
     */
    animate() {
        let lastAnimation = '';
        setInterval(() => {
            this.handleMovement();
            this.handleJumpInput();
            this.applyGravity();
            this.updateCamera();
        }, 1000 / 60);

        setInterval(() => {
            lastAnimation = this.updateAnimation(lastAnimation);
        }, 100);
    }

    /**
     * Handle the character's horizontal movement based on keyboard input and update the last move time. 
     */
    handleMovement() {
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
    }

    /**
     * Make the character jump
     */
    jump() {
        if (!this.isJumping) {
            this.speedY = -this.jumpSpeed;
            this.isJumping = true;
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Handle the character's jump input and set the appropriate speed and state for jumping.
     */
    handleJumpInput() {
        if (this.world.keyboard.UP_PRESSED) {
            this.jump();
            this.world.keyboard.UP_PRESSED = false;
        }
    }

    /**
     * This method applies gravity to the character by increasing the vertical speed and updating the y position. It also checks if the character has landed on the ground and resets the jumping state accordingly.
     * @returns 
     */
    applyGravity() {
        if (!this.isJumping) {
            return;
        }
        this.y += this.speedY;
        this.speedY += this.acceleration; 
        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.isJumping = false;
            this.speedY = 0;
        }
    }

    /**
     * Update the camera position based on the character's x position to keep the character centered on the screen.
     */
    updateCamera() {
        this.world.camera_x = -this.x + 100;
        console.log(this.world.camera_x);
    }

    /**
     * Apply acceleration to the character for gravity effect.
     */
    applyacceleration() {
        setInterval(() => {
            if (this.y < this.groundY) {
                this.speedY += this.acceleration;
                this.y += this.speedY;
            }
        }, 1000 / 45);
    }

    /**
     * Update the character's animation based on its state (jumping, walking, idle, long idle) and return the current animation state.
     * @param {string} lastAnimation - The last animation state of the character
     * @returns {string} The current animation state of the character
     */
    updateAnimation(lastAnimation) {
        if (this.isAboveGround()) {
            return this.playJumpingAnimation(lastAnimation);
        }
        if (this.isJumping) {
            return this.playJumpingAnimation(lastAnimation);
        }
        const bothHorizontal = this.world.keyboard.LEFT && this.world.keyboard.RIGHT;
        if (!bothHorizontal && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)) {
            return this.playWalkingAnimation(lastAnimation);
        }
        if (Date.now() - this.lastMoveTime > 7000) {
            return this.playLongIdleAnimation(lastAnimation);
        }
        return this.playIdleAnimation(lastAnimation);
    }

    /**
     * Play the jumping animation by changing the image based on the current frame index and return the current animation state.
     * @param {*} lastAnimation 
     * @returns 
     */
    playJumpingAnimation(lastAnimation) {
        if (lastAnimation !== 'jumping') {
            this.currentImage = 0;
            lastAnimation = 'jumping';
        }
        this.playAnimation(this.IMAGES_JUMPING);
        return lastAnimation;
    }

    /**
     * Play the walking animation by changing the image based on the current frame index and return the current animation state.
     * @param {*} lastAnimation 
     * @returns 
     */
    playWalkingAnimation(lastAnimation) {
        if (lastAnimation !== 'walking') {
            this.currentImage = 0;
            lastAnimation = 'walking';
        }
        this.playAnimation(this.IMAGES_WALKING);
        return lastAnimation;
    }

    /**
     * Play the long idle animation by changing the image based on the current frame index and return the current animation state.
     * @param {*} lastAnimation 
     * @returns 
     */
    playLongIdleAnimation(lastAnimation) {
        if (lastAnimation !== 'long_idle') {
            this.currentImage = 0;
            lastAnimation = 'long_idle';
        }
        this.playAnimation(this.IMAGES_LONG_IDLE);
        return lastAnimation;
    }

    /**
     * Play the idle animation by changing the image based on the current frame index and return the current animation state.
     * @param {*} lastAnimation 
     * @returns 
     */
    playIdleAnimation(lastAnimation) {
        if (lastAnimation !== 'idle') {
            this.currentImage = 0;
            lastAnimation = 'idle';
        }
        this.playAnimation(this.IMAGES_IDLE);
        return lastAnimation;
    }

}