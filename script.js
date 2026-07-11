const CANVAS = document.querySelector("canvas");
const MOBILE_JOYSTICK = document.getElementById("mobileJoystick");
const MOBILE_JOYSTICK_KNOB = document.getElementById("mobileJoystickKnob");
const MOBILE_THROW_BUTTON = document.getElementById("mobileThrowButton");
const MUTE_STORAGE_KEY = "elPolloLocoMuted";
let world;
let gameScreens;
let canvasMuteButton;
let KEYBOARD = new Keyboard();
let isMuted = localStorage.getItem(MUTE_STORAGE_KEY) === "true";

CANVAS.width = 960; CANVAS.height = 540;

/**
 * Initialize the start screen.
 */
function init() {
    canvasMuteButton = new CanvasMuteButton(CANVAS);
    canvasMuteButton.onIconLoad = redrawVisibleScreen;
    gameScreens = new GameScreens(CANVAS, canvasMuteButton);
    gameScreens.drawStartScreen();
    CANVAS.addEventListener("click", toggleMuteOnCanvasClick);
    CANVAS.addEventListener("click", startGameOnPlayClick);
    CANVAS.addEventListener("mousemove", updateMuteButtonHover);
    CANVAS.addEventListener("mousemove", updatePlayButtonHover);
    CANVAS.addEventListener("mouseleave", clearMuteButtonHover);
    CANVAS.addEventListener("mouseleave", clearPlayButtonHover);
    bindMobileControls();
}

/**
 * Start the game when the play button is clicked.
 * @param {MouseEvent} event - The click event
 */
function startGameOnPlayClick(event) {
    if (gameScreens.handleInstructionsClick(event) || !gameScreens.isPlayButtonClicked(event)) {
        return;
    }
    unbindStartScreenEvents();
    startGame();
    bindEndScreenEvents();
}

function unbindStartScreenEvents() {
    CANVAS.removeEventListener("click", startGameOnPlayClick);
    CANVAS.removeEventListener("mousemove", updatePlayButtonHover);
    CANVAS.removeEventListener("mouseleave", clearPlayButtonHover);
    CANVAS.style.cursor = "default";
}

function bindEndScreenEvents() {
    CANVAS.addEventListener("click", restartGameOnClick);
    CANVAS.addEventListener("click", goHomeOnClick);
    CANVAS.addEventListener("mousemove", updateRestartButtonHover);
    CANVAS.addEventListener("mousemove", updateHomeButtonHover);
    CANVAS.addEventListener("mouseleave", clearRestartButtonHover);
    CANVAS.addEventListener("mouseleave", clearHomeButtonHover);
}

/** Start a fresh game world. */
function startGame() {
    KEYBOARD = new Keyboard();
    showMobileControls();
    world = new World(CANVAS, KEYBOARD, gameScreens, canvasMuteButton);
    applyMuteState();
}

function toggleMuteOnCanvasClick(event) {
    if (!canvasMuteButton.isClicked(event)) {
        return;
    }
    event.stopImmediatePropagation();
    toggleMute();
    redrawVisibleScreen();
}

function updateMuteButtonHover(event) {
    if (!canvasMuteButton.updateHover(event)) {
        return;
    }
    updateCanvasCursor();
    redrawVisibleScreen();
}

function clearMuteButtonHover() {
    if (!canvasMuteButton.clearHover()) {
        return;
    }
    updateCanvasCursor();
    redrawVisibleScreen();
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    if (world) {
        applyMuteState();
    }
}

/**
 * Apply the current mute state to all loaded game sounds.
 */
function applyMuteState() {
    if (!world) {
        return;
    }
    world.sounds.muted = isMuted;
    world.sounds.getAllSounds().forEach(sound => sound.muted = isMuted);
}

function redrawVisibleScreen() {
    if (!gameScreens) {
        return;
    }
    if (!world) {
        gameScreens.drawStartScreen();
    }
}

