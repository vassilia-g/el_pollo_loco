/**
 * Manages all fixed status bars and HUD messages.
 */
class StatusBars {
    fullBottleMessageUntil = 0;
    healthBar = new StatusBar([
        "assets/graphics/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
        "assets/graphics/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "assets/graphics/7_statusbars/1_statusbar/2_statusbar_health/orange/40.png",
        "assets/graphics/7_statusbars/1_statusbar/2_statusbar_health/orange/60.png",
        "assets/graphics/7_statusbars/1_statusbar/2_statusbar_health/orange/80.png",
        "assets/graphics/7_statusbars/1_statusbar/2_statusbar_health/orange/100.png"
    ], 10, 10, 100);
    coinBar = new StatusBar([
        "assets/graphics/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
        "assets/graphics/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "assets/graphics/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
        "assets/graphics/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
        "assets/graphics/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
        "assets/graphics/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
    ], 10, 40, 0);
    bottleBar = new StatusBar([
        "assets/graphics/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "assets/graphics/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "assets/graphics/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "assets/graphics/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "assets/graphics/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "assets/graphics/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png"
    ], 10, 72, 0);
    endbossBar = new StatusBar([
        "assets/graphics/7_statusbars/2_statusbar_endboss/orange/orange0.png",
        "assets/graphics/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "assets/graphics/7_statusbars/2_statusbar_endboss/orange/orange40.png",
        "assets/graphics/7_statusbars/2_statusbar_endboss/orange/orange60.png",
        "assets/graphics/7_statusbars/2_statusbar_endboss/orange/orange80.png",
        "assets/graphics/7_statusbars/2_statusbar_endboss/orange/orange100.png"
    ], 750, 10, 100);

    /**
     * Update the health status bar.
     * @param {number} health - Current character health
     */
    setHealth(health) {
        this.healthBar.setPercentage(health);
    }

    /**
     * Update the coin status bar.
     * @param {number} collected - Collected coins
     * @param {number} total - Total coins
     */
    setCoins(collected, total) {
        this.coinBar.setPercentage(this.getCollectionPercentage(collected, total));
    }

    /**
     * Update the bottle status bar.
     * @param {number} collected - Collected bottles
     * @param {number} max - Maximum bottle amount
     */
    setBottles(collected, max) {
        this.bottleBar.setPercentage(this.getCollectionPercentage(collected, max));
    }

    /**
     * Update the endboss status bar.
     * @param {number} health - Current endboss health
     */
    setEndbossHealth(health) {
        this.endbossBar.setPercentage(health);
    }

    /**
     * Show a short blinking message when the bottle inventory is full.
     */
    showFullBottleMessage() {
        this.fullBottleMessageUntil = Date.now() + 3000;
    }

    /**
     * Draw all visible fixed canvas UI elements.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {World} world - Current game world
     */
    draw(ctx, world) {
        if (world.isGameOver()) {
            return;
        }
        world.addToMap(this.healthBar);
        world.addToMap(this.coinBar);
        world.addToMap(this.bottleBar);
        this.drawFullBottleMessage(ctx);
        if (world.endbossActivated) {
            world.addToMap(this.endbossBar);
        }
    }

    /**
     * Draw the blinking full bottle message below the bottle status bar.
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    drawFullBottleMessage(ctx) {
        if (Date.now() > this.fullBottleMessageUntil) {
            return;
        }
        ctx.save();
        ctx.font = "bold 20px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = Math.floor(Date.now() / 250) % 2 === 0 ? "red" : "white";
        ctx.fillText("VOLL!", this.bottleBar.x + this.bottleBar.width / 2, this.bottleBar.y + this.bottleBar.height + 24);
        ctx.restore();
    }

    /**
     * Calculate collected objects as a percentage of all objects of the same type.
     * @param {number} collected - Amount already collected
     * @param {number} total - Total available amount
     * @returns {number} Collection percentage
     */
    getCollectionPercentage(collected, total) {
        return total === 0 ? 0 : (collected / total) * 100;
    }
}
