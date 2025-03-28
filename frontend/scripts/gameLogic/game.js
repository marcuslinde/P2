/** @module game */

import { User, Game, setGame } from '../utility/state.js';
import { setLoading } from '../utility/ui.js';
import { getElementById } from '../utility/helperFunctions.js';
import { boardHeight, boardWidth } from './board.js';
import { deleteGame, fetchGameData, fireShot } from './gameFunctions.js';


let howOftenToFetchDataInMS = 500;


const playerIndex = User()._id == Game().players[0].userId ? 0 : 1;
const enemyIndex = playerIndex == 0 ? 1 : 0;


const turnElmnt = getElementById("turn")


getElementById("exitGameButton").addEventListener("click", handleDeleteGame)

initializeGame()

/** Fetches game data, and initalizes the fields;
 * @function
 */
async function initializeGame() {
    console.log("Initializing game...")
    setLoading(true)
    await handleFetchGameData()
    if (!Game()) {
        window.alert("could not find game")
            window.location.href = "/";
    }

    if (Game()) {
        initializeFields();
        paintShipsOnLeftBoard();
        paintShotsOnBoards();
        setGameNames();

        checkTurn();

    } else {
        window.location.href = "/"
    }
    setLoading(false)
}


function setGameNames() {
    if (Game().status == 'active') {
        if (Game().players[0].name == User().name) {
            getElementById("enemyName").innerHTML = Game().players[1].name;
        } else {
            getElementById("enemyName").innerHTML = Game().players[0].name;
        }
    }
}


async function checkTurn() {
    await handleFetchGameData();

    setTimeout(() => {
        if (User()._id !== Game().currentTurn) {
            turnElmnt.innerHTML = "Enemy turn"

        } else {
            turnElmnt.innerHTML = "Your turn"
        }
        checkGameState();
        paintShotsOnBoards()
        checkWinCondition();
        checkTurn();
    }, howOftenToFetchDataInMS);


}


function checkGameState() {
    if (!Game() || Game().status !== "active") {
        window.alert("Error: no game found. Enemy might have left")
        window.location.href = "/"
    }

    if (Game().status === "active") {
        setGameNames();
    }
}

async function paintShipsOnLeftBoard() {
    Game().players[playerIndex].ships.forEach((ship) => {
        ship.location.coveredFields.forEach((field) => {
            getElementById("leftfield" + field).classList.add("occupiedField")
        })
    })
}


function paintShotsOnBoards() {
    Game().players[enemyIndex].shots.forEach((shot) => {
        let fieldElmnt = getElementById("leftfield" + shot);
        

            if (fieldElmnt.classList.contains("occupiedField")) {
                fieldElmnt.classList.add("hitField");
            } else {
                fieldElmnt.classList.add("missedField");
            }
        
    })

    Game().players[playerIndex].shots.forEach((shot) => {
        let fieldElmnt = getElementById("rightfield" + shot);

            if (checkIfHit(shot)) {
                fieldElmnt.classList.add("hitField");
            } else {
                fieldElmnt.classList.add("missedField");
            }

    })

}



async function handleFetchGameData() {

    const gameData = await fetchGameData(Game()._id);
    console.log("gamedata fetched")
    if (gameData) {
        setGame(gameData)
    } else {
        setGame(null)

    }

}










/** Creates 100 fields to fill the game boards and adds drag and drop functionalty to them
 * @function
 */
export async function initializeFields() {
    let gameboard = getElementById("leftGameBoard");
    let side = "left";

    for (let j = 0; j <= 1; j++) {
        if (j == 1) {
            gameboard = getElementById("rightGameBoard");
            side = "right";
        }

        for (let i = 0; i < boardWidth * boardHeight; i++) {
            const field = document.createElement("div");
            field.classList.add("field");
            field.classList.add(side);
            field.id = side + "field" + (i + 1);
            field.dataset.side = side;
            field.dataset.index = String(i + 1);
            // Adds hover effect when dragging ship to left squares

            if (side == "left") {
                field.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    field.style.border = "2px solid black"
                })
                field.addEventListener("dragleave", (e) => {
                    e.preventDefault();
                    field.style.border = "1px solid black"
                })


            }
            if (side == "right") {
                field.addEventListener("click", handleFireShot);
            }

            // Tilføjer field div til gameboard div
            gameboard.append(field);
        }
    }
}









async function handleFireShot(e) {
    e.preventDefault();

    if (Game().currentTurn !== User()._id) {
        return;
    }

    if (!Game().players[0].ready || !Game().players[1].ready) {
        window.alert("Waiting for ships to be placed");
        return;
    }

    const firedAtField = e.currentTarget;
    const field = parseInt(firedAtField.dataset.index, 10); // Field number

    const updatedGame = await fireShot(Game()._id, field);

    if (updatedGame) {


        if (checkIfHit(field)) {
            firedAtField.classList.add("hitField");
        } else {
            firedAtField.classList.add("missedField");
        }
        setGame(updatedGame);

        // Prevent firing the same field twice
        firedAtField.parentNode.replaceChild(firedAtField.cloneNode(true), firedAtField);
    }
}

/**
 * 
 * @param {number} field 
 * @returns {boolean}
 */
/*
function checkIfHit(field) {

    console.log("fieldNumber", field)
    let checkPlayer = 0;

    if (Game().players[0].userId == User()._id) {
        checkPlayer = 1
    }


    for (let i = 0; i < 5; i++) {
        if (Game().players[checkPlayer].ships[i].location.coveredFields.includes(field)) {
            return true;
        }
    }
    return false
} */

function checkIfHit(field) {
    const checkPlayer = Game().players[0].userId === User()._id ? 1 : 0;
    const enemyShips = Game().players[checkPlayer].ships;

    for (let i = 0; i < enemyShips.length; i++) {
        const ship = enemyShips[i];
        if (ship.location && ship.location.coveredFields.includes(field)) {
            return true;
        }
    }
    return false;
}

function checkWinCondition() {

    const playerShots = Game().players[playerIndex].shots;
    const enemyShips = Game().players[enemyIndex].ships;

    const enemyShots = Game().players[enemyIndex].shots;
    const playerShips = Game().players[playerIndex].ships;

    // For each enemy ship, check if every field is included in the attacker's shots
    const allEnemyShipsSunk = enemyShips.every(ship => {
        if (!ship.location || !ship.location.coveredFields) return false;
        return ship.location.coveredFields.every(field => playerShots.includes(field));
    });

    // For each enemy ship, check if every field is included in the attacker's shots
    const allPlayerShipsSunk = playerShips.every(ship => {
        if (!ship.location || !ship.location.coveredFields) return false;
        return ship.location.coveredFields.every(field => enemyShots.includes(field));
    });


    if (allEnemyShipsSunk) {
        alert("Victory! All enemy ships have been sunk!");
        setGame(null);
        handleDeleteGame();
        window.location.href = "/";
        
    } else if (allPlayerShipsSunk) {
        alert(`${Game().players[enemyIndex].name} won!`);
        setGame(null);
        setTimeout(()=>{
            window.location.href = "/";
        },3000)
        return true;
    }
    return false;
}

async function handleDeleteGame(e) {
    setLoading(true);
    e.preventDefault();
    const response = await deleteGame(Game()._id)
    if (response) {
        setGame(null);
        window.location.href = "/";
    }

    setLoading(false);
}


