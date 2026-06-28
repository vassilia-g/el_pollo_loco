const CANVAS = document.querySelector("canvas");
const MOBILE_JOYSTICK = document.getElementById("mobileJoystick");
const MOBILE_JOYSTICK_KNOB = document.getElementById("mobileJoystickKnob");
const MOBILE_THROW_BUTTON = document.getElementById("mobileThrowButton");
let world;
let gameScreens;
let KEYBOARD = new Keyboard();

CANVAS.width = 960;
CANVAS.height = 540;

/**
 * Initialize the start screen.
 */
function init() {
    gameScreens = new GameScreens(CANVAS);
    gameScreens.drawStartScreen();
    CANVAS.addEventListener("click", startGameOnPlayClick);
    CANVAS.addEventListener("mousemove", updatePlayButtonHover);
    CANVAS.addEventListener("mouseleave", clearPlayButtonHover);
    bindMobileControls();
}

/**
 * Start the game when the play button is clicked.
 * @param {MouseEvent} event - The click event
 */
function startGameOnPlayClick(event) {
    if (!gameScreens.isPlayButtonClicked(event)) {
        return;
    }
    CANVAS.removeEventListener("click", startGameOnPlayClick);
    CANVAS.removeEventListener("mousemove", updatePlayButtonHover);
    CANVAS.removeEventListener("mouseleave", clearPlayButtonHover);
    CANVAS.style.cursor = "default";
    startGame();
    CANVAS.addEventListener("click", restartGameOnClick);
    CANVAS.addEventListener("click", goHomeOnClick);
    CANVAS.addEventListener("mousemove", updateRestartButtonHover);
    CANVAS.addEventListener("mousemove", updateHomeButtonHover);
    CANVAS.addEventListener("mouseleave", clearRestartButtonHover);
    CANVAS.addEventListener("mouseleave", clearHomeButtonHover);
}

/**
 * Start a fresh game world.
 */
function startGame() {
    KEYBOARD = new Keyboard();
    world = new World(CANVAS, KEYBOARD, gameScreens);
}

/**
 * Update the play button hover state.
 * @param {MouseEvent} event - The mouse move event
 */
function updatePlayButtonHover(event) {
    gameScreens.updatePlayButtonHover(event);
}

/**
 * Clear the play button hover state when the cursor leaves the canvas.
 */
function clearPlayButtonHover() {
    gameScreens.clearPlayButtonHover();
}

/**
 * Restart the game from the game over screen without reloading the page.
 * @param {MouseEvent} event - The click event
 */
function restartGameOnClick(event) {
    if (!world || !world.gameLost || !gameScreens.isRestartButtonClicked(event)) {
        return;
    }
    world.destroy();
    gameScreens.clearRestartButtonHover(world.ctx);
    startGame();
}

/**
 * Reload the page from the win screen to return home.
 * @param {MouseEvent} event - The click event
 */
function goHomeOnClick(event) {
    if (!world || !world.gameWon || !gameScreens.isHomeButtonClicked(event)) {
        return;
    }
    location.reload();
}

/**
 * Update the restart button hover state on the game over screen.
 * @param {MouseEvent} event - The mouse move event
 */
function updateRestartButtonHover(event) {
    if (!world || !world.gameLost) {
        return;
    }
    gameScreens.updateRestartButtonHover(event, world.ctx);
}

/**
 * Update the home button hover state on the win screen.
 * @param {MouseEvent} event - The mouse move event
 */
function updateHomeButtonHover(event) {
    if (!world || !world.gameWon) {
        return;
    }
    gameScreens.updateHomeButtonHover(event, world.ctx);
}

/**
 * Clear the restart button hover state when the cursor leaves the canvas.
 */
function clearRestartButtonHover() {
    if (!world || !world.gameLost) {
        return;
    }
    gameScreens.clearRestartButtonHover(world.ctx);
}

/**
 * Clear the home button hover state when the cursor leaves the canvas.
 */
function clearHomeButtonHover() {
    if (!world || !world.gameWon) {
        return;
    }
    gameScreens.clearHomeButtonHover(world.ctx);
}

/**
 * Connect mobile touch controls to the same flags used by keyboard input.
 */
function bindMobileControls() {
    bindMobileJoystick();
    bindMobileThrowButton();
}

/**
 * Bind the virtual joystick for left, right and jump controls.
 */
function bindMobileJoystick() {
    MOBILE_JOYSTICK.addEventListener("pointerdown", startMobileJoystick);
    MOBILE_JOYSTICK.addEventListener("pointermove", moveMobileJoystick);
    MOBILE_JOYSTICK.addEventListener("pointerup", resetMobileJoystick);
    MOBILE_JOYSTICK.addEventListener("pointercancel", resetMobileJoystick);
}

