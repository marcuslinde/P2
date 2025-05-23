/** @module login */
import { setLoading } from '../../utility/ui.js';
import { setUser } from '../../utility/state.js';
import { getElementById, getInputElement, getCookie, setCookie } from '../../utility/helperFunctions.js';
import { login } from './authFunctions.js';


getElementById("backButton")?.addEventListener("click", () => window.location.href = "/");

const loginForm = getElementById("loginForm");
const rememberMeBox = getInputElement("rememberMe");

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
    try {
    const username = getInputElement("username").value;
    const password = getInputElement("password").value;

    const user = await login(username, password);
    
    if (user) {
    // Update frontend userState
        setUser(user);
        setUserCookies(username, password);
        window.location.href = "/"; // go to front page
    }
    } catch(err) {
        window.alert(`${err.status}: Invalid username or password`);
    } finally {
    setLoading(false);
    }

}








