class Coins extends MoveableObject {
    height = 100;
    width = 100;
    y = 375;
    IMAGES_COINS = [
        "assets/graphics/8_coin/coin_1.png",
        "assets/graphics/8_coin/coin_2.png"
    ];

    /**
     * Create the coins and preload images.
     * @param {number} x - The x-position of the coin.
     */
    constructor(x) {
        super().loadImage("assets/graphics/8_coin/coin_1.png");
        this.x = x;
        this.loadImages(this.IMAGES_COINS);
        this.animate();
    }

    /**
     * Animate the coins by changing images at a set interval.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
        }, 400);
    }

    /**
     * Fade the coins out over two seconds.
     */
    fadeOut() {
        const interval = setInterval(() => {
            this.reduceOpacity(interval);
        }, 20);
    }

    /**
     * Lower opacity and hide the coins once fully transparent.
     * @param {number} interval - Fade interval identifier
     */
    reduceOpacity(interval) {
        this.opacity = Math.max(0, this.opacity - 0.025);
        if (this.opacity === 0) {
            this.visible = false;
            clearInterval(interval);
        }
    }
}