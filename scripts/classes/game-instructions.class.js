/**
 * Draws start-screen info buttons and controls their DOM dialog.
 */
class GameInstructions {
    visible = false;
    activeDialog = "instructions";
    isHelpButtonHovered = false;
    isImprintButtonHovered = false;
    helpButton = { x: 20, y: 20, width: 180, height: 60 };
    imprintButton = { x: 20, y: 90, width: 180, height: 50 };

    /**
     * Create the instructions helper and connect its DOM elements.
     * @param {HTMLCanvasElement} canvas - The game canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.overlay = document.getElementById("gameInfoOverlay");
        this.title = document.getElementById("gameInfoTitle");
        this.closeButton = document.getElementById("gameInfoClose");
        this.howToPlayContent = document.getElementById("howToPlayContent");
        this.imprintContent = document.getElementById("imprintContent");
        this.bindDialogEvents();
    }

    /**
     * Bind close, backdrop and keyboard events for the DOM dialog.
     */
    bindDialogEvents() {
        this.closeButton.addEventListener("click", () => this.closeDialog());
        this.overlay.addEventListener("click", event => this.closeOnBackdrop(event));
        document.addEventListener("keydown", event => this.closeOnEscape(event));
    }

    /**
     * Draw both information buttons on the start screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    draw(ctx) {
        this.drawStartButton(ctx, this.helpButton, "HOW TO PLAY", this.isHelpButtonHovered, 24);
        this.drawStartButton(ctx, this.imprintButton, "IMPRINT", this.isImprintButtonHovered, 23);
    }

    /**
     * Draw one start-screen information button.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {{x: number, y: number, width: number, height: number}} button - Button rectangle
     * @param {string} label - Button label
     * @param {boolean} isHovered - Whether the button is hovered
     * @param {number} fontSize - Font size in canvas pixels
     */
    drawStartButton(ctx, button, label, isHovered, fontSize) {
        ctx.save();
        ctx.fillStyle = isHovered ? "#ffe066" : "#ffcc01";
        ctx.strokeStyle = isHovered ? "#ffffff" : "#8b2d12";
        ctx.lineWidth = 2;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = "#8b2d12";
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(label, button.x + button.width / 2, button.y + button.height / 2);
        ctx.restore();
    }

    /**
     * Handle a canvas click on an information button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} Whether an information button handled the click
     */
    handleClick(event) {
        if (this.visible) {
            return true;
        }
        if (this.isHelpButtonClicked(event)) {
            return this.openDialog("instructions");
        }
        if (this.isImprintButtonClicked(event)) {
            return this.openDialog("imprint");
        }
        return false;
    }

    /**
     * Open the selected DOM dialog content.
     * @param {string} dialog - Dialog id
     * @returns {boolean} Always true after opening
     */
    openDialog(dialog) {
        this.visible = true;
        this.activeDialog = dialog;
        const showsImprint = dialog === "imprint";
        this.title.textContent = showsImprint ? "Imprint" : "How to Play";
        this.howToPlayContent.hidden = showsImprint;
        this.imprintContent.hidden = !showsImprint;
        this.overlay.hidden = false;
        this.closeButton.focus();
        return true;
    }

    /**
     * Close the DOM dialog and clear its visible state.
     */
    closeDialog() {
        this.visible = false;
        this.overlay.hidden = true;
    }

    /**
     * Close the dialog when the backdrop itself is clicked.
     * @param {MouseEvent} event - The backdrop click
     */
    closeOnBackdrop(event) {
        if (event.target === this.overlay) {
            this.closeDialog();
        }
    }

    /**
     * Close the dialog when Escape is pressed.
     * @param {KeyboardEvent} event - The keyboard event
     */
    closeOnEscape(event) {
        if (this.visible && event.key === "Escape") {
            this.closeDialog();
        }
    }

    /**
     * Update hover states for the two canvas buttons.
     * @param {MouseEvent} event - The mouse move event
     * @returns {boolean} Whether a hover state changed
     */
    updateHover(event) {
        const wasHelpHovered = this.isHelpButtonHovered;
        const wasImprintHovered = this.isImprintButtonHovered;
        this.isHelpButtonHovered = !this.visible && this.isHelpButtonClicked(event);
        this.isImprintButtonHovered = !this.visible && this.isImprintButtonClicked(event);
        return wasHelpHovered !== this.isHelpButtonHovered ||
               wasImprintHovered !== this.isImprintButtonHovered;
    }

    /**
     * Clear information-button hover states.
     * @returns {boolean} Whether a hover state changed
     */
    clearHover() {
        const hadHover = this.isHovered();
        this.isHelpButtonHovered = false;
        this.isImprintButtonHovered = false;
        return hadHover;
    }

    /**
     * Check whether either information button is hovered.
     * @returns {boolean} Whether an information button is hovered
     */
    isHovered() {
        return this.isHelpButtonHovered || this.isImprintButtonHovered;
    }

    /** @param {MouseEvent} event - Click event. @returns {boolean} Whether Help was clicked. */
    isHelpButtonClicked(event) {
        return this.isPositionInsideButton(this.getCanvasClickPosition(event), this.helpButton);
    }

    /** @param {MouseEvent} event - Click event. @returns {boolean} Whether Imprint was clicked. */
    isImprintButtonClicked(event) {
        return this.isPositionInsideButton(this.getCanvasClickPosition(event), this.imprintButton);
    }

    /**
     * Check whether a canvas position is inside a button.
     * @param {{x: number, y: number}} position - Canvas position
     * @param {{x: number, y: number, width: number, height: number}} button - Button rectangle
     * @returns {boolean} Whether the position is inside the button
     */
    isPositionInsideButton(position, button) {
        return position.x >= button.x && position.x <= button.x + button.width &&
               position.y >= button.y && position.y <= button.y + button.height;
    }

    /**
     * Convert browser click coordinates to canvas coordinates.
     * @param {MouseEvent} event - The pointer event
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
