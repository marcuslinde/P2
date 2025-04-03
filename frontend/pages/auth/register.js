/** @module register */

import { setUser } from '../../utility/state.js';
import { setLoading } from '../../utility/ui.js';
import { getElementById, getInputElement } from '../../utility/helperFunctions.js';
import { registerUser } from './userFunctions.js';

getElementById("backButton")?.addEventListener("click", () => window.location.href = "/");

const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", handleRegister)



/** validates the password the user has input
 * @returns {boolean} - true if password is good
 */

function isValidPassword() {
    const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const password = getInputElement("password").value;
    const repeatPassword = getInputElement("repeatPassword").value;

    if (!password || !repeatPassword) {
        window.alert("Invalid password")
        Error("element returned null")
        return false;
    }

    if (password.length < 6) {
        getElementById("password").style.border = "1px solid red"
        window.alert("Passwords must contain at least 6 characters")
        return false
    }

    if (password !== repeatPassword) {
        getElementById("repeatPassword").style.border = "1px solid red"

        window.alert("Passwords do not match")
        return false
    }

    return true;
}


/**
 * handles the registration process by calling the "registerUser" function and updating the ui 
 */
async function handleRegister(e) {
    e.preventDefault()

    if (!isValidPassword()) {
        return;
    }

    setLoading(true);

    
    const userData = {
        name: getInputElement("username").value,
        email: getInputElement("email").value,
        password: getInputElement("password").value,
    }

    const user = await registerUser(userData);

    if (user) {

        // Update frontend userState
        setUser(user);
        window.location.href = "/"; // go to front page

    }
    setLoading(false);
}




