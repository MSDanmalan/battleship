import Player from './player';
import Gameboard from './gameboard';
import { playUserInput } from './dom';

const playerBoard = new Gameboard();
const computerBoard = new Gameboard();
const player1 = new Player();
const computerAI = new Player();

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

const getPlayerShips = (gameboard) =>
    gameboard.board.filter((square) => square.ship !== null);

const playerShips = getPlayerShips(playerBoard);
const computerShips = getPlayerShips(computerBoard);

function isGameOver(allShips) {
    return allShips.every((coordinate) => coordinate.ship.sunk === true);
}

export {
    playerBoard,
    computerBoard,
    playerShips,
    computerShips,
    player1,
    computerAI,
};
