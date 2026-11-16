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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Iiwid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGVfcmVwby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVtcGxhdGVfcmVwby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tcHV0ZXJQbGF5IH0gZnJvbSAnLi9wbGF5ZXInO1xuaW1wb3J0IHtcbiAgICBwbGF5ZXJCb2FyZCxcbiAgICBjb21wdXRlckJvYXJkLFxuICAgIHBsYXllclNoaXBzLFxuICAgIGNvbXB1dGVyU2hpcHMsXG4gICAgcGxheWVyMSxcbiAgICBjb21wdXRlckFJLFxufSBmcm9tICcuL2dhbWUnO1xuXG5mdW5jdGlvbiBtYWtlQm9hcmQobmFtZSkge1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9hcmQuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7bmFtZX0tYm9hcmRgKTtcbiAgICBib2FyZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gJ3JlcGVhdCgxMCwgMWZyKSc7XG4gICAgYm9hcmQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9ICdyZXBlYXQoMTAsIDFmciknO1xuXG4gICAgY29uc3QgeCA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICBjb25zdCB5ID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldO1xuICAgIGZvciAoY29uc3QgaSBvZiB4KSB7XG4gICAgICAgIGZvciAoY29uc3QgaiBvZiB5KSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5jb29yZGluYXRlID0gYCR7aX0sICR7an1gO1xuICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkO1xufVxuY29uc3QgcGxheWVyQm9hcmRVSSA9IG1ha2VCb2FyZCgncGxheWVyJyk7XG5jb25zdCBjb21wdXRlckJvYXJkVUkgPSBtYWtlQm9hcmQoJ2NvbXB1dGVyJyk7XG5cbmxldCBjZWxscztcbmNvbnN0IGdldENlbGxzID0gKGJvYXJkSUQpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICAgIGAjJHtib2FyZElEfSAuY2VsbGBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZXNvbHZlKHNlbGVjdGVkQ2VsbHMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuYXN5bmMgZnVuY3Rpb24gcmVuZGVyQm9hcmRzKHBsYXllciwgYm9hcmRJRCkge1xuICAgIGNlbGxzID0gQXJyYXkuZnJvbShhd2FpdCBnZXRDZWxscyhib2FyZElEKSk7XG5cbiAgICBmb3IgKGNvbnN0IHNoaXAgb2YgcGxheWVyKSB7XG4gICAgICAgIGNvbnN0IHNoaXBQb3NpdGlvbiA9IGNlbGxzLmZpbmQoXG4gICAgICAgICAgICAoY2VsbCkgPT4gYCR7c2hpcC54fSwgJHtzaGlwLnl9YCA9PT0gY2VsbC5kYXRhc2V0LmNvb3JkaW5hdGVcbiAgICAgICAgKTtcbiAgICAgICAgc2hpcFBvc2l0aW9uLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgICB9XG59XG5yZW5kZXJCb2FyZHMocGxheWVyU2hpcHMsICdwbGF5ZXItYm9hcmQnKTtcbnJlbmRlckJvYXJkcyhjb21wdXRlclNoaXBzLCAnY29tcHV0ZXItYm9hcmQnKTtcblxuYXN5bmMgZnVuY3Rpb24gcGxheVVzZXJJbnB1dChwbGF5ZXIsIGVuZW15Qm9hcmQsIGJvYXJkSUQpIHtcbiAgICBjZWxscyA9IGF3YWl0IGdldENlbGxzKGJvYXJkSUQpO1xuICAgIGNlbGxzLmZvckVhY2goKGNlbGwpID0+XG4gICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB4ID0gTnVtYmVyKGNlbGwuZGF0YXNldC5jb29yZGluYXRlLmNoYXJBdCgwKSk7XG4gICAgICAgICAgICBjb25zdCB5ID0gTnVtYmVyKGNlbGwuZGF0YXNldC5jb29yZGluYXRlLmNoYXJBdCgzKSk7XG4gICAgICAgICAgICBwbGF5ZXIucGxheSh4LCB5LCBlbmVteUJvYXJkKTtcbiAgICAgICAgfSlcbiAgICApO1xufVxuXG5wbGF5VXNlcklucHV0KHBsYXllcjEsIGNvbXB1dGVyQm9hcmQsICdjb21wdXRlci1ib2FyZCcpO1xuXG5hc3luYyBmdW5jdGlvbiBkaXNwbGF5QXR0YWNrKGJvYXJkSUQpIHtcbiAgICBjZWxscyA9IGF3YWl0IGdldENlbGxzKGJvYXJkSUQpO1xuXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaGlwJykpIHtcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2F0dGFja2VkLXNoaXAnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQtYXR0YWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuZGlzcGxheUF0dGFjaygnY29tcHV0ZXItYm9hcmQnKTtcblxuY29uc3QgZ2FtZVN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0LWdhbWUnKTtcbmdhbWVTdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb21wdXRlclBsYXkoY29tcHV0ZXJBSSwgcGxheWVyQm9hcmQpO1xuICAgIC8vIGRpc3BsYXlBdHRhY2soJ3BsYXllci1ib2FyZCcpO1xufSk7XG5cbmV4cG9ydCB7IHBsYXllckJvYXJkVUksIGNvbXB1dGVyQm9hcmRVSSwgcGxheVVzZXJJbnB1dCB9O1xuIiwiaW1wb3J0IFBsYXllciBmcm9tICcuL3BsYXllcic7XG5pbXBvcnQgR2FtZWJvYXJkIGZyb20gJy4vZ2FtZWJvYXJkJztcblxuY29uc3QgcGxheWVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG5jb25zdCBjb21wdXRlckJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuY29uc3QgcGxheWVyMSA9IG5ldyBQbGF5ZXIoKTtcbmNvbnN0IGNvbXB1dGVyQUkgPSBuZXcgUGxheWVyKCk7XG5cbnBsYXllckJvYXJkLnBsYWNlU2hpcCg1LCBbNiwgMl0sIFs2LCA2XSk7XG5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoNCwgWzUsIDhdLCBbOCwgOF0pO1xucGxheWVyQm9hcmQucGxhY2VTaGlwKDMsIFswLCAwXSwgWzAsIDJdKTtcbnBsYXllckJvYXJkLnBsYWNlU2hpcCgzLCBbOSwgMF0sIFs5LCAyXSk7XG5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoMiwgWzEsIDhdLCBbMSwgOV0pO1xuXG5jb21wdXRlckJvYXJkLnBsYWNlU2hpcCg1LCBbNCwgNF0sIFs0LCA4XSk7XG5jb21wdXRlckJvYXJkLnBsYWNlU2hpcCg0LCBbNiwgNF0sIFs2LCA3XSk7XG5jb21wdXRlckJvYXJkLnBsYWNlU2hpcCgzLCBbMiwgOV0sIFswLCA5XSk7XG5jb21wdXRlckJvYXJkLnBsYWNlU2hpcCgzLCBbNywgMl0sIFs1LCAyXSk7XG5jb21wdXRlckJvYXJkLnBsYWNlU2hpcCgyLCBbOCwgN10sIFs4LCA2XSk7XG5cbmNvbnN0IGdldFBsYXllclNoaXBzID0gKGdhbWVib2FyZCkgPT5cbiAgICBnYW1lYm9hcmQuYm9hcmQuZmlsdGVyKChzcXVhcmUpID0+IHNxdWFyZS5zaGlwICE9PSBudWxsKTtcblxuY29uc3QgcGxheWVyU2hpcHMgPSBnZXRQbGF5ZXJTaGlwcyhwbGF5ZXJCb2FyZCk7XG5jb25zdCBjb21wdXRlclNoaXBzID0gZ2V0UGxheWVyU2hpcHMoY29tcHV0ZXJCb2FyZCk7XG5cbmZ1bmN0aW9uIGlzR2FtZU92ZXIoYWxsU2hpcHMpIHtcbiAgICByZXR1cm4gYWxsU2hpcHMuZXZlcnkoKGNvb3JkaW5hdGUpID0+IGNvb3JkaW5hdGUuc2hpcC5zdW5rID09PSB0cnVlKTtcbn1cblxuZXhwb3J0IHtcbiAgICBwbGF5ZXJCb2FyZCxcbiAgICBjb21wdXRlckJvYXJkLFxuICAgIHBsYXllclNoaXBzLFxuICAgIGNvbXB1dGVyU2hpcHMsXG4gICAgcGxheWVyMSxcbiAgICBjb21wdXRlckFJLFxufTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmZ1bmN0aW9uIENyZWF0ZU5vZGUoeCwgeSkge1xuICAgIGNvbnN0IHNoaXAgPSBudWxsO1xuICAgIHJldHVybiB7IHgsIHksIHNoaXAgfTtcbn1cblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcbiAgICAgICAgdGhpcy5taXNzZWRBdHRhY2tzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmF0dGFja2VkU3F1YXJlcyA9IG5ldyBTZXQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgeCA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICAgICAgY29uc3QgeSA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICAgICAgY29uc3QgYm9hcmQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaiBvZiB5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBDcmVhdGVOb2RlKGksIGopO1xuICAgICAgICAgICAgICAgIGJvYXJkLnB1c2goY29vcmRpbmF0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvYXJkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaGlwTGVuZ3RoLCBzdGFydCA9IFtdLCBlbmQgPSBbXSkge1xuICAgICAgICAvLyBWYWxpZGF0ZSBzaGlwIGxlbmd0aFxuICAgICAgICBpZiAoIU51bWJlci5pc0ludGVnZXIoc2hpcExlbmd0aCkgfHwgc2hpcExlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcCBsZW5ndGggbXVzdCBiZSBhIHBvc2l0aXZlIGludGVnZXInKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZhbGlkYXRlIGNvb3JkaW5hdGUgZm9ybWF0XG4gICAgICAgIGNvbnN0IGlzVmFsaWRDb29yZGluYXRlID0gKGNvb3JkaW5hdGUpID0+XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KGNvb3JkaW5hdGUpICYmXG4gICAgICAgICAgICBjb29yZGluYXRlLmxlbmd0aCA9PT0gMiAmJlxuICAgICAgICAgICAgY29vcmRpbmF0ZS5ldmVyeShcbiAgICAgICAgICAgICAgICAodmFsdWUpID0+IE51bWJlci5pc0ludGVnZXIodmFsdWUpICYmIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gOVxuICAgICAgICAgICAgKTtcblxuICAgICAgICBpZiAoIWlzVmFsaWRDb29yZGluYXRlKHN0YXJ0KSB8fCAhaXNWYWxpZENvb3JkaW5hdGUoZW5kKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb29yZGluYXRlcyBtdXN0IGJlIHZhbGlkIGJvYXJkIHBvc2l0aW9ucycpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgW3hTdGFydCwgeVN0YXJ0XSA9IHN0YXJ0O1xuICAgICAgICBjb25zdCBbeEVuZCwgeUVuZF0gPSBlbmQ7XG5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIG9yaWVudGF0aW9uXG4gICAgICAgIGNvbnN0IGlzSG9yaXpvbnRhbCA9IHhTdGFydCA9PT0geEVuZDtcbiAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IHlTdGFydCA9PT0geUVuZDtcblxuICAgICAgICBpZiAoIWlzSG9yaXpvbnRhbCAmJiAhaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwcyBtdXN0IGJlIHBsYWNlZCBob3Jpem9udGFsbHkgb3IgdmVydGljYWxseScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIHNoaXAgbGVuZ3RoIGZyb20gaXRzIGVuZHBvaW50c1xuICAgICAgICBjb25zdCBhY3R1YWxMZW5ndGggPVxuICAgICAgICAgICAgTWF0aC5hYnMoeEVuZCAtIHhTdGFydCkgKyBNYXRoLmFicyh5RW5kIC0geVN0YXJ0KSArIDE7XG5cbiAgICAgICAgaWYgKGFjdHVhbExlbmd0aCAhPT0gc2hpcExlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdTaGlwIGxlbmd0aCBkb2VzIG5vdCBtYXRjaCB0aGUgc2VsZWN0ZWQgY29vcmRpbmF0ZXMnXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2FsY3VsYXRlIGFsbCBvY2N1cGllZCBjb29yZGluYXRlc1xuICAgICAgICBjb25zdCBjb29yZGluYXRlcyA9IFtdO1xuXG4gICAgICAgIGNvbnN0IHN0ZXBYID0gTWF0aC5zaWduKHhFbmQgLSB4U3RhcnQpO1xuICAgICAgICBjb25zdCBzdGVwWSA9IE1hdGguc2lnbih5RW5kIC0geVN0YXJ0KTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBMZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZXMucHVzaChbeFN0YXJ0ICsgaSAqIHN0ZXBYLCB5U3RhcnQgKyBpICogc3RlcFldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZhbGlkYXRlIGV2ZXJ5IHBvc2l0aW9uIGJlZm9yZSBjaGFuZ2luZyB0aGUgYm9hcmRcbiAgICAgICAgY29uc3QgcG9zaXRpb25zID0gY29vcmRpbmF0ZXMubWFwKChbeCwgeV0pID0+XG4gICAgICAgICAgICB0aGlzLmJvYXJkLmZpbmQoKG5vZGUpID0+IG5vZGUueCA9PT0geCAmJiBub2RlLnkgPT09IHkpXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9ucy5zb21lKChwb3NpdGlvbikgPT4gIXBvc2l0aW9uKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaGlwIHBsYWNlbWVudCBpcyBvdXRzaWRlIHRoZSBib2FyZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9ucy5zb21lKChwb3NpdGlvbikgPT4gcG9zaXRpb24uc2hpcCAhPT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2hpcHMgY2Fubm90IG92ZXJsYXAnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBsYWNlIHRoZSBzaGlwIG9ubHkgYWZ0ZXIgYWxsIHZhbGlkYXRpb25zIHBhc3NcbiAgICAgICAgY29uc3QgbmV3U2hpcCA9IG5ldyBTaGlwKHNoaXBMZW5ndGgpO1xuXG4gICAgICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgICAgICAgcG9zaXRpb24uc2hpcCA9IG5ld1NoaXA7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmJvYXJkO1xuICAgIH1cblxuICAgIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgICAgICAvLyBWYWxpZGF0ZSBjb29yZGluYXRlc1xuICAgICAgICBjb25zdCBpc1ZhbGlkQ29vcmRpbmF0ZSA9ICh2YWx1ZSkgPT5cbiAgICAgICAgICAgIE51bWJlci5pc0ludGVnZXIodmFsdWUpICYmIHZhbHVlID49IDAgJiYgdmFsdWUgPD0gOTtcblxuICAgICAgICBpZiAoIWlzVmFsaWRDb29yZGluYXRlKHgpIHx8ICFpc1ZhbGlkQ29vcmRpbmF0ZSh5KSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICdpbnZhbGlkLWNvb3JkaW5hdGUnLFxuICAgICAgICAgICAgICAgIHNxdWFyZTogbnVsbCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVc2UgY29vcmRpbmF0ZSB2YWx1ZXMgcmF0aGVyIHRoYW4gb2JqZWN0IHJlZmVyZW5jZXNcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZUtleSA9IGAke3h9LCR7eX1gO1xuXG4gICAgICAgIC8vIFByZXZlbnQgcmVwZWF0ZWQgYXR0YWNrc1xuICAgICAgICBpZiAodGhpcy5hdHRhY2tlZFNxdWFyZXMuaGFzKGNvb3JkaW5hdGVLZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXR1czogJ2FscmVhZHktYXR0YWNrZWQnLFxuICAgICAgICAgICAgICAgIHNxdWFyZTogdGhpcy5ib2FyZC5maW5kKChub2RlKSA9PiBub2RlLnggPT09IHggJiYgbm9kZS55ID09PSB5KSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLmJvYXJkLmZpbmQoKG5vZGUpID0+IG5vZGUueCA9PT0geCAmJiBub2RlLnkgPT09IHkpO1xuXG4gICAgICAgIC8vIFJlY29yZCB0aGUgYXR0YWNrXG4gICAgICAgIHRoaXMuYXR0YWNrZWRTcXVhcmVzLmFkZChjb29yZGluYXRlS2V5KTtcblxuICAgICAgICBpZiAodGFyZ2V0LnNoaXAgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRhcmdldC5zaGlwLmhpdCgpO1xuICAgICAgICAgICAgdGFyZ2V0LnNoaXAuaXNTdW5rKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiAnaGl0JyxcbiAgICAgICAgICAgICAgICBzcXVhcmU6IHRhcmdldCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm1pc3NlZEF0dGFja3MuYWRkKHRhcmdldCk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogJ21pc3MnLFxuICAgICAgICAgICAgc3F1YXJlOiB0YXJnZXQsXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lYm9hcmQ7XG4iLCJjbGFzcyBQbGF5ZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnBsYXllZCA9IG51bGw7XG4gICAgICAgIHRoaXMuc2hvdHMgPSBuZXcgU2V0KCk7XG4gICAgfVxuXG4gICAgcGxheSh4LCB5LCBnYW1lQm9hcmQpIHtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2FtZUJvYXJkLnJlY2VpdmVBdHRhY2soeCwgeSk7XG5cbiAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdoaXQnIHx8IHJlc3VsdC5zdGF0dXMgPT09ICdtaXNzJykge1xuICAgICAgICAgICAgdGhpcy5wbGF5ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG59XG5cbmNvbnN0IGNvbXB1dGVyUGxheSA9IChBSSwgYm9hcmQpID0+IHtcbiAgICAvLyBGaW5kIGFsbCBzcXVhcmVzIHRoYXQgbmVpdGhlciB0aGlzIEFJIG5vciB0aGUgYm9hcmQgaGFzIGF0dGFja2VkLlxuICAgIGNvbnN0IGF2YWlsYWJsZVRhcmdldHMgPSBib2FyZC5ib2FyZC5maWx0ZXIoKHNxdWFyZSkgPT4ge1xuICAgICAgICBjb25zdCBjb29yZGluYXRlS2V5ID0gYCR7c3F1YXJlLnh9LCR7c3F1YXJlLnl9YDtcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgIUFJLnNob3RzLmhhcyhjb29yZGluYXRlS2V5KSAmJlxuICAgICAgICAgICAgIWJvYXJkLmF0dGFja2VkU3F1YXJlcy5oYXMoY29vcmRpbmF0ZUtleSlcbiAgICAgICAgKTtcbiAgICB9KTtcblxuICAgIC8vIFN0b3Agc2FmZWx5IHdoZW4gbm8gdGFyZ2V0cyByZW1haW4uXG4gICAgaWYgKGF2YWlsYWJsZVRhcmdldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIFNlbGVjdCBhIHJhbmRvbSBhdmFpbGFibGUgc3F1YXJlLlxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogYXZhaWxhYmxlVGFyZ2V0cy5sZW5ndGgpO1xuICAgIGNvbnN0IHRhcmdldCA9IGF2YWlsYWJsZVRhcmdldHNbcmFuZG9tSW5kZXhdO1xuXG4gICAgLy8gQXR0YWNrIHRoZSBzZWxlY3RlZCBzcXVhcmUuXG4gICAgY29uc3QgcmVzdWx0ID0gQUkucGxheSh0YXJnZXQueCwgdGFyZ2V0LnksIGJvYXJkKTtcblxuICAgIC8vIFJlY29yZCBvbmx5IHN1Y2Nlc3NmdWwgYXR0YWNrcy5cbiAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ2hpdCcgfHwgcmVzdWx0LnN0YXR1cyA9PT0gJ21pc3MnKSB7XG4gICAgICAgIEFJLnNob3RzLmFkZChgJHt0YXJnZXQueH0sJHt0YXJnZXQueX1gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuZXhwb3J0IHsgY29tcHV0ZXJQbGF5IH07XG4iLCJjbGFzcyBTaGlwIHtcbiAgICBjb25zdHJ1Y3RvcihsZW5ndGgpIHtcbiAgICAgICAgdGhpcy5sZW5ndGggPSBsZW5ndGg7XG4gICAgICAgIHRoaXMuaGl0cyA9IDA7XG4gICAgICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICAgIH1cblxuICAgIGhpdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGl0cyA8IHRoaXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmhpdHMgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5oaXRzO1xuICAgIH1cblxuICAgIGlzU3VuaygpIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSB0aGlzLmhpdHMpIHtcbiAgICAgICAgICAgIHRoaXMuc3VuayA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5zdW5rO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcGxheWVyQm9hcmRVSSwgY29tcHV0ZXJCb2FyZFVJIH0gZnJvbSAnLi9kb20nO1xuXG5jb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udGFpbmVyJyk7XG5jb250YWluZXIuYXBwZW5kKHBsYXllckJvYXJkVUksIGNvbXB1dGVyQm9hcmRVSSk7XG4iXSwibmFtZXMiOlsiY29tcHV0ZXJQbGF5IiwicGxheWVyQm9hcmQiLCJjb21wdXRlckJvYXJkIiwicGxheWVyU2hpcHMiLCJjb21wdXRlclNoaXBzIiwicGxheWVyMSIsImNvbXB1dGVyQUkiLCJtYWtlQm9hcmQiLCJuYW1lIiwiYm9hcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJncmlkVGVtcGxhdGVSb3dzIiwieCIsInkiLCJpIiwiaiIsImNlbGwiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZSIsImFwcGVuZENoaWxkIiwicGxheWVyQm9hcmRVSSIsImNvbXB1dGVyQm9hcmRVSSIsImNlbGxzIiwiZ2V0Q2VsbHMiLCJib2FyZElEIiwiUHJvbWlzZSIsInJlc29sdmUiLCJhZGRFdmVudExpc3RlbmVyIiwic2VsZWN0ZWRDZWxscyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZW5kZXJCb2FyZHMiLCJwbGF5ZXIiLCJBcnJheSIsImZyb20iLCJzaGlwIiwic2hpcFBvc2l0aW9uIiwiZmluZCIsInBsYXlVc2VySW5wdXQiLCJlbmVteUJvYXJkIiwiZm9yRWFjaCIsIk51bWJlciIsImNoYXJBdCIsInBsYXkiLCJkaXNwbGF5QXR0YWNrIiwiY29udGFpbnMiLCJnYW1lU3RhcnRCdXR0b24iLCJnZXRFbGVtZW50QnlJZCIsIlBsYXllciIsIkdhbWVib2FyZCIsInBsYWNlU2hpcCIsImdldFBsYXllclNoaXBzIiwiZ2FtZWJvYXJkIiwiZmlsdGVyIiwic3F1YXJlIiwiaXNHYW1lT3ZlciIsImFsbFNoaXBzIiwiZXZlcnkiLCJzdW5rIiwiU2hpcCIsIkNyZWF0ZU5vZGUiLCJjb25zdHJ1Y3RvciIsImNyZWF0ZUJvYXJkIiwibWlzc2VkQXR0YWNrcyIsIlNldCIsImF0dGFja2VkU3F1YXJlcyIsImNvb3JkaW5hdGVzIiwicHVzaCIsInNoaXBMZW5ndGgiLCJzdGFydCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImVuZCIsImlzSW50ZWdlciIsIkVycm9yIiwiaXNWYWxpZENvb3JkaW5hdGUiLCJpc0FycmF5IiwidmFsdWUiLCJ4U3RhcnQiLCJ5U3RhcnQiLCJ4RW5kIiwieUVuZCIsImlzSG9yaXpvbnRhbCIsImlzVmVydGljYWwiLCJhY3R1YWxMZW5ndGgiLCJNYXRoIiwiYWJzIiwic3RlcFgiLCJzaWduIiwic3RlcFkiLCJwb3NpdGlvbnMiLCJtYXAiLCJfcmVmIiwibm9kZSIsInNvbWUiLCJwb3NpdGlvbiIsIm5ld1NoaXAiLCJyZWNlaXZlQXR0YWNrIiwic3RhdHVzIiwiY29vcmRpbmF0ZUtleSIsImhhcyIsInRhcmdldCIsImhpdCIsImlzU3VuayIsInBsYXllZCIsInNob3RzIiwiZ2FtZUJvYXJkIiwicmVzdWx0IiwiQUkiLCJhdmFpbGFibGVUYXJnZXRzIiwicmFuZG9tSW5kZXgiLCJmbG9vciIsInJhbmRvbSIsImhpdHMiLCJjb250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYXBwZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==