/**
 * Manages game objects and draws them on the canvas.
 */
class World {
    character = new Character();
    level = createLevel1();
    camera_x_float = 0;
    camera_x = 0;
    activeEnemyCollisions = new Set();
    throwableSalsas = [];
    collectedCoins = 0;
    collectedBottles = 0;
    maxBottles = 5;
    gameWon = false;
    gameLost = false;
    endbossActivated = false;
    statusBars = new StatusBars();
    

    /**x
     * The constructor of the World class. It initializes the canvas context and starts the drawing loop.
     * @param {HTMLCanvasElement} canvas - The canvas element where the game will be drawn
     * @param {Keyboard} keyboard - The keyboard instance to handle input
     * @param {GameScreens} gameScreens - The helper that draws start and end screens
     */
    constructor(canvas, keyboard, gameScreens) {
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;
        this.gameScreens = gameScreens;
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
            this.gameLost = true;
            this.keyboard.block();
            return;
        }
        const endboss = this.getEndboss();
        if (endboss && endboss.isDead()) {
            this.gameWon = true;
            this.keyboard.block();
        }
    }

    /**
     * Find the endboss in the current level.
     * @returns {Endboss|undefined} The level endboss
     */
    getEndboss() {
        return this.level.chicken.find(enemy => enemy instanceof Endboss);
    }

    /**
     * Check for collisions between the character and chickens. If a collision is detected, handle it accordingly (e.g., damage the character or kill the chicken).
     */
    checkChickenCollisions() {
        if (this.isGameOver()) {
            return;
        }
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
        if (this.isGameOver()) {
            return;
        }
        if (!this.activeEnemyCollisions.has(chicken)) {
            this.character.hit();
            this.statusBars.setHealth(this.character.health);
        }
        this.activeEnemyCollisions.add(chicken);
    }

    /**
     * Check whether the game already reached a win or lose state.
     * @returns {boolean} True once an end screen is active
     */
    isGameOver() {
        return this.gameWon || this.gameLost;
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
        this.statusBars.setCoins(this.collectedCoins, this.level.coins.length);
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
            this.statusBars.showFullBottleMessage();
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
            this.statusBars.setEndbossHealth(enemy.health);
            this.alignBottleSplashWithEndboss(bottle, enemy);
        }
        bottle.splash();
    }

    /**
     * Move the splash animation closer to the visible side of the endboss.
     * @param {Salsa} bottle - The bottle that hit the endboss
     * @param {Endboss} endboss - The hit endboss
     */
    alignBottleSplashWithEndboss(bottle, endboss) {
        if (bottle.speedX > 0) {
            bottle.x = endboss.x + 20;
            return;
        }
        bottle.x = endboss.x + endboss.width - bottle.width - 20;
    }

    /**
     * Update the bottle bar from the current inventory count.
     */
    updateBottleBar() {
        this.statusBars.setBottles(this.collectedBottles, this.maxBottles);
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
        this.addObjectsToMap(this.level.chicken);
        this.addObjectsToMap(this.throwableSalsas);
        this.ctx.translate(-this.camera_x, 0);
        this.checkEndbossActivation();
        this.statusBars.draw(this.ctx, this);
        this.drawEndScreen();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Activate the endboss once he reaches the visible area with 100px spacing.
     */
    checkEndbossActivation() {
        const endboss = this.getEndboss();
        if (!endboss || this.endbossActivated || endboss.isDead()) {
            return;
        }
        if (endboss.x + this.camera_x <= CANVAS.width - 100) {
            this.endbossActivated = true;
            endboss.startAlert();
        }
    }

    /**
     * Draw the matching end screen once the game is won or lost.
     */
    drawEndScreen() {
        this.gameScreens.drawEndScreen(this.ctx, this.gameWon, this.gameLost);
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
