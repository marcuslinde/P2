/** @module login */
import { setLoading } from '../../utility/ui.js';
import { setUser, User } from '../../utility/state.js';
import { getElementById, getInputElement, getCookie, setCookie } from '../../utility/helperFunctions.js';
import { login } from './userFunctions.js';

const loginForm = getElementById("loginForm");
const rememberMeBox = getInputElement("rememberMe");

const apiBase = '/'

document.addEventListener("DOMContentLoaded", getUserCookies);

/** gets the username and passwords values that are saved in the cookies
 * @function
 */
function getUserCookies(e) {
    e.preventDefault();
    if (getCookie("rememberMe") === "true") {
        getInputElement("username").value = getCookie("username");
        getInputElement("password").value = getCookie("password");
        rememberMeBox.checked = true;
    }
}

/** sets the username and password cookies for the user
 * @function
 */
function setUserCookies(username, password) {
    if (rememberMeBox.checked) {
        setCookie("username", username, 5);
        setCookie("password", password, 5);
        setCookie("rememberMe", true, 5);
    } else {
        setCookie("username", "", -1);
        setCookie("password", "", -1);
        setCookie("rememberMe", "", -1);
    }
}


loginForm.addEventListener("submit", handleLogin)


async function handleLogin(e) {
    e.preventDefault()
    setLoading(true);

    const username = getInputElement("username").value;
    const password = getInputElement("password").value;

    const userId = await login(username, password);
    
    if (userId) {
    // Update frontend userState
        setUser(userId);
        setUserCookies(username, password);
        window.location.href = "/"; // go to front page
    }
    setLoading(false);

}








