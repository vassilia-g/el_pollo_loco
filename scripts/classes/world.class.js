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
    sounds = new GameSounds();
    collisionIntervals = [];
    animationFrameId;
    stopped = false;
    

    /**x
     * The constructor of the World class. It initializes the canvas context and starts the drawing loop.
     * @param {HTMLCanvasElement} canvas - The canvas element where the game will be drawn
     * @param {Keyboard} keyboard - The keyboard instance to handle input
     * @param {GameScreens} gameScreens - The helper that draws start and end screens
     * @param {CanvasMuteButton} muteButton - The canvas mute button
     */
    constructor(canvas, keyboard, gameScreens, muteButton) {
        this.ctx = canvas.getContext("2d");
        this.renderer = new WorldRenderer(this.ctx);
        this.keyboard = keyboard;
        this.gameScreens = gameScreens;
        this.muteButton = muteButton;
        this.connectCharacterToWorld();
        this.sounds.playBackgroundMusic();
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
        this.collisionIntervals.push(setInterval(() => this.checkChickenCollisions(), 1000 / 60));
        this.collisionIntervals.push(setInterval(() => {
            this.checkCoinCollisions();
            this.checkSalsaCollisions();
        }, 100));
        this.collisionIntervals.push(setInterval(() => {
            this.checkThrowInput();
            this.checkThrowableCollisions();
            this.checkGameEnd();
        }, 1000 / 60));
    }

    /** Stop keyboard input when the player loses or wins. */
    checkGameEnd() {
        if (this.isGameOver()) {
            return;
        }
        if (this.character.isDead()) {
            this.loseGame();
            return;
        }
        const endboss = this.getEndboss();
        if (endboss && endboss.isDead()) {
            this.winGame();
        }
    }

    /** Switch the world into the lost state. */
    loseGame() {
        this.gameLost = true;
        this.stopGameplayInput();
        this.sounds.playGameOver();
    }

    /** Switch the world into the won state. */
    winGame() {
        this.gameWon = true;
        this.stopGameplayInput();
        this.sounds.playGameWon();
    }

    /** Stop player input and hide mobile controls after the game ends. */
    stopGameplayInput() {
        this.keyboard.block();
        hideMobileControls();
    }

    /** @returns {Endboss|undefined} The level endboss. */
    getEndboss() {
        return this.level.chicken.find(enemy => enemy instanceof Endboss);
    }

    /** Check collisions between the character and chickens. */
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
            this.playChickenDeathSound(chicken);
            return;
        }
        this.damageCharacterOnce(chicken);
    }

    /**
     * Play the matching sound for the defeated chicken type.
     * @param {Chicken} chicken - The defeated chicken
     */
    playChickenDeathSound(chicken) {
        if (chicken instanceof ChickenSmall) {
            this.sounds.playSmallChicken();
            return;
        }
        this.sounds.playChicken();
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
            this.sounds.playCharacterHurt();
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
        this.sounds.playCoin();
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
        this.sounds.playBottleCollect();
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
        bottle.sounds = this.sounds;
        bottle.y = this.character.y + 80;
        bottle.throw(direction);
        this.throwableSalsas.push(bottle);
        this.collectedBottles--;
        this.updateBottleBar();
        this.sounds.playBottleThrow();
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

    /** Damage or kill enemies when a thrown salsa bottle hits them. */
    handleThrowableCollision(bottle, enemy) {
        if (bottle.splashing || !enemy.visible || enemy.isDead() || !bottle.isColliding(enemy)) {
            return;
        }
        if (enemy instanceof Endboss) {
            this.hitEndbossWithBottle(bottle, enemy);
        } else if (enemy instanceof Chicken) {
            this.hitChickenWithBottle(bottle, enemy);
        }
        bottle.splash();
    }

    /** Damage the endboss with a thrown bottle. */
    hitEndbossWithBottle(bottle, endboss) {
        endboss.hit();
        this.statusBars.setEndbossHealth(endboss.health);
        this.alignBottleSplashWithEndboss(bottle, endboss);
    }

    /** Kill a chicken with a thrown bottle. */
    hitChickenWithBottle(bottle, chicken) {
        this.alignBottleSplashWithEnemy(bottle, chicken);
        chicken.die();
        this.playChickenDeathSound(chicken);
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
     * Move the splash animation closer to the visible side of a small enemy.
     * @param {Salsa} bottle - The bottle that hit the enemy
     * @param {Chicken} enemy - The hit chicken
     */
    alignBottleSplashWithEnemy(bottle, enemy) {
        if (bottle.speedX > 0) {
            bottle.x = enemy.x + 10;
            return;
        }
        bottle.x = enemy.x + enemy.width - bottle.width - 10;
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
        if (this.stopped) {
            return;
        }
        this.ctx.clearRect(0, 0, CANVAS.width, CANVAS.height);
        this.camera_x = Math.round(this.camera_x_float || this.camera_x);
        this.renderer.drawGameObjects(this);
        this.checkEndbossActivation();
        this.statusBars.draw(this.ctx, this);
        this.drawEndScreen();
        this.muteButton.draw(this.ctx, isMuted);
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Stop this world before starting a fresh one.
     */
    destroy() {
        this.stopped = true;
        this.collisionIntervals.forEach(interval => clearInterval(interval));
        cancelAnimationFrame(this.animationFrameId);
        this.sounds.stopEndbossLoop();
        this.sounds.stopBackgroundMusic();
        this.destroyGameObjects();
    }

    /**
     * Stop intervals from all active objects in this world.
     */
    destroyGameObjects() {
        [
            this.character,
            ...this.level.chicken,
            ...this.level.cloud,
            ...this.level.coins,
            ...this.level.salsa,
            ...this.throwableSalsas
        ].forEach(object => object.destroy?.());
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
            endboss.startAlert(this.character);
            this.sounds.startEndbossLoop();
        }
    }

    /**
     * Draw the matching end screen once the game is won or lost.
     */
    drawEndScreen() {
        this.gameScreens.drawEndScreen(this.ctx, this.gameWon, this.gameLost);
    }

    /**
     * Draw a single object through the world renderer.
     * @param {MoveableObject} object - The object to be drawn
     */
    addToMap(object) {
        this.renderer.addToMap(object);
    }
}
