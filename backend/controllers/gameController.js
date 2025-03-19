import Game from "../models/game.js";


/**
 * // Create a new game (lobby creation)
 * @param {any} req 
 * @param {any} res 
 */
export const createGame = async (req, res) => {
  try {
    const { gameCode, userId } = req.body;
    if (!gameCode || !userId) {
      return res.status(400).json({ error: 'gameCode and userId are required' });
    }

    // Ensure the lobby code is unique
    const existingGame = await Game.findOne({ gameCode });
    if (existingGame) {
      return res.status(400).json({ error: 'game code already in use' });
    }

    // Create a game document with the creator as the only player initially
    const newGame = new Game({

      gameCode,
      players: [{
        userId,
        ships: [],
        shots: [],
        ready: false
      }],//board: { ships: [], shots: [] }, //<----
      status: 'waiting'
    });

    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Join a game using a lobby code
 * @param {any} req 
 * @param {any} res 
 */
export async function joinGame(req, res) {
  try {
    const { userId, gameCode } = req.body;
    const game = await Game.findOne({ gameCode });
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Prevent adding more than 2 players
    if (game.players.length >= 2) {
      return res.status(400).json({ error: 'Game is already full' });
    }

    // Ensure the user is not already in the game
    if (game.players.some(player => player.userId.toString() === userId)) {
      return res.status(400).json({ error: 'User already joined the game' });
    }

    // Ensure the user is not already in the game
    if (game.players.some(player => player.userId.toString() === userId)) {
      return res.status(400).json({ error: 'User already joined the game' });
    }
    
    // Add the new player
    game.players.push({
      userId,
      ships: [],
      shots: [],
      ready: false
    });
    
    // If both players have joined, update the game status to 'active'
    if (game.players.length === 2) {
      game.status = 'active';
      // Optionally, set the currentTurn (e.g., to the first player's userId)
      game.currentTurn = game.players[0].userId;
    }
    
    const updatedGame = await game.save();
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}



/**
 * Update game details (e.g., updating ship placements and setting "ready")
 * @param {any} req 
 * @param {any} res 
 */
export const updateGame = async (req, res) => {
  try {

    // Expect gameId to be sent in the request body (this is the _id from MongoDB)
    const { gameId, userId, ships, shots, ready } = req.body;
    console.log("Updating game with ID:", gameId); // Debug log
    
    if (!userId || !gameId) {
      return res.status(400).json({ error: 'userId and gameId are required' });

    }

    const game = await Game.findById(gameId);
    console.log("Game found:", game); // Debug log

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Find the player in the game document
    const player = game.players.find(player => player.userId.toString() === userId);
    if (!player) {
      return res.status(400).json({ error: 'User not part of this game' });
    }

    // Update board (ship placements) and readiness flag if provided
    if(ships){
      player.ships=ships;
    }
    if(shots){
      player.shots=shots;
    }
    if (typeof ready === 'boolean') {
      player.ready = ready;
    }

    // If both players have joined and are ready, update the game status and set the current turn
    if (game.players.length === 2 && game.players.every(p => p.ready)) {
      game.status = 'active';
      game.currentTurn = game.players[0].userId;
    }

    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


export async function getGameData(req, res) {
  try {
    const { gameId } = req.query;
    if (!gameId) {
      return res.status(400).json({ error: 'No gameId provided' });
    }
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.status(200).json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}