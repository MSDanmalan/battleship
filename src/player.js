class Player {
    constructor() {
        this.played = null;
    }

    play(x, y, gameBoard) {
        const result = gameBoard.receiveAttack(x, y);

        if (result.status === 'hit' || result.status === 'miss') {
            this.played = true;
        }

        return result;
    }
}

const getComputerTarget = () => {
    let target = [];

    const getX = () => Math.floor(Math.random() * 10);
    const getY = () => Math.floor(Math.random() * 10);

    const x = getX();
    const y = getY();

    target = [x, y];

    return target;
};

const shots = new Set();

const computerPlay = (AI, board) => {
    console.log('hi');
    const computerTarget = getComputerTarget();
    let x = 0;
    let y = 0;

    if (!shots.has(computerTarget)) {
        shots.add(computerTarget);
        ({ x, y } = computerTarget);
        AI.play(x, y, board);
    } else if (shots.length !== 99) {
        computerPlay(AI, board);
    }
};

export default Player;
export { computerPlay };
