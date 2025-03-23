import { initializeFields } from './game.js';
import { randomizeShipPlacement, resetShipPlacement } from './placeShips.js';
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';
import { createShips } from './ships.js';


/** Array of ship div elements
* @type {Array<Object>} */
const shipsClass = createShips();

/** Array of ship div elements 
 * @type {Array<HTMLElement>} */
const shipsDiv = querySelectorAll(".ship");

/** Array of fields that are filled by ships 
*  @type {Array<HTMLElement>}  */
const occupiedFieldArrayLeft = [];

/** Array of fields that are filled by ships 
*  @type {Array<HTMLElement>}*/
const occupiedFieldArrayRight = [];

/** Array of fields that are filled by ships 
*  @type {Array<HTMLElement>}  */
const leftFieldArray = [];

/** Array of fields that are filled by ships 
*  @type {Array<HTMLElement>}  */
const rightFieldArray = [];


let targetList = createTargetList()
let enemyHits = 0;
let ownHits = 0;
let battleBegun = 0;
let turn = 1;

initializeBotGame(); // starts bot game

function createTargetList() {
    let targetList = [];
    for (let i = 1; i <= 100; i++) {
        targetList.push(i);
    }
    console.log(targetList);
    return targetList
}


function botFireCannon() {

    const firedAtField = getElementById(`leftfield${getNextRandomTarget()}`);

    if (rightFieldArray.includes(firedAtField)) {
        alert("bot should not fire at its own board");
        return;
    }
    else if (occupiedFieldArrayLeft.includes(firedAtField)) {
        firedAtField.classList.remove("occupiedField");
        firedAtField.classList.add("hitField");
        console.log("Hit shot");
        enemyHits += 1;
    }
    else {
        firedAtField?.classList.add("missedField");
        console.log("Missed shot");
    }
    turn = 1;
    gameLoop();
    console.log("Bot fired at:", firedAtField?.id);
}

function getNextRandomTarget() {
    const randomIndex = Math.floor(Math.random() * targetList.length);
    const randomTarget = targetList[randomIndex];
    targetList.splice(randomIndex, 1);

    return randomTarget;
}

function checkWinCondition() {
    if (enemyHits === 17) {
        return 1;
    }
    else if (ownHits === 17) {
        return 2;
    }

}

if (turn == 0) {
    console.log("test")
    botFireCannon();
    turn = 1;
}

function gameLoop() {
    if (checkWinCondition() === 1) {
        alert("The bot won!");
    }
    else if (checkWinCondition() === 2) {
        alert("You have won!");
    }
    if (turn === 0) {
        console.log("Bot's Turn");
        botFireCannon();
    } else {
        console.log("Player's Turn");
    }
}

function initializeBotGame() {
    initializeFields()
    randomizeShipPlacement("right");
    gameLoop();
}

function removeButtonEventListener() {
    getElementById("resetButton").removeEventListener("click", resetShipPlacement);
    getElementById("randomizeButton").removeEventListener("click", () => randomizeShipPlacement("left"));
}

getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
getElementById("randomizeButton")?.addEventListener("click", () => randomizeShipPlacement("left"));