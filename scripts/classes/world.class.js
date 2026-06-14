/**
 * Manages game objects and draws them on the canvas.
 */
class World {
    character = new Character();
    level = level1;
    camera_x_float = 0;
    camera_x = 0;
    activeEnemyCollisions = new Set();
    throwableSalsas = [];
    collectedCoins = 0;
    collectedBottles = 0;
    maxBottles = 5;
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
    

    /**x
     * The constructor of the World class. It initializes the canvas context and starts the drawing loop.
     * @param {HTMLCanvasElement} canvas - The canvas element where the game will be drawn
     * @param {Keyboard} keyboard - The keyboard instance to handle input
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.connectCharacterToWorld();
        this.draw();
        this.checkCollisions();
    }

    /**
     * Give the character access to keyboard, level and camera data in this world.
     */
    connectCharacterToWorld() {
        this.character.world = this;
    }

    /**
     * Check for collisions between the character and other game objects (chickens, coins, salsa) at regular intervals.
     */
    checkCollisions() {
        setInterval(() => this.checkChickenCollisions(), 1000 / 60);
        setInterval(() => {
            this.checkCoinCollisions();
            this.checkSalsaCollisions();
        }, 100);
        setInterval(() => {
            this.checkThrowInput();
            this.checkThrowableCollisions();
            this.checkGameEnd();
        }, 1000 / 60);
    }

    /**
     * Stop keyboard input when the player loses or wins the game.
     */
    checkGameEnd() {
        if (this.character.isDead()) {
            this.keyboard.block();
            return;
        }
        const endboss = this.level.chicken.find(enemy => enemy instanceof Endboss);
        if (endboss && endboss.isDead()) {
            this.keyboard.block();
        }
    }

    /**
     * Check for collisions between the character and chickens. If a collision is detected, handle it accordingly (e.g., damage the character or kill the chicken).
     */
    checkChickenCollisions() {
        this.level.chicken.forEach(chicken => this.handleChickenCollision(chicken));
    }

    /**
     * Handle the collision between the character and a chicken. If the chicken is dead or there is no collision, remove it from the active collisions set. If the character is jumping on the chicken, kill the chicken. Otherwise, damage the character.
     * @param {Chicken} chicken - The chicken to check for collision with the character
     */
    handleChickenCollision(chicken) {
        if (chicken.isDead() || !this.character.isColliding(chicken)) {
            this.activeEnemyCollisions.delete(chicken);
            return;
        }
        if (chicken instanceof Chicken && this.character.isJumpingOn(chicken)) {
            chicken.die();
            return;
        }
        this.damageCharacterOnce(chicken);
    }

    /**
     * Damage the character if it collides with a chicken and hasn't already been damaged by that chicken in the current collision.
     * @param {Chicken} chicken - The chicken that is colliding with the character
     */
    damageCharacterOnce(chicken) {
        if (!this.activeEnemyCollisions.has(chicken)) {
            this.character.hit();
            this.healthBar.setPercentage(this.character.health);
        }
        this.activeEnemyCollisions.add(chicken);
    }

    /**
     * Check for collisions between the character and coins and collect each coin once.
     */
    checkCoinCollisions() {
        this.level.coins.forEach(coin => {
            if (coin.visible && !coin.collected && this.character.isColliding(coin)) {
                this.collectCoin(coin);
            }
        });
    }

    /**
     * Collect a coin and update the coin status bar.
     * @param {Coins} coin - The collected coin
     */
    collectCoin(coin) {
        coin.collected = true;
        coin.fadeOut();
        this.collectedCoins++;
        this.coinBar.setPercentage(this.getCollectionPercentage(this.collectedCoins, this.level.coins.length));
    }

    /**
     * Check for collisions between the character and salsa. If a collision is detected, collect the salsa bottle.
     */
    checkSalsaCollisions() {
        this.level.salsa.forEach(salsa => {
            if (salsa.visible && !salsa.collected && this.character.isColliding(salsa)) {
                this.collectSalsa(salsa);
            }
        });
    }

    /**
     * Collect a salsa bottle and update the bottle status bar.
     * @param {Salsa} salsa - The collected salsa bottle
     */
    collectSalsa(salsa) {
        if (this.collectedBottles >= this.maxBottles) {
            return;
        }
        salsa.collected = true;
        salsa.fadeOut();
        this.collectedBottles++;
        this.updateBottleBar();
        this.showFullBottleMessage();
    }

