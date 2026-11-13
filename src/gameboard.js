import Ship from './ship';

function CreateNode(x, y) {
    const ship = null;
    return { x, y, ship };
}

class Gameboard {
    constructor() {
        this.board = this.createBoard();
        this.missedAttacks = new Set();
        this.attackedSquares = new Set();
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

    placeShip(shipLength, start = [], end = []) {
        // Validate ship length
        if (!Number.isInteger(shipLength) || shipLength < 1) {
            throw new Error('Ship length must be a positive integer');
        }

        // Validate coordinate format
        const isValidCoordinate = (coordinate) =>
            Array.isArray(coordinate) &&
            coordinate.length === 2 &&
            coordinate.every(
                (value) => Number.isInteger(value) && value >= 0 && value <= 9
            );

        if (!isValidCoordinate(start) || !isValidCoordinate(end)) {
            throw new Error('Coordinates must be valid board positions');
        }

        const [xStart, yStart] = start;
        const [xEnd, yEnd] = end;

        // Determine orientation
        const isHorizontal = xStart === xEnd;
        const isVertical = yStart === yEnd;

        if (!isHorizontal && !isVertical) {
            throw new Error('Ships must be placed horizontally or vertically');
        }

        // Calculate ship length from its endpoints
        const actualLength =
            Math.abs(xEnd - xStart) + Math.abs(yEnd - yStart) + 1;

        if (actualLength !== shipLength) {
            throw new Error(
                'Ship length does not match the selected coordinates'
            );
        }

        // Calculate all occupied coordinates
        const coordinates = [];

        const stepX = Math.sign(xEnd - xStart);
        const stepY = Math.sign(yEnd - yStart);

        for (let i = 0; i < shipLength; i += 1) {
            coordinates.push([xStart + i * stepX, yStart + i * stepY]);
        }

        // Validate every position before changing the board
        const positions = coordinates.map(([x, y]) =>
            this.board.find((node) => node.x === x && node.y === y)
        );

        if (positions.some((position) => !position)) {
            throw new Error('Ship placement is outside the board');
        }

        if (positions.some((position) => position.ship !== null)) {
            throw new Error('Ships cannot overlap');
        }

        // Place the ship only after all validations pass
        const newShip = new Ship(shipLength);

        positions.forEach((position) => {
            position.ship = newShip;
        });

        return this.board;
    }

    receiveAttack(x, y) {
        // Validate coordinates
        const isValidCoordinate = (value) =>
            Number.isInteger(value) && value >= 0 && value <= 9;

        if (!isValidCoordinate(x) || !isValidCoordinate(y)) {
            return {
                status: 'invalid-coordinate',
                square: null,
            };
        }

        // Use coordinate values rather than object references
        const coordinateKey = `${x},${y}`;

        // Prevent repeated attacks
        if (this.attackedSquares.has(coordinateKey)) {
            return {
                status: 'already-attacked',
                square: this.board.find((node) => node.x === x && node.y === y),
            };
        }

        const target = this.board.find((node) => node.x === x && node.y === y);

        // Record the attack
        this.attackedSquares.add(coordinateKey);

        if (target.ship !== null) {
            target.ship.hit();
            target.ship.isSunk();

            return {
                status: 'hit',
                square: target,
            };
        }

        this.missedAttacks.add(target);

        return {
            status: 'miss',
            square: target,
        };
    }
}

export default Gameboard;
