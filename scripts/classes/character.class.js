/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
class Character extends MoveableObject {
    height = 200;
    width = 100;
    y = 140;
    speed = 5.5;
    jumpSpeed = 17;
    groundY = 275;
    isJumping = true;
    hasLandedOnce = false;
    startFallAcceleration = 0.15;
    world;
    lastMoveTime;
    deathAnimationStarted = false;
    deathAnimationFinished = false;
    deathFallSpeed = 0;
    deathFallAcceleration = 0.15;
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
    IMAGES_HURT = [
        "assets/graphics/2_character_pepe/4_hurt/H-41.png",
        "assets/graphics/2_character_pepe/4_hurt/H-42.png",
        "assets/graphics/2_character_pepe/4_hurt/H-43.png"
    ];
    IMAGES_DEAD = [
        "assets/graphics/2_character_pepe/5_dead/D-51.png",
        "assets/graphics/2_character_pepe/5_dead/D-52.png",
        "assets/graphics/2_character_pepe/5_dead/D-53.png",
        "assets/graphics/2_character_pepe/5_dead/D-54.png",
        "assets/graphics/2_character_pepe/5_dead/D-55.png",
        "assets/graphics/2_character_pepe/5_dead/D-56.png",
        "assets/graphics/2_character_pepe/5_dead/D-57.png"
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
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.lastMoveTime = Date.now();
        this.animate();
    }

    /**
     * Animate the character by changing the image every 100ms
     */
    animate() {
        let lastAnimation = '';
        this.setManagedInterval(() => {
            this.handleMovement();
            this.handleJumpInput();
            this.applyGravity();
            this.updateCamera();
        }, 1000 / 60);

        this.setManagedInterval(() => {
            lastAnimation = this.updateAnimation(lastAnimation);
        }, 100);
    }

    /** Handle horizontal movement and step sounds. */
    handleMovement() {
        if (this.isDead()) {
            this.world.sounds.stopSteps();
            return;
        }
        this.updateStepSound(this.moveHorizontally());
    }

    /** @returns {boolean} True when Pepe moved horizontally. */
    moveHorizontally() {
        if (this.isHorizontalBlocked()) {
            return false;
        }
        return this.moveLeftIfPressed() || this.moveRightIfPressed();
    }

    /** @returns {boolean} True when both horizontal directions are pressed. */
    isHorizontalBlocked() {
        return this.world.keyboard.LEFT && this.world.keyboard.RIGHT;
    }

    /** @returns {boolean} True when Pepe moved left. */
    moveLeftIfPressed() {
        if (!this.world.keyboard.LEFT || this.x <= -500) {
            return false;
        }
        this.x -= this.speed;
        this.otherDirection = true;
        this.lastMoveTime = Date.now();
        return true;
    }

    /** @returns {boolean} True when Pepe moved right. */
    moveRightIfPressed() {
        if (!this.world.keyboard.RIGHT || this.x >= this.world.level.level_end_x) {
            return false;
        }
        this.x += this.speed;
        this.otherDirection = false;
        this.lastMoveTime = Date.now();
        return true;
    }

    /** @param {boolean} isMoving - Whether Pepe moved horizontally this frame. */
    updateStepSound(isMoving) {
        if (isMoving && !this.isJumping) {
            this.world.sounds.playSteps();
            return;
        }
        this.world.sounds.stopSteps();
    }

    /** Handle jump input. */
    handleJumpInput() {
        if (this.isDead()) {
            return;
        }
        if (this.world.keyboard.UP_PRESSED) {
            this.jump();
            this.world.keyboard.UP_PRESSED = false;
        }
    }

    /** Make the character jump. */
    jump() {
        if (!this.isJumping) {
            this.speedY = -this.jumpSpeed;
            this.isJumping = true;
            this.lastMoveTime = Date.now();
        }
    }

    /** Apply gravity and landing behavior. */
    applyGravity() {
        if (this.isDead()) {
            this.fallAfterDeath();
            return;
        }
        if (!this.isJumping) {
            return;
        }
        this.y += this.speedY;
        this.speedY += this.getGravityAcceleration(); 
        this.updateStartFallKeyboard();
        this.landOnGround();
    }

    /** Stop jumping when Pepe reaches the ground. */
    landOnGround() {
        if (this.y < this.groundY) {
            return;
        }
        const wasStartFall = !this.hasLandedOnce;
        this.resetJumpState();
        if (wasStartFall) {
            this.world.keyboard.unblock();
        }
    }

