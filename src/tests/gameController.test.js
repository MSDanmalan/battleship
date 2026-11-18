import GameController from '../gameController';
import Gameboard from '../gameboard';
import Player from '../player';

describe('GameController', () => {
    let playerBoard;
    let computerBoard;
    let player;
    let computer;
    let controller;

    beforeEach(() => {
        playerBoard = new Gameboard();
        computerBoard = new Gameboard();

        player = new Player();
        computer = new Player();

        playerBoard.placeShip(2, [0, 0], [0, 1]);
        computerBoard.placeShip(2, [0, 0], [0, 1]);

        controller = new GameController(
            player,
            computer,
            playerBoard,
            computerBoard
        );
    });

    test('initializes with the game active and no winner', () => {
        expect(controller.gameOver).toBe(false);
        expect(controller.winner).toBe(null);
    });

    test('detects when a fleet has been completely sunk', () => {
        computerBoard.receiveAttack(0, 0);
        computerBoard.receiveAttack(0, 1);

        expect(controller.isGameOver()).toBe(true);
        expect(controller.winner).toBe(player);
    });

    test('executes a human attack against the computer board', () => {
        const result = controller.playTurn(0, 0);

        expect(result.playerAttack.status).toBe('hit');
    });

    test('triggers a computer response after a valid human attack', () => {
        controller.playTurn(5, 5);

        expect(playerBoard.attackedSquares.size).toBe(1);
    });

    test('does not trigger a computer response after an invalid attack', () => {
        const result = controller.playTurn(-1, 5);

        expect(result.playerAttack.status).toBe('invalid-coordinate');
        expect(playerBoard.attackedSquares.size).toBe(0);
    });

    test('does not trigger a computer response after a repeated attack', () => {
        controller.playTurn(5, 5);

        const attacksBefore = playerBoard.attackedSquares.size;

        const result = controller.playTurn(5, 5);

        expect(result.playerAttack.status).toBe('already-attacked');
        expect(playerBoard.attackedSquares.size).toBe(attacksBefore);
    });

    test('does not trigger a computer attack after the computer fleet is destroyed', () => {
        // Destroy the computer's two-cell fleet.
        computerBoard.receiveAttack(0, 0);
        computerBoard.receiveAttack(0, 1);

        const attacksBefore = playerBoard.attackedSquares.size;

        // Attempting another turn should not trigger an AI attack.
        const result = controller.playTurn(5, 5);

        expect(result.status).toBe('game-over');
        expect(playerBoard.attackedSquares.size).toBe(attacksBefore);
        expect(controller.winner).toBe(player);
    });

    test('records the computer as winner when the human fleet is destroyed', () => {
        playerBoard.receiveAttack(0, 0);
        playerBoard.receiveAttack(0, 1);

        expect(controller.isGameOver()).toBe(true);
        expect(controller.winner).toBe(computer);
    });

    test('does not trigger a computer response when the human destroys the final computer ship', () => {
        // First attack: hit one segment of the computer's ship.
        controller.playTurn(0, 0);

        // Record the number of computer attacks already made.
        const attacksBefore = playerBoard.attackedSquares.size;

        // Second attack: destroy the final segment.
        const result = controller.playTurn(0, 1);

        expect(result.playerAttack.status).toBe('hit');
        expect(result.computerAttack).toBe(null);
        expect(playerBoard.attackedSquares.size).toBe(attacksBefore);
        expect(controller.gameOver).toBe(true);
        expect(controller.winner).toBe(player);
    });
});
