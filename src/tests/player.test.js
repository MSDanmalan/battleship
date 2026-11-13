import Player, { computerPlay } from '../player';
import Gameboard from '../gameboard';

describe('Player', () => {
    let player;
    let gameboard;

    beforeEach(() => {
        player = new Player();
        gameboard = new Gameboard();
        gameboard.placeShip(2, [0, 0], [0, 1]);
    });

    test('returns the result of a successful hit', () => {
        const result = player.play(0, 0, gameboard);

        expect(result.status).toBe('hit');
        expect(player.played).toBe(true);
    });

    test('returns the result of a successful miss', () => {
        const result = player.play(3, 3, gameboard);

        expect(result.status).toBe('miss');
        expect(player.played).toBe(true);
    });

    test('does not mark an invalid attack as played', () => {
        const result = player.play(-1, 3, gameboard);

        expect(result.status).toBe('invalid-coordinate');
        expect(player.played).toBe(null);
    });

    test('does not mark a repeated attack as played', () => {
        player.play(0, 0, gameboard);
        player.played = null;

        const result = player.play(0, 0, gameboard);

        expect(result.status).toBe('already-attacked');
        expect(player.played).toBe(null);
    });
});

describe('Computer AI', () => {
    let AI;
    let gameboard;

    beforeEach(() => {
        AI = new Player();
        gameboard = new Gameboard();
        gameboard.placeShip(2, [0, 0], [0, 1]);
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('makes a valid attack', () => {
        const result = computerPlay(AI, gameboard);

        expect(['hit', 'miss']).toContain(result.status);
        expect(gameboard.attackedSquares.size).toBe(1);
    });

    test('does not attack the same square twice', () => {
        const firstAttack = computerPlay(AI, gameboard);
        const secondAttack = computerPlay(AI, gameboard);

        expect(firstAttack.square).not.toEqual(secondAttack.square);
        expect(gameboard.attackedSquares.size).toBe(2);
    });

    test('keeps attack history separate for each AI instance', () => {
        const anotherAI = new Player();
        const anotherBoard = new Gameboard();

        computerPlay(AI, gameboard);
        computerPlay(anotherAI, anotherBoard);

        expect(AI.shots.size).toBe(1);
        expect(anotherAI.shots.size).toBe(1);
        expect(AI.shots).not.toBe(anotherAI.shots);
    });

    test('handles a board with no remaining targets', () => {
        for (let x = 0; x < 10; x += 1) {
            for (let y = 0; y < 10; y += 1) {
                gameboard.attackedSquares.add(`${x},${y}`);
            }
        }

        const result = computerPlay(AI, gameboard);

        expect(result).toBe(null);
        expect(gameboard.attackedSquares.size).toBe(100);
    });
});
