/**
 * Represents a collectible and throwable salsa bottle.
 */
class Salsa extends MoveableObject {
    width = 60;
    height = 60;
    y = 412;
    collectionOffset = { top: 5, right: 29, bottom: 5, left: 29 };
    isThrown = false;
    splashing = false;
    sounds;
    throwInterval;
    animationInterval;
    IMAGES_SALSA_ROTATION = [
        "assets/graphics/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
    ];
    IMAGES_SALSA_SPLASH = [
        "assets/graphics/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
        "assets/graphics/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
    ];

    /**
     * Create the salsa bottle and preload images.
     * @param {number} x - The x-position of the salsa bottle.
     * @param {string} imgPath - The image path for the salsa bottle.
     */
    constructor(imgPath, x) {
        super().loadImage(imgPath);
        this.x = x;
        this.loadImages(this.IMAGES_SALSA_ROTATION);
        this.loadImages(this.IMAGES_SALSA_SPLASH);
    }

    /**
     * Throw the salsa bottle in the given direction.
     * @param {number} direction - 1 throws right, -1 throws left
     */
    throw(direction) {
        this.isThrown = true;
        this.speedY = -15;
        this.speedX = direction * 3;
        this.currentImage = 0;
        this.startThrowMovement();
        this.startRotationAnimation();
    }

    /**
     * Move the thrown bottle in an arc until it hits the ground.
     */
    startThrowMovement() {
        this.throwInterval = this.setManagedInterval(() => {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY += this.acceleration;
            if (this.y >= 410) {
                this.splash();
            }
        }, 1000 / 60);
    }

    /**
     * Rotate the bottle while it flies.
     */
    startRotationAnimation() {
        this.animationInterval = this.setManagedInterval(() => {
            if (!this.splashing) {
                this.playAnimation(this.IMAGES_SALSA_ROTATION);
            }
        }, 80);
    }

    /**
     * Play the splash animation and hide the bottle afterwards.
     */
    splash() {
        if (this.splashing) {
            return;
        }
        this.splashing = true;
        this.speedX = 0;
        this.clearManagedInterval(this.throwInterval);
        this.clearManagedInterval(this.animationInterval);
        this.sounds?.playSplash();
        this.playSplashAnimation();
    }

    /**
     * Animate the bottle splash once.
     */
    playSplashAnimation() {
        this.currentImage = 0;
        const interval = this.setManagedInterval(() => {
            this.playAnimation(this.IMAGES_SALSA_SPLASH);
            if (this.currentImage >= this.IMAGES_SALSA_SPLASH.length) {
                this.visible = false;
                this.clearManagedInterval(interval);
            }
        }, 80);
    }

    /**
     * Fade the salsa bottles out over two seconds.
     */
    fadeOut() {
        const interval = this.setManagedInterval(() => {
            this.reduceOpacity(interval);
        }, 0.001);
    }

    /**
     * Lower opacity and hide the salsa bottles once fully transparent.
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
