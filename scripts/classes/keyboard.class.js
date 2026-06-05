/**
 * Class for handling keyboard input.
 */
class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    UP_PRESSED = false;
    DOWN = false;
    SPACE = false;
    SPACE_PRESSED = false;
    blocked = false;

    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.UP_PRESSED = false;
        this.DOWN = false;
        this.SPACE = false;
        this.SPACE_PRESSED = false;
    }

    block() {
        this.blocked = true;
        this.reset();
    }

    unblock() {
        this.blocked = false;
    }
}
