/** 
 * @module game.js 
 * @typedef {number} field - defines a field so we get errors
 * @typedef {Ship} ship - defines a ship so we can see errors
 * @typedef {"left"|"right"} side
*/
import { User, Game, setGame } from '../../../utility/state.js';
import { getElementById } from '../../../utility/helperFunctions.js';
import { boardHeight, boardWidth } from '../gameHelpers/board.js';
import { Ship } from '../gameHelpers/ships.js';

const howOftenToFetchDataInMS = 500;

const playerIndex = User()._id == Game().players[0].userId ? 0 : 1;
const enemyIndex = playerIndex == 0 ? 1 : 0;

if (Game().status !== "finished") {
    window.location.href = "/"
}

initializeFields();
paintShipsOnBoards();
paintShotsOnBoards();
setGameNames();

getElementById("homeButton").addEventListener("click",() =>{
    setGame(null)
    window.location.href = "/"
})




/** Creates 100 fields to fill the game boards and adds drag and drop functionalty to them */
async function initializeFields() {
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

            // Tilføjer field div til gameboard div
            gameboard.append(field);
        }
    }
}


/** Sets the visible player names  */
function setGameNames() {
    getElementById("enemyName").innerHTML = Game().players[playerIndex].name;
    getElementById("enemyName").innerHTML = Game().players[enemyIndex].name;
    const winnerDisplayElement = getElementById("winnerDisplay")

    winnerDisplayElement.innerHTML = "Well fought, sailor!"
    if (Game().winner === User()._id) {
        // winnerDisplayElement.innerHTML = `Congratulations sailor, you won the battle!`
    } else {
        // winnerDisplayElement.innerHTML = `${Game().players[enemyIndex].name} won the battle!`
    }
}



/** paints the ships on the left board*/
async function paintShipsOnBoards() {
    Game().players[playerIndex].ships.forEach((ship) => {
        ship.coveredFields.forEach((field) => {
            getElementById("leftfield" + field).classList.add("occupiedField")
        })
    })
    Game().players[enemyIndex].ships.forEach((ship) => {
        ship.coveredFields.forEach((field) => {
            getElementById("rightfield" + field).classList.add("occupiedField")
        })
    })
}

/** Paints the shots on both boards */
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
/** Helper function to check if a shot hits a ship or not. */
function checkIfHit(field) {
    const checkPlayer = Game().players[0].userId === User()._id ? 1 : 0;

    /** @type {Array<ship>} */
    const enemyShips = Game().players[checkPlayer].ships;

    for (let i = 0; i < enemyShips.length; i++) {
        const ship = enemyShips[i];
        if (ship.coveredFields && ship.coveredFields.includes(field)) {
            return true;
        }
    }
    return false;
}
