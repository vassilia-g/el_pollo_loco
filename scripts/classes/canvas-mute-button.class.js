/**
 * Draws and hit-tests the mute button inside the canvas.
 */
class CanvasMuteButton {
    soundIcon = new Image();
    mutedIcon = new Image();
    isHovered = false;
    onIconLoad;
    button = {
        x: 453,
        y: 20,
        width: 54,
        height: 54
    };

    /**
     * Create the canvas mute button and load its icons.
     * @param {HTMLCanvasElement} canvas - The game canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.soundIcon.onload = () => this.onIconLoad?.();
        this.mutedIcon.onload = () => this.onIconLoad?.();
        this.soundIcon.src = "assets/audio/icons/volume-svgrepo-com.svg";
        this.mutedIcon.src = "assets/audio/icons/volume-muted-svgrepo-com.svg";
    }

    /**
     * Draw the mute button.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {boolean} isMuted - Whether the game is muted
     */
    draw(ctx, isMuted) {
        const button = this.button;
        const icon = isMuted ? this.mutedIcon : this.soundIcon;
        ctx.save();
        this.drawCircle(ctx, button);
        this.drawIcon(ctx, icon, button);
        ctx.restore();
    }

    /**
     * Draw the circular button background.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {{x: number, y: number, width: number, height: number}} button - Button rectangle
     */
    drawCircle(ctx, button) {
        ctx.fillStyle = this.isHovered ? "rgba(255, 224, 102, 0.95)" : "rgba(43, 22, 0, 0.48)";
        ctx.strokeStyle = this.isHovered ? "#ffffff" : "rgba(255, 255, 255, 0.86)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(button.x + button.width / 2, button.y + button.height / 2, button.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Draw the current mute icon.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {HTMLImageElement} icon - The icon to draw
     * @param {{x: number, y: number}} button - Button position
     */
    drawIcon(ctx, icon, button) {
        if (icon.complete) {
            ctx.drawImage(icon, button.x + 13, button.y + 13, 28, 28);
        }
    }

    /**
     * Update the hover state.
     * @param {MouseEvent} event - The mouse move event
     * @returns {boolean} True when the hover state changed
     */
    updateHover(event) {
        const wasHovered = this.isHovered;
        this.isHovered = this.isClicked(event);
        return wasHovered !== this.isHovered;
    }

    /**
     * Clear the hover state.
     * @returns {boolean} True when hover was active
     */
    clearHover() {
        const hadHover = this.isHovered;
        this.isHovered = false;
        return hadHover;
    }

    /**
     * Check whether a click is inside the mute button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the mute button was clicked
     */
    isClicked(event) {
        const position = this.getCanvasClickPosition(event);
        const centerX = this.button.x + this.button.width / 2;
        const centerY = this.button.y + this.button.height / 2;
        const dx = position.x - centerX;
        const dy = position.y - centerY;
        return Math.sqrt(dx * dx + dy * dy) <= this.button.width / 2;
    }

    /**
     * Convert browser click coordinates to canvas coordinates.
     * @param {MouseEvent} event - The click event
     * @returns {{x: number, y: number}} Canvas click coordinates
     */
    getCanvasClickPosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (event.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }
}
