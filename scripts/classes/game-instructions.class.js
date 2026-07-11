/**
 * Draws and handles the start screen instructions dialog.
 */
class GameInstructions {
    visible = false;
    activeDialog = "instructions";
    isHelpButtonHovered = false;
    isImprintButtonHovered = false;
    isCloseButtonHovered = false;
    helpButton = {
        x: 20,
        y: 20,
        width: 180,
        height: 60
    };
    imprintButton = {
        x: 20,
        y: 90,
        width: 180,
        height: 50
    };
    closeButton = {
        x: 667,
        y: 84,
        width: 110,
        height: 42
    };
    dialog = {
        x: 170,
        y: 70,
        width: 620,
        height: 390
    };

    /**
     * Create the instructions helper.
     * @param {HTMLCanvasElement} canvas - The game canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
    }

    /**
     * Draw the help button and, when open, the instructions dialog.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    draw(ctx) {
        this.drawHelpButton(ctx);
        this.drawImprintButton(ctx);
        if (this.visible) {
            this.drawDialog(ctx);
        }
    }

    /**
     * Draw the help button on the start screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawHelpButton(ctx) {
        this.drawStartButton(ctx, this.helpButton, "HOW TO PLAY", this.isHelpButtonHovered, 24);
    }

    /**
     * Draw the imprint button on the start screen.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawImprintButton(ctx) {
        this.drawStartButton(ctx, this.imprintButton, "IMPRINT", this.isImprintButtonHovered, 23);
    }

    /**
     * Draw one start screen dialog button.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     * @param {{x: number, y: number, width: number, height: number}} button - Button rectangle
     * @param {string} label - Button label
     * @param {boolean} isHovered - Whether the button is hovered
     * @param {number} fontSize - Font size in pixels
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
     * Draw the open instructions dialog.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawDialog(ctx) {
        const dialog = this.dialog;
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "rgba(255, 244, 204, 0.97)";
        ctx.strokeStyle = "#8b2d12";
        ctx.lineWidth = 4;
        ctx.fillRect(dialog.x, dialog.y, dialog.width, dialog.height);
        ctx.strokeRect(dialog.x, dialog.y, dialog.width, dialog.height);
        this.drawText(ctx);
        this.drawCloseButton(ctx);
        ctx.restore();
    }

    /**
     * Draw the instructions text.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawText(ctx) {
        ctx.fillStyle = "#8b2d12";
        ctx.font = this.activeDialog === "imprint" ? "30px Arial" : "34px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.getDialogTitle(), this.dialog.x + this.dialog.width / 2, 125);
        ctx.font = this.activeDialog === "imprint" ? "15px Arial" : "22px Arial";
        ctx.textAlign = "left";
        this.getDialogLines().forEach((line, index) => {
            ctx.fillText(line, this.dialog.x + 55, this.getTextStartY() + index * this.getLineHeight());
        });
    }

    /**
     * Return the first text line y-position for the open dialog.
     * @returns {number} Start y-position
     */
    getTextStartY() {
        return this.activeDialog === "imprint" ? 152 : 180;
    }

    /**
     * Return the text line height for the open dialog.
     * @returns {number} Text line height
     */
    getLineHeight() {
        return this.activeDialog === "imprint" ? 19 : 36;
    }

    /**
     * Return the title for the open dialog.
     * @returns {string} Dialog title
     */
    getDialogTitle() {
        return this.activeDialog === "imprint" ? "Imprint" : "How to Play";
    }

    /**
     * Return the text lines for the open dialog.
     * @returns {string[]} Dialog lines
     */
    getDialogLines() {
        if (this.activeDialog === "imprint") {
            return this.getImprintLines();
        }
        return this.getInstructionLines();
    }

    /**
     * Return the instructions shown inside the dialog.
     * @returns {string[]} Lines of instructions
     */
    getInstructionLines() {
        return [
            "A / Left Arrow: Move left",
            "D / Right Arrow: Move right",
            "W / Up Arrow: Jump",
            "Space: Throw a salsa bottle",
            "Collect coins and salsa bottles.",
            "Jump on chickens or hit enemies with bottles.",
            "Defeat the endboss to win the level."
        ];
    }

