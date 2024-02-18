import Gameboard from '../gameboard';

describe('gameboard', () => {
    const gameboard = new Gameboard();
    const xCoordinate = gameboard.placeShip(3, [0, 0], [0, 2]);
    const yCoordinate = gameboard.placeShip(3, [1, 1], [3, 1]);

    test('place ship at x coordinate', () => {
        expect(xCoordinate[0].ship).not.toBe(null);
    });

    test('place ship at y coordinate', () => {
        expect(yCoordinate[0].ship).not.toBe(null);
    });

    test('check attacks', () => {
        const attackedShip = gameboard.receiveAttack(0, 1);
        expect(attackedShip.ship.hits).toBe(1);
    });

    test('track missed attacks', () => {
        const missedShip = gameboard.receiveAttack(3, 3);
        expect(gameboard.missedAttacks).toContain(missedShip);
    });
});
