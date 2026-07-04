class GameSounds {
    character = new Audio("assets/audio/character.mp3");
    steps = new Audio("assets/audio/steps.mp3");
    jump = new Audio("assets/audio/jump.mp3");
    chicken = new Audio("assets/audio/chicken.mp3");
    endboss = new Audio("assets/audio/endboss.mp3");
    coin = new Audio("assets/audio/coin.mp3");
    bottle = new Audio("assets/audio/bottle.mp3");
    splash = new Audio("assets/audio/splash.mp3");
    backgroundMusic = new Audio("assets/audio/background/sonican-gypsy-tango-acoustic-folk-loop-469606.mp3");

    muted = false;
    volume = 0.5;
    backgroundVolume = 0.25;

    constructor() {
        this.getAllSounds().forEach(sound => sound.volume = this.volume);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = this.backgroundVolume;
    }

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
            this.backgroundMusic
        ];
    }

    play(sound) {
        if (this.muted) return;

        sound.currentTime = 0;
        const playPromise = sound.play();
        if (playPromise) {
            playPromise.catch(() => {});
        }
    }

    playJump() {
        this.play(this.jump);
    }

    playCoin() {
        this.play(this.coin);
    }

    playBottleCollect() {
        this.play(this.bottle);
    }

    playBottleThrow() {
        this.play(this.bottle);
    }

    playSplash() {
        this.play(this.splash);
    }

    playChicken() {
        this.play(this.chicken);
    }

    playEndboss() {
        this.play(this.endboss);
    }

    playBackgroundMusic() {
        if (this.muted) return;

        const playPromise = this.backgroundMusic.play();
        if (playPromise) {
            playPromise.catch(() => {});
        }
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    setVolume(volume) {
        this.volume = Math.min(Math.max(volume, 0), 1);
        this.getAllSounds().forEach(sound => sound.volume = this.volume);
        this.backgroundMusic.volume = this.backgroundVolume;
    }

    toggleMute() {
        this.muted = !this.muted;
    }
}