    /**
     * Return the imprint text shown inside the dialog.
     * @returns {string[]} Lines of imprint text
     */
    getImprintLines() {
        return [
            "Legal Notice",
            "",
            "Vassilia Gerodimos",
            "Mörfelder Landstraße 62",
            "Email: vassilia@gerodimos.com",
            "",
            "Project",
            "This game was created as part of a Developer Akademie module.",
            "",
            "Audio Credits",
            "Original sound effects by Vassilia Gerodimos:",
            "throw bottle, footsteps, chickens, endboss, jump,",
            "coins and salsa bottles.",
            "Additional sound effects downloaded from Pixabay."
        ];
    }

    /**
     * Draw the close button inside the dialog.
     * @param {CanvasRenderingContext2D} ctx - The canvas context
     */
    drawCloseButton(ctx) {
        const button = this.closeButton;
        ctx.fillStyle = this.isCloseButtonHovered ? "#ffe066" : "#ffcc01";
        ctx.strokeStyle = this.isCloseButtonHovered ? "#ffffff" : "#8b2d12";
        ctx.lineWidth = 2;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeRect(button.x, button.y, button.width, button.height);
        ctx.fillStyle = "#8b2d12";
        ctx.font = "22px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("CLOSE", button.x + button.width / 2, button.y + button.height / 2);
    }

    /**
     * Handle a start screen click that may belong to the instructions UI.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the click was handled or blocked by the dialog
     */
    handleClick(event) {
        if (this.visible) {
            this.visible = !this.isCloseButtonClicked(event);
            return true;
        }
        if (this.isHelpButtonClicked(event)) {
            this.visible = true;
            this.activeDialog = "instructions";
            return true;
        }
        if (this.isImprintButtonClicked(event)) {
            this.visible = true;
            this.activeDialog = "imprint";
            return true;
        }
        return false;
    }

    /**
     * Update hover states for the instructions UI.
     * @param {MouseEvent} event - The mouse move event
     * @returns {boolean} True when a hover state changed
     */
    updateHover(event) {
        const wasHelpHovered = this.isHelpButtonHovered;
        const wasImprintHovered = this.isImprintButtonHovered;
        const wasCloseHovered = this.isCloseButtonHovered;
        this.isHelpButtonHovered = !this.visible && this.isHelpButtonClicked(event);
        this.isImprintButtonHovered = !this.visible && this.isImprintButtonClicked(event);
        this.isCloseButtonHovered = this.visible && this.isCloseButtonClicked(event);
        return wasHelpHovered !== this.isHelpButtonHovered ||
               wasImprintHovered !== this.isImprintButtonHovered ||
               wasCloseHovered !== this.isCloseButtonHovered;
    }

    /**
     * Clear instruction hover states.
     * @returns {boolean} True when a hover state changed
     */
    clearHover() {
        const hadHover = this.isHelpButtonHovered || this.isImprintButtonHovered || this.isCloseButtonHovered;
        this.isHelpButtonHovered = false;
        this.isImprintButtonHovered = false;
        this.isCloseButtonHovered = false;
        return hadHover;
    }

    /**
     * Check whether the instructions UI is currently hovered.
     * @returns {boolean} True when a visible instructions button is hovered
     */
    isHovered() {
        return this.isHelpButtonHovered || this.isImprintButtonHovered || this.isCloseButtonHovered;
    }

    /**
     * Check whether a click is inside the help button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the help button was clicked
     */
    isHelpButtonClicked(event) {
        return this.isPositionInsideButton(this.getCanvasClickPosition(event), this.helpButton);
    }

    /**
     * Check whether a click is inside the imprint button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the imprint button was clicked
     */
    isImprintButtonClicked(event) {
        return this.isPositionInsideButton(this.getCanvasClickPosition(event), this.imprintButton);
    }

    /**
     * Check whether a click is inside the close button.
     * @param {MouseEvent} event - The click event
     * @returns {boolean} True when the close button was clicked
     */
    isCloseButtonClicked(event) {
        return this.isPositionInsideButton(this.getCanvasClickPosition(event), this.closeButton);
    }

    /**
     * Check whether a canvas position is inside a button.
     * @param {{x: number, y: number}} position - Canvas position
     * @param {{x: number, y: number, width: number, height: number}} button - Button rectangle
     * @returns {boolean} True when the position is inside the button
     */
    isPositionInsideButton(position, button) {
        return position.x >= button.x &&
               position.x <= button.x + button.width &&
               position.y >= button.y &&
               position.y <= button.y + button.height;
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
