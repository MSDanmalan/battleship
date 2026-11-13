import Gameboard from '../gameboard';

describe('gameboard ship placement', () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
    });

    const getSquare = (x, y) =>
        gameboard.board.find((node) => node.x === x && node.y === y);

    test('places a ship horizontally', () => {
        gameboard.placeShip(3, [0, 0], [0, 2]);

        expect(getSquare(0, 0).ship).not.toBe(null);
        expect(getSquare(0, 1).ship).not.toBe(null);
        expect(getSquare(0, 2).ship).not.toBe(null);
    });

    test('places a ship vertically', () => {
        gameboard.placeShip(3, [1, 1], [3, 1]);

        expect(getSquare(1, 1).ship).not.toBe(null);
        expect(getSquare(2, 1).ship).not.toBe(null);
        expect(getSquare(3, 1).ship).not.toBe(null);
    });

    test('does not allow ships to overlap', () => {
        gameboard.placeShip(3, [0, 0], [0, 2]);

        expect(() => {
            gameboard.placeShip(3, [0, 1], [2, 1]);
        }).toThrow();
    });

    test('rejects placements outside the board', () => {
        expect(() => {
            gameboard.placeShip(3, [9, 9], [9, 11]);
        }).toThrow();
    });

    test('rejects placements where ship length does not match coordinates', () => {
        expect(() => {
            gameboard.placeShip(3, [0, 0], [0, 1]);
        }).toThrow();
    });

    test('rejects diagonal placements', () => {
        expect(() => {
            gameboard.placeShip(3, [0, 0], [2, 2]);
        }).toThrow();
    });

    test('does not partially place a ship when placement fails', () => {
        gameboard.placeShip(3, [0, 0], [0, 2]);

        expect(() => {
            gameboard.placeShip(3, [0, 1], [2, 1]);
        }).toThrow();

        expect(getSquare(1, 1).ship).toBe(null);
        expect(getSquare(2, 1).ship).toBe(null);
    });
});

describe('gameboard attacks', () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
        gameboard.placeShip(3, [0, 0], [0, 2]);
    });

    test('records an attack on a ship', () => {
        const attackedSquare = gameboard.receiveAttack(0, 1);

        expect(attackedSquare.ship.hits).toBe(1);
    });

    test('tracks missed attacks', () => {
        const missedSquare = gameboard.receiveAttack(3, 3);

        expect(gameboard.missedAttacks).toContain(missedSquare);
    });
});
