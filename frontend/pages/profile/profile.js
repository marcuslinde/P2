/** @module profile */

import { User } from "../../utility/state.js";
import { getElementById } from "../../utility/helperFunctions.js";
import { setBanner } from "../../utility/ui.js";
import { deleteUser } from "../../utility/userFunctions.js";
 

const apiBase = '/api/user'

getElementById("deleteUserButton").addEventListener("click", handleDeleteUser)
getElementById("cancelButton").addEventListener("click", handleCancel)
getElementById("deleteUserConfirmButton").addEventListener("click", handleDeleteUserConfirmButton)

if (!User()) {
    window.location.href = "/login"; // go to front page
}

getElementById("backButton")?.addEventListener("click", () => window.location.href = "/");

async function fetchUserStats(userId) {
  const response = await fetch(apiBase + `/${userId}/stats`);
  const stats = await response.json();

    
    getElementById('won').innerHTML = "Games won: " + `${stats.stats.wins}`; 
    getElementById('ratio').innerHTML = "Win ratio: " + `${stats.stats.winRatio}`; 
    getElementById('totalGames').innerHTML = "Total games: " + `${stats.stats.totalGames}`; 
    getElementById('username').innerHTML = "Username: " + `${User().name}`; 
    getElementById('mail').innerHTML = "Mail: " + `${User().email}`;
  }

fetchUserStats(`${User()._id}`);

async function handleCancel(e) {
  e.preventDefault()
  setBanner(false)
}

async function handleDeleteUser(e) {
  e.preventDefault()
  setBanner(true)
}

async function handleDeleteUserConfirmButton(e){
  e.preventDefault()
  const isDeleted = await deleteUser(User()._id);

  if (isDeleted) {
      window.location.href = "/"
  } else {
      window.alert("could not delete user");
  }
}