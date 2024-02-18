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
/* harmony export */   playerBoardUI: () => (/* binding */ playerBoardUI)
/* harmony export */ });
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/game.js");

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
const getPlayerShips = gameboard => gameboard.board.filter(square => square.ship !== null);
const playerShips = getPlayerShips(_game__WEBPACK_IMPORTED_MODULE_0__.playerBoard);
const computerShips = getPlayerShips(_game__WEBPACK_IMPORTED_MODULE_0__.computerBoard);
let cells; // Declare cells in a broader scope

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
renderBoards(playerShips, 'player-board');
renderBoards(computerShips, 'computer-board');
async function displayAttack(board, boardID) {
  cells = await getCells(boardID);
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      const x = Number(cell.dataset.coordinate.charAt(0));
      const y = Number(cell.dataset.coordinate.charAt(3));
      board.receiveAttack(x, y);
      if (cell.classList.contains('ship')) {
        cell.classList.add('attacked-ship');
      } else {
        cell.classList.add('missed-attack');
      }
    });
  });
}
displayAttack(_game__WEBPACK_IMPORTED_MODULE_0__.playerBoard, 'player-board');
displayAttack(_game__WEBPACK_IMPORTED_MODULE_0__.computerBoard, 'computer-board');


/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computerBoard: () => (/* binding */ computerBoard),
/* harmony export */   playerBoard: () => (/* binding */ playerBoard)
/* harmony export */ });
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./player */ "./src/player.js");
/* harmony import */ var _gameboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameboard */ "./src/gameboard.js");


const playerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
const computerBoard = new _gameboard__WEBPACK_IMPORTED_MODULE_1__["default"]();
const player1 = new _player__WEBPACK_IMPORTED_MODULE_0__["default"]();
const computerAI = (0,_player__WEBPACK_IMPORTED_MODULE_0__.createComputerAI)();
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
function startGame() {
  // render gameboards with placed ship
  // switch turns
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
  placeShip(ship) {
    let start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    let end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    const shipType = new _ship__WEBPACK_IMPORTED_MODULE_0__["default"](ship);
    const coordinate = [];
    const xStart = start[0];
    const yStart = start[1];
    let xEnd = end[0];
    let yEnd = end[1];
    if (start === end) coordinate.push(start);
    if (xStart === xEnd) {
      coordinate.push(end);
      for (let i = 0; i < shipType.length - 1; i++) {
        if (yStart < yEnd) {
          coordinate.push([xStart, yEnd -= 1]);
        } else if (yStart > yEnd) {
          coordinate.push([xStart, yEnd += 1]);
        }
      }
    } else if (yStart === yEnd) {
      coordinate.push(end);
      for (let i = 0; i < shipType.length - 1; i++) {
        if (xStart < xEnd) {
          coordinate.push([xEnd -= 1, yStart]);
        } else if (xStart > xEnd) {
          coordinate.push([xEnd += 1, yStart]);
        }
      }
    }
    for (const square of coordinate) {
      const position = this.board.find(node => node.x === square[0] && node.y === square[1]);
      if (position.ship === null) {
        position.ship = shipType;
      }
    }
    return this.board;
  }
  missedAttacks = new Set();
  receiveAttack(x, y) {
    const isValidCoordinate = (a, b) => a >= 0 && a <= 9 && b >= 0 && b <= 9;
    if (!isValidCoordinate(x, y)) {
      return 'Please select coordinates between 0 and 9';
    }
    const target = this.board.find(node => node.x === x && node.y === y);
    console.log(target);
    if (target.ship !== null) {
      target.ship.hit();
      target.ship.isSunk();
    } else {
      this.missedAttacks.add(target);
    }
    return target;
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
/* harmony export */   createComputerAI: () => (/* binding */ createComputerAI),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class Player {
  constructor() {
    this.played = null;
  }
  play(x, y, gameBoard) {
    gameBoard.receiveAttack(x, y);
    this.played = true;
  }
}
const createComputerAI = () => {
  const computer = new Player();
  return computer;
};
const getComputerTarget = () => {
  let target = [];
  const getX = () => Math.floor(Math.random() * 10);
  const getY = () => Math.floor(Math.random() * 10);
  const x = getX();
  const y = getY();
  target = [x, y];
  return target;
};
const shots = new Set();
const computerPlay = (AI, board) => {
  const computerTarget = getComputerTarget();
  let x = 0;
  let y = 0;
  if (!shots.has(computerTarget)) {
    shots.add(computerTarget);
    ({
      x,
      y
    } = computerTarget);
    AI.play(x, y, board);
  } else if (shots.length !== 99) {
    computerPlay(AI, board);
  }
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
    this.hits = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ozs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTnVEO0FBRXZELE1BQU02QyxTQUFTLEdBQUdqRyxRQUFRLENBQUNrRyxhQUFhLENBQUMsWUFBWSxDQUFDO0FBQ3RERCxTQUFTLENBQUNFLE1BQU0sQ0FBQ25GLCtDQUFhLEVBQUVDLGlEQUFlLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvZG9tLmpzIiwid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvZ2FtZS5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL2dhbWVib2FyZC5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL3BsYXllci5qcyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvLy4vc3JjL3NoaXAuanMiLCJ3ZWJwYWNrOi8vdGVtcGxhdGVfcmVwby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90ZW1wbGF0ZV9yZXBvL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdGVtcGxhdGVfcmVwby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RlbXBsYXRlX3JlcG8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQgfSBmcm9tICcuL2dhbWUnO1xuXG5mdW5jdGlvbiBtYWtlQm9hcmQobmFtZSkge1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYm9hcmQuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcbiAgICBib2FyZC5zZXRBdHRyaWJ1dGUoJ2lkJywgYCR7bmFtZX0tYm9hcmRgKTtcbiAgICBib2FyZC5zdHlsZS5ncmlkVGVtcGxhdGVDb2x1bW5zID0gJ3JlcGVhdCgxMCwgMWZyKSc7XG4gICAgYm9hcmQuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9ICdyZXBlYXQoMTAsIDFmciknO1xuXG4gICAgY29uc3QgeCA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICBjb25zdCB5ID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDldO1xuICAgIGZvciAoY29uc3QgaSBvZiB4KSB7XG4gICAgICAgIGZvciAoY29uc3QgaiBvZiB5KSB7XG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2NlbGwnKTtcbiAgICAgICAgICAgIGNlbGwuZGF0YXNldC5jb29yZGluYXRlID0gYCR7aX0sICR7an1gO1xuICAgICAgICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJvYXJkO1xufVxuXG5jb25zdCBwbGF5ZXJCb2FyZFVJID0gbWFrZUJvYXJkKCdwbGF5ZXInKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmRVSSA9IG1ha2VCb2FyZCgnY29tcHV0ZXInKTtcblxuY29uc3QgZ2V0UGxheWVyU2hpcHMgPSAoZ2FtZWJvYXJkKSA9PlxuICAgIGdhbWVib2FyZC5ib2FyZC5maWx0ZXIoKHNxdWFyZSkgPT4gc3F1YXJlLnNoaXAgIT09IG51bGwpO1xuXG5jb25zdCBwbGF5ZXJTaGlwcyA9IGdldFBsYXllclNoaXBzKHBsYXllckJvYXJkKTtcbmNvbnN0IGNvbXB1dGVyU2hpcHMgPSBnZXRQbGF5ZXJTaGlwcyhjb21wdXRlckJvYXJkKTtcbmxldCBjZWxsczsgLy8gRGVjbGFyZSBjZWxscyBpbiBhIGJyb2FkZXIgc2NvcGVcblxuY29uc3QgZ2V0Q2VsbHMgPSAoYm9hcmRJRCkgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgICAgYCMke2JvYXJkSUR9IC5jZWxsYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJlc29sdmUoc2VsZWN0ZWRDZWxscyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5hc3luYyBmdW5jdGlvbiByZW5kZXJCb2FyZHMocGxheWVyLCBib2FyZElEKSB7XG4gICAgY2VsbHMgPSBBcnJheS5mcm9tKGF3YWl0IGdldENlbGxzKGJvYXJkSUQpKTtcblxuICAgIGZvciAoY29uc3Qgc2hpcCBvZiBwbGF5ZXIpIHtcbiAgICAgICAgY29uc3Qgc2hpcFBvc2l0aW9uID0gY2VsbHMuZmluZChcbiAgICAgICAgICAgIChjZWxsKSA9PiBgJHtzaGlwLnh9LCAke3NoaXAueX1gID09PSBjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZVxuICAgICAgICApO1xuICAgICAgICBzaGlwUG9zaXRpb24uY2xhc3NMaXN0LmFkZCgnc2hpcCcpO1xuICAgIH1cbn1cblxucmVuZGVyQm9hcmRzKHBsYXllclNoaXBzLCAncGxheWVyLWJvYXJkJyk7XG5yZW5kZXJCb2FyZHMoY29tcHV0ZXJTaGlwcywgJ2NvbXB1dGVyLWJvYXJkJyk7XG5cbmFzeW5jIGZ1bmN0aW9uIGRpc3BsYXlBdHRhY2soYm9hcmQsIGJvYXJkSUQpIHtcbiAgICBjZWxscyA9IGF3YWl0IGdldENlbGxzKGJvYXJkSUQpO1xuXG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgICBjZWxsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeCA9IE51bWJlcihjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZS5jaGFyQXQoMCkpO1xuICAgICAgICAgICAgY29uc3QgeSA9IE51bWJlcihjZWxsLmRhdGFzZXQuY29vcmRpbmF0ZS5jaGFyQXQoMykpO1xuICAgICAgICAgICAgYm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcblxuICAgICAgICAgICAgaWYgKGNlbGwuY2xhc3NMaXN0LmNvbnRhaW5zKCdzaGlwJykpIHtcbiAgICAgICAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoJ2F0dGFja2VkLXNoaXAnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKCdtaXNzZWQtYXR0YWNrJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5kaXNwbGF5QXR0YWNrKHBsYXllckJvYXJkLCAncGxheWVyLWJvYXJkJyk7XG5kaXNwbGF5QXR0YWNrKGNvbXB1dGVyQm9hcmQsICdjb21wdXRlci1ib2FyZCcpO1xuXG5leHBvcnQgeyBwbGF5ZXJCb2FyZFVJLCBjb21wdXRlckJvYXJkVUkgfTtcbiIsImltcG9ydCBQbGF5ZXIsIHsgY3JlYXRlQ29tcHV0ZXJBSSB9IGZyb20gJy4vcGxheWVyJztcbmltcG9ydCBHYW1lYm9hcmQgZnJvbSAnLi9nYW1lYm9hcmQnO1xuXG5jb25zdCBwbGF5ZXJCb2FyZCA9IG5ldyBHYW1lYm9hcmQoKTtcbmNvbnN0IGNvbXB1dGVyQm9hcmQgPSBuZXcgR2FtZWJvYXJkKCk7XG5jb25zdCBwbGF5ZXIxID0gbmV3IFBsYXllcigpO1xuY29uc3QgY29tcHV0ZXJBSSA9IGNyZWF0ZUNvbXB1dGVyQUkoKTtcblxucGxheWVyQm9hcmQucGxhY2VTaGlwKDUsIFs2LCAyXSwgWzYsIDZdKTtcbnBsYXllckJvYXJkLnBsYWNlU2hpcCg0LCBbNSwgOF0sIFs4LCA4XSk7XG5wbGF5ZXJCb2FyZC5wbGFjZVNoaXAoMywgWzAsIDBdLCBbMCwgMl0pO1xucGxheWVyQm9hcmQucGxhY2VTaGlwKDMsIFs5LCAwXSwgWzksIDJdKTtcbnBsYXllckJvYXJkLnBsYWNlU2hpcCgyLCBbMSwgOF0sIFsxLCA5XSk7XG5cbmNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDUsIFs0LCA0XSwgWzQsIDhdKTtcbmNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDQsIFs2LCA0XSwgWzYsIDddKTtcbmNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDMsIFsyLCA5XSwgWzAsIDldKTtcbmNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDMsIFs3LCAyXSwgWzUsIDJdKTtcbmNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDIsIFs4LCA3XSwgWzgsIDZdKTtcblxuZnVuY3Rpb24gc3RhcnRHYW1lKCkge1xuICAgIC8vIHJlbmRlciBnYW1lYm9hcmRzIHdpdGggcGxhY2VkIHNoaXBcbiAgICAvLyBzd2l0Y2ggdHVybnNcbn1cblxuZXhwb3J0IHsgcGxheWVyQm9hcmQsIGNvbXB1dGVyQm9hcmQgfTtcbiIsImltcG9ydCBTaGlwIGZyb20gJy4vc2hpcCc7XG5cbmZ1bmN0aW9uIENyZWF0ZU5vZGUoeCwgeSkge1xuICAgIGNvbnN0IHNoaXAgPSBudWxsO1xuICAgIHJldHVybiB7IHgsIHksIHNoaXAgfTtcbn1cblxuY2xhc3MgR2FtZWJvYXJkIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ib2FyZCA9IHRoaXMuY3JlYXRlQm9hcmQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVCb2FyZCgpIHtcbiAgICAgICAgY29uc3QgeCA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICAgICAgY29uc3QgeSA9IFswLCAxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XTtcbiAgICAgICAgY29uc3QgYm9hcmQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHgpIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaiBvZiB5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBDcmVhdGVOb2RlKGksIGopO1xuICAgICAgICAgICAgICAgIGJvYXJkLnB1c2goY29vcmRpbmF0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGJvYXJkO1xuICAgIH1cblxuICAgIHBsYWNlU2hpcChzaGlwLCBzdGFydCA9IFtdLCBlbmQgPSBbXSkge1xuICAgICAgICBjb25zdCBzaGlwVHlwZSA9IG5ldyBTaGlwKHNoaXApO1xuICAgICAgICBjb25zdCBjb29yZGluYXRlID0gW107XG4gICAgICAgIGNvbnN0IHhTdGFydCA9IHN0YXJ0WzBdO1xuICAgICAgICBjb25zdCB5U3RhcnQgPSBzdGFydFsxXTtcbiAgICAgICAgbGV0IHhFbmQgPSBlbmRbMF07XG4gICAgICAgIGxldCB5RW5kID0gZW5kWzFdO1xuXG4gICAgICAgIGlmIChzdGFydCA9PT0gZW5kKSBjb29yZGluYXRlLnB1c2goc3RhcnQpO1xuXG4gICAgICAgIGlmICh4U3RhcnQgPT09IHhFbmQpIHtcbiAgICAgICAgICAgIGNvb3JkaW5hdGUucHVzaChlbmQpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwVHlwZS5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoeVN0YXJ0IDwgeUVuZCkge1xuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlLnB1c2goW3hTdGFydCwgKHlFbmQgLT0gMSldKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHlTdGFydCA+IHlFbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29vcmRpbmF0ZS5wdXNoKFt4U3RhcnQsICh5RW5kICs9IDEpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHlTdGFydCA9PT0geUVuZCkge1xuICAgICAgICAgICAgY29vcmRpbmF0ZS5wdXNoKGVuZCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXBUeXBlLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh4U3RhcnQgPCB4RW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb3JkaW5hdGUucHVzaChbKHhFbmQgLT0gMSksIHlTdGFydF0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoeFN0YXJ0ID4geEVuZCkge1xuICAgICAgICAgICAgICAgICAgICBjb29yZGluYXRlLnB1c2goWyh4RW5kICs9IDEpLCB5U3RhcnRdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGNvbnN0IHNxdWFyZSBvZiBjb29yZGluYXRlKSB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuYm9hcmQuZmluZChcbiAgICAgICAgICAgICAgICAobm9kZSkgPT4gbm9kZS54ID09PSBzcXVhcmVbMF0gJiYgbm9kZS55ID09PSBzcXVhcmVbMV1cbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmIChwb3NpdGlvbi5zaGlwID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb24uc2hpcCA9IHNoaXBUeXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuYm9hcmQ7XG4gICAgfVxuXG4gICAgbWlzc2VkQXR0YWNrcyA9IG5ldyBTZXQoKTtcblxuICAgIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgICAgICBjb25zdCBpc1ZhbGlkQ29vcmRpbmF0ZSA9IChhLCBiKSA9PlxuICAgICAgICAgICAgYSA+PSAwICYmIGEgPD0gOSAmJiBiID49IDAgJiYgYiA8PSA5O1xuXG4gICAgICAgIGlmICghaXNWYWxpZENvb3JkaW5hdGUoeCwgeSkpIHtcbiAgICAgICAgICAgIHJldHVybiAnUGxlYXNlIHNlbGVjdCBjb29yZGluYXRlcyBiZXR3ZWVuIDAgYW5kIDknO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5ib2FyZC5maW5kKChub2RlKSA9PiBub2RlLnggPT09IHggJiYgbm9kZS55ID09PSB5KTtcbiAgICAgICAgY29uc29sZS5sb2codGFyZ2V0KTtcbiAgICAgICAgaWYgKHRhcmdldC5zaGlwICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0YXJnZXQuc2hpcC5oaXQoKTtcbiAgICAgICAgICAgIHRhcmdldC5zaGlwLmlzU3VuaygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5taXNzZWRBdHRhY2tzLmFkZCh0YXJnZXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVib2FyZDtcbiIsImNsYXNzIFBsYXllciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMucGxheWVkID0gbnVsbDtcbiAgICB9XG5cbiAgICBwbGF5KHgsIHksIGdhbWVCb2FyZCkge1xuICAgICAgICBnYW1lQm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgICAgICAgdGhpcy5wbGF5ZWQgPSB0cnVlO1xuICAgIH1cbn1cblxuY29uc3QgY3JlYXRlQ29tcHV0ZXJBSSA9ICgpID0+IHtcbiAgICBjb25zdCBjb21wdXRlciA9IG5ldyBQbGF5ZXIoKTtcbiAgICByZXR1cm4gY29tcHV0ZXI7XG59O1xuXG5jb25zdCBnZXRDb21wdXRlclRhcmdldCA9ICgpID0+IHtcbiAgICBsZXQgdGFyZ2V0ID0gW107XG5cbiAgICBjb25zdCBnZXRYID0gKCkgPT4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgIGNvbnN0IGdldFkgPSAoKSA9PiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cbiAgICBjb25zdCB4ID0gZ2V0WCgpO1xuICAgIGNvbnN0IHkgPSBnZXRZKCk7XG5cbiAgICB0YXJnZXQgPSBbeCwgeV07XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuY29uc3Qgc2hvdHMgPSBuZXcgU2V0KCk7XG5cbmNvbnN0IGNvbXB1dGVyUGxheSA9IChBSSwgYm9hcmQpID0+IHtcbiAgICBjb25zdCBjb21wdXRlclRhcmdldCA9IGdldENvbXB1dGVyVGFyZ2V0KCk7XG4gICAgbGV0IHggPSAwO1xuICAgIGxldCB5ID0gMDtcblxuICAgIGlmICghc2hvdHMuaGFzKGNvbXB1dGVyVGFyZ2V0KSkge1xuICAgICAgICBzaG90cy5hZGQoY29tcHV0ZXJUYXJnZXQpO1xuICAgICAgICAoeyB4LCB5IH0gPSBjb21wdXRlclRhcmdldCk7XG4gICAgICAgIEFJLnBsYXkoeCwgeSwgYm9hcmQpO1xuICAgIH0gZWxzZSBpZiAoc2hvdHMubGVuZ3RoICE9PSA5OSkge1xuICAgICAgICBjb21wdXRlclBsYXkoQUksIGJvYXJkKTtcbiAgICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG5leHBvcnQgeyBjcmVhdGVDb21wdXRlckFJLCBjb21wdXRlclBsYXkgfTtcbiIsImNsYXNzIFNoaXAge1xuICAgIGNvbnN0cnVjdG9yKGxlbmd0aCkge1xuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy5oaXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdW5rID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaGl0KCkge1xuICAgICAgICBpZiAodGhpcy5oaXRzIDwgdGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuaGl0cyArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmhpdHM7XG4gICAgfVxuXG4gICAgaXNTdW5rKCkge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IHRoaXMuaGl0cykge1xuICAgICAgICAgICAgdGhpcy5zdW5rID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLnN1bms7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBwbGF5ZXJCb2FyZFVJLCBjb21wdXRlckJvYXJkVUkgfSBmcm9tICcuL2RvbSc7XG5cbmNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWluZXInKTtcbmNvbnRhaW5lci5hcHBlbmQocGxheWVyQm9hcmRVSSwgY29tcHV0ZXJCb2FyZFVJKTtcbiJdLCJuYW1lcyI6WyJwbGF5ZXJCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJtYWtlQm9hcmQiLCJuYW1lIiwiYm9hcmQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJzdHlsZSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJncmlkVGVtcGxhdGVSb3dzIiwieCIsInkiLCJpIiwiaiIsImNlbGwiLCJkYXRhc2V0IiwiY29vcmRpbmF0ZSIsImFwcGVuZENoaWxkIiwicGxheWVyQm9hcmRVSSIsImNvbXB1dGVyQm9hcmRVSSIsImdldFBsYXllclNoaXBzIiwiZ2FtZWJvYXJkIiwiZmlsdGVyIiwic3F1YXJlIiwic2hpcCIsInBsYXllclNoaXBzIiwiY29tcHV0ZXJTaGlwcyIsImNlbGxzIiwiZ2V0Q2VsbHMiLCJib2FyZElEIiwiUHJvbWlzZSIsInJlc29sdmUiLCJhZGRFdmVudExpc3RlbmVyIiwic2VsZWN0ZWRDZWxscyIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZW5kZXJCb2FyZHMiLCJwbGF5ZXIiLCJBcnJheSIsImZyb20iLCJzaGlwUG9zaXRpb24iLCJmaW5kIiwiZGlzcGxheUF0dGFjayIsImZvckVhY2giLCJOdW1iZXIiLCJjaGFyQXQiLCJyZWNlaXZlQXR0YWNrIiwiY29udGFpbnMiLCJQbGF5ZXIiLCJjcmVhdGVDb21wdXRlckFJIiwiR2FtZWJvYXJkIiwicGxheWVyMSIsImNvbXB1dGVyQUkiLCJwbGFjZVNoaXAiLCJzdGFydEdhbWUiLCJTaGlwIiwiQ3JlYXRlTm9kZSIsImNvbnN0cnVjdG9yIiwiY3JlYXRlQm9hcmQiLCJjb29yZGluYXRlcyIsInB1c2giLCJzdGFydCIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsImVuZCIsInNoaXBUeXBlIiwieFN0YXJ0IiwieVN0YXJ0IiwieEVuZCIsInlFbmQiLCJwb3NpdGlvbiIsIm5vZGUiLCJtaXNzZWRBdHRhY2tzIiwiU2V0IiwiaXNWYWxpZENvb3JkaW5hdGUiLCJhIiwiYiIsInRhcmdldCIsImNvbnNvbGUiLCJsb2ciLCJoaXQiLCJpc1N1bmsiLCJwbGF5ZWQiLCJwbGF5IiwiZ2FtZUJvYXJkIiwiY29tcHV0ZXIiLCJnZXRDb21wdXRlclRhcmdldCIsImdldFgiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJnZXRZIiwic2hvdHMiLCJjb21wdXRlclBsYXkiLCJBSSIsImNvbXB1dGVyVGFyZ2V0IiwiaGFzIiwiaGl0cyIsInN1bmsiLCJjb250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiYXBwZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==