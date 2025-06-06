/**
 * @module {botGamePlaceShips}
 */
import { getElementById } from "../../utility/helperFunctions.js";
import { setGame } from "../../utility/state.js";
import { boardHeight, boardWidth } from "../game/gameHelpers/board.js";
import { createShips } from "../game/gameHelpers/ships.js";
import { calculateCoveredFields, initializeBoardFields, randomizeShipPlacement, resetShipPlacement } from "../game/placeShips/placeShipsFunctionality.js";
import { ships as ownShips } from "../game/placeShips/placeShipsFunctionality.js";


getElementById("resetButton")?.addEventListener("click", resetShipPlacement);
getElementById("readyButton").addEventListener("click", submitShips);
getElementById("backButton")?.addEventListener("click", () => { window.location.href = "/"; setGame(null) });
getElementById("randomizeButton")?.addEventListener("click", () => { randomizeShipPlacement(ownShips) });

initializeBoardFields();

let botShips = placeBotShips();

/** checks if player is done the necessary steps to start the game  */
function submitShips(e) {
    e.preventDefault();
    const allShipsPlaced = ownShips.every(ship => ship.coveredFields.length > 0); 
    if (!allShipsPlaced) {
        window.alert("Please place all ships before submitting");
        return;
    } else {
        setGame({ 
            type: "botGame", 
            own: { occupiedFields: getOccupiedFields(ownShips), firedShots: [] }, 
            bot: { occupiedFields: getOccupiedFields(botShips), firedShots: [] }, 
            turn: "BOT"
        })
        window.location.href = "/botGame"
    }
}

function getOccupiedFields(ships) {
    let fields = []

    ships.forEach(ship =>
        ship.coveredFields.forEach((f) => { fields.push(f); })
    );
    return fields;
}

function placeBotShips() {
    let ships = createShips();
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

            shipData.setcoveredFields(coveredFields);

            placed = true;
        }

        if (!placed) {
            console.error(`Failed to place ${shipData.name} after ${maxAttempts} attempts`);
        }
    })
    return ships;
}