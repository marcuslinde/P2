//import { initializeFields, randomizeShipPlacement, resetShipPlacement } from './game.js'; 
import { getElementById, querySelectorAll } from '../utility/helperFunctions.js';
import { createShips } from './ships.js';
import { boardHeight, boardWidth } from './board.js';

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
let botGameState = "";
let turn = 1;


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

function removeButtonEventListener() {
    getElementById("resetButton").removeEventListener("click", resetShipPlacement);
    getElementById("randomizeButton").removeEventListener("click", () => randomizeShipPlacement("left"));
}


/** Tilføjer elementet occupiedField til de fields med skibe på
 * @function
 */
function assignOccupiedFields(coveredFields, side) {
    coveredFields.forEach(index => {
        const fieldElement = getElementById(side + "field" + (index));
        if (fieldElement) {
            fieldElement.classList.add("occupiedField");
            if (side === "left") {
                occupiedFieldArrayLeft.push(fieldElement);
            } else if (side === "right"){
                occupiedFieldArrayRight.push(fieldElement);
            }
        }
    });
}

/** checks if there already are any ships on the fields
 * @function
 * @param {any} coveredFields
 */
function checkForOverlap(coveredFields) {
    for (let i = 0; i < coveredFields.length; i++) {
        const fieldElement = getElementById("leftfield" + (coveredFields[i]));
        if (occupiedFieldArrayLeft.includes(fieldElement)) {
            return true;
        }
    }
    return false;
}


/** Checks if the ship is out of the board bounds
 * @function
 */
function checkForOutOfBounds(startRow, startColumn, shipLength, rotation) {
    if (rotation % 180 === 0) { // Hvis lodret
        return (startRow + shipLength > boardHeight);
    } else { // Hvis vandret
        return (startColumn + shipLength > boardWidth);
    }
}

function randomizeShipPlacement(boardSide) {
    resetShipPlacement();
    // Går over arrayet af ship classes for at placere alle skibene
    shipsClass.forEach (ship => {
        let placed = false;
        while (!placed) {
            // Sætter skibets rotation til 0 hvis et tilfældigt tal fra 0-1 er mindre en 0.5
            let rotation = Math.random() < 0.5 ? 0 : 90;
            let row = Math.floor(Math.random() * boardHeight);
            let col = Math.floor(Math.random() * boardWidth);
            
            if (checkForOutOfBounds(row, col, ship.length, rotation)) continue; // Prøver en ny position
            
            let droppedField = row * boardWidth + col + 1;
            let coveredFields = [];
            
            if (rotation % 180 === 0) {
               for (let j = 0; j < ship.length; j++) { // Lodret placering
                    console.log(droppedField)
                    coveredFields.push(droppedField + j * boardWidth);
                }
            } else {
                for (let j = 0; j < ship.length; j++) { // Vandret placering
                    coveredFields.push(droppedField + j);
                }
 

            }
            if (checkForOverlap(coveredFields, boardSide)) {
                continue;
            }
            assignOccupiedFields(coveredFields, boardSide);
            // Finder skibets id og gemmer elementet når placeret
            if (boardSide === "left") {
            
                const shipElement = document.getElementById(ship.name + "Size" + ship.length);
                shipElement.style.display = "none";
            }
            placed = true;
        }
    })
    console.log(boardSide === "left" ? occupiedFieldArrayLeft : occupiedFieldArrayRight);
}

function resetShipPlacement() {
    // Finder alle left elementer og fjerner occupiedField classen hvis de har den
    const fields = querySelectorAll(".left");

    fields.forEach((field) => field.classList.remove("occupiedField"));

    occupiedFieldArrayLeft.length = 0;

    // Finder elementer med class "ship" og gør dem synlige igen og fjerne rotation)
    const ships = querySelectorAll(".ship");
    for (let i = 0; i < ships.length; i++) {
        ships[i].style.display = "block";
        ships[i].style.transform = "rotate(0deg)";
        ships[i].setAttribute("data-rotation", "0");
    }
}

function initializeFields() {
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

                // Adds hover effect when dragging ship
                field.addEventListener("drop", (e) => {
                    console.log("onShipDrop triggered");
                    onShipDrop(e);
                });
            }
            
            field.addEventListener("click", fireCannon); 

            // Tilføjer field div til gameboard div
            gameboard.append(field);
        }
    }
}

/** handles ship drop event
 * @function
 */
