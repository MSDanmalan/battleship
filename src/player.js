class Player {
    constructor() {
        this.played = null;
        this.shots = new Set();
    }

    play(x, y, gameBoard) {
        const result = gameBoard.receiveAttack(x, y);

        if (result.status === 'hit' || result.status === 'miss') {
            this.played = true;
        }

        return result;
    }
}

const computerPlay = (AI, board) => {
    // Find all squares that neither this AI nor the board has attacked.
    const availableTargets = board.board.filter((square) => {
        const coordinateKey = `${square.x},${square.y}`;

        return (
            !AI.shots.has(coordinateKey) &&
            !board.attackedSquares.has(coordinateKey)
        );
    });

    // Stop safely when no targets remain.
    if (availableTargets.length === 0) {
        return null;
    }

    // Select a random available square.
    const randomIndex = Math.floor(Math.random() * availableTargets.length);
    const target = availableTargets[randomIndex];

    // Attack the selected square.
    const result = AI.play(target.x, target.y, board);

    // Record only successful attacks.
    if (result.status === 'hit' || result.status === 'miss') {
        AI.shots.add(`${target.x},${target.y}`);
    }

    return result;
};

export default Player;
export { computerPlay };
