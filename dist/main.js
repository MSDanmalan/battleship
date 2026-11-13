/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom.js":
/*!********************!*\
  !*** ./src/dom.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerBoardUI: () => (/* binding */ computerBoardUI),
/* harmony export */   playUserInput: () => (/* binding */ playUserInput),
/* harmony export */   playerBoardUI: () => (/* binding */ playerBoardUI)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./game */ "./src/game.js");


function makeBoard(name) {
  const board = document.createElement('div');
  board.classList.add('board');
  board.setAttribute('id', `${name}-board`);
  board.style.gridTemplateColumns = 'repeat(10, 1fr)';
  board.style.gridTemplateRows = 'repeat(10, 1fr)';
  const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (const i of x) {
    for (const j of y) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.coordinate = `${i}, ${j}`;
      board.appendChild(cell);
    }
  }
  return board;
}
const playerBoardUI = makeBoard('player');
const computerBoardUI = makeBoard('computer');
let cells;
const getCells = boardID => new Promise(resolve => {
  document.addEventListener('DOMContentLoaded', () => {
    const selectedCells = document.querySelectorAll(`#${boardID} .cell`);
    resolve(selectedCells);
  });
});
async function renderBoards(player, boardID) {
  cells = Array.from(await getCells(boardID));
  for (const ship of player) {
    const shipPosition = cells.find(cell => `${ship.x}, ${ship.y}` === cell.dataset.coordinate);
    shipPosition.classList.add('ship');
  }
}
renderBoards(_game__WEBPACK_IMPORTED_MODULE_1__.playerShips, 'player-board');
renderBoards(_game__WEBPACK_IMPORTED_MODULE_1__.computerShips, 'computer-board');
async function playUserInput(player, enemyBoard, boardID) {
  cells = await getCells(boardID);
  cells.forEach(cell => cell.addEventListener('click', () => {
    const x = Number(cell.dataset.coordinate.charAt(0));
    const y = Number(cell.dataset.coordinate.charAt(3));
    player.play(x, y, enemyBoard);
  }));
}
playUserInput(_game__WEBPACK_IMPORTED_MODULE_1__.player1, _game__WEBPACK_IMPORTED_MODULE_1__.computerBoard, 'computer-board');
async function displayAttack(boardID) {
  cells = await getCells(boardID);
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (cell.classList.contains('ship')) {
        cell.classList.add('attacked-ship');
      } else {
        cell.classList.add('missed-attack');
      }
    });
  });
}
displayAttack('computer-board');
const gameStartButton = document.getElementById('start-game');
gameStartButton.addEventListener('click', () => {
  (0,_player__WEBPACK_IMPORTED_MODULE_0__.computerPlay)(_game__WEBPACK_IMPORTED_MODULE_1__.computerAI, _game__WEBPACK_IMPORTED_MODULE_1__.playerBoard);
  // displayAttack('player-board');
});


/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerAI: () => (/* binding */ computerAI),
/* harmony export */   computerBoard: () => (/* binding */ computerBoard),
/* harmony export */   computerShips: () => (/* binding */ computerShips),
/* harmony export */   player1: () => (/* binding */ player1),
/* harmony export */   playerBoard: () => (/* binding */ playerBoard),
/* harmony export */   playerShips: () => (/* binding */ playerShips)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dom */ "./src/dom.js");



const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
const player1 = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]();
const computerAI = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]();
playerBoard.placeShip(5, [6, 2], [6, 6]);
playerBoard.placeShip(4, [5, 8], [8, 8]);
playerBoard.placeShip(3, [0, 0], [0, 2]);
playerBoard.placeShip(3, [9, 0], [9, 2]);
playerBoard.placeShip(2, [1, 8], [1, 9]);
computerBoard.placeShip(5, [4, 4], [4, 8]);
computerBoard.placeShip(4, [6, 4], [6, 7]);
computerBoard.placeShip(3, [2, 9], [0, 9]);
computerBoard.placeShip(3, [7, 2], [5, 2]);
computerBoard.placeShip(2, [8, 7], [8, 6]);
const getPlayerShips = gameboard => gameboard.board.filter(square => square.ship !== null);
const playerShips = getPlayerShips(playerBoard);
const computerShips = getPlayerShips(computerBoard);
function isGameOver(allShips) {
  return allShips.every(coordinate => coordinate.ship.sunk === true);
}


