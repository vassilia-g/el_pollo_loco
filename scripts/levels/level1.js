/**
 * Level 1 loading background, clouds, chickens and endboss.
 * The level is created by instantiating the Level class with the respective objects.
 */
const level1 = new Level(
    [
        new Chicken(), 
        new Chicken(), 
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new Endboss()
    ],
    [
        new Cloud()
    ],
    [
        new BackgroundObject("assets/graphics/5_background/layers/air.png", -960),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/2.png", -960),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/2.png", -960),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/2.png", -960),

        new BackgroundObject("assets/graphics/5_background/layers/air.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/1.png", 0),

        new BackgroundObject("assets/graphics/5_background/layers/air.png", 960),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/2.png", 960),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/2.png", 960),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/2.png", 960),

        new BackgroundObject("assets/graphics/5_background/layers/air.png", 1920),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/1.png", 1920),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/1.png", 1920),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/1.png", 1920),

        new BackgroundObject("assets/graphics/5_background/layers/air.png", 2880),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/2.png", 2880),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/2.png", 2880),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/2.png", 2880),
    ],
    [
        new Coins(300),   // Coin at x=300
        new Coins(450),   // Coin at x=450
        new Coins(600),   // Coin at x=600
        new Coins(850),   // Coin at x=850
        new Coins(1000),  // Coin at x=1000
        new Coins(1200),  // Coin at x=1200
        new Coins(1500)   // Coin at x=1500

    ],
    []  // Empty array for salsa
);