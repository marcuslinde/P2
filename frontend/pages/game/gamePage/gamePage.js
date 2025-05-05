/** 
 * @module game.js 
 * @typedef {number} field
 * @typedef {Ship} ship
 * @typedef {"left"|"right"} side
 */
import { User, Game, setGame } from '../../../utility/state.js';
import { setLoading } from '../../../utility/ui.js';
import { getElementById } from '../../../utility/helperFunctions.js';
import { boardHeight, boardWidth } from '../gameHelpers/board.js';
import { deleteGame, getGameByID, fireShot } from '../gameHelpers/gameFunctions.js';
import { cannonSound, splashSound } from '../../../utility/audioManager.js';
import { gameUpdate, joinRoom, socket } from '../../../utility/socketFunctions.js';

joinRoom(Game().gameCode);
initializeGame();
socket.on("gameUpdate", () => checkTurn());

const playerIndex = User()._id === Game().players[0].userId ? 0 : 1;
const enemyIndex  = playerIndex === 0 ? 1 : 0;

getElementById("exitGameButton").addEventListener("click", handleDeleteGame);


/** Initialiserer spillet: felter, skibe, shots, tur osv. */
async function initializeGame() {
  setLoading(true);
  await handleFetchGameData();

  if (!Game()) {
    window.alert("Kunne ikke finde spillet");
    return window.location.href = "/";
  }

  initializeFields();
  paintShipsOnLeftBoard();
  paintShotsOnBoards();
  setGameNames();
  await checkTurn();
  setLoading(false);
}


/** Opretter 2×100 felter og bindes drag/drop eller klik */
export async function initializeFields() {
  ["left", "right"].forEach(side => {
    const board = getElementById(side + "GameBoard");
    for (let i = 1; i <= boardWidth * boardHeight; i++) {
      const field = document.createElement("div");
      field.classList.add("field", side);
      field.id = side + "field" + i;
      field.dataset.side = side;
      field.dataset.index = String(i);

      if (side === "left") {
        field.addEventListener("dragover", e => { e.preventDefault(); field.style.border = "2px solid black"; });
        field.addEventListener("dragleave", e => { e.preventDefault(); field.style.border = "1px solid black"; });
      } else {
        field.addEventListener("click", handleFireShot);
      }

      board.append(field);
    }
  });
}


/** Sætter spiller‐navne i UI */
function setGameNames() {
  getElementById("yourName").textContent  = Game().players[playerIndex].name;
  getElementById("enemyName").textContent = Game().players[enemyIndex].name;
}


/**
 * Finder skibe der netop blev sunket, markerer dem isSunk=true
 * og returnerer deres navne til popup.
 */
function getNewlySunkShips(ships, shots) {
  const sunkNow = [];
  ships.forEach(ship => {
    if (!ship.isSunk && ship.coveredFields.every(f => shots.includes(f))) {
      ship.isSunk = true;
      sunkNow.push(ship.name);
    }
  });
  return sunkNow;
}

/** Viser midlertidig popup med “X sunk!”-tekst */
function showSunkMessage(shipNames) {
  if (!shipNames.length) return;
  const msg = document.createElement('div');
  msg.classList.add('sunk-message');
  msg.textContent = shipNames.map(n => `${n} sunk!`).join(' ');
  document.body.appendChild(msg);
  msg.addEventListener('animationend', () => msg.remove());
}


/** 
 * Henter frisk state, tjekker om spillet er slut og opdaterer UI ellers. 
 */
async function checkTurn() {
  await handleFetchGameData();

  // 1) Hvis modstanderen forlod
  if (!Game()) {
    window.alert("Modstanderen forlod spillet");
    return window.location.href = "/";
  }

  // 2) Hvis spillet er færdigt → redirect begge
  if (Game().status === 'finished') {
    const didWin = (Game().winner === User()._id);
    sessionStorage.setItem('didWin', didWin);
    return window.location.href = "/endScreen";
  }

  // 3) Ellers set tur‐tekst og opdater shots
  const turnEl = getElementById("turn");
  turnEl.textContent = (User()._id === Game().currentTurn) ? "Your turn" : "Enemy turn";
  paintShotsOnBoards();
}


/** Tegner egne skibe på venstre board */
function paintShipsOnLeftBoard() {
  Game().players[playerIndex].ships.forEach(ship =>
    ship.coveredFields.forEach(f =>
      getElementById("leftfield" + f).classList.add("occupiedField")
    )
  );
}

/** Tegner hits/misses på begge boards */
function paintShotsOnBoards() {
  // Fjendens skud på dit board
  Game().players[enemyIndex].shots.forEach(s => {
    const el = getElementById("leftfield" + s);
    el.classList.add(el.classList.contains("occupiedField") ? "hitField" : "missedField");
  });
  // Dine skud på fjendens board
  Game().players[playerIndex].shots.forEach(s => {
    const el = getElementById("rightfield" + s);
    el.classList.add(isHit(s) ? "hitField" : "missedField");
  });
}


/** Henter spil‐data fra backend og gemmer i state */
async function handleFetchGameData() {
  const gameData = await getGameByID(Game()._id);
  setGame(gameData || null);
}


/**
 * Sender skud, opdaterer UI, viser sunk‐popup og redirecter hvis færdigt 
 */
async function handleFireShot(e) {
  e.preventDefault();
  if (Game().currentTurn !== User()._id) return;

  const td = e.currentTarget;
  const field = parseInt(td.dataset.index, 10);

  try {
    const updatedGame = await fireShot(Game()._id, User()._id, field);
    if (!updatedGame) return;

    // Hit/Miss animation + lyd
    if (isHit(field)) {
      td.classList.add("hitField"); cannonSound.play();
    } else {
      td.classList.add("missedField"); splashSound.play();
    }

    // Opdater state + socket‐broadcast
    setGame(updatedGame);
    gameUpdate(Game().gameCode);

    // Sunk‐popup
    const enemy      = Game().players[enemyIndex];
    const sunkShips  = getNewlySunkShips(enemy.ships, Game().players[playerIndex].shots);
    showSunkMessage(sunkShips);

    // Hvis spillet nu er færdigt → redirect
    if (updatedGame.status === 'finished') {
      const didWin = (updatedGame.winner === User()._id);
      sessionStorage.setItem('didWin', didWin);
      return window.location.href = "/endScreen";
    }

    // Fjern click‐listener på feltet
    td.replaceWith(td.cloneNode(true));
  } catch (err) {
    console.error("Error in handleFireShot:", err);
  }
}


/** Returnerer true hvis skud er på et skib */
function isHit(field) {
  const enemyShips = Game().players[
    Game().players[0].userId === User()._id ? 1 : 0
  ].ships;
  return enemyShips.some(ship => ship.coveredFields.includes(field));
}


/** Slet spillet helt og redirect til forsiden */
async function handleDeleteGame(e) {
  e.preventDefault();
  setLoading(true);
  try {
    await deleteGame(Game()._id);
    setGame(null);
    window.location.href = "/";
  } finally {
    setLoading(false);
  }
}