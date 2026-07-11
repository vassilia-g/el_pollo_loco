/**
 * Level 1 loading background, clouds, chickens and endboss.
 * The level is created by instantiating the Level class with the respective objects.
 */
function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createBackground(),
        createCoins(),
        createSalsaBottles()
    );
}

/**
 * Create all enemies for level 1.
 * @returns {MoveableObject[]} Enemies and endboss
 */
function createEnemies() {
    return [
        new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new ChickenSmall(), new ChickenSmall(), new ChickenSmall(), new ChickenSmall(),
        new Endboss()
    ];
}

/**
 * Create all clouds for level 1.
 * @returns {Cloud[]} Clouds
 */
function createClouds() {
    return [-500, -100, 400, 900, 1400, 1900, 2400, 2900, 3400].map(x => new Cloud(x));
}

/**
 * Create the parallax background for level 1.
 * @returns {BackgroundObject[]} Background objects
 */
function createBackground() {
    return [-960, 0, 960, 1920, 2880].flatMap((x, index) => createBackgroundSet(x, index % 2 === 0));
}

/**
 * Create one background set at an x-position.
 * @param {number} x - Background x-position
 * @param {boolean} evenSet - Whether to use the second layer variant
 * @returns {BackgroundObject[]} Background objects
 */
function createBackgroundSet(x, evenSet) {
    const variant = evenSet ? "2" : "1";
    return [
        new BackgroundObject("assets/graphics/5_background/layers/air.png", x),
        new BackgroundObject(`assets/graphics/5_background/layers/3_third_layer/${variant}.png`, x),
        new BackgroundObject(`assets/graphics/5_background/layers/2_second_layer/${variant}.png`, x),
        new BackgroundObject(`assets/graphics/5_background/layers/1_first_layer/${variant}.png`, x)
    ];
}

/**
 * Create all coins for level 1.
 * @returns {Coins[]} Coins
 */
function createCoins() {
    return [450, 600, 1000, 1200, 1500].map(x => new Coins(x));
}

/**
 * Create all salsa bottles for level 1.
 * @returns {Salsa[]} Salsa bottles
 */
function createSalsaBottles() {
    return getSalsaBottlePositions().map(([image, x]) => new Salsa(image, x));
}

/**
 * Return salsa bottle image and x-position pairs.
 * @returns {Array} Salsa bottle configuration
 */
function getSalsaBottlePositions() {
    const bottle1 = "assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png";
    const bottle2 = "assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png";
    return [
        [bottle1, -500], [bottle2, -450], [bottle1, -200], [bottle2, -100],
        [bottle1, 400], [bottle2, 500], [bottle1, 700], [bottle2, 750],
        [bottle1, 1000], [bottle2, 1150], [bottle2, 1450], [bottle1, 1700],
        [bottle2, 1980], [bottle1, 2100]
    ];
}
