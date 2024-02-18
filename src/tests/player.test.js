/* eslint-disable no-undef */
import Player, { createComputerAI, computerPlay } from '../player';
import Gameboard from '../gameboard';

const gameboard = new Gameboard();
const computerBoard = new Gameboard();
const player1 = new Player();
const computerAI = createComputerAI();

describe('players take turns', () => {
    test('first player turn', () => {
        player1.play(2, 3, computerBoard);
        expect(player1.played).toBeTruthy();
    });

    test("computer's turn", () => {
        computerPlay(computerAI, gameboard);
        expect(computerAI.played).toBeTruthy();
    });
});
