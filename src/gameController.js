import { computerPlay } from './player';

class GameController {
    constructor(player, computer, playerBoard, computerBoard) {
        this.player = player;
        this.computer = computer;
        this.playerBoard = playerBoard;
        this.computerBoard = computerBoard;

        this.gameOver = false;
        this.winner = null;
    }

    isGameOver() {
        const computerFleetDestroyed =
            this.computerBoard.ships.length > 0 &&
            this.computerBoard.ships.every((ship) => ship.isSunk());

        const playerFleetDestroyed =
            this.playerBoard.ships.length > 0 &&
            this.playerBoard.ships.every((ship) => ship.isSunk());

        if (computerFleetDestroyed) {
            this.gameOver = true;
            this.winner = this.player;
        } else if (playerFleetDestroyed) {
            this.gameOver = true;
            this.winner = this.computer;
        }

        return this.gameOver;
    }

    playTurn(x, y) {
        // Reject attacks if the game has already ended.
        if (this.gameOver || this.isGameOver()) {
            return { status: 'game-over' };
        }

        // Human player attacks the computer's board.
        const playerAttack = this.player.play(x, y, this.computerBoard);

        // Invalid and repeated attacks do not trigger a computer response.
        if (playerAttack.status !== 'hit' && playerAttack.status !== 'miss') {
            return {
                playerAttack,
                computerAttack: null,
            };
        }

        // Check whether the human player has defeated the computer.
        if (this.isGameOver()) {
            return {
                playerAttack,
                computerAttack: null,
            };
        }

        const computerAttack = computerPlay(this.computer, this.playerBoard);

        // Check whether the computer has defeated the human.
        this.isGameOver();

        return {
            playerAttack,
            computerAttack,
        };
    }
}

export default GameController;
