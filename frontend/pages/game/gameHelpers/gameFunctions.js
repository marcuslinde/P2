const apiBase = '/api/game';

/**
 * Calls the api for creating game, and returns the response.
 * @param {string} userId 
 * @param {string} gameCode 
 * @returns {Promise<object>}  
 */
export async function createGame(userId, gameCode, name) {
    try {
        const response = await fetch(apiBase + "/create", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, gameCode: gameCode, name: name })
        });

        if (!response.ok) {
            window.alert(response.statusText)
            throw new Error(`Server error: ${response.status}`);
        }

        const gameData = await response.json();

        return gameData;

    } catch (error) {
        console.error("Error creating game:", error);
    }
}

/**
 * Checks for game status
 * @param {string} gameId 
 * @returns {Promise<object>}  
 */
export async function getGameByID(gameId) {
    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(apiBase + `/data?gameId=${gameId}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
        }

        const gameData = await response.json();

        return gameData;
    } catch (error) {
        console.error("Error fetching gameData:", error);

    }
}

/**
 * Sends a POST request to join a game using the provided lobby code and user ID.
 * @param {string} userId - The user's ID.
 * @param {string} gameCode - The game code entered by the user.
 * @returns {Promise<object>}  
*/
export async function joinGame(userId, gameCode, name) {

    try {
        const response = await fetch(apiBase + "/join", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, gameCode, name })
        });

        if (!response.ok) {
            window.alert(response.statusText)
            throw new Error(`Server error: ${response.status}`);
        }

        const gameData = await response.json();

        return gameData;

    } catch (error) {
        console.error("Error joining game:", error);
    }

}

/**
 * calls the api for deleting games
 * @param {string} gameId 
 * @returns {Promise<object>} 
 */
export async function deleteGame(gameId) {

    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(apiBase + `/delete/${gameId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`)
        };

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error checking game state:", error);
    }
}

/**
 * Update the game state on the backend with the player's board and ready status.
 * @param {string} gameId
 * @param {string} userId - The current user's ID.
 * @param {object} ships - The ships object including name, length, rotation and location
 * @returns {Promise<object>} - The updated game data from the backend.
 */
export async function submitShips(gameId, userId, ships) {
    try {
        const response = await fetch(apiBase + "/submitShips", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gameId: gameId, userId: userId, ships: ships })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedGame = await response.json();
        return updatedGame;
    } catch (error) {
        console.error("Error updating game:", error);
        throw error;
    }
}

/**
 * 
 * @param {string} gameId 
 * @param {number} field 
 * @returns {Promise<object>}  
 */
export async function fireShot(gameId, userId, field) {

    const response = await fetch(apiBase + "/updateGame", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, userId, field })
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();

}

/*
// Checks for game status
async function checkGameStatus() {

    if (!gameID()) return;

    try {
        // Fetch from the dedicated endpoint
        const response = await fetch(apiBase + `/data?gameId=${gameID()}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const gameData = await response.json();

        if (gameData.status === 'active') {
            setBanner(true);
            clearInterval(checkGameStatusTimer); // Removes the timer if game status is active
        }
    } catch (error) {
        console.error("Error checking game state:", error);
    }
}


async function checkCurrentTurn() {
    const userId = User()._id;

    if (!gameID()) return;

    try {
        const response = await fetch(apiBase + `/data?gameId=${gameID()}`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const gameData = await response.json();

        if (gameData.currentTurn === userId) {
            turn = 1;
            clearInterval(checkCurrentTurnTimer);
        }
    } catch (error) {
        console.error("Error checking game state:", error);
    }
}
*/


export async function handleActiveGameRedirection(user) {
    if (!user || !user._id) return;
    try {
        const activeGames = await fetchActiveGames(user._id);
        if (activeGames.length > 0) {
            window.location.href = `/game/${activeGames[0]._id}`; //
        }
    } catch (error) {
        console.error("Active game redirection failed:", error);
    }
}



export async function fetchActiveGames(userId) {
    try {
        const response = await fetch(apiBase + `/active?userId=${userId}`);
        if (!response.ok) {
            // If no active game exists, our backend returns 404.
            if (response.status === 404) return [];
            throw new Error(`Server error: ${response.status}`);
        }
        const activeGames = await response.json();
        return activeGames;
    } catch (error) {
        console.error("Error fetching active games:", error);
        throw error;
    }
}