/** @module helperFunctions */

/**
 * Securely gets a html INPUT element by id
 * @param {string} id 
 * @returns {HTMLInputElement}
 */
export function getInputElement(id) {
    const elmnt = document.getElementById(id);

    if (!(elmnt instanceof HTMLInputElement)) {
        throw new Error(`Element ${id} couldn't be found or is not input`)
    }

    return elmnt;
}

/**
 * Securely gets a html element by id
 * @param {string} id 
 * @returns {HTMLElement}
 */
export function getElementById(id) {
    const elmnt = (document.getElementById(id));

    if (!elmnt) {
        throw new Error(`Element ${id} couldn't be found`)
    }
    return elmnt;
}

/**
 * Securely gets a collection of elements with the querySelector
 * @param {string} query
 * @returns {Array<HTMLElement>}
 */
export function querySelectorAll(query) {
    const nodeList = document.querySelectorAll(query);

    if (nodeList.length === 0) {
        throw new Error(`Elements found with selector ${query} are not HTMLElements`);
    }
    const elements = Array.from(nodeList).filter((node) => node instanceof HTMLElement);

    return elements;
}



// Helper function to show/hide an element by removing or adding the 'hidden' class
export function showElementWithID(id) {
    getElementById(id).classList.remove('hidden');
}

export function hideElementWithID(id) {
    getElementById(id).classList.add('hidden');
}



/**
 * @function
 * @param {string} name 
 * @param {any} value 
 * @param {number} days 
 */
export const setCookie = (name, value, days) => {
    const date = new Date();

    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
};

/**
 * @function
 * @param {string} name 
 * @returns {any} - the cookie value
*/
export const getCookie = (name) => {
    return document.cookie
        .split(';')
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith(name + "="))
        ?.split('=')[1] || "";
};


