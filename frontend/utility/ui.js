/** @module loading */

import { getElementById, getInputElement } from "./helperFunctions.js";

let isLoading = false;

function displayLoader(e) {
    const loader = document.createElement("div")
    loader.id = "loader";
    document.body.appendChild(loader);

    const screenCover = document.createElement("div")
    screenCover.id = "screenCover";
    document.body.appendChild(screenCover);
}

function removeLoader() {
    document.body.removeChild(getElementById("loader"))
    document.body.removeChild(getElementById("screenCover"))

}

export const setLoading = (bool) => {
    isLoading = bool;
    if (bool) {
        displayLoader();
    } else {
        removeLoader();
    } 
}

/**
 * 
 * @param {boolean} bool 
 */
export const setBanner = (bool) => {
    const banner = getElementById("banner");
    if (bool) {
        banner.style.visibility = "visible"
    } else {
        banner.style.visibility = "hidden"
    }
}