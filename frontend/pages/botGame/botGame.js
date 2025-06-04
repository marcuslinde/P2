/**
 * @module
 * @typedef {"left"|"right"} boardSide
 * @typedef {Ship} ship
 */
import { getElementById } from '../../utility/helperFunctions.js';
import { cannonSound, splashSound } from '../../utility/audioManager.js';
import { Game, setGame } from '../../utility/state.js';
import { boardWidth, boardHeight } from '../game/gameHelpers/board.js';

let game = Game();
// holds the probabillity of a ship being on each free field. Sum is always 1.
let fieldDistribution = Array.from({ length: 100 }, (_, i) => 0.01);


getElementById("backButton").addEventListener("click", () => window.location.href = "/");
initializeFields();

gameLoop(); // starts the game with a bot shot


/** Checks win condition for both player and bot */
export function checkWinCondition() {
    if (game.own.occupiedFields.every((fieldId)=>{game.bot.firedShots.includes(fieldId)})) {
        window.alert("BOT WON!")
    } else if(game.bot.occupiedFields.every((fieldId)=>{game.own.firedShots.includes(fieldId)})) {
        window.alert("YOU WON!")
    }
}

/** calls checkwincondtion to check if condition are met for a win and finds if it is player on enmey turn. */
function gameLoop() {
    checkWinCondition()
    console.log(game)
    if (game.turn === "BOT") {
        getElementById("turn").innerHTML = "Bot turn!"
        setTimeout(() => {
            botFireCannon();
            game.turn = "OWN";
            gameLoop();
        }, 100)
    } else if (game.turn == "OWN"){
        console.log("my turn")
        getElementById("turn").innerHTML = "Your turn!"
    }
}

/** Opretter 2×100 felter */
function initializeFields() {
    ["left", "right"].forEach(side => {
        const board = getElementById(side + "GameBoard");
        for (let i = 0; i <= boardWidth * boardHeight - 1; i++) {
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
      game.own.occupiedFields.forEach((fieldId)=>{
        getElementById(`leftfield${fieldId}`).classList.add("occupiedField")
    })
    game.own.firedShots.forEach((fieldId)=>{
        if (game.bot.occupiedFields.includes(fieldId)) {
            getElementById(`rightfield${fieldId}`).classList.add("hitField")
        } else {
            getElementById(`rightfield${fieldId}`).classList.add("missedField")
        }
    })
     game.bot.firedShots.forEach((fieldId)=>{
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
        game.own.firedShots.push(firedAtField.dataset.index)

    if (game.turn === "BOT" || firedAtField.classList.contains("missedField") || firedAtField.classList.contains("hitField")) {
        return;
    }
    else if (game.bot.occupiedFields.includes(firedAtField)) {
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
export function botFireCannon() {
    const posWeight = 200;
    const negWeight = 0.005;

    const fieldId = getNextRandomTarget();
    const firedAtField = getElementById(`leftfield${fieldId}`);
    game.bot.firedShots.push(fieldId);
    fieldDistribution[fieldId] = 0;


    if (game.own.occupiedFields.includes(fieldId)) {
        firedAtField.classList.remove("occupiedField");
        firedAtField.classList.add("hitField");
        
        cannonSound.play();

        [10, -10, 1, -1].forEach((i) => {
            if (checkIfValidField(fieldId + (i))) { fieldDistribution[fieldId + (i)] *= posWeight }
        })

    } else {
        [10 -10, 1, -1].forEach((i) => {
            if (checkIfValidField(fieldId + (i))) { fieldDistribution[fieldId + (i)] *= negWeight };
        })
        firedAtField?.classList.add("missedField");
        splashSound.play();
    }
    correctDistribution();
    setGame(game);
}

function checkIfValidField(fieldId) {
    return (fieldId < 100 && fieldId >= 0 && fieldDistribution[fieldId] !== 0) ? true : false;
}

/** Takes the fieldDistribution, and makes sure it sums up to one, by multiplying each field probabillity with the overflow */
function correctDistribution() {
    let probSum = fieldDistribution.reduce((p, i) => { return i += p })

    if (probSum !== 1) {
        let overflow = 1 / probSum

        for (let i = 0; i < 100; i++) {
            fieldDistribution[i] *= overflow;
        }

    }
    probSum = fieldDistribution.reduce((p, i) => { return i += p })
}

/** Gets random target for the bot to shot at */
function getNextRandomTarget() {
    let randomProb = Math.random();
    let sum = 0;
    let randomIdx = -1;

    for (let i = 0; i < 100; i++) {
        sum += fieldDistribution[i];
        if (sum > randomProb) {

            randomIdx = i;
            break;
        }
    }
    return randomIdx;
}