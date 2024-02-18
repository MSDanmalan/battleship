import Ship from '../ship';

const calculateHits = (ship, numberOfHits) => {
    for (let i = 0; i < numberOfHits; i++) {
        ship.hit();
    }
};

describe('hits', () => {
    test('increases number of hits', () => {
        const destroyer = new Ship(3);
        calculateHits(destroyer, 5);
        expect(destroyer.hits).toBe(3);
    });

    test('hits does not exceeds ship length', () => {
        const submarine = new Ship(3);
        calculateHits(submarine, 4);
        expect(submarine.hits).toBe(3);
    });
});

describe('sunk', () => {
    test('consider ship as sunked', () => {
        const patrolBoat = new Ship(2);
        calculateHits(patrolBoat, 4);
        patrolBoat.isSunk();
        expect(patrolBoat.sunk).toBeTruthy();
    });
});