/***/ }),

/***/ "./src/gameboard.js":
/*!**************************!*\
  !*** ./src/gameboard.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/ship.js");

function CreateNode(x, y) {
  const ship = null;
  return {
    x,
    y,
    ship
  };
}
class Gameboard {
  constructor() {
    this.board = this.createBoard();
    this.missedAttacks = new Set();
    this.attackedSquares = new Set();
  }
  createBoard() {
    const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const board = [];
    for (const i of x) {
      for (const j of y) {
        const coordinates = CreateNode(i, j);
        board.push(coordinates);
      }
    }
    return board;
  }
  placeShip(shipLength) {
    let start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    // Validate ship length
    if (!Number.isInteger(shipLength) || shipLength < 1) {
      throw new Error('Ship length must be a positive integer');
    }

    // Validate coordinate format
    const isValidCoordinate = coordinate => Array.isArray(coordinate) && coordinate.length === 2 && coordinate.every(value => Number.isInteger(value) && value >= 0 && value <= 9);
    if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
      throw new Error('Coordinates must be valid board positions');
    }
    const [xStart, yStart] = start;
    const [xEnd, yEnd] = end;

    // Determine orientation
    const isHorizontal = xStart === xEnd;
    const isVertical = yStart === yEnd;
    if (!isHorizontal && !isVertical) {
      throw new Error('Ships must be placed horizontally or vertically');
    }

    // Calculate ship length from its endpoints
    const actualLength = Math.abs(xEnd - xStart) + Math.abs(yEnd - yStart) + 1;
    if (actualLength !== shipLength) {
      throw new Error('Ship length does not match the selected coordinates');
    }

    // Calculate all occupied coordinates
    const coordinates = [];
    const stepX = Math.sign(xEnd - xStart);
    const stepY = Math.sign(yEnd - yStart);
    for (let i = 0; i < shipLength; i += 1) {
      coordinates.push([xStart + i * stepX, yStart + i * stepY]);
    }

    // Validate every position before changing the board
    const positions = coordinates.map(_ref => {
      let [x, y] = _ref;
      return this.board.find(node => node.x === x && node.y === y);
    });
    if (positions.some(position => !position)) {
      throw new Error('Ship placement is outside the board');
    }
    if (positions.some(position => position.ship !== null)) {
      throw new Error('Ships cannot overlap');
    }

    // Place the ship only after all validations pass
    const newShip = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](shipLength);
    positions.forEach(position => {
      position.ship = newShip;
    });
    return this.board;
  }
  receiveAttack(x, y) {
    // Validate coordinates
    const isValidCoordinate = value => Number.isInteger(value) && value >= 0 && value <= 9;
    if (!isValidCoordinate(x) || !isValidCoordinate(y)) {
      return {
        status: 'invalid-coordinate',
        square: null
      };
    }

    // Use coordinate values rather than object references
    const coordinateKey = `${x},${y}`;

    // Prevent repeated attacks
    if (this.attackedSquares.has(coordinateKey)) {
      return {
        status: 'already-attacked',
        square: this.board.find(node => node.x === x && node.y === y)
      };
    }
    const target = this.board.find(node => node.x === x && node.y === y);

    // Record the attack
    this.attackedSquares.add(coordinateKey);
    if (target.ship !== null) {
      target.ship.hit();
      target.ship.isSunk();
      return {
        status: 'hit',
        square: target
      };
    }
    this.missedAttacks.add(target);
    return {
      status: 'miss',
      square: target
    };
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Gameboard);

/***/ }),

/***/ "./src/player.js":
/*!***********************!*\
  !*** ./src/player.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerPlay: () => (/* binding */ computerPlay),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Player {
  constructor() {
    this.played = null;
    this.shots = new Set();
  }
  play(x, y, gameBoard) {
    const result = gameBoard.receiveAttack(x, y);
    if (result.status === 'hit' || result.status === 'miss') {
      this.played = true;
    }
    return result;
  }
}
const computerPlay = (AI, board) => {
  // Find all squares that neither this AI nor the board has attacked.
  const availableTargets = board.board.filter(square => {
    const coordinateKey = `${square.x},${square.y}`;
    return !AI.shots.has(coordinateKey) && !board.attackedSquares.has(coordinateKey);
  });

  // Stop safely when no targets remain.
  if (availableTargets.length === 0) {
    return null;
  }

  // Select a random available square.
  const randomIndex = Math.floor(Math.random() * availableTargets.length);
  const target = availableTargets[randomIndex];

  // Attack the selected square.
  const result = AI.play(target.x, target.y, board);

  // Record only successful attacks.
  if (result.status === 'hit' || result.status === 'miss') {
    AI.shots.add(`${target.x},${target.y}`);
  }
  return result;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);


