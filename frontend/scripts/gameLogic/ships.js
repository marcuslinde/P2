

export class Ship {
  /** constuctor method creates a ship with following properties
   * @param {string} name - "destoryer", "submarine", "cruiser", "battliship", "carrier"
   * @param {number} length - how many fields  the ship take up

   */
  constructor(name, length) {
    this.name = name;
    this.length = length;
    this.rotation = "vertical";
    this.location = null;
    this.hits = 0;
    this.isSunk = false;
  }

  getOccupiedFields() {
    return this.location.occupiedFields;
  }

  setOccupiedFields(fields) {
    this.location.occupiedFields = fields;
  }

  getRotation() {
    return this.location.rotation;
  }

  setRotation(rotation) {
    if (rotation == "vertical" || rotation == "horizontal")
      this.location.rotation = rotation
  }

  hitShip() {
    this.hits += 1;
    if (this.hits >= this.length) {
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
    alert(`You sunk the ${this.name}!`);
  }


}



export const createShips = () => {
  const destroyer = new Ship("destroyer", 2);
  const submarine = new Ship("submarine", 3);
  const cruiser = new Ship("cruiser", 3);
  const battleship = new Ship("battleship", 4);
  const carrier = new Ship("carrier", 5);
  return [destroyer, submarine, cruiser, battleship, carrier];
}


