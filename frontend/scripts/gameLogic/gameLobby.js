import { deleteGame, fetchGameData } from "./gameFunctions.js";
import { Game, setGame } from "../utility/state.js";
import { getElementById } from "../utility/helperFunctions.js";
import { setBanner, setLoading } from "../utility/ui.js";



setBanner(true)
checkForEnemy();


getElementById("gameCode").innerHTML = `GAME CODE: ${Game().gameCode}`
getElementById("cancelButton").addEventListener("click", handleDeleteGame)



async function checkForEnemy() {
    const gameData = await fetchGameData(Game()._id);

    setTimeout(() => { 
        console.log('Waiting for enemy'); 


        if (!gameData.players[1]) {
            checkForEnemy()
        } else {
            setGame(gameData)
            window.location.href = "/placeShips"
        }
        
        
    }, 500)
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
