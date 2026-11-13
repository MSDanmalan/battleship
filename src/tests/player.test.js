import Player from '../player';
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
