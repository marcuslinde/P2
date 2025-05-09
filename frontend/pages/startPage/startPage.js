/** @module register */
import '../../utility/redirection.js'
import '../../utility/audioManager.js';
import { User, setUser } from '../../utility/state.js';
import { getElementById } from '../../utility/helperFunctions.js';
import { showElementWithID, hideElementWithID } from '../../utility/helperFunctions.js';
import { handleActiveGameRedirection } from '../game/gameHelpers/gameFunctions.js';

// Adjust display based on login state
if (User()) {
    hideElementWithID("login");
    hideElementWithID("register")
    showElementWithID("joinGame");
    showElementWithID("createGame");
    showElementWithID("createBotGame")
    showElementWithID("signOut");
    showElementWithID("settings");
    showElementWithID("profileButton");
    handleActiveGameRedirection(User());
} else {
    showElementWithID("login");
    showElementWithID("register")
    hideElementWithID("joinGame");
    hideElementWithID("createGame");
    hideElementWithID("signOut");
    showElementWithID("settings");
    hideElementWithID("profileButton");
}

const signOutButton = getElementById("signOut");
signOutButton.addEventListener("click", signOut);

function signOut() {
    setUser(null); // Removes user from browser storage
    window.location.reload();
}