    /** Reset Pepe to a grounded jump state. */
    resetJumpState() {
        this.y = this.groundY;
        this.isJumping = false;
        this.speedY = 0;
        this.hasLandedOnce = true;
    }

    /** @returns {number} The current gravity acceleration. */
    getGravityAcceleration() {
        return this.hasLandedOnce ? this.acceleration : this.startFallAcceleration;
    }

    /** Block controls while Pepe falls into the level at game start. */
    updateStartFallKeyboard() {
        if (!this.hasLandedOnce) {
            this.world.keyboard.block();
        }
    }

    /** Update the camera position based on Pepe's x-position. */
    updateCamera() {
        const cam = -this.x + 230;
        this.world.camera_x_float = cam;
        const roundedCam = Math.round(cam);
        if (this.world.camera_x !== roundedCam) {
            this.world.camera_x = roundedCam;
        }
    }

    /** Apply acceleration to the character for gravity effect. */
    applyacceleration() {
        this.setManagedInterval(() => {
            if (this.y < this.groundY) {
                this.speedY += this.acceleration;
                this.y += this.speedY;
            }
        }, 1000 / 45);
    }

    /** Damage the character and wake him from long idle. */
    hit() {
        super.hit();
        this.lastMoveTime = Date.now();
    }

    /**
     * Update the character's animation based on its state (jumping, walking, idle, long idle) and return the current animation state.
     * @param {string} lastAnimation - The last animation state of the character
     * @returns {string} The current animation state of the character
     */
    updateAnimation(lastAnimation) {
        if (this.isDead()) {
            this.playDeathAnimation(lastAnimation);
            return 'dead';
        }
        if (this.isHurt()) {
            return this.playHurtAnimation(lastAnimation);
        }
        return this.updateActiveAnimation(lastAnimation);
    }

    /**
     * Play the character's death animation exactly once.
     */
    playDeathAnimation(lastAnimation) {
        if (lastAnimation !== 'dead' && !this.deathAnimationStarted) {
            this.currentImage = 0;
            this.deathAnimationStarted = true;
        }
        if (!this.deathAnimationFinished) {
            this.playDeathAnimationOnce();
        }
    }

    /**
     * Show the death animation one time and keep the last frame visible afterwards.
     */
    playDeathAnimationOnce() {
        const index = Math.min(this.currentImage, this.IMAGES_DEAD.length - 1);
        const path = this.IMAGES_DEAD[index];
        this.img = this.imageCache[path];
        this.currentImage++;
        this.deathAnimationFinished = this.currentImage >= this.IMAGES_DEAD.length;
    }

    /**
     * Let the dead character fall down and out of the canvas without affecting the camera.
     */
    fallAfterDeath() {
        this.isJumping = false;
        this.speedY = 0;
        this.y += this.deathFallSpeed;
        this.deathFallSpeed += this.deathFallAcceleration;
    }

    /**
     * Play one hurt animation after the character receives damage.
     * @param {string} lastAnimation - The previous animation state
     * @returns {string} The current animation state
     */
    playHurtAnimation(lastAnimation) {
        if (lastAnimation !== 'hurt') {
            this.currentImage = 0;
        }
        this.playAnimation(this.IMAGES_HURT);
        this.hurt = this.currentImage < this.IMAGES_HURT.length;
        return 'hurt';
    }

    /**
     * Update the character's active animation based on its current state (jumping, walking, idle, long idle) and return the current animation state.
     * @param {string} lastAnimation - The last animation state of the character
     * @returns {string} The current animation state of the character
     */
    updateActiveAnimation(lastAnimation) {
        if (this.isAboveGround() || this.isJumping) {
            return this.playJumpingAnimation(lastAnimation);
        }
        if (this.isWalking()) {
            return this.playWalkingAnimation(lastAnimation);
        }
        if (Date.now() - this.lastMoveTime > 7000) {
            return this.playLongIdleAnimation(lastAnimation);
        }
        return this.playIdleAnimation(lastAnimation);
    }

    /**
     * Check if the character is currently walking by checking the keyboard input for left and right movement.
     * @returns {boolean} True if the character is walking, false otherwise.
     */
    isWalking() {
        const keyboard = this.world.keyboard;
        return keyboard.RIGHT !== keyboard.LEFT;
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
