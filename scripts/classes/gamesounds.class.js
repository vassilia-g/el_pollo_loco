/**
 * Manages gameplay music and sound effects.
 */
class GameSounds {
    steps = new Audio("assets/audio/steps.mp3");
    jump = new Audio("assets/audio/jump.mp3");
    normalChicken = new Audio("assets/audio/normal-chicken.mp3");
    smallChicken = new Audio("assets/audio/small-chicken.mp3");
    endboss = new Audio("assets/audio/endboss.mp3");
    coin = new Audio("assets/audio/coins.mp3");
    bottleCollect = new Audio("assets/audio/bottle-1.mp3");
    hurtMale = new Audio("assets/audio/icons/hurt-male.mp3");
    throwBottle = new Audio("assets/audio/throw-bottle.mp3");
    splash = new Audio("assets/audio/salsa-splat.mp3");
    gameOver = new Audio("assets/audio/game-over.mp3");
    gameWon = new Audio("assets/audio/game-won.mp3");
    backgroundMusic = new Audio("assets/audio/background/sonican-gypsy-tango-acoustic-folk-loop-469606.mp3");

    muted = false;
    volume = 0.5;
    backgroundVolume = 0.10;
    endbossLoopInterval;
    endbossLoopDelay = 2500;

    /**
     * Initializes the GameSounds class by setting the volume for all sounds and configuring the background music.
     */
    constructor() {
        this.getAllSounds().forEach(sound => sound.volume = this.volume);
        this.steps.loop = true;
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundVolume;
    }

    /**
     * Returns an array of all sound objects used in the game.
     * @returns {Audio[]} An array containing all sound objects.
     */
    getAllSounds() {
        return this.getCharacterSounds()
            .concat(this.getEnemySounds())
            .concat(this.getCollectibleSounds())
            .concat(this.getEndScreenSounds())
            .concat(this.backgroundMusic);
    }

    /**
     * Return character-related sounds.
     * @returns {Audio[]} Character sounds
     */
    getCharacterSounds() {
        return [this.steps, this.jump, this.hurtMale];
    }

    /**
     * Return enemy-related sounds.
     * @returns {Audio[]} Enemy sounds
     */
    getEnemySounds() {
        return [this.normalChicken, this.smallChicken, this.endboss];
    }

    /**
     * Return collectible and bottle sounds.
     * @returns {Audio[]} Collectible sounds
     */
    getCollectibleSounds() {
        return [this.coin, this.bottleCollect, this.throwBottle, this.splash];
    }

    /**
     * Return game end sounds.
     * @returns {Audio[]} End screen sounds
     */
    getEndScreenSounds() {
        return [this.gameOver, this.gameWon];
    }

    /**
     * Plays the specified sound if the game is not muted.
     * @param {Audio} sound - The sound object to be played.
     */
    play(sound) {
        if (this.muted) return;

        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise) {
            playPromise.catch(() => {});
        }
    }

    /**
     * Starts the looping steps sound.
     */
    playSteps() {
        if (this.muted || !this.steps.paused) return;

        const playPromise = this.steps.play();
        if (playPromise) {
            playPromise.catch(() => {});
        }
    }

    /**
     * Stops the looping steps sound.
     */
    stopSteps() {
        this.steps.pause();
        this.steps.currentTime = 0;
    }

    /**
     * Plays the jump sound.
     */ 
    playJump() {
        this.play(this.jump);
    }

    /**
     * Plays the coin sound.
     */
    playCoin() {
        this.play(this.coin);
    }

    /**
     * Plays the bottle collect sound.
     */
    playBottleCollect() {
        this.play(this.bottleCollect);
    }

    /**
     * Plays the character hurt sound.
     */
    playCharacterHurt() {
        this.play(this.hurtMale);
    }

    /**
     * Plays the bottle throw sound.
     */
    playBottleThrow() {
        this.play(this.throwBottle);
    }

    /**
     * Plays the splash sound.
     */
    playSplash() {
        this.play(this.splash);
    }

    /**
     * Plays the normal chicken sound.
     */
    playChicken() {
        this.play(this.normalChicken);
    }

    /**
     * Plays the small chicken sound.
     */
    playSmallChicken() {
        this.play(this.smallChicken);
    }

    /**
     * Plays the endboss sound.
     */
    playEndboss() {
        this.play(this.endboss);
    }

    /**
     * Starts repeating the endboss sound during the boss encounter.
     */
    startEndbossLoop() {
        if (this.endbossLoopInterval) {
            return;
        }
        this.playEndboss();
        this.endbossLoopInterval = setInterval(() => this.playEndboss(), this.endbossLoopDelay);
    }

    /**
     * Stops the repeating endboss sound.
     */
    stopEndbossLoop() {
        clearInterval(this.endbossLoopInterval);
        this.endbossLoopInterval = undefined;
        this.endboss.pause();
        this.endboss.currentTime = 0;
    }

    /**
     * Plays the game over sound.
     */
    playGameOver() {
        this.stopSoundsExcept(this.gameOver);
        this.play(this.gameOver);
    }

    /**
     * Plays the game won sound.
     */
    playGameWon() {
        this.stopSoundsExcept(this.gameWon);
        this.play(this.gameWon);
    }

    /**
     * Stops the end screen sounds.
     */
    stopEndSounds() {
        [this.gameOver, this.gameWon].forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Stops every sound except the selected one.
     * @param {Audio} excludedSound - The sound that should keep playing
     */
    stopSoundsExcept(excludedSound) {
        if (excludedSound !== this.endboss) {
            this.stopEndbossLoop();
        }
        this.getAllSounds().forEach(sound => {
            if (sound === excludedSound) {
                return;
            }
            sound.pause();
            sound.currentTime = 0;
        });
    }

    /**
     * Plays the background music if the game is not muted.
     */
    playBackgroundMusic() {
        if (this.muted) return;

        const playPromise = this.backgroundMusic.play();
        if (playPromise) {
            playPromise.catch(() => {});
        }
    }

    /**
     * Stops the background music and resets its playback position.
     */
    stopBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    /**
     * Sets the volume for all sounds and the background music.
     * @param {number} volume - The desired volume level (between 0 and 1).
     */
    setVolume(volume) {
        this.volume = Math.min(Math.max(volume, 0), 1);
        this.getAllSounds().forEach(sound => sound.volume = this.volume);
        this.backgroundMusic.volume = this.backgroundVolume;
    }

    /**
     * Toggles the mute state of the game sounds.
     */
    toggleMute() {
        this.muted = !this.muted;
    }
}
