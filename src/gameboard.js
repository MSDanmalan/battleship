import Ship from './ship';

function CreateNode(x, y) {
    const ship = null;
    return { x, y, ship };
}

class Gameboard {
    constructor() {
        this.board = this.createBoard();
    }

    createBoard() {
        const x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const y = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        const board = [];
        for (const i of x) {
            for (const j of y) {
                const coordinates = CreateNode(i, j);
                board.push(coordinates);
            }
        }

        return board;
    }

    placeShip(ship, start = [], end = []) {
        const shipType = new Ship(ship);
        const coordinate = [];
        const xStart = start[0];
        const yStart = start[1];
        let xEnd = end[0];
        let yEnd = end[1];

        if (start === end) coordinate.push(start);

        if (xStart === xEnd) {
            coordinate.push(end);
            for (let i = 0; i < shipType.length - 1; i++) {
                if (yStart < yEnd) {
                    coordinate.push([xStart, (yEnd -= 1)]);
                } else if (yStart > yEnd) {
                    coordinate.push([xStart, (yEnd += 1)]);
                }
            }
        } else if (yStart === yEnd) {
            coordinate.push(end);
            for (let i = 0; i < shipType.length - 1; i++) {
                if (xStart < xEnd) {
                    coordinate.push([(xEnd -= 1), yStart]);
                } else if (xStart > xEnd) {
                    coordinate.push([(xEnd += 1), yStart]);
                }
            }
        }

        for (const square of coordinate) {
            const position = this.board.find(
                (node) => node.x === square[0] && node.y === square[1]
            );

            if (position.ship === null) {
                position.ship = shipType;
            }
        }

        return this.board;
    }

    missedAttacks = new Set();

    receiveAttack(x, y) {
        const isValidCoordinate = (a, b) =>
            a >= 0 && a <= 9 && b >= 0 && b <= 9;

        if (!isValidCoordinate(x, y)) {
            return 'Please select coordinates between 0 and 9';
        }

        const target = this.board.find((node) => node.x === x && node.y === y);
        if (target.ship !== null) {
            target.ship.hit();
            target.ship.isSunk();
            console.log(target.ship);
        } else {
            this.missedAttacks.add(target);
        }

        return target;
    }
}

export default Gameboard;