function onShipDrop(e) {
    e.preventDefault();

    const field = e.currentTarget;

    const side = field.dataset.side;

    const shipId = e.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst

    const shipElmnt = getElementById(shipId); // htmlElement

    const draggedShip = getShipObjectByID(shipElmnt.id); // ship object

    const droppedField = parseInt(field.dataset.index, 10);

    const draggedShipLength = draggedShip.length;

    const draggedShipRotation = parseInt(shipElmnt.getAttribute("data-rotation") || "0", 10); // Finder skibets nuværende rotation ved at finde attributen "data-rotation" og give den som en int

    const startColumn = (droppedField - 1) % boardWidth; // finder de næste felter ud fra start

    const startRow = Math.floor((droppedField - 1) / boardWidth);

    let coveredFields = [];



    if (draggedShipRotation % 180 === 0) { // Hvis % 180 === 0 er sandt betyder det at skibet er lodret 
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) { // Hvis skibet kan være der bliver felterne placeret i arrayet
            coveredFields.push(droppedField + j * boardWidth);
        }
    } else { // Hvis det ikke er sandt % 180 === 0 betyder det at skibet er vandret
        if (checkForOutOfBounds(startRow, startColumn, draggedShipLength, draggedShipRotation)) {
            alert("Ship is out of bounds.");
            return;
        }
        for (let j = 0; j < draggedShipLength; j++) {
            coveredFields.push(droppedField + j);
        }
    }

    if (checkForOverlap(coveredFields)) {
        alert("Ship overlaps another ship.");
        return;
    }

    draggedShip.rotation = String(draggedShipRotation);
    draggedShip.location = {
        startField: droppedField,
        coveredFields: coveredFields
    };

    shipElmnt.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret

    assignOccupiedFields(coveredFields, side);

    console.log(occupiedFieldArrayLeft)
}

function getShipObjectByID(ID) {
    let draggedShip = null;
    // finder hvilken class ship vi skal bruge ud fra html elementet
    if (ID === "destroyerSize2") {
        draggedShip = shipsClass[0] // destoryer
    } else if (ID === "submarineSize3") {
        draggedShip = shipsClass[1]; // submarine
    } else if (ID === "cruiserSize3") {
        draggedShip = shipsClass[2]; // cruiser
    } else if (ID === "battleshipSize4") {
        draggedShip = shipsClass[3]; // battleship
    } else if (ID === "carrierSize5") {
        draggedShip = shipsClass[4]; // carrier
    }
    if (!draggedShip) {
        throw new Error("Couldn't handle ship draggin properly");
    }
    return draggedShip
}

function fireCannon(e) {
    if (botGameState === "Begun"){
        const firedAtField = e.currentTarget
        if (firedAtField.dataset.side === "left") {
            alert("Cannot fire at your own board");
            return;
        } else if (firedAtField.classList.contains("missedField") || firedAtField.classList.contains("hitField")) {
            return;
        }
        else if (occupiedFieldArrayRight.includes(firedAtField)) {
            firedAtField.classList.remove("occupiedField");
            firedAtField.classList.add("hitField");
            console.log("Hit shot");
            ownHits += 1;
        } else {
            firedAtField.classList.add("missedField");

        console.log("Missed shot");
            console.log("Missed shot");
        }
        turn = 0;
        console.log(turn)
        gameLoop();
    }
    else {
        alert("Place your ships and click ready to start the game!")
    }
}

function setShipEventListener() {
    shipsDiv.forEach(ship => {
        ship.addEventListener("dragstart", (e) => {
            let cloneImageShip = ship.cloneNode(true);
            if (cloneImageShip instanceof HTMLElement) {

                // Sætter skibet rotation (transform) til klonens
                const style = getComputedStyle(ship);
                cloneImageShip.style.transform = style.transform

                // Placerer klonen så den ikke er synlig

                cloneImageShip.style.position = "absolute";
                cloneImageShip.style.top = "-2000px";
                cloneImageShip.style.left = "-2000px";

                document.body.appendChild(cloneImageShip);

                // Sætter klonen til at være drag image
                if (e.dataTransfer !== null) {
                    e.dataTransfer.setDragImage(cloneImageShip, 0, 0);
                    e.dataTransfer.setData("text/plain", ship.id);
                }
                // Fjerne klonen efter e queuen (timeren er sat til 0 millisekunder)
                setTimeout(() => {
                    document.body.removeChild(cloneImageShip);
                }, 0);
            }

        })
    })
}

function readyCheck() {
    console.log(occupiedFieldArrayLeft.length)
    if (occupiedFieldArrayLeft.length === 17) {
        document.getElementById("turn").textContent = "Battle begun";
        botGameState = "Begun"
        //Reset ships when pressing ready
        //getElementById("resetButton")?.removeEventListener("click", resetShipPlacement()); 
        //getElementById("randomizeButton")?.removeEventListener("click", randomizeShipPlacement());
    }
    else {
        alert("Not all ships are placed place all ships")
    }
}

function initializeBotGame() {
    initializeFields()
    setShipEventListener()
    randomizeShipPlacement("right");
    document.getElementById("turn").textContent = "Place your ships";
    gameLoop();
}

initializeBotGame(); // starts bot game

getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
getElementById("randomizeButton")?.addEventListener("click", () => randomizeShipPlacement("left"));
getElementById("readyButton")?.addEventListener("click", () => readyCheck());
getElementById("exitGameButton")?.addEventListener("click", () => window.location.href = "/");