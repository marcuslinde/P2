/** @module createGame */

import { getElementById, getInputElement } from "../../scripts/utility/helperFunctions.js";
import { User, setGame } from '../../scripts/utility/state.js';
import { setLoading } from "../../scripts/utility/ui.js";
import { createGame } from "../game/gameFunctions.js";


if (!User()) {
    window.location.href = "/login"; // go to login page
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
    window.location.href = '/gameLobby';
  }

  setLoading(false);
}






