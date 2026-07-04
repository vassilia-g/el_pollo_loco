class GameSounds {
    character = new Audio("assets/audio/character.mp3");
    steps = new Audio("assets/audio/steps.mp3");
    jump = new Audio("assets/audio/jump.mp3");
    chicken = new Audio("assets/audio/chicken.mp3");
    endboss = new Audio("assets/audio/endboss.mp3");
    coin = new Audio("assets/audio/coin.mp3");
    bottle = new Audio("assets/audio/bottle.mp3");
    splash = new Audio("assets/audio/splash.mp3");
    gameOver = new Audio("assets/audio/game-over.mp3");
    backgroundMusic = new Audio("assets/audio/background/sonican-gypsy-tango-acoustic-folk-loop-469606.mp3");

    muted = false;
    volume = 0.5;
    backgroundVolume = 0.25;

    /**
     * Initializes the GameSounds class by setting the volume for all sounds and configuring the background music.
     */
    constructor() {
        this.getAllSounds().forEach(sound => sound.volume = this.volume);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundVolume;
    }

    /**
     * Returns an array of all sound objects used in the game.
     * @returns {Audio[]} An array containing all sound objects.
     */
    getAllSounds() {
        return [
            this.character,
            this.steps,
            this.jump,
            this.chicken,
            this.endboss,
            this.coin,
            this.bottle,
            this.splash,
            this.gameOver,
            this.backgroundMusic
        ];
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
     * Plays the character sound.
     */
    playCharacter() {
        this.play(this.character);
    }

    /**
     * Plays the steps sound.
     */
    playSteps() {
        this.play(this.steps);
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
        this.play(this.bottle);
    }

    /**
     * Plays the bottle throw sound.
     */
    playBottleThrow() {
        this.play(this.bottle);
    }

    /**
     * Plays the splash sound.
     */
    playSplash() {
        this.play(this.splash);
    }

    /**
     * Plays the chicken sound.
     */
    playChicken() {
        this.play(this.chicken);
    }

    /**
     * Plays the endboss sound.
     */
    playEndboss() {
        this.play(this.endboss);
    }

    /**
     * Plays the game over sound.
     */
    playGameOver() {
        this.stopSoundsExcept(this.gameOver);
        this.play(this.gameOver);
    }

    /**
     * Stops every sound except the selected one.
     * @param {Audio} excludedSound - The sound that should keep playing
     */
    stopSoundsExcept(excludedSound) {
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
