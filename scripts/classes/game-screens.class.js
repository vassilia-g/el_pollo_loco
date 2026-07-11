/**
 * Draws the start screen and end screens on the canvas.
 */
class GameScreens {
    startImage = new Image();
    winImage = new Image();
    gameOverImage = new Image();
    instructions;
    isPlayButtonHovered = false;
    isRestartButtonHovered = false;
    isHomeButtonHovered = false;
    playButton = {
        x: 450,
        y: 470,
        width: 90,
        height: 64
    };
    restartButton = {
        x: 275,
        y: 470,
        width: 200,
        height: 58
    };
    homeButton = {
        x: 535,
        y: 470,
        width: 150,
        height: 58
    };

    /**
     * Create the screen helper and preload screen images.
     * @param {HTMLCanvasElement} canvas - The game canvas
     * @param {CanvasMuteButton} muteButton - The canvas mute button
     */
    constructor(canvas, muteButton) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.muteButton = muteButton;
        this.instructions = new GameInstructions(canvas);
        this.loadImages();
    }

    /**
     * Preload artwork for start, win and game over screens.
     */
    loadImages() {
        this.startImage.src = "assets/graphics/9_intro_outro_screens/start/startscreen_1.png";
        this.winImage.src = "assets/graphics/You won, you lost/You Win A.png";
        this.gameOverImage.src = "assets/graphics/You won, you lost/Game Over.png";
    }

    /**
     * Draw the start screen with a play button.
     */
    drawStartScreen() {
        if (!this.startImage.complete) {
            this.startImage.onload = () => this.drawStartScreen();
            return;
        }
        this.ctx.drawImage(this.startImage, 0, 0, CANVAS.width, CANVAS.height);
        this.drawPlayButton();
        this.instructions.draw(this.ctx);
        this.drawMuteButton(this.ctx);
    }

    /**
     * Draw the play button on the start screen.
     */
    drawPlayButton() {
        const button = this.playButton;
        this.ctx.fillStyle = this.isPlayButtonHovered ? "#ffe066" : "#ffcc01";
        this.ctx.strokeStyle = this.isPlayButtonHovered ? "#ffffff" : "#8b2d12";
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(button.x, button.y, button.width, button.height);
        this.ctx.strokeRect(button.x, button.y, button.width, button.height);
        this.ctx.fillStyle = "#8b2d12";
        this.ctx.font = "42px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("\u25B6", button.x + button.width / 1.9, button.y + button.height / 1.7);
    }

    /**
     * Update the hover state of the play button and redraw when it changes.
     * @param {MouseEvent} event - The mouse move event
     */
    updatePlayButtonHover(event) {
        const isHovered = !this.instructions.visible && this.isPlayButtonClicked(event);
        const playHoverChanged = this.isPlayButtonHovered !== isHovered;
        const instructionsHoverChanged = this.instructions.updateHover(event);
        if (!playHoverChanged && !instructionsHoverChanged) {
            return;
        }
        this.isPlayButtonHovered = isHovered;
        this.updateCursor(isHovered || this.instructions.isHovered());
        this.drawStartScreen();
    }

    /**
     * Remove the play button hover state.
     */
    clearPlayButtonHover() {
        const instructionsHoverChanged = this.instructions.clearHover();
        if (!this.isPlayButtonHovered && !instructionsHoverChanged) {
            return;
        }
        this.isPlayButtonHovered = false;
        this.updateCursor(false);
        this.drawStartScreen();
    }

    /**
     * Handle a click on the start screen instructions UI.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the click was handled by the instructions UI
     */
    handleInstructionsClick(event) {
        if (!this.instructions.handleClick(event)) {
            return false;
        }
        this.isPlayButtonHovered = false;
        this.updateCursor(false);
        this.drawStartScreen();
        return true;
    }

    /**
     * Check whether a canvas click is inside the play button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the play button was clicked
     */
    isPlayButtonClicked(event) {
        const position = this.getCanvasClickPosition(event);
        return position.x >= this.playButton.x &&
               position.x <= this.playButton.x + this.playButton.width &&
               position.y >= this.playButton.y &&
               position.y <= this.playButton.y + this.playButton.height;
    }

    /**
     * Convert browser click coordinates to canvas coordinates.
     * @param {MouseEvent} event - The click event
     * @returns {{x: number, y: number}} Canvas click coordinates
     */
    getCanvasClickPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * (CANVAS.width / rect.width),
            y: (event.clientY - rect.top) * (CANVAS.height / rect.height)
        };
    }

    /**
     * Draw the matching end screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {boolean} gameWon - Whether the player won
     * @param {boolean} gameLost - Whether the player lost
     */
    drawEndScreen(ctx, gameWon, gameLost) {
        if (gameLost) {
            this.drawOverlay(ctx);
            ctx.drawImage(this.gameOverImage, (CANVAS.width - 600) / 2, (CANVAS.height - 400) / 2, 600, 400);
            this.drawEndButtons(ctx);
            this.drawMuteButton(ctx);
            return;
        }
        if (gameWon) {
            this.drawWinOverlay(ctx);
            ctx.drawImage(this.winImage, (CANVAS.width - 500) / 2, (CANVAS.height - 450) / 2, 500, 450);
            this.drawEndButtons(ctx);
            this.drawMuteButton(ctx);
        }
    }

    /**
     * Draw all buttons shown on end screens.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawEndButtons(ctx) {
        this.drawRestartButton(ctx);
        this.drawHomeButton(ctx);
    }

    /**
     * Draw the canvas mute button when one is available.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawMuteButton(ctx) {
        this.muteButton?.draw(ctx, isMuted);
    }

    /**
     * Draw a dark transparent overlay behind an end screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
        ctx.restore();
    }

    /**
     * Draw the restart button on the game over screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawRestartButton(ctx) {
        const button = this.restartButton;
        ctx.save();
        ctx.fillStyle = this.isRestartButtonHovered ? "#ffe066" : "#ffcc01";
        ctx.strokeStyle = this.isRestartButtonHovered ? "#ffffff" : "#8b2d12";
        ctx.lineWidth = 3;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = "#8b2d12";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("RESTART", button.x + button.width / 2, button.y + button.height / 2);
        ctx.restore();
    }

    /**
     * Update the hover state of the restart button and redraw when it changes.
     * @param {MouseEvent} event - The mouse move event
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    updateRestartButtonHover(event, ctx) {
        const isHovered = this.isRestartButtonClicked(event);
        if (this.isRestartButtonHovered === isHovered) {
            return;
        }
        this.isRestartButtonHovered = isHovered;
        this.updateCursor(isHovered);
        this.redrawCurrentEndScreen(ctx);
    }

    /**
     * Remove the restart button hover state.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    clearRestartButtonHover(ctx) {
        if (!this.isRestartButtonHovered) {
            return;
        }
        this.isRestartButtonHovered = false;
        this.updateCursor(false);
        this.redrawCurrentEndScreen(ctx);
    }

    /**
     * Check whether a canvas click is inside the restart button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the restart button was clicked
     */
    isRestartButtonClicked(event) {
        const position = this.getCanvasClickPosition(event);
        return position.x >= this.restartButton.x &&
               position.x <= this.restartButton.x + this.restartButton.width &&
               position.y >= this.restartButton.y &&
               position.y <= this.restartButton.y + this.restartButton.height;
    }

    /**
     * Draw the home button on the win screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawHomeButton(ctx) {
        const button = this.homeButton;
        ctx.save();
        ctx.fillStyle = this.isHomeButtonHovered ? "#ffe066" : "#ffcc01";
        ctx.strokeStyle = this.isHomeButtonHovered ? "#ffffff" : "#8b2d12";
        ctx.lineWidth = 3;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = "#8b2d12";
        ctx.font = "32px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("HOME", button.x + button.width / 2, button.y + button.height / 2);
        ctx.restore();
    }

    /**
     * Update the hover state of the home button and redraw when it changes.
     * @param {MouseEvent} event - The mouse move event
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    updateHomeButtonHover(event, ctx) {
        const isHovered = this.isHomeButtonClicked(event);
        if (this.isHomeButtonHovered === isHovered) {
            return;
        }
        this.isHomeButtonHovered = isHovered;
        this.updateCursor(isHovered);
        this.redrawCurrentEndScreen(ctx);
    }

    /**
     * Remove the home button hover state.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    clearHomeButtonHover(ctx) {
        if (!this.isHomeButtonHovered) {
            return;
        }
        this.isHomeButtonHovered = false;
        this.updateCursor(false);
        this.redrawCurrentEndScreen(ctx);
    }

    /**
     * Set the canvas cursor for visible controls.
     * @param {boolean} isHovered - Whether a screen control is hovered
     */
    updateCursor(isHovered) {
        this.canvas.style.cursor = isHovered || this.muteButton?.isHovered ? "pointer" : "default";
    }

    /**
     * Redraw the currently active end screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    redrawCurrentEndScreen(ctx) {
        this.drawEndScreen(ctx, world?.gameWon, world?.gameLost);
    }

    /**
     * Check whether a canvas click is inside the home button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the home button was clicked
     */
    isHomeButtonClicked(event) {
        const position = this.getCanvasClickPosition(event);
        return position.x >= this.homeButton.x &&
               position.x <= this.homeButton.x + this.homeButton.width &&
               position.y >= this.homeButton.y &&
               position.y <= this.homeButton.y + this.homeButton.height;
    }

    /**
     * Draw a warm transparent overlay behind the win screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawWinOverlay(ctx) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 204, 1, 0.22)";
        ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
        ctx.fillStyle = "rgba(255, 112, 0, 0.16)";
        ctx.fillRect(0, 0, CANVAS.width, CANVAS.height);
        ctx.restore();
    }
}