/**
 * Bind the mobile throw button to the space action.
 */
function bindMobileThrowButton() {
    MOBILE_THROW_BUTTON.addEventListener("pointerdown", startMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("pointerup", stopMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("pointercancel", stopMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("pointerleave", stopMobileThrow);
}

/**
 * Start tracking the virtual joystick.
 * @param {PointerEvent} event - The pointer event
 */
function startMobileJoystick(event) {
    MOBILE_JOYSTICK.setPointerCapture(event.pointerId);
    moveMobileJoystick(event);
}

/**
 * Update keyboard flags from the current joystick pointer position.
 * @param {PointerEvent} event - The pointer event
 */
function moveMobileJoystick(event) {
    event.preventDefault();
    if (KEYBOARD.blocked) {
        return;
    }
    const rect = MOBILE_JOYSTICK.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDistance = rect.width / 2 - 21;
    const x = Math.max(-maxDistance, Math.min(event.clientX - centerX, maxDistance));
    const y = Math.max(-maxDistance, Math.min(event.clientY - centerY, maxDistance));

    updateJoystickKnob(x, y);
    updateJoystickKeyboard(x, y);
}

/**
 * Move the visible joystick knob.
 * @param {number} x - Horizontal knob offset
 * @param {number} y - Vertical knob offset
 */
function updateJoystickKnob(x, y) {
    MOBILE_JOYSTICK_KNOB.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

/**
 * Convert joystick offsets to keyboard flags.
 * @param {number} x - Horizontal joystick offset
 * @param {number} y - Vertical joystick offset
 */
function updateJoystickKeyboard(x, y) {
    const threshold = 18;
    KEYBOARD.LEFT = x < -threshold;
    KEYBOARD.RIGHT = x > threshold;
    if (y < -threshold && !KEYBOARD.UP) {
        KEYBOARD.UP_PRESSED = true;
    }
    KEYBOARD.UP = y < -threshold;
}

/**
 * Reset joystick state when the user releases it.
 */
function resetMobileJoystick() {
    updateJoystickKnob(0, 0);
    KEYBOARD.LEFT = false;
    KEYBOARD.RIGHT = false;
    KEYBOARD.UP = false;
    KEYBOARD.UP_PRESSED = false;
}

/**
 * Trigger salsa throwing from the mobile action button.
 * @param {PointerEvent} event - The pointer event
 */
function startMobileThrow(event) {
    event.preventDefault();
    if (KEYBOARD.blocked) {
        return;
    }
    if (!KEYBOARD.SPACE) {
        KEYBOARD.SPACE_PRESSED = true;
    }
    KEYBOARD.SPACE = true;
}

/**
 * Stop the mobile throw button hold state.
 */
function stopMobileThrow() {
    KEYBOARD.SPACE = false;
    KEYBOARD.SPACE_PRESSED = false;
}

/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
window.addEventListener("keydown", (event) => {
     if (KEYBOARD.blocked) {
        return;
    }
    if (event.keyCode == 39 || event.keyCode == 68) {
        KEYBOARD.RIGHT = true;
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
        KEYBOARD.LEFT = true;
    }
    if (event.keyCode == 38 || event.keyCode == 87) {
        if (!KEYBOARD.UP) {
            KEYBOARD.UP_PRESSED = true;
        }
        KEYBOARD.UP = true;
    }
    if (event.keyCode == 40 || event.keyCode == 83) {
        KEYBOARD.DOWN = true;
    }
    if (event.keyCode == 32) {
        if (!KEYBOARD.SPACE) {
            KEYBOARD.SPACE_PRESSED = true;
        }
        KEYBOARD.SPACE = true;
    }
});

/**
 * This class represents the main character of the game. It contains all methods and attributes that are needed for the character.
 */
window.addEventListener("keyup", (event) => {
     if (KEYBOARD.blocked) {
        return;
    }
    if (event.keyCode == 39 || event.keyCode == 68) {
        KEYBOARD.RIGHT = false;
    }
    if (event.keyCode == 37 || event.keyCode == 65) {
        KEYBOARD.LEFT = false;
    }
    if (event.keyCode == 38 || event.keyCode == 87) {
        KEYBOARD.UP = false;
        KEYBOARD.UP_PRESSED = false;
    }
    if (event.keyCode == 40 || event.keyCode == 83) {
        KEYBOARD.DOWN = false;
    }
    if (event.keyCode == 32) {
        KEYBOARD.SPACE = false;
        KEYBOARD.SPACE_PRESSED = false;
    }
});
