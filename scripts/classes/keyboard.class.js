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

    /**
     * Initializes the Keyboard class by setting up event listeners for keydown and keyup events.
     */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.UP = false;
        this.UP_PRESSED = false;
        this.DOWN = false;
        this.SPACE = false;
        this.SPACE_PRESSED = false;
    }

    /**
     * Blocks the keyboard input and resets the key states.
     */
    block() {
        this.blocked = true;
        this.reset();
    }

    /**
     * Unblocks the keyboard input and resets the key states.
     */
    unblock() {
        this.blocked = false;
        this.reset();
    }
}
