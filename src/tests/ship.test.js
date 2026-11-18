import Ship from '../ship';

const calculateHits = (ship, numberOfHits) => {
    for (let i = 0; i < numberOfHits; i += 1) {
        ship.hit();
    }
};

describe('Ship hits', () => {
    test('starts with zero hits', () => {
        const ship = new Ship(3);

        expect(ship.hits).toBe(0);
    });

    test('increments hits when hit', () => {
        const ship = new Ship(3);

        ship.hit();

        expect(ship.hits).toBe(1);
    });

    test('does not exceed the ship length', () => {
        const ship = new Ship(3);

        calculateHits(ship, 5);

        expect(ship.hits).toBe(3);
    });
});

describe('Ship sinking', () => {
    test('starts unsunk', () => {
        const ship = new Ship(2);

        expect(ship.sunk).toBe(false);
    });

    test('remains unsunk before reaching its hit limit', () => {
        const ship = new Ship(2);

        ship.hit();
        expect(ship.isSunk()).toBe(false);
    });

    test('becomes sunk when all segments are hit', () => {
        const ship = new Ship(2);

        calculateHits(ship, 2);

        expect(ship.isSunk()).toBe(true);
        expect(ship.sunk).toBe(true);
    });

    test('remains sunk after subsequent checks', () => {
        const ship = new Ship(2);

        calculateHits(ship, 2);

        ship.isSunk();

        expect(ship.isSunk()).toBe(true);
    });
});
