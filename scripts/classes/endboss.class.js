/**
 * Class for the endboss character.
 */
class Endboss extends MoveableObject {
    animationState = "walking";
    activeAnimation = "";
    target;
    attackFrames = 0;
    walkingFrames = 0;
    recoveryFrames = 0;
    gameEnded = false;
    deathAnimationFinished = false;
    deathFrameChangedAt = 0;
    deathFrameDelay = 150;
    arenaMinX = 0;
    arenaMaxX = 2650;
    collisionOffset = { top: 10, right: 20, bottom: 10, left: 20 };
    IMAGES_WALKING = [
        "assets/graphics/4_enemie_boss_chicken/1_walk/G1.png",
        "assets/graphics/4_enemie_boss_chicken/1_walk/G2.png",
        "assets/graphics/4_enemie_boss_chicken/1_walk/G3.png",
        "assets/graphics/4_enemie_boss_chicken/1_walk/G4.png"
    ];
    IMAGES_ALERT = [
        "assets/graphics/4_enemie_boss_chicken/2_alert/G5.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G6.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G7.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G8.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G9.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G10.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G11.png",
        "assets/graphics/4_enemie_boss_chicken/2_alert/G12.png"
    ];
    IMAGES_ATTACK = [
        "assets/graphics/4_enemie_boss_chicken/3_attack/G13.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G14.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G15.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G16.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G17.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G18.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G19.png",
        "assets/graphics/4_enemie_boss_chicken/3_attack/G20.png"
    ];
    IMAGES_HURT = [
        "assets/graphics/4_enemie_boss_chicken/4_hurt/G21.png",
        "assets/graphics/4_enemie_boss_chicken/4_hurt/G22.png",
        "assets/graphics/4_enemie_boss_chicken/4_hurt/G23.png"
    ];
    IMAGES_DEAD = [
        "assets/graphics/4_enemie_boss_chicken/5_dead/G24.png",
        "assets/graphics/4_enemie_boss_chicken/5_dead/G25.png",
        "assets/graphics/4_enemie_boss_chicken/5_dead/G26.png"
    ];

