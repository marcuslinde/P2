/** @module createGame */

import { getElementById, getInputElement } from "../utility/helperFunctions.js";
import { User, setGame } from '../utility/state.js';
import { setLoading } from "../utility/ui.js";
import { createGame } from "./gameFunctions.js";



if (!User()) {
    window.location.href = "/login"; // go to front page
}

const form = getElementById("createGameForm");


form.addEventListener("submit", handleCreateGame);

async function handleCreateGame(e) {
  e.preventDefault();
  setLoading(true);

  const gameCodeInput = getInputElement("gameCodeInput");
  const gameCode = gameCodeInput.value.trim();
  
  const gameData = await createGame(User()._id, gameCode, User().name);

  if (gameData) {
    // Store the _id from the MongoDB document
    setGame(gameData);
    window.location.href = '/game';
  }

  setLoading(false);
}






