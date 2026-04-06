class Cloud extends MoveableObject {
    height = 300;
    width = 400;
    
    constructor() {
        super().loadImage("assets/graphics/5_background/layers/4_clouds/1.png");
        this.x = 200 + Math.random() * 500;
        this.y = 50;
    }
}