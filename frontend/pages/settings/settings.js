/** @module settings */
import '../../utility/redirection.js'
import { setVolume,volume } from "../../utility/state.js";
import { getInputElement,getElementById } from "../../utility/helperFunctions.js";
import { music } from "../../utility/audioManager.js";



getElementById("backButton").addEventListener("click", () => window.location.href = "/");

const volumeElmmt = getInputElement('volume');

volumeElmmt.value = volume() ?? "0.5"; // 0.5 is default volume


volumeElmmt.addEventListener("change", handleVolumeChange);

/**
 * Handles the volume change event.
 * @param {Event} e - The event object.
 */
function handleVolumeChange(e) {
    const target = e.target;
    if (target instanceof (HTMLInputElement)) {
        setVolume(target.value)
        music.volume(Number(target.value));
    }
}