/***/ }),

/***/ "./src/ship.js":
/*!*********************!*\
  !*** ./src/ship.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Ship {
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
  }
  hit() {
    if (this.hits < this.length) {
      this.hits += 1;
    }
    return this.hits;
  }
  isSunk() {
    if (this.length === this.hits) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom */ "./src/dom.js");

const container = document.querySelector('.container');
container.append(_dom__WEBPACK_IMPORTED_MODULE_0__.playerBoardUI, _dom__WEBPACK_IMPORTED_MODULE_0__.computerBoardUI);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZG9tLmpzIiwid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGVfcmVwby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVtcGxhdGVfcmVwby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcHV0ZXJQbGF5IH0gZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IHtcbiAgICBwbGF5ZXJCb2FyZCxcbiAgICBjb21wdXRlckJvYXJkLFxuICAgIHBsYXllclNoaXBzLFxuICAgIGNvbXB1dGVyU2hpcHMsXG4gICAgcGxheWVyMSxcbiAgICBjb21wdXRlckFJLFxufSBmcm9tICcuL2dhbWUnO1xuXG5mdW5jdGlvbiBtYWtlQm9hcmQobmFtZSkge1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9hcmQuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7bmFtZX0tYm9hcmRgKTtcbiAgICBib2FyZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gJ3JlcGVhdCgxMCwgMWZyKSc7XG4gICAgYm9hcmQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9ICdyZXBlYXQoMTAsIDFmciknO1xuXG4gICAgY29uc3QgeCA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICBjb25zdCB5ID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldO1xuICAgIGZvciAoY29uc3QgaSBvZiB4KSB7XG4gICAgICAgIGZvciAoY29uc3QgaiBvZiB5KSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5jb29yZGluYXRlID0gYCR7aX0sICR7an1gO1xuICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkO1xufVxuY29uc3QgcGxheWVyQm9hcmRVSSA9IG1ha2VCb2FyZCgncGxheWVyJyk7XG5jb25zdCBjb21wdXRlckJvYXJkVUkgPSBtYWtlQm9hcmQoJ2NvbXB1dGVyJyk7XG5cbmxldCBjZWxscztcbmNvbnN0IGdldENlbGxzID0gKGJvYXJkSUQpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgIGAjJHtib2FyZElEfSAuY2VsbGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXNvbHZlKHNlbGVjdGVkQ2VsbHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyQm9hcmRzKHBsYXllciwgYm9hcmRJRCkge1xuICAgIGNlbGxzID0gQXJyYXkuZnJvbShhd2FpdCBnZXRDZWxscyhib2FyZElEKSk7XG5cbiAgICBmb3IgKGNvbnN0IHNoaXAgb2YgcGxheWVyKSB7XG4gICAgICAgIGNvbnN0IHNoaXBQb3NpdGlvbiA9IGNlbGxzLmZpbmQoXG4gICAgICAgICAgICAoY2VsbCkgPT4gYCR7c2hpcC54fSwgJHtzaGlwLnl9YCA9PT0gY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVcbiAgICAgICAgKTtcbiAgICAgICAgc2hpcFBvc2l0aW9uLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG59XG5yZW5kZXJCb2FyZHMocGxheWVyU2hpcHMsICdwbGF5ZXItYm9hcmQnKTtcbnJlbmRlckJvYXJkcyhjb21wdXRlclNoaXBzLCAnY29tcHV0ZXItYm9hcmQnKTtcblxuYXN5bmMgZnVuY3Rpb24gcGxheVVzZXJJbnB1dChwbGF5ZXIsIGVuZW15Qm9hcmQsIGJvYXJkSUQpIHtcbiAgICBjZWxscyA9IGF3YWl0IGdldENlbGxzKGJvYXJkSUQpO1xuICAgIGNlbGxzLmZvckVhY2goKGNlbGwpID0+XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTnVtYmVyKGNlbGwuZGF0YXNldC5jb29yZGluYXRlLmNoYXJBdCgwKSk7XG4gICAgICAgICAgICBjb25zdCB5ID0gTnVtYmVyKGNlbGwuZGF0YXNldC5jb29yZGluYXRlLmNoYXJBdCgzKSk7XG4gICAgICAgICAgICBwbGF5ZXIucGxheSh4LCB5LCBlbmVteUJvYXJkKTtcbiAgICAgICAgfSlcbiAgICApO1xufVxuXG5wbGF5VXNlcklucHV0KHBsYXllcjEsIGNvbXB1dGVyQm9hcmQsICdjb21wdXRlci1ib2FyZCcpO1xuXG5hc3luYyBmdW5jdGlvbiBkaXNwbGF5QXR0YWNrKGJvYXJkSUQpIHtcbiAgICBjZWxscyA9IGF3YWl0IGdldENlbGxzKGJvYXJkSUQpO1xuXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaGlwJykpIHtcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2F0dGFja2VkLXNoaXAnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQtYXR0YWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZGlzcGxheUF0dGFjaygnY29tcHV0ZXItYm9hcmQnKTtcblxuY29uc3QgZ2FtZVN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0LWdhbWUnKTtcbmdhbWVTdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb21wdXRlclBsYXkoY29tcHV0ZXJBSSwgcGxheWVyQm9hcmQpO1xuICAgIC8vIGRpc3BsYXlBdHRhY2soJ3BsYXllci1ib2FyZCcpO1xufSk7XG5cbmV4cG9ydCB7IHBsYXllckJvYXJkVUksIGNvbXB1dGVyQm9hcmRVSSwgcGxheVVzZXJJbnB1dCB9O1xuIiwiaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcbmltcG9ydCB7IHBsYXlVc2VySW5wdXQgfSBmcm9tICcuL2RvbSc7XG5cbmNvbnN0IHBsYXllckJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuY29uc3QgY29tcHV0ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbmNvbnN0IHBsYXllcjEgPSBuZXcgUGxheWVyKCk7XG5jb25zdCBjb21wdXRlckFJID0gbmV3IFBsYXllcigpO1xuXG5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoNSwgWzYsIDJdLCBbNiwgNl0pO1xucGxheWVyQm9hcmQucGxhY2VTaGlwKDQsIFs1LCA4XSwgWzgsIDhdKTtcbnBsYXllckJvYXJkLnBsYWNlU2hpcCgzLCBbMCwgMF0sIFswLCAyXSk7XG5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoMywgWzksIDBdLCBbOSwgMl0pO1xucGxheWVyQm9hcmQucGxhY2VTaGlwKDIsIFsxLCA4XSwgWzEsIDldKTtcblxuY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNSwgWzQsIDRdLCBbNCwgOF0pO1xuY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCwgWzYsIDRdLCBbNiwgN10pO1xuY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMywgWzIsIDldLCBbMCwgOV0pO1xuY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMywgWzcsIDJdLCBbNSwgMl0pO1xuY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoMiwgWzgsIDddLCBbOCwgNl0pO1xuXG5jb25zdCBnZXRQbGF5ZXJTaGlwcyA9IChnYW1lYm9hcmQpID0+XG4gICAgZ2FtZWJvYXJkLmJvYXJkLmZpbHRlcigoc3F1YXJlKSA9PiBzcXVhcmUuc2hpcCAhPT0gbnVsbCk7XG5cbmNvbnN0IHBsYXllclNoaXBzID0gZ2V0UGxheWVyU2hpcHMocGxheWVyQm9hcmQpO1xuY29uc3QgY29tcHV0ZXJTaGlwcyA9IGdldFBsYXllclNoaXBzKGNvbXB1dGVyQm9hcmQpO1xuXG5mdW5jdGlvbiBpc0dhbWVPdmVyKGFsbFNoaXBzKSB7XG4gICAgcmV0dXJuIGFsbFNoaXBzLmV2ZXJ5KChjb29yZGluYXRlKSA9PiBjb29yZGluYXRlLnNoaXAuc3VuayA9PT0gdHJ1ZSk7XG59XG5cbmV4cG9ydCB7XG4gICAgcGxheWVyQm9hcmQsXG4gICAgY29tcHV0ZXJCb2FyZCxcbiAgICBwbGF5ZXJTaGlwcyxcbiAgICBjb21wdXRlclNoaXBzLFxuICAgIHBsYXllcjEsXG4gICAgY29tcHV0ZXJBSSxcbn07XG4iLCJpbXBvcnQgU2hpcCBmcm9tICcuL3NoaXAnO1xuXG5mdW5jdGlvbiBDcmVhdGVOb2RlKHgsIHkpIHtcbiAgICBjb25zdCBzaGlwID0gbnVsbDtcbiAgICByZXR1cm4geyB4LCB5LCBzaGlwIH07XG59XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYm9hcmQgPSB0aGlzLmNyZWF0ZUJvYXJkKCk7XG4gICAgICAgIHRoaXMubWlzc2VkQXR0YWNrcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgdGhpcy5hdHRhY2tlZFNxdWFyZXMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgY3JlYXRlQm9hcmQoKSB7XG4gICAgICAgIGNvbnN0IHggPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV07XG4gICAgICAgIGNvbnN0IHkgPSBbMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOV07XG4gICAgICAgIGNvbnN0IGJvYXJkID0gW107XG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB4KSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGogb2YgeSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gQ3JlYXRlTm9kZShpLCBqKTtcbiAgICAgICAgICAgICAgICBib2FyZC5wdXNoKGNvb3JkaW5hdGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBib2FyZDtcbiAgICB9XG5cbiAgICBwbGFjZVNoaXAoc2hpcExlbmd0aCwgc3RhcnQgPSBbXSwgZW5kID0gW10pIHtcbiAgICAgICAgLy8gVmFsaWRhdGUgc2hpcCBsZW5ndGhcbiAgICAgICAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHNoaXBMZW5ndGgpIHx8IHNoaXBMZW5ndGggPCAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NoaXAgbGVuZ3RoIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWYWxpZGF0ZSBjb29yZGluYXRlIGZvcm1hdFxuICAgICAgICBjb25zdCBpc1ZhbGlkQ29vcmRpbmF0ZSA9IChjb29yZGluYXRlKSA9PlxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShjb29yZGluYXRlKSAmJlxuICAgICAgICAgICAgY29vcmRpbmF0ZS5sZW5ndGggPT09IDIgJiZcbiAgICAgICAgICAgIGNvb3JkaW5hdGUuZXZlcnkoXG4gICAgICAgICAgICAgICAgKHZhbHVlKSA9PiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSAmJiB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9IDlcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkQ29vcmRpbmF0ZShzdGFydCkgfHwgIWlzVmFsaWRDb29yZGluYXRlKGVuZCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29vcmRpbmF0ZXMgbXVzdCBiZSB2YWxpZCBib2FyZCBwb3NpdGlvbnMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IFt4U3RhcnQsIHlTdGFydF0gPSBzdGFydDtcbiAgICAgICAgY29uc3QgW3hFbmQsIHlFbmRdID0gZW5kO1xuXG4gICAgICAgIC8vIERldGVybWluZSBvcmllbnRhdGlvblxuICAgICAgICBjb25zdCBpc0hvcml6b250YWwgPSB4U3RhcnQgPT09IHhFbmQ7XG4gICAgICAgIGNvbnN0IGlzVmVydGljYWwgPSB5U3RhcnQgPT09IHlFbmQ7XG5cbiAgICAgICAgaWYgKCFpc0hvcml6b250YWwgJiYgIWlzVmVydGljYWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcHMgbXVzdCBiZSBwbGFjZWQgaG9yaXpvbnRhbGx5IG9yIHZlcnRpY2FsbHknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBzaGlwIGxlbmd0aCBmcm9tIGl0cyBlbmRwb2ludHNcbiAgICAgICAgY29uc3QgYWN0dWFsTGVuZ3RoID1cbiAgICAgICAgICAgIE1hdGguYWJzKHhFbmQgLSB4U3RhcnQpICsgTWF0aC5hYnMoeUVuZCAtIHlTdGFydCkgKyAxO1xuXG4gICAgICAgIGlmIChhY3R1YWxMZW5ndGggIT09IHNoaXBMZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnU2hpcCBsZW5ndGggZG9lcyBub3QgbWF0Y2ggdGhlIHNlbGVjdGVkIGNvb3JkaW5hdGVzJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENhbGN1bGF0ZSBhbGwgb2NjdXBpZWQgY29vcmRpbmF0ZXNcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbXTtcblxuICAgICAgICBjb25zdCBzdGVwWCA9IE1hdGguc2lnbih4RW5kIC0geFN0YXJ0KTtcbiAgICAgICAgY29uc3Qgc3RlcFkgPSBNYXRoLnNpZ24oeUVuZCAtIHlTdGFydCk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwTGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGVzLnB1c2goW3hTdGFydCArIGkgKiBzdGVwWCwgeVN0YXJ0ICsgaSAqIHN0ZXBZXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWYWxpZGF0ZSBldmVyeSBwb3NpdGlvbiBiZWZvcmUgY2hhbmdpbmcgdGhlIGJvYXJkXG4gICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IGNvb3JkaW5hdGVzLm1hcCgoW3gsIHldKSA9PlxuICAgICAgICAgICAgdGhpcy5ib2FyZC5maW5kKChub2RlKSA9PiBub2RlLnggPT09IHggJiYgbm9kZS55ID09PSB5KVxuICAgICAgICApO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbnMuc29tZSgocG9zaXRpb24pID0+ICFwb3NpdGlvbikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcCBwbGFjZW1lbnQgaXMgb3V0c2lkZSB0aGUgYm9hcmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbnMuc29tZSgocG9zaXRpb24pID0+IHBvc2l0aW9uLnNoaXAgIT09IG51bGwpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1NoaXBzIGNhbm5vdCBvdmVybGFwJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQbGFjZSB0aGUgc2hpcCBvbmx5IGFmdGVyIGFsbCB2YWxpZGF0aW9ucyBwYXNzXG4gICAgICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcChzaGlwTGVuZ3RoKTtcblxuICAgICAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgIHBvc2l0aW9uLnNoaXAgPSBuZXdTaGlwO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5ib2FyZDtcbiAgICB9XG5cbiAgICByZWNlaXZlQXR0YWNrKHgsIHkpIHtcbiAgICAgICAgLy8gVmFsaWRhdGUgY29vcmRpbmF0ZXNcbiAgICAgICAgY29uc3QgaXNWYWxpZENvb3JkaW5hdGUgPSAodmFsdWUpID0+XG4gICAgICAgICAgICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSAmJiB2YWx1ZSA+PSAwICYmIHZhbHVlIDw9IDk7XG5cbiAgICAgICAgaWYgKCFpc1ZhbGlkQ29vcmRpbmF0ZSh4KSB8fCAhaXNWYWxpZENvb3JkaW5hdGUoeSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnaW52YWxpZC1jb29yZGluYXRlJyxcbiAgICAgICAgICAgICAgICBzcXVhcmU6IG51bGwsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVXNlIGNvb3JkaW5hdGUgdmFsdWVzIHJhdGhlciB0aGFuIG9iamVjdCByZWZlcmVuY2VzXG4gICAgICAgIGNvbnN0IGNvb3JkaW5hdGVLZXkgPSBgJHt4fSwke3l9YDtcblxuICAgICAgICAvLyBQcmV2ZW50IHJlcGVhdGVkIGF0dGFja3NcbiAgICAgICAgaWYgKHRoaXMuYXR0YWNrZWRTcXVhcmVzLmhhcyhjb29yZGluYXRlS2V5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdhbHJlYWR5LWF0dGFja2VkJyxcbiAgICAgICAgICAgICAgICBzcXVhcmU6IHRoaXMuYm9hcmQuZmluZCgobm9kZSkgPT4gbm9kZS54ID09PSB4ICYmIG5vZGUueSA9PT0geSksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5ib2FyZC5maW5kKChub2RlKSA9PiBub2RlLnggPT09IHggJiYgbm9kZS55ID09PSB5KTtcblxuICAgICAgICAvLyBSZWNvcmQgdGhlIGF0dGFja1xuICAgICAgICB0aGlzLmF0dGFja2VkU3F1YXJlcy5hZGQoY29vcmRpbmF0ZUtleSk7XG5cbiAgICAgICAgaWYgKHRhcmdldC5zaGlwICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0YXJnZXQuc2hpcC5oaXQoKTtcbiAgICAgICAgICAgIHRhcmdldC5zaGlwLmlzU3VuaygpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2hpdCcsXG4gICAgICAgICAgICAgICAgc3F1YXJlOiB0YXJnZXQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5taXNzZWRBdHRhY2tzLmFkZCh0YXJnZXQpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXM6ICdtaXNzJyxcbiAgICAgICAgICAgIHNxdWFyZTogdGFyZ2V0LFxuICAgICAgICB9O1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZWJvYXJkO1xuIiwiY2xhc3MgUGxheWVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wbGF5ZWQgPSBudWxsO1xuICAgICAgICB0aGlzLnNob3RzID0gbmV3IFNldCgpO1xuICAgIH1cblxuICAgIHBsYXkoeCwgeSwgZ2FtZUJvYXJkKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGdhbWVCb2FyZC5yZWNlaXZlQXR0YWNrKHgsIHkpO1xuXG4gICAgICAgIGlmIChyZXN1bHQuc3RhdHVzID09PSAnaGl0JyB8fCByZXN1bHQuc3RhdHVzID09PSAnbWlzcycpIHtcbiAgICAgICAgICAgIHRoaXMucGxheWVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuXG5jb25zdCBjb21wdXRlclBsYXkgPSAoQUksIGJvYXJkKSA9PiB7XG4gICAgLy8gRmluZCBhbGwgc3F1YXJlcyB0aGF0IG5laXRoZXIgdGhpcyBBSSBub3IgdGhlIGJvYXJkIGhhcyBhdHRhY2tlZC5cbiAgICBjb25zdCBhdmFpbGFibGVUYXJnZXRzID0gYm9hcmQuYm9hcmQuZmlsdGVyKChzcXVhcmUpID0+IHtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZUtleSA9IGAke3NxdWFyZS54fSwke3NxdWFyZS55fWA7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICFBSS5zaG90cy5oYXMoY29vcmRpbmF0ZUtleSkgJiZcbiAgICAgICAgICAgICFib2FyZC5hdHRhY2tlZFNxdWFyZXMuaGFzKGNvb3JkaW5hdGVLZXkpXG4gICAgICAgICk7XG4gICAgfSk7XG5cbiAgICAvLyBTdG9wIHNhZmVseSB3aGVuIG5vIHRhcmdldHMgcmVtYWluLlxuICAgIGlmIChhdmFpbGFibGVUYXJnZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBTZWxlY3QgYSByYW5kb20gYXZhaWxhYmxlIHNxdWFyZS5cbiAgICBjb25zdCByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGF2YWlsYWJsZVRhcmdldHMubGVuZ3RoKTtcbiAgICBjb25zdCB0YXJnZXQgPSBhdmFpbGFibGVUYXJnZXRzW3JhbmRvbUluZGV4XTtcblxuICAgIC8vIEF0dGFjayB0aGUgc2VsZWN0ZWQgc3F1YXJlLlxuICAgIGNvbnN0IHJlc3VsdCA9IEFJLnBsYXkodGFyZ2V0LngsIHRhcmdldC55LCBib2FyZCk7XG5cbiAgICAvLyBSZWNvcmQgb25seSBzdWNjZXNzZnVsIGF0dGFja3MuXG4gICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdoaXQnIHx8IHJlc3VsdC5zdGF0dXMgPT09ICdtaXNzJykge1xuICAgICAgICBBSS5zaG90cy5hZGQoYCR7dGFyZ2V0Lnh9LCR7dGFyZ2V0Lnl9YCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbmV4cG9ydCB7IGNvbXB1dGVyUGxheSB9O1xuIiwiY2xhc3MgU2hpcCB7XG4gICAgY29uc3RydWN0b3IobGVuZ3RoKSB7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbGVuZ3RoO1xuICAgICAgICB0aGlzLmhpdHMgPSAwO1xuICAgICAgICB0aGlzLnN1bmsgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBoaXQoKSB7XG4gICAgICAgIGlmICh0aGlzLmhpdHMgPCB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5oaXRzICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuaGl0cztcbiAgICB9XG5cbiAgICBpc1N1bmsoKSB7XG4gICAgICAgIGlmICh0aGlzLmxlbmd0aCA9PT0gdGhpcy5oaXRzKSB7XG4gICAgICAgICAgICB0aGlzLnN1bmsgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHBsYXllckJvYXJkVUksIGNvbXB1dGVyQm9hcmRVSSB9IGZyb20gJy4vZG9tJztcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpO1xuY29udGFpbmVyLmFwcGVuZChwbGF5ZXJCb2FyZFVJLCBjb21wdXRlckJvYXJkVUkpO1xuIl0sIm5hbWVzIjpbImNvbXB1dGVyUGxheSIsInBsYXllckJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsInBsYXllclNoaXBzIiwiY29tcHV0ZXJTaGlwcyIsInBsYXllcjEiLCJjb21wdXRlckFJIiwibWFrZUJvYXJkIiwibmFtZSIsImJvYXJkIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwic2V0QXR0cmlidXRlIiwic3R5bGUiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ3JpZFRlbXBsYXRlUm93cyIsIngiLCJ5IiwiaSIsImoiLCJjZWxsIiwiZGF0YXNldCIsImNvb3JkaW5hdGUiLCJhcHBlbmRDaGlsZCIsInBsYXllckJvYXJkVUkiLCJjb21wdXRlckJvYXJkVUkiLCJjZWxscyIsImdldENlbGxzIiwiYm9hcmRJRCIsIlByb21pc2UiLCJyZXNvbHZlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNlbGVjdGVkQ2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwicmVuZGVyQm9hcmRzIiwicGxheWVyIiwiQXJyYXkiLCJmcm9tIiwic2hpcCIsInNoaXBQb3NpdGlvbiIsImZpbmQiLCJwbGF5VXNlcklucHV0IiwiZW5lbXlCb2FyZCIsImZvckVhY2giLCJOdW1iZXIiLCJjaGFyQXQiLCJwbGF5IiwiZGlzcGxheUF0dGFjayIsImNvbnRhaW5zIiwiZ2FtZVN0YXJ0QnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJQbGF5ZXIiLCJHYW1lYm9hcmQiLCJwbGFjZVNoaXAiLCJnZXRQbGF5ZXJTaGlwcyIsImdhbWVib2FyZCIsImZpbHRlciIsInNxdWFyZSIsImlzR2FtZU92ZXIiLCJhbGxTaGlwcyIsImV2ZXJ5Iiwic3VuayIsIlNoaXAiLCJDcmVhdGVOb2RlIiwiY29uc3RydWN0b3IiLCJjcmVhdGVCb2FyZCIsIm1pc3NlZEF0dGFja3MiLCJTZXQiLCJhdHRhY2tlZFNxdWFyZXMiLCJjb29yZGluYXRlcyIsInB1c2giLCJzaGlwTGVuZ3RoIiwic3RhcnQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJlbmQiLCJpc0ludGVnZXIiLCJFcnJvciIsImlzVmFsaWRDb29yZGluYXRlIiwiaXNBcnJheSIsInZhbHVlIiwieFN0YXJ0IiwieVN0YXJ0IiwieEVuZCIsInlFbmQiLCJpc0hvcml6b250YWwiLCJpc1ZlcnRpY2FsIiwiYWN0dWFsTGVuZ3RoIiwiTWF0aCIsImFicyIsInN0ZXBYIiwic2lnbiIsInN0ZXBZIiwicG9zaXRpb25zIiwibWFwIiwiX3JlZiIsIm5vZGUiLCJzb21lIiwicG9zaXRpb24iLCJuZXdTaGlwIiwicmVjZWl2ZUF0dGFjayIsInN0YXR1cyIsImNvb3JkaW5hdGVLZXkiLCJoYXMiLCJ0YXJnZXQiLCJoaXQiLCJpc1N1bmsiLCJwbGF5ZWQiLCJzaG90cyIsImdhbWVCb2FyZCIsInJlc3VsdCIsIkFJIiwiYXZhaWxhYmxlVGFyZ2V0cyIsInJhbmRvbUluZGV4IiwiZmxvb3IiLCJyYW5kb20iLCJoaXRzIiwiY29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsImFwcGVuZCJdLCJzb3VyY2VSb290IjoiIn0=