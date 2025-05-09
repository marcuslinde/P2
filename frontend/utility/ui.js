/** @module loading */

import { getElementById } from "./helperFunctions.js";


function displayLoader() {
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