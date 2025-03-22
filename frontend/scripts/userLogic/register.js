/** @module register */

import { setUser, User } from '../utility/state.js';
import { setLoading } from '../utility/ui.js';
import { getElementById, getInputElement } from '../utility/helperFunctions.js';
import { registerUser } from './userFunctions.js';

const registerForm = document.getElementById("registerForm");

registerForm?.addEventListener("submit", (e) => {
    e.preventDefault()

    if (isValidPassword()) {
        registerUser();
    }
})


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


async function handeRegister(e) {
    e.preventDefault()

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




