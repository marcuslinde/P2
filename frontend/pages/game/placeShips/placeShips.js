/** 
 * @module placeShips.js 
 * @typedef {Ship} ship
 * @typedef {number} field
 * @typedef {"vertical"|"horizontal"} rotation
*/

import { deleteGame, fetchGameData, submitShips } from "../gameHelpers/gameFunctions.js";
import { Game, setGame, User } from "../../../utility/state.js";
import { setLoading } from "../../../utility/ui.js";
import { getElementById, querySelectorAll } from "../../../utility/helperFunctions.js";
import { boardWidth, boardHeight } from "../gameHelpers/board.js";
import { createShips, Ship } from "../gameHelpers/ships.js";

checkIfReady();
initializeBoardFields();

// Event listeners for game control buttons
getElementById("cancelButton").addEventListener("click", handleDeleteGame);
getElementById("resetButton").addEventListener("click", resetShipPlacement);
getElementById("randomizeButton").addEventListener("click", randomizeShipPlacement);
getElementById("readyButton").addEventListener("click", handleSubmitShips);

const fetchIntervalMS = 500;

/** @type {HTMLElement|null} */
let currentSelectedShip = null;
/** @type {HTMLElement|null} */
let currentHoveredField = null;

/** Holds the array of ship objects */
const ships = createShips();
/** @type {Array<HTMLElement>} */
const shipElements = querySelectorAll(".ship");
/** @type {Array<number>} */
const occupiedFieldIds = [];

/** 
 * Initializes the game board fields and attaches event listeners for hover and click.
 */
export function initializeBoardFields() {
    const gameboard = getElementById("gameBoard");

    for (let i = 0; i < boardWidth * boardHeight; i++) {
        const field = document.createElement("div");
        field.classList.add("field");
        field.dataset.index = String(i + 1);
        field.id = "field" + (i + 1);

        // When hovering over a field, update the ghost ship display.
        field.addEventListener("mouseenter", (e) => {
            e.preventDefault();
            currentHoveredField = getElementById("field" + (i + 1));
            if (currentSelectedShip) {
                updateGhostShipDisplay("var(--orange)");
            }
        });

        // When leaving a field, remove the ghost ship display.
        field.addEventListener("mouseleave", (e) => {
            e.preventDefault();
            if (currentSelectedShip) {
                updateGhostShipDisplay("transparent");
            }
            currentHoveredField = null;
        });

        // When clicking a field, attempt to place the selected ship.
        field.addEventListener("click", (e) => {
            e.preventDefault();
            if (currentSelectedShip) {
                updateGhostShipDisplay("transparent"); // clear ghost display
                placeShip(e);
            }
        });

        gameboard.append(field);
    }
}

/**
 * Updates the display of the ghost ship on the board.
 * @param {string} color - The color to apply ("var(--orange)" for display, "transparent" for clearing).
 */
function updateGhostShipDisplay(color) {
    // Added defensive check for currentHoveredField
    if (!currentHoveredField || !currentSelectedShip) return;
    
    const fieldIndex = Number(currentHoveredField.dataset.index);
    const shipData = getShipByName(currentSelectedShip.id);
    if (!shipData) return;
    
    const ghostFields = calculateCoveredFields(fieldIndex, shipData.length, shipData.rotation);
    if (ghostFields) {
        ghostFields.forEach(fieldId => {
            try {
                const fieldElement = getElementById("field" + fieldId);
                if (fieldElement) {
                    fieldElement.style.backgroundColor = color;
                }
            } catch (error) {
                console.error("Error updating ghost ship display:", error);
            }
        });
    }
}

/**
 * Retrieves the ship object corresponding to the provided ship element name.
 * @param {string} name
 * @returns {Ship|null}
 */
function getShipByName(name) {
    try {
        let shipData = null;
        switch (name) {
            case "destroyer":
                shipData = ships[0];
                break;
            case "submarine":
                shipData = ships[1];
                break;
            case "cruiser":
                shipData = ships[2];
                break;
            case "battleship":
                shipData = ships[3];
                break;
            case "carrier":
                shipData = ships[4];
                break;
            default:
                console.error("Unknown ship name:", name);
                return null;
        }
        return shipData;
    } catch (error) {
        console.error("Error in getShipByName:", error);
        return null;
    }
}

/**
 * Places the selected ship on the board when a field is clicked.
 * @param {Event} e - The click event.
 */
