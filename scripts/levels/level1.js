const level1 = new Level(
    [
        new Chicken(), 
        new Chicken(), 
        new Chicken()
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
       
    ]
);