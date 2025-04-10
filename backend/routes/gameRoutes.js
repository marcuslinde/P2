import express from "express";
import {
    createGame,
    joinGame,
    submitShips,
    getGameData,
    deleteGame,
    fireShot,
    updateGameStatus,
    getActiveGamesForUser
} from "../controllers/gameController.js";

const router = express.Router();

// Route to create a new game (lobby creation)
router.post('/create', createGame);

// Route for a player to join a game using the lobby code
router.put('/join', joinGame);

// Route to update game details (e.g., ship placements and readiness)
router.put('/submitShips', submitShips);

// Fires a shot;
router.put('/fireShot', fireShot);

// Updates game status
router.put('/updateGameStatus', updateGameStatus);
// Route to get data of game
router.get('/data', getGameData);

router.delete('/delete/:id', deleteGame);


router.get('/active', getActiveGamesForUser);

export default router;