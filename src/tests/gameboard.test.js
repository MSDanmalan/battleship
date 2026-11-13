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
        const result = gameboard.receiveAttack(0, 1);

        expect(result.status).toBe('hit');
        expect(result.square.ship.hits).toBe(1);
    });

    test('tracks missed attacks', () => {
        const result = gameboard.receiveAttack(3, 3);

        expect(result.status).toBe('miss');
        expect(gameboard.missedAttacks).toContain(result.square);
    });

    test('does not count a repeated hit twice', () => {
        const firstAttack = gameboard.receiveAttack(0, 1);
        const secondAttack = gameboard.receiveAttack(0, 1);

        expect(firstAttack.status).toBe('hit');
        expect(secondAttack.status).toBe('already-attacked');
        expect(
            gameboard.board.find((node) => node.x === 0 && node.y === 1).ship
                .hits
        ).toBe(1);
    });

    test('does not register a repeated miss twice', () => {
        const firstAttack = gameboard.receiveAttack(3, 3);
        const secondAttack = gameboard.receiveAttack(3, 3);

        expect(firstAttack.status).toBe('miss');
        expect(secondAttack.status).toBe('already-attacked');
        expect(gameboard.missedAttacks.size).toBe(1);
    });

    test('rejects negative coordinates', () => {
        expect(gameboard.receiveAttack(-1, 3).status).toBe(
            'invalid-coordinate'
        );
    });

    test('rejects coordinates outside the board', () => {
        expect(gameboard.receiveAttack(10, 3).status).toBe(
            'invalid-coordinate'
        );
    });

    test('rejects decimal coordinates', () => {
        expect(gameboard.receiveAttack(1.5, 3).status).toBe(
            'invalid-coordinate'
        );
    });

    test('rejects non-numeric coordinates', () => {
        expect(gameboard.receiveAttack('a', 3).status).toBe(
            'invalid-coordinate'
        );
    });

    test('marks a ship as sunk after all its squares are hit', () => {
        gameboard.receiveAttack(0, 0);
        gameboard.receiveAttack(0, 1);
        const finalAttack = gameboard.receiveAttack(0, 2);

        expect(finalAttack.status).toBe('hit');
        expect(finalAttack.square.ship.sunk).toBe(true);
    });
});