function updateCanvasCursor() {
    CANVAS.style.cursor = canvasMuteButton.isHovered ? "pointer" : "default";
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
    if (!isEndScreenVisible() || !gameScreens.isRestartButtonClicked(event)) {
        return;
    }
    world.sounds.stopEndSounds();
    world.destroy();
    gameScreens.clearRestartButtonHover(world.ctx);
    startGame();
}
/**
 * Reload the page from the win screen to return home.
 * @param {MouseEvent} event - The click event
 */
function goHomeOnClick(event) {
    if (!isEndScreenVisible() || !gameScreens.isHomeButtonClicked(event)) {
        return;
    }
    world.sounds.stopEndSounds();
    location.reload();
}

/**
 * Update the restart button hover state on the game over screen.
 * @param {MouseEvent} event - The mouse move event
 */
function updateRestartButtonHover(event) {
    if (!isEndScreenVisible()) {
        return;
    }
    gameScreens.updateRestartButtonHover(event, world.ctx);
}

/**
 * Update the home button hover state on the win screen.
 * @param {MouseEvent} event - The mouse move event
 */
function updateHomeButtonHover(event) {
    if (!isEndScreenVisible()) {
        return;
    }
    gameScreens.updateHomeButtonHover(event, world.ctx);
}

/**
 * Clear the restart button hover state when the cursor leaves the canvas.
 */
function clearRestartButtonHover() {
    if (!isEndScreenVisible()) {
        return;
    }
    gameScreens.clearRestartButtonHover(world.ctx);
}

/**
 * Clear the home button hover state when the cursor leaves the canvas.
 */
function clearHomeButtonHover() {
    if (!isEndScreenVisible()) {
        return;
    }
    gameScreens.clearHomeButtonHover(world.ctx);
}
function isEndScreenVisible() { return world && (world.gameLost || world.gameWon); }
/**
 * Show mobile controls while a game is running.
 */
function showMobileControls() {
    document.body.classList.add("game-started");
}

/**
 * Hide mobile controls outside of active gameplay.
 */
function hideMobileControls() {
    document.body.classList.remove("game-started");
    resetMobileJoystick();
    stopMobileThrow();
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
    MOBILE_JOYSTICK.addEventListener("contextmenu", preventButtonFocus);
}
/**
 * Bind the mobile throw button to the space action.
 */
function bindMobileThrowButton() {
    MOBILE_THROW_BUTTON.addEventListener("pointerdown", preventButtonFocus);
    MOBILE_THROW_BUTTON.addEventListener("pointerdown", startMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("pointerup", stopMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("pointercancel", stopMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("pointerleave", stopMobileThrow);
    MOBILE_THROW_BUTTON.addEventListener("contextmenu", preventButtonFocus);
}
/**
 * Prevent touch and mouse buttons from stealing keyboard focus.
 * @param {PointerEvent} event - The pointer event
 */
function preventButtonFocus(event) {
    event.preventDefault();
}

/** @param {PointerEvent} event - The pointer event. */
function startMobileJoystick(event) {
    MOBILE_JOYSTICK.setPointerCapture(event.pointerId);
    moveMobileJoystick(event);
}

/** @param {PointerEvent} event - The pointer event. */
function moveMobileJoystick(event) {
    event.preventDefault();
    if (KEYBOARD.blocked) {
        return;
    }
    updateJoystickFromEvent(event);
}

function updateJoystickFromEvent(event) {
    const offset = getJoystickOffset(event);
    updateJoystickKnob(offset.x, offset.y);
    updateJoystickKeyboard(offset.x, offset.y);
}

function getJoystickOffset(event) {
    const rect = MOBILE_JOYSTICK.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDistance = rect.width / 2 - 21;
    return {
        x: Math.max(-maxDistance, Math.min(event.clientX - centerX, maxDistance)),
        y: Math.max(-maxDistance, Math.min(event.clientY - centerY, maxDistance))
    };
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

/** @param {PointerEvent} event - The pointer event. */
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
            if (world && !world.character.isJumping) {
                world.sounds.playJump();
            }
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
