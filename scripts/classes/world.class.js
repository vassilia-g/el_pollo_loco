class World {
    cloud = [new Cloud()];
    character = new Character();
    chicken = [new Chicken(), new Chicken(), new Chicken()];
    background = [
        new BackgroundObject("assets/graphics/5_background/layers/air.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/3_third_layer/1.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/2_second_layer/1.png", 0),
        new BackgroundObject("assets/graphics/5_background/layers/1_first_layer/1.png", 0)
    ];

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
    
        this.addObjectsToMap(this.background);
        this.addToMap(this.character);
        this.addObjectsToMap(this.chicken);
        this.addObjectsToMap(this.cloud);
        requestAnimationFrame(() => this.draw());
    }

    addToMap(object) {
    this.ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }
}