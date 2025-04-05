/** @module audioManager */
import "https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.min.js";

export let clickSound = new Howl({
    src: ["/resources/sounds/mouse_click.wav"],
    volume: 0.01,
});


export let music = new Howl({
    src: ["/resources/sounds/music1.mp3"],
    volume: 0.1,
    loop: true,
    autoplay: true
})

document.addEventListener("click", () => {
    clickSound.play();
    console.log(music.volume())

}); 

music.play(); 


export let cannonSound = new Howl({
    src: ["/resources/sounds/bomb1.mp3"],
    volume: 0.5, 
})

export let splashSound = new Howl({
    src: ["/resources/sounds/splash.wav"],
    volume: 0.5, 
})

export let lose = new Howl({
    src: ["/resources/sounds/lose.mp3"],
    volume: 0.5, 
})

