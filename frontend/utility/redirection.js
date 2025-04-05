import {Game, setUser, User, setGame } from './state.js'
import { setLoading } from './ui.js'
import { getUserById } from '../pages/auth/userFunctions.js'
import { getGameByID } from '../pages/game/gameHelpers/gameFunctions.js'


// check for user status and redirect to right pages
if (!User() || !User()._id || !User().name) {
    setUser(null)
    window.location.href = "/login"
} else {
    await checkForUserInDB()
}

// check for game status and redirect to right pages
if (Game()) {
    // check for game in database
    await checkForGameInDB()

    // redirect to right page
    if (Game().status = "waiting") {
       window.location.href = "/gameLobby"
    } else if (Game().status = "placingShips") {
        window.location.href = "/placeShips"
    } else if (Game().status = "active") {
        window.location.href = "/game"
    } else if (Game().status = "finished") {
        setGame(null)
    } else {
        throw new Error("error getting game state")
    }
} else {
    // if game doesn't exist, look in DB for active games with user id

}


/** Gets the user by id, to check if still exists in database */
async function checkForUserInDB() {
    setLoading(true)
    const user = await getUserById(User()._id)

    if (user) {
        setUser(user);
    } else {
        setUser(null)
        window.location.href = "/login"
    }
    
    setLoading(false)
}



/** Gets the game by id, to check if exists in database */
async function checkForGameInDB() {
    setLoading(true)

    const game = await getGameByID(Game()._id)
    console.log("game", game)

    if (game) {
        setGame(game);
    } else {
        setGame(null)
    }
    
    setLoading(false)
}