    /**
     * Create the endboss and preload walk images.
     */
    constructor() {
        super().loadImage(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.speed = 0.15;
        this.x = 2550;
        this.y = 150;
        this.width = 250;
        this.height = 350;
        this.animate();
    }

    /**
     * Animate the endboss by changing the image every 150ms
     */
    animate() {
        this.moveWithinArena();
        this.setManagedInterval(() => {
            this.updateAnimation();
        }, 150);      
    }

    /**
     * Start the endboss encounter with the alert animation.
     * @param {Character} target - Character targeted by the endboss
     */
    startAlert(target) {
        if (this.animationState === "walking") {
            this.target = target;
            this.animationState = "alert";
            this.speed = 0;
            this.currentImage = 0;
            this.activeAnimation = "alert";
        }
    }

    /**
     * Update the boss animation based on its current state.
     */
    updateAnimation() {
        if (this.gameEnded) {
            return;
        }
        if (this.isDead()) {
            this.playDeathAnimationOnce();
            return;
        }
        if (this.playHurtIfNeeded()) {
            return;
        }
        this.playActiveAnimation();
    }

    /** Play the current non-hurt, non-dead animation. */
    playActiveAnimation() {
        if (this.animationState === "alert") {
            this.playAlertAnimation();
            return;
        }
        if (this.animationState === "attack") {
            this.playAttackAnimation();
            return;
        }
        if (this.animationState === "recover") {
            this.playRecoveryAnimation();
            return;
        }
        this.playWalkingAnimation();
    }

    /** @returns {boolean} True when the hurt animation was used. */
    playHurtIfNeeded() {
        if (!this.isHurt()) {
            return false;
        }
        this.playStateAnimation(this.IMAGES_HURT, "hurt");
        this.hurt = this.currentImage < this.IMAGES_HURT.length;
        return true;
    }

    /**
     * Play the alert animation once and then start pursuing the character.
     */
    playAlertAnimation() {
        this.playStateAnimation(this.IMAGES_ALERT, "alert");
        if (this.currentImage >= this.IMAGES_ALERT.length) {
            this.startWalking();
        }
    }

    /**
     * Start pursuing the character with the walking animation.
     */
    startWalking() {
        this.animationState = "walking";
        this.walkingFrames = 0;
        this.currentImage = 0;
        this.activeAnimation = "walking";
        this.updateWalkingDirection();
    }

    /**
     * Walk toward the character and attack once the collision range is reached.
     */
    playWalkingAnimation() {
        this.playStateAnimation(this.IMAGES_WALKING, "walking");
        if (!this.target) {
            return;
        }
        this.updateWalkingDirection();
        this.walkingFrames++;
        if (this.isTargetInAttackRange() || this.walkingFrames >= this.getAttackInterval()) {
            this.startAttack();
        }
    }

    /**
     * Update movement speed and sprite direction toward the character.
     */
    updateWalkingDirection() {
        if (!this.target) {
            return;
        }
        const targetCenter = this.target.x + this.target.width / 2;
        const bossCenter = this.x + this.width / 2;
        const movesLeft = targetCenter < bossCenter;
        this.speed = movesLeft ? this.getWalkingSpeed() : -this.getWalkingSpeed();
        this.otherDirection = !movesLeft;
    }

    /**
     * Check whether the boss is close enough to hit the character.
     * @returns {boolean} Whether the character is inside attack range
     */
    isTargetInAttackRange() {
        return this.target.isColliding(this);
    }

    /**
     * Stop walking and start the attack animation.
     */
    startAttack() {
        this.speed = 0;
        this.animationState = "attack";
        this.attackFrames = 0;
        this.currentImage = 0;
        this.activeAnimation = "attack";
    }

    /**
     * Play one complete attack animation and then enter recovery.
     */
    playAttackAnimation() {
        this.playStateAnimation(this.IMAGES_ATTACK, "attack");
        this.attackFrames++;
        if (this.attackFrames >= this.IMAGES_ATTACK.length) {
            this.startRecovery();
        }
    }

    /**
     * Stop movement briefly before pursuing the character again.
     */
    startRecovery() {
        this.speed = 0;
        this.animationState = "recover";
        this.recoveryFrames = 0;
        this.currentImage = 0;
        this.activeAnimation = "recover";
    }

    /**
     * Hold a standing frame briefly and then resume walking.
     */
    playRecoveryAnimation() {
        this.img = this.imageCache[this.IMAGES_WALKING[0]];
        this.recoveryFrames++;
        if (this.recoveryFrames >= this.getRecoveryDuration()) {
            this.startWalking();
        }
    }

    /**
     * Move the boss according to its signed speed without leaving the level.
     */
    moveWithinArena() {
        this.setManagedInterval(() => {
            this.x = Math.max(this.arenaMinX, Math.min(this.x - this.speed, this.arenaMaxX));
        }, 1000 / 60);
    }

    /**
     * Return a faster walking speed during the final part of the fight.
     * @returns {number} Walking speed in pixels per movement tick
     */
    getWalkingSpeed() {
        return this.health <= 40 ? 3 : 2;
    }

    /**
     * Return a shorter recovery duration while the boss has low health.
     * @returns {number} Recovery duration in animation frames
     */
    getRecoveryDuration() {
        return this.health <= 40 ? 2 : 4;
    }

    /**
     * Return how many walking frames pass before the next attack.
     * @returns {number} Walking frames between attacks
     */
    getAttackInterval() {
        return this.health <= 40 ? 8 : 12;
    }

    /**
     * Play an animation and reset the frame counter when the animation changes.
     * @param {string[]} images - Animation frames
     * @param {string} state - Current animation state name
     */
    playStateAnimation(images, state) {
        if (this.activeAnimation !== state) {
            this.currentImage = 0;
            this.activeAnimation = state;
        }
        this.playAnimation(images);
    }

    /**
     * Play the death animation once and hold its final frame.
     */
    playDeathAnimationOnce() {
        const now = Date.now();
        if (this.deathAnimationFinished || now - this.deathFrameChangedAt < this.deathFrameDelay) {
            return;
        }
        const index = this.currentImage;
        const path = this.IMAGES_DEAD[index];
        this.img = this.imageCache[path];
        this.deathFrameChangedAt = now;
        if (this.currentImage < this.IMAGES_DEAD.length - 1) {
            this.currentImage++;
            return;
        }
        this.deathAnimationFinished = true;
    }

    /**
     * Check whether the boss death animation has completed.
     * @returns {boolean} Whether the final death frame is visible
     */
    isDeathAnimationFinished() {
        return this.isDead() && this.deathAnimationFinished && this.opacity === 0;
    }

    /**
     * Damage the endboss and restart the hurt animation.
     */
    hit() {
        super.hit();
        this.currentImage = 0;
        if (this.isDead()) {
            this.speed = 0;
            this.otherDirection = false;
            this.animationState = "dead";
            this.activeAnimation = "dead";
            this.deathFrameChangedAt = 0;
            this.fadeOut();
            return;
        }
        this.startRecovery();
    }

    /**
     * Freeze the defeated boss after a win and keep him active after a loss.
     * @param {boolean} gameWon - Whether the boss was defeated
     */
    stopAtGameEnd(gameWon) {
        if (!gameWon) {
            this.resumeWalkingAfterLoss();
            return;
        }
        this.speed = 0;
        this.gameEnded = true;
        const lastDeadImage = this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1];
        this.img = this.imageCache[lastDeadImage];
        this.animationState = "dead";
        this.activeAnimation = "dead";
    }

    /**
     * Leave combat mode and resume the original slow walk to the left.
     */
    resumeWalkingAfterLoss() {
        this.target = undefined;
        this.animationState = "walking";
        this.activeAnimation = "walking";
        this.attackFrames = 0;
        this.walkingFrames = 0;
        this.recoveryFrames = 0;
        this.currentImage = 0;
        this.otherDirection = false;
        this.speed = 0.15;
    }

    /**
     * Fade the dead endboss out slowly.
     */
    fadeOut() {
        const interval = this.setManagedInterval(() => {
            this.reduceOpacity(interval);
        }, 50);
    }

    /**
     * Lower opacity and hide the endboss once fully transparent.
     * @param {number} interval - Fade interval identifier
     */
    reduceOpacity(interval) {
        this.opacity = Math.max(0, this.opacity - 0.025);
        if (this.opacity === 0) {
            this.visible = false;
            this.clearManagedInterval(interval);
        }
    }
}
