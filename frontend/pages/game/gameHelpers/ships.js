/** 
 * @module ships.js
 * @typedef {"vertical"|"horizontal"} rotation 
 * @typedef {number} field
 * @typedef {Ship} ship 
*/

/** @class Ship */
export class Ship {
  /** constuctor method creates a ship with following properties
   * @param {string} name - "destoryer", "submarine", "cruiser", "battliship", "carrier"
   * @param {number} length - how many fields  the ship take up
   */
  constructor(name, length) {
    /** @type {string} */
    this.name = name;
    /** @type {number} */
    this.length = length;
    /** @type {rotation} */
    this.rotation = "vertical";
    /** @type {?Array<field>} */
    this.coveredFields = null;
    /** @type {number} */
    this.hits = 0;
    /** @type {boolean} */
    this.isSunk = false;
  }

  getOccupiedFields() {
    return this.coveredFields;
  }

  /*** @param {Array<field>} fields */
  setcoveredFields(fields) {
    this.coveredFields = fields;
  }

  /** @param {rotation} rotation */
  setRotation(rotation) {
    if (rotation == "vertical" || rotation == "horizontal")
      this.rotation = rotation
  }

  hitShip() {
    this.hits += 1;
    if (this.hits >= this.length) {
      this.isSunk = true;
      this.displaySunkMessage();
    }
  }

  displaySunkMessage() {
    alert(`You sunk the ${this.name}!`);
  }


}


/**
 * Helper function to create the five ships when needed
 * @returns {Array<ship>}
 */
export const createShips = () => {
  const destroyer = new Ship("destroyer", 2);
  const submarine = new Ship("submarine", 3);
  const cruiser = new Ship("cruiser", 3);
  const battleship = new Ship("battleship", 4);
  const carrier = new Ship("carrier", 5);
  return [destroyer, submarine, cruiser, battleship, carrier];
}