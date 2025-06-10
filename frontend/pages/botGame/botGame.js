/**
 * @module
 * @typedef {"left"|"right"} boardSide
 * @typedef {Ship} ship
 */
import { getElementById } from '../../utility/helperFunctions.js';
import { cannonSound, splashSound } from '../../utility/audioManager.js';
import { Game, setGame } from '../../utility/state.js';
import { boardWidth, boardHeight } from '../game/gameHelpers/board.js';
import { createShips } from '../game/gameHelpers/ships.js';

let game = Game();

getElementById("backButton").addEventListener("click", () => {
    setGame(null);
    window.location.href = "/";
});

initializeFields();

gameLoop(); // starts the game with a bot shot

let strategyShips = createShips();
let occupiedFields = calculateOccupiedFields();

/** Checks win condition for both player and bot */
export function checkWinCondition() {
    if (game.own.occupiedFields.every((fieldId) => { return game.bot.firedShots.includes(fieldId) })) {
        setTimeout(() => {
            window.alert("BOT WON!")
            window.location.href = "/";
            setGame(null);
        }, 500)

    } else if (game.bot.occupiedFields.every((fieldId) => { return game.own.firedShots.includes(fieldId) })) {
        setTimeout(() => {

            window.alert("YOU WON!")
            window.location.href = "/";
            setGame(null);
        }, 500)
    }
}

/** calls checkwincondtion to check if condition are met for a win and finds if it is player on enmey turn. */
function gameLoop() {
    checkWinCondition()

    if (game.turn === "BOT") {
        getElementById("turn").innerHTML = "Bot turn!"
        setTimeout(() => {
            botFireCannon();
            game.turn = "OWN";
            setGame(game);
            gameLoop();
        }, Math.random() * 500 + 500)
    } else if (game.turn == "OWN") {
        getElementById("turn").innerHTML = "Your turn!"
        setGame(game);
    }
}

/** Opretter 2×100 felter */
function initializeFields() {
    ["left", "right"].forEach(side => {
        const board = getElementById(side + "GameBoard");
        for (let i = 0; i < boardWidth * boardHeight; i++) {
            const field = document.createElement("div");
            field.classList.add("field", side);
            field.id = side + "field" + i;
            field.dataset.side = side;
            field.dataset.index = String(i);

            if (side === "left") {
                field.addEventListener("dragover", e => { e.preventDefault(); field.style.border = "2px solid black"; });
                field.addEventListener("dragleave", e => { e.preventDefault(); field.style.border = "1px solid black"; });
            } else {
                field.addEventListener("click", fireCannon);
            }
            board.append(field);
        }
    });
    repaintBoard();

}

function repaintBoard() {
    game.own.occupiedFields.forEach((fieldId) => {
        getElementById(`leftfield${fieldId}`).classList.add("occupiedField")
    })
    game.own.firedShots.forEach((fieldId) => {
        if (game.bot.occupiedFields.includes(fieldId)) {
            getElementById(`rightfield${fieldId}`).classList.add("hitField")
        } else {
            getElementById(`rightfield${fieldId}`).classList.add("missedField")
        }
    })
    game.bot.firedShots.forEach((fieldId) => {
        if (game.own.occupiedFields.includes(fieldId)) {
            getElementById(`leftfield${fieldId}`).classList.add("hitField")
        } else {
            getElementById(`leftfield${fieldId}`).classList.add("missedField")
        }
    })
}

/** handels shots made by player event */
function fireCannon(e) {
    e.preventDefault()
    const firedAtField = e.currentTarget
    const fieldId = Number(firedAtField.dataset.index);
    game.own.firedShots.push(fieldId)

    if (game.turn === "BOT" || firedAtField.classList.contains("missedField") || firedAtField.classList.contains("hitField")) {
        return;
    }
    else if (game.bot.occupiedFields.includes(fieldId)) {
        firedAtField.classList.remove("occupiedField");
        firedAtField.classList.add("hitField");
        cannonSound.play();
    } else {
        firedAtField.classList.add("missedField");
        splashSound.play();
    }
    game.turn = "BOT";
    setGame(game);
    gameLoop();
}


