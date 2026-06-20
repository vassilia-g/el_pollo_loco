/**
 * Draws the start screen and end screens on the canvas.
 */
class GameScreens {
    startImage = new Image();
    winImage = new Image();
    gameOverImage = new Image();
    isPlayButtonHovered = false;
    playButton = {
        x: 450,
        y: 470,
        width: 90,
        height: 64
    };

    /**
     * Create the screen helper and preload screen images.
     * @param {HTMLCanvasElement} canvas - The game canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
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
        const isHovered = this.isPlayButtonClicked(event);
        if (this.isPlayButtonHovered === isHovered) {
            return;
        }
        this.isPlayButtonHovered = isHovered;
        this.canvas.style.cursor = isHovered ? "pointer" : "default";
        this.drawStartScreen();
    }

    /**
     * Remove the play button hover state.
     */
    clearPlayButtonHover() {
        if (!this.isPlayButtonHovered) {
            return;
        }
        this.isPlayButtonHovered = false;
        this.canvas.style.cursor = "default";
        this.drawStartScreen();
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
            return;
        }
        if (gameWon) {
            this.drawWinOverlay(ctx);
            ctx.drawImage(this.winImage, (CANVAS.width - 500) / 2, (CANVAS.height - 450) / 2, 500, 450);
        }
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
