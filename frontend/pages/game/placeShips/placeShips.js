/** 
 * @module placeShips.js 
 * @typedef {Ship} ship
 * @typedef {number} field
 * @typedef {"vertical"|"horizontal"} rotation
*/
import { deleteGame } from "../gameHelpers/gameFunctions.js";
import { Game, setGame, User } from "../../../utility/state.js";
import { setLoading } from "../../../utility/ui.js";
import { getElementById } from "../../../utility/helperFunctions.js";
import { fetchGameData, submitShips } from "../gameHelpers/gameFunctions.js";
import { boardWidth, boardHeight } from "../gameHelpers/board.js";
import { querySelectorAll } from "../../../utility/helperFunctions.js";
import { createShips, Ship } from "../gameHelpers/ships.js";

checkIfReady();
initializeFields()

// Event listeners der kalder deres respektive funktioner
getElementById("cancelButton").addEventListener("click", handleDeleteGame)
getElementById("resetButton").addEventListener("click", resetShipPlacement);
getElementById("randomizeButton").addEventListener("click", () => randomizeShipPlacement());
getElementById("readyButton").addEventListener("click", handleSubmitShips);

const howOftenToFetchDataInMS = 500;

/** @type {HTMLElement|null}*/
let currentSelectedShip = null;

/** @type {HTMLElement|null}*/
let currentHoveredField = null;


/** Holds the array of five ships */
const shipsClass = createShips();

/** @type {Array<HTMLElement>} */
const shipsDiv = querySelectorAll(".ship");

/** @type {Array<HTMLElement>}  */
const occupiedFieldArrayLeft = [];


/** Creates 100 fields to fill the game boards and adds drag and drop functionalty to them */
export function initializeFields() {
    let gameboard = getElementById("gameBoard");

    for (let i = 0; i < boardWidth * boardHeight; i++) {
        const field = document.createElement("div");
        field.classList.add("field");
        field.dataset.index = String(i + 1);
        field.id = "field" + (i + 1);  // sets the html field ID

        // Adds hover effect when dragging ship to left squares
        field.addEventListener("mouseenter", (e) => {
            e.preventDefault();

            currentHoveredField = getElementById("field" + (i+1));
            console.log("field", currentHoveredField)

            if (currentSelectedShip) {
                getAndPaintFields()
            }

        })
        field.addEventListener("mouseleave", (e) => {
            e.preventDefault();

            if (currentSelectedShip) {
                getAndRemovePaintFields()
            }
            currentHoveredField = null;
            console.log("field", currentHoveredField)

        })
        field.addEventListener("click", (e) => {
            e.preventDefault()
            if (currentSelectedShip) {
                getAndRemovePaintFields();
                onShipDrop(e)
                currentSelectedShip = null;
                currentHoveredField = null;
            }

        });        // Adds hover effect when dragging ship

        gameboard.append(field);        // Tilføjer field div til gameboard div
    }
}

/** Finder de felter et skib vil lande på ud fra rotation of start punkt, og maler dem orange */
function getAndPaintFields() {
    let fieldIndex = Number(currentHoveredField?.dataset.index);
    if (currentSelectedShip) {
        let currentShip = getShipByName(currentSelectedShip.id)
        let coveredFields = calculateCoveredFields(fieldIndex, currentShip.length, currentShip.rotation)

        if (coveredFields) {
            for (let j = 0; j < currentShip.length; j++) {
                getElementById("field" + coveredFields[j]).style.backgroundColor = "var(--orange)"
            }
        }
    }
}


/** fjerner farven fra det sted hvor skibet "ville kunne lande på" hvis man slap det.*/
function getAndRemovePaintFields() {
    let fieldIndex = Number(currentHoveredField?.dataset.index);
    if (currentSelectedShip) {
        let currentShip = getShipByName(currentSelectedShip.id)
        let coveredFields = calculateCoveredFields(fieldIndex, currentShip.length, currentShip.rotation)


        if (coveredFields) {
            for (let j = 0; j < currentShip.length; j++) {
                getElementById("field" + coveredFields[j]).style.backgroundColor = "transparent"
            }
        }
    }

}


/** recursive function that checks if both players have pressed 'ready' every x seconds */
async function checkIfReady() {
    const gameData = await fetchGameData(Game()._id);
    // timeout so we dont fetch constantly
    setTimeout(() => {
        console.log('Waiting for enemy');

        if (gameData.players[1].ready && gameData.players[0].ready) {
            setGame(gameData)
            window.location.href = "/game"

        } else {
            checkIfReady()
        }
    }, howOftenToFetchDataInMS)
}

//* Adds eventlistener for dragging a ship, which creates a cloneImage that is the one visible when dragging */
shipsDiv.forEach(ship => {
    ship.addEventListener("click", (e)=>{
        e.preventDefault()
        console.log("setShip")
        ship.style.opacity = "0.5"
        currentSelectedShip = ship;
    })

/*
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
            }, 300);
        }
    })*/
})

/** Helper function 
 * @param {string} name */
function getShipByName(name) {
    let ship = null;
    // finder hvilken class ship vi skal bruge ud fra html elementet
    if (name === "destroyer") {
        ship = shipsClass[0] // destoryer
    } else if (name === "submarine") {
        ship = shipsClass[1]; // submarine
    } else if (name === "cruiser") {
        ship = shipsClass[2]; // cruiser
    } else if (name === "battleship") {
        ship = shipsClass[3]; // battleship
    } else if (name === "carrier") {
        ship = shipsClass[4]; // carrier
    }
    if (!ship) {
        throw new Error("Couldn't handle ship draggin properly");
    }
    return ship
}

