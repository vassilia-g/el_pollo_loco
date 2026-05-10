class Salsa extends MoveableObject {
    width = 60;
    height = 60;
    y = 415;
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
    }
}