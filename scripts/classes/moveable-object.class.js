class MoveableObject {
    x = 100;
    y = 300;
    height = 150;
    width = 100;
    img;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log("Move right");
    }

    moveLeft() {
        console.log("Move left");
    }
}