/** Logic for dropping a ship on a given field. the event (e) holds the field we are dropping on */
function onShipDrop(e) {
    e.preventDefault();
    if (!currentSelectedShip) {
        return;
    }

    const field = e.currentTarget;
   //  const shipId = e.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst
    //  const shipElmnt = getElementById(shipId); // htmlElement
    const ship = getShipByName(currentSelectedShip.id); // ship class element

    const dropField = parseInt(field.dataset.index, 10);
    console.log("dropped on:", dropField)

    let coveredFields = calculateCoveredFields(dropField, ship.length, ship.rotation);
    if (!coveredFields) {
        throw new Error("couldn't calculate covered fields")
    }

    ship.setcoveredFields(coveredFields);

    currentSelectedShip.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret
    currentSelectedShip = null
    paintOccupiedFields(coveredFields);

        

}

/** Changes the currentHovered ship rotation and updates the css to rotate the ship when " */
function rotateShip() {

    if (!currentSelectedShip)
        return;
    
    const ship = getShipByName(currentSelectedShip.id);

    ship.rotation == "horizontal" ? ship.setRotation("vertical") : ship.setRotation("horizontal");

    let currentRotation = parseInt(currentSelectedShip.getAttribute("data-rotation") || "0", 10);
    let newRotation = (currentRotation + 90) % 360;

    
    currentSelectedShip.style.transform = "rotate(" + newRotation + "deg)";
    currentSelectedShip.setAttribute("data-rotation", `${newRotation}`);

}

// calls the rotateShip function when "r" key is pressed
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r" && currentSelectedShip) {
        if (currentHoveredField) {
            getAndRemovePaintFields() // remove paint
            rotateShip(); // rotate
            getAndPaintFields() // add new paint, for new rotation
        } else 
            rotateShip(); // just rotate
    }
});

/** Helper function to calculate what fields to the ship will take up. Returns null if out of bounds.
 * @param {number} start 
 * @param {number} length 
 * @param {rotation} rotation 
 * @returns {?Array<field>|null} returens null, if theres an overlap or out of bounds
 */
function calculateCoveredFields(start, length, rotation) {
    const startColumn = (start - 1) % boardWidth; // finder de næste felter ud fra start
    const startRow = Math.floor((start - 1) / boardWidth);

    if (rotation == "vertical" && startRow + length > boardHeight) {
        return null;
    } else if (rotation == "horizontal" && startColumn + length > boardWidth) {
        return null;
    }

    let occupiedFields = [];

    for (let i = 0; i < length; i++) {
        if (rotation == "vertical") {
            occupiedFields.push(start + 10 * i);
            console.log("pushed field", start + 10);
        } else if (rotation == "horizontal") {
            occupiedFields.push(start + i);
        }
    }
    if (checkForOverlap(occupiedFields)) {
        return null;
    }

    return occupiedFields;
}

/** checks if there already are any ships on the fields
 * @function
 * @param {Array<field>} coveredFields
 * @returns {boolean}
 */
function checkForOverlap(coveredFields) {
    for (let i = 0; i < coveredFields.length; i++) {
        const fieldElement = getElementById("field" + (coveredFields[i]));
        if (occupiedFieldArrayLeft.includes(fieldElement)) {
            return true;
        }
    }
    return false;
}

/** Tilføjer css styling til alle de fields med skibe på
 * @param {Array<field>} coveredFields */
function paintOccupiedFields(coveredFields) {
    coveredFields.forEach(index => {
        const fieldElement = getElementById("field" + (index));
        fieldElement.style.background = "var(--orange)"
        fieldElement.classList.add("occupiedField");
        occupiedFieldArrayLeft.push(fieldElement);
    });
}

/** Tilføjer css styling til alle de fields med skibe på
 * @param {Array<field>} coveredFields */
function unPaintOccupiedFields(coveredFields) {
    coveredFields.forEach(index => {
        const fieldElement = getElementById("field" + (index));
        fieldElement.classList.remove("occupiedField")
        fieldElement.style.background = "transparent"
        occupiedFieldArrayLeft.push(fieldElement);
    });
}


/** Calls the submitShip function and updates the "game" struct */
async function handleSubmitShips(e) {
    e.preventDefault();
    setLoading(true)

    const updatedGame = await submitShips(Game()._id, User()._id, shipsClass)

    if (updatedGame) {
        setGame(updatedGame);
    }
}

/** Places the ships randomly*/
export function randomizeShipPlacement() {
    resetShipPlacement();

    // Går over arrayet af ship classes for at placere alle skibene
    shipsClass.forEach(ship => {
        let placed = false;

        while (!placed) {
            // Sætter skibets rotation til 0 hvis et tilfældigt tal fra 0-1 er mindre en 0.5
            Math.random() < 0.5 ? ship.setRotation("vertical") : ship.setRotation("horizontal");
            let field = Math.floor(Math.random() * 100) + 1;
            let coveredFields = calculateCoveredFields(field, ship.length, ship.rotation)
            if (!coveredFields || checkForOverlap(coveredFields)) continue; // Prøver en ny position

            paintOccupiedFields(coveredFields);

            ship.setcoveredFields(coveredFields);

            // Finder skibets id og gemmer elementet når placeret
            const shipElement = getElementById(ship.name);
            shipElement.style.display = "none";

            placed = true;
        }
    })

}

/** Clears the board*/
export function resetShipPlacement() {
    // Finder alle left elementer og fjerner occupiedField classen hvis de har den
    const fields = querySelectorAll(".field");

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

/** Calls the deleteGame function and changes to frontpage if the game is deleted */
async function handleDeleteGame(e) {
    e.preventDefault()
    setLoading(true)
    const isDeleted = await deleteGame(Game()._id);

    if (isDeleted) {
        setGame(null)
        window.location.href = "/"
    } else {
        window.alert("could not delete game");
    }
    setLoading(false);
}