    /**
     * Show a short blinking message when the bottle inventory is full.
     */
    showFullBottleMessage() {
        if (this.collectedBottles === this.maxBottles) {
            this.fullBottleMessageUntil = Date.now() + 3000;
        }
    }

    /**
     * Throw a collected salsa bottle when the throw key is pressed.
     */
    checkThrowInput() {
        if (!this.keyboard.SPACE_PRESSED) {
            return;
        }
        if (this.collectedBottles > 0) {
            this.throwSalsa();
        }
        this.keyboard.SPACE_PRESSED = false;
    }

    /**
     * Create and launch a throwable salsa bottle.
     */
    throwSalsa() {
        const direction = this.character.otherDirection ? -1 : 1;
        const x = this.character.x + (direction === 1 ? this.character.width - 20 : -20);
        const bottle = new Salsa("assets/graphics/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png", x);
        bottle.y = this.character.y + 80;
        bottle.throw(direction);
        this.throwableSalsas.push(bottle);
        this.collectedBottles--;
        this.updateBottleBar();
    }

    /**
     * Check thrown bottles against enemies.
     */
    checkThrowableCollisions() {
        this.throwableSalsas.forEach(bottle => {
            if (!bottle.visible || bottle.splashing) {
                return;
            }
            this.level.chicken.forEach(enemy => this.handleThrowableCollision(bottle, enemy));
        });
    }

    /**
     * Damage or kill enemies when a thrown salsa bottle hits them.
     * @param {Salsa} bottle - The thrown salsa bottle
     * @param {MoveableObject} enemy - The enemy hit by the bottle
     */
    handleThrowableCollision(bottle, enemy) {
        if (bottle.splashing || !enemy.visible || enemy.isDead() || !bottle.isColliding(enemy)) {
            return;
        }
        if (enemy instanceof Chicken) {
            return;
        }
        if (enemy instanceof Endboss) {
            enemy.hit();
            this.endbossBar.setPercentage(enemy.health);
        }
        bottle.splash();
    }

    /**
     * Update the bottle bar from the current inventory count.
     */
    updateBottleBar() {
        this.bottleBar.setPercentage(this.getCollectionPercentage(this.collectedBottles, this.maxBottles));
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

    /**
     * Draw all game objects on the canvas and request the next animation frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        this.camera_x = Math.round(this.camera_x_float || this.camera_x);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.background);
        this.addObjectsToMap(this.level.cloud);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.salsa);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableSalsas);
        this.addObjectsToMap(this.level.chicken);
        this.ctx.translate(-this.camera_x, 0);
        this.addStatusBarsToMap();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draw the fixed canvas UI independent of the camera.
     */
    addStatusBarsToMap() {
        this.addToMap(this.healthBar);
        this.addToMap(this.coinBar);
        this.addToMap(this.bottleBar);
        this.drawFullBottleMessage();
        this.addToMap(this.endbossBar);
    }

    /**
     * Draw the blinking full bottle message below the bottle status bar.
     */
    drawFullBottleMessage() {
        if (Date.now() > this.fullBottleMessageUntil) {
            return;
        }
        this.ctx.save();
        this.ctx.font = "bold 20px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = Math.floor(Date.now() / 250) % 2 === 0 ? "red" : "white";
        this.ctx.fillText("VOLL!", this.bottleBar.x + this.bottleBar.width / 2, this.bottleBar.y + this.bottleBar.height + 24);
        this.ctx.restore();
    }

    /**
     * Draw a single object on the canvas.
     * @param {MoveableObject} object - The object to be drawn
     */
    addToMap(object) {
        if (object.otherDirection) {
            this.flipImage(object);
        }
        object.draw(this.ctx);
        object.drawFrame(this.ctx);

        if (object.otherDirection) {
            this.flipImageBack(object);
        }
    }

    /**
     * Draw multiple objects on the canvas.
     * @param {MoveableObject[]} objects - An array of objects to be drawn
     */
    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    /**
     * Flip the image of an object horizontally.
     * @param {MoveableObject} object - The object whose image needs to be flipped
     */
    flipImage(object) {
        this.ctx.save();
        this.ctx.translate(object.width, 0);
        this.ctx.scale(-1, 1);
        object.x = object.x * -1;
    }

    /**
     * Flip the image back to its original orientation.
     * @param {MoveableObject} object - The object whose image needs to be flipped back
     */
    flipImageBack(object) {
        object.x = object.x * -1;
        this.ctx.restore();
    }
}
