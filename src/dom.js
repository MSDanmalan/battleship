import {
    playerBoard,
    computerBoard,
    playerShipPositions,
    gameController,
} from './game';

function makeBoard(name) {
    const isPlayerBoard = name === 'player';
    const panel = document.createElement('section');
    panel.classList.add('board-panel');

    const heading = document.createElement('h2');
    heading.textContent = isPlayerBoard ? 'Your Fleet' : 'Computer Fleet';
    panel.appendChild(heading);

    const board = document.createElement('div');
    board.classList.add('board');
    board.setAttribute('id', `${name}-board`);
    board.setAttribute('role', isPlayerBoard ? 'table' : 'grid');
    board.setAttribute(
        'aria-label',
        isPlayerBoard ? 'Your fleet' : 'Computer fleet'
    );

    for (let x = 0; x < 10; x += 1) {
        const row = document.createElement('div');
        row.classList.add('board-row');
        row.setAttribute('role', 'row');

        for (let y = 0; y < 10; y += 1) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.coordinate = `${x},${y}`;
            cell.setAttribute('role', isPlayerBoard ? 'cell' : 'gridcell');
            cell.setAttribute('aria-label', `Row ${x + 1}, column ${y + 1}`);

            const marker = document.createElement('span');
            marker.classList.add('cell-marker');
            marker.setAttribute('aria-hidden', 'true');
            cell.appendChild(marker);
            row.appendChild(cell);
        }

        board.appendChild(row);
    }

    panel.appendChild(board);
    return { panel, board };
}

const { panel: playerBoardPanel, board: playerBoardUI } = makeBoard('player');
const { panel: computerBoardPanel, board: computerBoardUI } =
    makeBoard('computer');
computerBoardUI.setAttribute(
    'aria-describedby',
    'computer-board-instructions'
);

