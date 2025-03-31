/** @module profile */


import { User } from "./utility/state.js";
import { getElementById } from "./utility/helperFunctions.js";

if (!User()) {
    window.location.href = "/login"; // go to front page
}


getElementById('username').innerHTML = "Username: " + `${User().name}`; 
getElementById('userId').innerHTML = "User ID: " + `${User()._id}`; 
getElementById('email').innerHTML = "Email: " + `${User().email}`; 
