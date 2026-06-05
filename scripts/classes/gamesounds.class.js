class GameSounds {
    character = new Audio("assets/audio/character.mp3");
    steps = new Audio("assets/audio/steps.mp3");
    jump = new Audio("assets/audio/jump.mp3");
    chicken = new Audio("assets/audio/chicken.mp3");
    endboss = new Audio("assets/audio/endboss.mp3");
    coin = new Audio("assets/audio/coin.mp3");
    bottle = new Audio("assets/audio/bottle.mp3");
    splash = new Audio("assets/audio/splash.mp3");

    muted = false;
    volume = 0.5;

    constructor() {
        [this.coin, this.bottle, this.splash].forEach(sound => {
            sound.volume = this.volume;
        });
    }

    play(sound) {
        if (this.muted) return;

        sound.currentTime = 0;
        sound.play();
    }

    playCoin() {
        this.play(this.coin);
    }

    playBottleThrow() {
        this.play(this.bottle);
    }

    playSplash() {
        this.play(this.splash);
    }

    toggleMute() {
        this.muted = !this.muted;
    }
}