function initializeGameUI() {
    const playerCells = new Map();
    const computerCells = new Map();

    const playerBoardCells = Array.from(
        playerBoardUI.querySelectorAll('.cell')
    );
    const computerBoardCells = Array.from(
        computerBoardUI.querySelectorAll('.cell')
    );

    computerBoardCells.forEach((cell, index) => {
        cell.tabIndex = index === 0 ? 0 : -1;
        computerCells.set(cell.dataset.coordinate, cell);
    });

    playerBoardCells.forEach((cell) => {
        playerCells.set(cell.dataset.coordinate, cell);
    });

    for (const square of playerShipPositions) {
        const key = `${square.x},${square.y}`;
        const cell = playerCells.get(key);
        cell.classList.add('ship');
        cell.setAttribute(
            'aria-label',
            `Row ${square.x + 1}, column ${square.y + 1}, your ship`
        );
    }

    const status = document.querySelector('#game-status');
    const startButton = document.querySelector('#start-game');

    let gameStarted = false;
    let activeCellIndex = 0;
    let focusBeforePointerActivation = null;

    const updateCellResult = (cell, attack, board, cellMap) => {
        if (attack.status === 'miss') {
            cell.classList.add('missed-attack');
            cell.setAttribute(
                'aria-label',
                `${cell.getAttribute('aria-label')}, miss`
            );
            return;
        }

        if (attack.sunk) {
            board.board
                .filter((square) => square.ship === attack.square.ship)
                .forEach((square) => {
                    const sunkCell = cellMap.get(`${square.x},${square.y}`);
                    sunkCell.classList.remove('attacked-ship');
                    sunkCell.classList.add('sunk-ship');
                    sunkCell.setAttribute(
                        'aria-label',
                        `Row ${square.x + 1}, column ${square.y + 1}, sunk ship segment`
                    );
                });
            return;
        }

        cell.classList.add('attacked-ship');
        cell.setAttribute(
            'aria-label',
            `${cell.getAttribute('aria-label')}, hit`
        );
    };

    const setActiveCell = (index, moveFocus = false) => {
        computerBoardCells[activeCellIndex].tabIndex = -1;
        activeCellIndex = index;
        const cell = computerBoardCells[activeCellIndex];
        cell.tabIndex = 0;
        if (moveFocus) cell.focus();
    };

    const attackFromCell = (cell, moveFocusOnSuccess = false) => {
        if (!gameStarted || gameController.gameOver) return false;

        const [x, y] = cell.dataset.coordinate.split(',').map(Number);
        const result = gameController.playTurn(x, y);
        const { playerAttack, computerAttack } = result;

        if (!playerAttack) return false;

        if (playerAttack.status === 'already-attacked') {
            status.textContent =
                'You have already attacked that square. Choose another.';
            return false;
        }

        if (playerAttack.status === 'invalid-coordinate') {
            status.textContent = 'Invalid target. Choose another square.';
            return false;
        }

        updateCellResult(cell, playerAttack, computerBoard, computerCells);

        if (moveFocusOnSuccess) {
            setActiveCell(x * 10 + y, true);
        }

        if (computerAttack && computerAttack.square) {
            const computerKey = `${computerAttack.square.x},${computerAttack.square.y}`;
            const computerTarget = playerCells.get(computerKey);

            if (computerTarget) {
                updateCellResult(
                    computerTarget,
                    computerAttack,
                    playerBoard,
                    playerCells
                );
            }
        }

        if (gameController.gameOver) {
            computerBoardUI.setAttribute('aria-disabled', 'true');
            const playerWon = gameController.winner === gameController.player;
            const sinkingMessage = playerAttack.sunk
                ? 'You sank a ship! '
                : '';

            status.textContent = playerWon
                ? `${sinkingMessage}You win! You destroyed the computer fleet.`
                : `Game over! ${computerAttack?.sunk ? 'The computer sank one of your ships. ' : ''}The computer destroyed your fleet.`;
            startButton.textContent = 'Game Over';
            return true;
        }

        const playerMessage = playerAttack.sunk
            ? 'You sank a ship!'
            : playerAttack.status === 'hit'
              ? 'You hit a ship!'
              : 'You missed.';
        const computerMessage = computerAttack
            ? computerAttack.sunk
                ? ' The computer sank one of your ships.'
                : computerAttack.status === 'hit'
                  ? ' The computer hit one of your ships.'
                  : ' The computer missed.'
            : '';

        status.textContent = `${playerMessage}${computerMessage} Your turn.`;
        return true;
    };

    startButton.addEventListener('click', () => {
        if (gameStarted) return;

        gameStarted = true;
        startButton.textContent = 'Game in Progress';
        status.textContent =
            'Your turn. Choose a square on the computer board.';
    });

    computerBoardCells.forEach((cell) => {
        cell.addEventListener('mousedown', () => {
            focusBeforePointerActivation = document.activeElement;
        });

        cell.addEventListener('click', () => {
            const previousFocus = focusBeforePointerActivation;
            focusBeforePointerActivation = null;
            const succeeded = attackFromCell(cell, true);

            if (
                !succeeded &&
                previousFocus &&
                document.activeElement !== previousFocus &&
                typeof previousFocus.focus === 'function'
            ) {
                previousFocus.focus();
            }
        });

        cell.addEventListener('keydown', (event) => {
            const [row, column] = cell.dataset.coordinate
                .split(',')
                .map(Number);
            let nextRow = row;
            let nextColumn = column;

            if (event.key === 'ArrowUp') nextRow -= 1;
            else if (event.key === 'ArrowDown') nextRow += 1;
            else if (event.key === 'ArrowLeft') nextColumn -= 1;
            else if (event.key === 'ArrowRight') nextColumn += 1;
            else if (event.key === 'Home') {
                nextRow = event.ctrlKey ? 0 : row;
                nextColumn = 0;
            } else if (event.key === 'End') {
                nextRow = event.ctrlKey ? 9 : row;
                nextColumn = 9;
            } else if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                attackFromCell(cell);
                return;
            } else {
                return;
            }

            event.preventDefault();
            if (nextRow < 0 || nextRow > 9 || nextColumn < 0 || nextColumn > 9) {
                return;
            }

            setActiveCell(nextRow * 10 + nextColumn, true);
        });
    });
}

export {
    playerBoardUI,
    computerBoardUI,
    playerBoardPanel,
    computerBoardPanel,
    initializeGameUI,
};