function placeShip(e) {
    e.preventDefault();
    if (!currentSelectedShip) return;
    
    try {
        const field = e.currentTarget;
        const shipData = getShipByName(currentSelectedShip.id);
        if (!shipData) {
            deselectCurrentShip();
            return;
        }
        
        const dropField = parseInt(field.dataset.index, 10);
        
        const coveredFields = calculateCoveredFields(dropField, shipData.length, shipData.rotation);
        if (!coveredFields) {
            // Invalid placement, don't deselect the ship to allow trying again
            return;
        }
        
        shipData.setcoveredFields(coveredFields);
        currentSelectedShip.style.display = "none"; // Hide ship element after placement
        markFieldsOccupied(coveredFields);
        deselectCurrentShip();
    } catch (error) {
        console.error("Error in placeShip:", error);
        deselectCurrentShip();
    }
}

/**
 * Deselects the currently selected ship and resets related states.
 */
function deselectCurrentShip() {
    if (currentSelectedShip) {
        currentSelectedShip.style.opacity = "1";
        currentSelectedShip = null;
    }
    currentHoveredField = null;
}

/**
 * Calculates the board fields a ship will cover given a starting field.
 * Returns null if placement is invalid or overlaps.
 * @param {number} start - The starting field number.
 * @param {number} length - The ship length.
 * @param {rotation} rotation - The ship rotation.
 * @returns {?Array<field>|null}
 */
function calculateCoveredFields(start, length, rotation) {
    try {
        const startColumn = (start - 1) % boardWidth;
        const startRow = Math.floor((start - 1) / boardWidth);

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
        if (isOverlap(fields)) {
            return null;
        }
        return fields;
    } catch (error) {
        console.error("Error in calculateCoveredFields:", error);
        return null;
    }
}

/**
 * Checks whether any of the provided fields are already occupied.
 * @param {Array<field>} fields 
 * @returns {boolean}
 */
function isOverlap(fields) {
    try {
        for (const fieldId of fields) {
            if (occupiedFieldIds.includes(fieldId)) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Error in isOverlap:", error);
        return true; // Safer to return true on error
    }
}

/**
 * Marks the provided fields as occupied by a ship.
 * @param {Array<field>} fields 
 */
function markFieldsOccupied(fields) {
    try {
        fields.forEach(fieldId => {
            const fieldElement = getElementById("field" + fieldId);
            if (fieldElement) {
                fieldElement.style.backgroundColor = "var(--orange)";
                fieldElement.classList.add("occupiedField");
                if (!occupiedFieldIds.includes(fieldId)) {
                    occupiedFieldIds.push(fieldId);
                }
            }
        });
    } catch (error) {
        console.error("Error in markFieldsOccupied:", error);
    }
}

/**
 * Rotates the currently selected ship and updates its visual representation.
 * Checks if rotation would keep the ship in bounds if there's a hovered field.
 */
function rotateShip() {
    if (!currentSelectedShip) return;
    
    try {
        const shipData = getShipByName(currentSelectedShip.id);
        if (!shipData) return;
        
        const newRotation = shipData.rotation === "horizontal" ? "vertical" : "horizontal";
        
        // Check if rotation would be valid when hovering over a field
        if (currentHoveredField) {
            const fieldIndex = Number(currentHoveredField.dataset.index);
            const possibleFields = calculateCoveredFields(fieldIndex, shipData.length, newRotation);
            if (!possibleFields) {
                // Invalid rotation, don't rotate
                return;
            }
        }
        
        // Toggle ship rotation
        shipData.rotation = newRotation;
        
        // Update visual rotation of the ship element
        const currentRotationDeg = parseInt(currentSelectedShip.getAttribute("data-rotation") || "0", 10);
        const newRotationDeg = (currentRotationDeg + 90) % 360;
        currentSelectedShip.style.transform = `rotate(${newRotationDeg}deg)`;
        currentSelectedShip.setAttribute("data-rotation", `${newRotationDeg}`);
    } catch (error) {
        console.error("Error in rotateShip:", error);
    }
}

// Add escape key handler to deselect ship
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        deselectCurrentShip();
    } else if (e.key.toLowerCase() === "r" && currentSelectedShip) {
        if (currentHoveredField) {
            updateGhostShipDisplay("transparent");
            rotateShip();
            updateGhostShipDisplay("var(--orange)");
        } else {
            rotateShip();
        }
    }
});

/**
 * Recursively checks if both players are ready at regular intervals.
 * Fixed race condition by moving the timeout inside the promise resolution.
 */
