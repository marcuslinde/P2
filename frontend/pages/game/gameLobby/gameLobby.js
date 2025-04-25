import { deleteGame, getGameByID } from "../gameHelpers/gameFunctions.js";
import { Game, setGame } from "../../../utility/state.js";
import { getElementById } from "../../../utility/helperFunctions.js";
import { setBanner, setLoading } from "../../../utility/ui.js";
import { joinRoom, socket } from "../../../utility/socketFunctions.js";

setBanner(true)
joinRoom(Game().gameCode)

getElementById("gameCode").innerHTML = `GAME CODE: ${Game().gameCode}`
getElementById("cancelButton").addEventListener("click", handleDeleteGame)

socket.on("gameUpdate", (room)=>{
    updateGame();
})

async function updateGame() {
    const gameData = await getGameByID(Game()._id);
    if (!gameData.players[1]) {
        // checkForEnemy()
    } else {
        setGame(gameData)
        window.location.href = "/placeShips"
    }
}


async function handleDeleteGame(e) {
    e.preventDefault()
    setLoading(true)
    const isDeleted = await deleteGame(Game()._id);

    if (isDeleted) {
        setGame(null)
        window.location.href = "/"
    } else {
        window.alert("could not delete game");
    }
    setLoading(false);
}
