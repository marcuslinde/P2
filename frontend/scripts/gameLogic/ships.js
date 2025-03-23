

export class Ship {
    /** constuctor method creates a ship with following properties
     * @param {string} name - "destoryer", "submarine", "cruiser", "battliship", "carrier"
     * @param {number} length - how many fields  the ship take up
     * @param {string} rotation - either "vertical" or "horizontal"
     * @param {object|null} location - ships placement. Null means 'unplaced';
     * @param {number} hits - number of times ship has been hit
     * @param {boolean} isSunk - if the ship has been sunk or not
     */
    constructor(name, length, rotation, location, hits, isSunk) {
        this.name = name;
        this.length = length;
        this.rotation = rotation;
        this.location = location;
        this.hits = hits;
        this.isSunk = isSunk;
    }

/*
registerHit() {
        this.hits++;
        if (!this.isSunk && this.hits >= this.length) {
          this.isSunk = true;
          this.displaySunkMessage();
        }
      }

      displaySunkMessage() {
        const messages = {
          destroyer: "Destroyer sunk!",
          submarine: "Submarine sunk!",
          cruiser: "Cruiser sunk!",
          battleship: "Battleship sunk!",
          carrier: "Carrier sunk!"
        };
        alert(messages[this.name] || `You sunk the ${this.name}!`);
      }
}

*/



}
    

const destroyer = new Ship("destroyer", 2, "vertical", null, 0, false);
const submarine = new Ship("submarine", 3, "vertical", null, 0, false);
const cruiser = new Ship("cruiser", 3, "vertical", null, 0, false);
const battleship = new Ship("battleship", 4, "vertical", null, 0, false);
const carrier = new Ship("carrier", 5, "vertical", null, 0, false);

export const createShips = () => {
    const destroyer = new Ship("destroyer", 2, "vertical", null, 0, false);
    const submarine = new Ship("submarine", 3, "vertical", null, 0, false);
    const cruiser = new Ship("cruiser", 3, "vertical", null, 0, false);
    const battleship = new Ship("battleship", 4, "vertical", null, 0, false);
    const carrier = new Ship("carrier", 5, "vertical", null, 0, false);
    return [destroyer, submarine, cruiser, battleship, carrier];
}


