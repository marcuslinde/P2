/** @module profile */

import { User } from "../../utility/state.js";
import { getElementById } from "../../utility/helperFunctions.js";

const apiBase = '/api/user'

if (!User()) {
    window.location.href = "/login"; // go to front page
}

getElementById("backButton")?.addEventListener("click", () => window.location.href = "/");

async function fetchUserStats(userId) {
    const response = await fetch(apiBase + `/${userId}/stats`);
    const stats = await response.json();

    console.log(stats);
    
    getElementById('won').innerHTML = "Games won: " + `${stats.stats.wins}`; 
    getElementById('ratio').innerHTML = "Win ratio: " + `${stats.stats.winRatio}`; 
    getElementById('totalGames').innerHTML = "Total games: " + `${stats.stats.totalGames}`; 
    getElementById('username').innerHTML = "Username: " + `${User().name}`; 
    getElementById('mail').innerHTML = "Mail: " + `${User().email}`;
  }

fetchUserStats(`${User()._id}`);