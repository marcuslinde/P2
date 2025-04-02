/** @module audioManager */
import "https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.min.js";
import { volume } from "./state.js";
export let clickSound = new Howl({
    src: ["/resources/sounds/mouse_click.wav"],
    volume: 0.01,
});


export let music = new Howl({
    src: ["/resources/sounds/music1.mp3"],
    volume: 0,
    loop: true,
    autoplay: true
})

document.addEventListener("click", () => {
    clickSound.play();
    console.log(music.volume())

});

music.play();
console.log(music.volume(Number(volume())))

