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
        new Cloud(-500),
        new Cloud(-100),
        new Cloud(400),
        new Cloud(900),
        new Cloud(1400),
        new Cloud(1900),
        new Cloud(2400),
        new Cloud(2900),
        new Cloud(3400)
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
        new Coins(300),   
        new Coins(450),
        new Coins(600),   
        new Coins(850),   
        new Coins(1000),  
        new Coins(1200),  
        new Coins(1500)   

    ],
    [
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", -500),
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", -450),
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", -200),
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", -100), 
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", 400),   // Salsa at x=400, 
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", 500),
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", 700),   // Salsa at x=400, 
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", 750),
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1000),   // Salsa at x=400, 
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1150),
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1450),
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", 1700),
        new Salsa("assets/graphics/6_salsa_bottle/2_salsa_bottle_on_ground.png", 1980),
        new Salsa("assets/graphics/6_salsa_bottle/1_salsa_bottle_on_ground.png", 2100), 
        
    ]  // Empty array for salsa
);