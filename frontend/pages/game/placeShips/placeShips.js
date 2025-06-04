

import { Game, setGame, User } from "../../../utility/state.js";
import { setLoading } from "../../../utility/ui.js";
import { getElementById, querySelectorAll } from "../../../utility/helperFunctions.js";
import { initializeBoardFields, resetShipPlacement, randomizeShipPlacement, ships } from "./placeShipsFunctionality.js";
import { getGameByID, submitShips, deleteGame } from "../gameHelpers/gameFunctions.js"
import { gameUpdate, joinRoom, socket } from "../../../utility/socketFunctions.js";



initializeBoardFields();
joinRoom(Game().gameCode)

socket.on("gameUpdate", () => {
    checkIfReady();
})
// Event listeners for game control buttons
getElementById("exitGameButton").addEventListener("click", handleDeleteGame);
getElementById("resetButton").addEventListener("click", resetShipPlacement);
getElementById("randomizeButton").addEventListener("click", ()=>{randomizeShipPlacement(ships)});
getElementById("readyButton").addEventListener("click", handleSubmitShips);


/**
 * Recursively checks if both players are ready at regular intervals.
 * Fixed race condition by moving the timeout inside the promise resolution.
 */
async function checkIfReady() {

    const gameData = await getGameByID(Game()._id);

    if (!gameData) {
        window.alert("Enemy left the game!")
        setGame(null)
        setTimeout(() => {
            window.location.href = "/"
        }, 1);
    }

    if (gameData && gameData.players &&
        gameData.players[1].ready && gameData.players[0].ready) {
        setGame(gameData);
        window.location.href = "/game";
    }


}


/** Submits the ship placement to the game server. */
async function handleSubmitShips(e) {
    e.preventDefault();
    try {
        setLoading(true);
        // @ts-ignore: Check if all ships are placed
        const allShipsPlaced = ships.every(ship => ship.coveredFields.length > 0);
        if (!allShipsPlaced) {
            window.alert("Please place all ships before submitting");
            setLoading(false);
            return;
        }

        const updatedGame = await submitShips(Game()._id, User()._id, ships);
        if (updatedGame) {
            setGame(updatedGame);
            gameUpdate(Game().gameCode)
        }
    } catch (error) {
        console.error("Error in handleSubmitShips:", error);
        setLoading(false);
    }
}

/** Deletes the game and redirects to the front page.*/
async function handleDeleteGame(e) {
    e.preventDefault();
    try {
        setLoading(true);
        const isDeleted = await deleteGame(Game()._id);

        if (isDeleted) {
            setGame(null);
            window.location.href = "/";
        } else {
            window.alert("Could not delete game");
        }
    } catch (error) {
        console.error("Error in handleDeleteGame:", error);
        window.alert("Error deleting game");
    } finally {
        setLoading(false);
    }
}


