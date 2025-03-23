/** @module audioManager */


var click = new Howl({
    src: ["../resources/sounds/mouse_click.wav"],
    volume: 0.1,
});

var music = new Howl({
    src: ["../resources/sounds/music2.mp3"],
    volume: 0.5,
    loop: true,
    autoplay: true
})

document.addEventListener("click", () => {
    click.play();
});