async function checkIfReady() {
    try {
        const gameData = await fetchGameData(Game()._id);
        
        if (gameData && gameData.players && 
            gameData.players[1].ready && gameData.players[0].ready) {
            setGame(gameData);
            window.location.href = "/game";
        } else {
            // Only set the next check after this one completes
            setTimeout(() => checkIfReady(), fetchIntervalMS);
        }
    } catch (error) {
        console.error("Error checking if ready:", error);
        // Still retry on error, but with a delay
        setTimeout(() => checkIfReady(), fetchIntervalMS);
    }
}

// Attach event listeners to ship elements for selection
shipElements.forEach(ship => {
    ship.addEventListener("click", (e) => {
        e.preventDefault();
        // Deselect previous ship if any
        if (currentSelectedShip) {
            currentSelectedShip.style.opacity = "1";
        }
        // Only select if ship is visible (not placed yet)
        if (ship.style.display !== "none") {
            ship.style.opacity = "0.5";
            currentSelectedShip = ship;
        }
    });
    
    // Right-click to deselect ship
    ship.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (currentSelectedShip === ship) {
            deselectCurrentShip();
        }
    });
});

/**
 * Randomizes the placement of ships on the board.
 */
export function randomizeShipPlacement() {
    resetShipPlacement();

    ships.forEach(shipData => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100; // Prevent infinite loops
        
        while (!placed && attempts < maxAttempts) {
            attempts++;
            // Randomly set ship rotation
            Math.random() < 0.5 ? shipData.setRotation("vertical") : shipData.setRotation("horizontal");
            const randomField = Math.floor(Math.random() * (boardWidth * boardHeight)) + 1;
            const coveredFields = calculateCoveredFields(randomField, shipData.length, shipData.rotation);
            if (!coveredFields) continue;

            markFieldsOccupied(coveredFields);
            shipData.setcoveredFields(coveredFields);

            const shipElement = getElementById(shipData.name);
            if (shipElement) {
                shipElement.style.display = "none";
            }

            placed = true;
        }
        
        if (!placed) {
            console.error(`Failed to place ${shipData.name} after ${maxAttempts} attempts`);
        }
    });
}

/**
 * Resets the board and ship placements to their initial state.
 */
export function resetShipPlacement() {
    try {
        // Clear all occupied field classes and background colors
        const fields = querySelectorAll(".field");
        fields.forEach(field => {
            field.classList.remove("occupiedField");
            field.style.backgroundColor = ""; // Reset background color
        });
        occupiedFieldIds.length = 0; // Clear the array

        // Reset ship elements visibility and rotation
        const shipsOnBoard = querySelectorAll(".ship");
        shipsOnBoard.forEach(ship => {
            ship.style.display = "block";
            ship.style.opacity = "1";
            ship.style.transform = "rotate(0deg)";
            ship.setAttribute("data-rotation", "0");
        });
        
        // Reset the ships data structure
        ships.forEach(ship => {
            ship.setcoveredFields([]);
            ship.setRotation("vertical");
        });
        
        // Reset current selections
        deselectCurrentShip();
    } catch (error) {
        console.error("Error in resetShipPlacement:", error);
    }
}

/**
 * Submits the ship placement to the game server.
 * @param {Event} e 
 */
async function handleSubmitShips(e) {
    e.preventDefault();
    try {
        setLoading(true);
        // Check if all ships are placed
        const allShipsPlaced = ships.every(ship => ship.coveredFields.length > 0);
        if (!allShipsPlaced) {
            window.alert("Please place all ships before submitting");
            setLoading(false);
            return;
        }

        const updatedGame = await submitShips(Game()._id, User()._id, ships);
        if (updatedGame) {
            setGame(updatedGame);
        }
    } catch (error) {
        console.error("Error in handleSubmitShips:", error);
        setLoading(false);
    }
}

/**
 * Deletes the game and redirects to the front page.
 * @param {Event} e 
 */
async function handleDeleteGame(e) {
    e.preventDefault();
    try {
        setLoading(true);
        const isDeleted = await deleteGame(Game()._id);

        if (isDeleted) {
            setGame(null);
            window.location.href = "/";
        } else {
            window.alert("Could not delete game");
        }
    } catch (error) {
        console.error("Error in handleDeleteGame:", error);
        window.alert("Error deleting game");
    } finally {
        setLoading(false);
    }
}