/** handls the bot fire a shot */
function botFireCannon() {
    const randomnessFactor = 0.3;
    let fieldId = -1;

    // choose random target
    if (Math.random() < randomnessFactor || occupiedFields.length == 0 || game.bot.hitFields.length == 0) {
        let freeFields = Array.from(Array(100).keys())
        game.bot.missedFields.forEach((field) => freeFields.splice(freeFields.indexOf(field), 1))
        let randomIdx = Math.floor(Math.random() * freeFields.length)
        fieldId = freeFields[randomIdx];
    }

    // choose target according to strategy
    while (fieldId == -1) {
        let idx = Math.floor(Math.random() * occupiedFields.length);
        if (!game.bot.firedShots.includes(occupiedFields[idx])) {
            fieldId = occupiedFields[idx];
        }
    }

    const firedAtField = getElementById(`leftfield${fieldId}`);
    game.bot.firedShots.push(fieldId);

    if (game.own.occupiedFields.includes(fieldId)) {
        firedAtField.classList.remove("occupiedField");
        firedAtField.classList.add("hitField");
        game.bot.hitFields.push(fieldId);
        cannonSound.play();
    } else {
        game.bot.missedFields.push(fieldId);
        firedAtField?.classList.add("missedField");
        splashSound.play();
    }

    getNewShips();
    setGame(game);
}

// calls the getNewPosition function
function getNewShips() {
    if (!checkIfValidFields(calculateOccupiedFields())) {
        let freeFields = Array.from(Array(100).keys())
        game.bot.missedFields.forEach((field) => freeFields.splice(freeFields.indexOf(field), 1))
        strategyShips.forEach((ship) => ship.setcoveredFields([]));

        getNewPositions(strategyShips.length - 1, freeFields);
    }
    occupiedFields = calculateOccupiedFields();
}

/**
 * Recursive function which checks all possible ship placement and returns if a given ship place ment satisfies "checkIfValidFields" conditions.
 * modifies the 'strategyShips'
 * @param {Number} shipIdx 
 * @param {Array<field>} freeFields 
 * @returns {boolean}
 */
function getNewPositions(shipIdx, freeFields) {
    const freeFieldsCopy = [...freeFields];

    // termination
    if (shipIdx === -1) return checkIfValidFields(calculateOccupiedFields());

    for (let i = 0; i < freeFieldsCopy.length; i++) {
        for (let j = 0; j < 2; j++) {
            // reset free fields
            freeFields = freeFieldsCopy;

            strategyShips[shipIdx].setRotation(j == 0 ? "vertical" : "horizontal");
            let coveredFields = calculateCoveredFields(freeFieldsCopy[i], strategyShips[shipIdx].length, strategyShips[shipIdx].rotation);

            // check if covered fields are valid:
            if (!coveredFields) continue;
            if (!coveredFields?.every((field) => freeFieldsCopy.includes(field))) continue;
            if (coveredFields?.some((field) => game.bot.missedFields.includes(field))) continue;

            // if we are here, the ship placement fields are valid
            strategyShips[shipIdx].setcoveredFields(coveredFields);

            freeFields = freeFieldsCopy.filter(field => !coveredFields.includes(field));

            if (getNewPositions(shipIdx - 1, freeFields)) {
                return true;
            } else {
                strategyShips[shipIdx].setcoveredFields([]);
            }
        }
    }
    return false;
}


function calculateOccupiedFields() {
    let arr = [];
    strategyShips.forEach((ship) => {
        ship.getOccupiedFields()?.forEach((field) => arr.push(field))
    })
    return arr;
}



function checkIfValidFields(arr) {
    let set = new Set(arr);

    if (set.size !== 17) {
        return false;
    }

    if (arr.length !== 17) {
        return false;
    }

    for (let i = 0; i < arr.length; i++) {
        if (game.bot.missedFields.includes(arr[i])) {
            return false;
        }
    }

    for (let i = 0; i < game.bot.hitFields.length; i++) {
        if (!arr.includes(game.bot.hitFields[i])) {
            return false;
        }
    }
    if (game.bot.missedFields.some((field) => arr.includes(field))) {
        // return false;
    }
    if (!game.bot.hitFields.every((field) => arr.includes(field))) {
        // return false;
    }
    return true;
}

/**
 * Calculates the board fields a ship will cover given a starting field.
 * Returns null if placement is invalid or overlaps.
 */
export function calculateCoveredFields(start, length, rotation) {
    const startColumn = (start) % boardWidth;
    const startRow = Math.floor((start) / boardWidth);

    // check for out of bounds
    if (rotation === "vertical" && startRow + length > boardHeight) {
        return null;
    } else if (rotation === "horizontal" && startColumn + length > boardWidth) {
        return null;
    }

    const fields = [];
    for (let i = 0; i < length; i++) {
        if (rotation === "vertical") {
            fields.push(start + boardWidth * i);
        } else {
            fields.push(start + i);
        }
    }

    if (fields.some((field) => game.bot.missedFields.includes(field))) {
        return null;
    }


    return fields;
}
