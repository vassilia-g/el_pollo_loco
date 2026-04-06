class Chicken extends MoveableObject {
    width = 80;
    height = 60;
    y = 410;
    constructor() {
        super().loadImage("assets/graphics/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
        this.x = 200 + Math.random() * 500;
    }
}