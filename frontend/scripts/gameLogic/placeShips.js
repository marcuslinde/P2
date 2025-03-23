import { deleteGame } from "./gameFunctions.js";
import { Game, setGame, User } from "../utility/state.js";
import { setLoading } from "../utility/ui.js";
import { getElementById } from "../utility/helperFunctions.js";
import { fetchGameData, submitShips } from "./gameFunctions.js";
import { boardWidth, boardHeight } from "./board.js";
import { querySelectorAll } from "../utility/helperFunctions.js";
import { createShips } from "./ships.js";


checkIfReady();

initializeFields()


// Event listeners der kalder deres respektive funktioner
getElementById("cancelButton").addEventListener("click", handleDeleteGame)

getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
getElementById("randomizeButton")?.addEventListener("click", () => randomizeShipPlacement("left"));


let currentHoveredShip = null;


/** Array of ship div elements
 * @type {Array<Object>} */
const shipsClass = createShips();

/** Array of ship div elements 
 * @type {Array<HTMLElement>} */
const shipsDiv = querySelectorAll(".ship");

/** Array of fields that are filled by ships 
 *  @type {Array<HTMLElement>}  */
const occupiedFieldArrayLeft = [];




/** Creates 100 fields to fill the game boards and adds drag and drop functionalty to them
 * @function
 */
export function initializeFields() {
    let gameboard = getElementById("gameBoard");


    for (let i = 0; i < boardWidth * boardHeight; i++) {
        const field = document.createElement("div");
        field.classList.add("field");

        field.dataset.index = String(i + 1);

        field.id = "field" + (i + 1);


        // Adds hover effect when dragging ship to left squares


        field.addEventListener("dragover", (e) => {
            e.preventDefault();
            field.style.border = "2px solid black"
        })
        field.addEventListener("dragleave", (e) => {
            e.preventDefault();
            field.style.border = "1px solid black"
        })

        // Adds hover effect when dragging ship
        field.addEventListener("drop", onShipDrop);
        // Tilføjer field div til gameboard div
        gameboard.append(field);
    }
}


async function checkIfReady() {
    const gameData = await fetchGameData(Game()._id);

    setTimeout(() => {
        console.log('Waiting for enemy');


        if (gameData.players[1].ready && gameData.players[0].ready) {
            setGame(gameData)
            window.location.href = "/game"

        } else {
            checkIfReady()
        }


    }, 2000)
}



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

    ship.addEventListener("mouseover", (e) => {
        currentHoveredShip = ship;
    });

    ship.addEventListener("mouseout", (e) => {
        currentHoveredShip = null;
    })

})




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



/** handles ship drop event
 * @function
 */
function onShipDrop(e) {
    e.preventDefault();

    const field = e.currentTarget;
    const shipId = e.dataTransfer.getData("text/plain"); // text/plain fortæller at dataen vi leder efter er ren tekst
    const shipElmnt = getElementById(shipId); // htmlElement
    const shipObject = getShipObjectByID(shipId); // ship object

    const dropField = parseInt(field.dataset.index, 10);
    console.log("dropped on:", dropField)

    let coveredFields = calculateCoveredFields(dropField, shipObject.length, shipObject.rotation);

    if (!coveredFields) {
        window.alert("Ship is out of bounds!");
        return
    }

    if (checkForOverlap(coveredFields)) {
        window.alert("Ship overlaps another ship.");
        return;
    }

    shipObject.location = {
        startField: dropField,
        coveredFields: coveredFields
    };

    shipElmnt.style.display = "none"; // Gør html elementet usynligt når skibet bliver placeret

    paintOccupiedFields(coveredFields);


}

// ROTATE SHIP
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r" && currentHoveredShip) {

        let shipID = currentHoveredShip.getAttribute('id')

        const shipObject = getShipObjectByID(shipID);
        if (shipObject.rotation == "horizontal") {
            shipObject.rotation = "vertical";
        } else {
            shipObject.rotation = "horizontal";
        }

        console.log("hovered ship", shipObject)

        let currentRotation = parseInt(currentHoveredShip.getAttribute("data-rotation") || "0", 10);
        let newRotation = (currentRotation + 90) % 360;

        currentHoveredShip.style.transform = "rotate(" + newRotation + "deg)";

        currentHoveredShip.setAttribute("data-rotation", newRotation);
    }
});


/**
 * 
 * @param {*} start 
 * @param {*} length 
 * @param {"vertical"|"horizontal"} rotation 
 * @returns 
 */

function calculateCoveredFields(start, length, rotation) {

    const startColumn = (start - 1) % boardWidth; // finder de næste felter ud fra start
    const startRow = Math.floor((start - 1) / boardWidth);

    if (rotation == "vertical" && startRow + length > boardHeight) { // Hvis lodret
        return false;
    } else if (rotation == "horizontal" && startColumn + length > boardWidth) {
        return false;
    }

    let occupiedFields = [];

    console.log
    for (let i = 0; i < length; i++) {
        if (rotation == "vertical") {
            occupiedFields.push(start + 10 * i);
            console.log("pushed field", start + 10);
        } else if (rotation == "horizontal") {
            occupiedFields.push(start + i);
        }
    }

    console.log("occupied fields", occupiedFields);
    return occupiedFields;

}


/** checks if there already are any ships on the fields
 * @function
 * @param {any} coveredFields
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

/** Tilføjer elementet occupiedField til de fields med skibe på
 * @function
 */
function paintOccupiedFields(coveredFields) {
    coveredFields.forEach(index => {
        const fieldElement = getElementById("field" + (index));
        fieldElement.classList.add("occupiedField");
        occupiedFieldArrayLeft.push(fieldElement);
    });
}




async function handleSubmitShips(e) {
    e.preventDefault();
    setLoading(true)

    const updatedGame = await submitShips(Game()._id, User()._id, shipsClass)

    if (updatedGame) {
        setGame(updatedGame);
    }

    setLoading(false)

}
getElementById("readyButton").addEventListener("click", handleSubmitShips);


export function randomizeShipPlacement(boardSide) {
    resetShipPlacement();

    // Går over arrayet af ship classes for at placere alle skibene
    shipsClass.forEach(ship => {
        let placed = false;

        while (!placed) {
            // Sætter skibets rotation til 0 hvis et tilfældigt tal fra 0-1 er mindre en 0.5
            ship.rotation = Math.random() < 0.5 ? "vertical" : "horizontal"
            let field = Math.floor(Math.random() * 100)+1;
            let coveredFields = calculateCoveredFields(field, ship.length, ship.rotation)
            if (!coveredFields || checkForOverlap(coveredFields)) continue; // Prøver en ny position

            paintOccupiedFields(coveredFields);

            ship.location = {
                startField: field,
                coveredFields: coveredFields
            };

            // Finder skibets id og gemmer elementet når placeret
            const shipElement = getElementById(ship.name + "Size" + ship.length);
            shipElement.style.display = "none";


            placed = true;
        }
    })

}



/** 
 * @function
 */
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