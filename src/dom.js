import { computerPlay } from './player';
import {
    playerBoard,
    computerBoard,
    playerShips,
    computerShips,
    player1,
    computerAI,
} from './game';

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
const getCells = (boardID) =>
    new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', () => {
            const selectedCells = document.querySelectorAll(
                `#${boardID} .cell`
            );
            resolve(selectedCells);
        });
    });

async function renderBoards(player, boardID) {
    cells = Array.from(await getCells(boardID));

    for (const ship of player) {
        const shipPosition = cells.find(
            (cell) => `${ship.x}, ${ship.y}` === cell.dataset.coordinate
        );
        shipPosition.classList.add('ship');
    }
}
renderBoards(playerShips, 'player-board');
renderBoards(computerShips, 'computer-board');

async function playUserInput(player, enemyBoard, boardID) {
    cells = await getCells(boardID);
    cells.forEach((cell) =>
        cell.addEventListener('click', () => {
            const x = Number(cell.dataset.coordinate.charAt(0));
            const y = Number(cell.dataset.coordinate.charAt(3));
            player.play(x, y, enemyBoard);
        })
    );
}

playUserInput(player1, computerBoard, 'computer-board');

async function displayAttack(boardID) {
    cells = await getCells(boardID);

    cells.forEach((cell) => {
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
    computerPlay(computerAI, playerBoard);
    // displayAttack('player-board');
});

export { playerBoardUI, computerBoardUI, playUserInput };
