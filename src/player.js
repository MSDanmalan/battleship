class Player {
    constructor() {
        this.played = null;
    }

    play(x, y, gameBoard) {
        gameBoard.receiveAttack(x, y);
        this.played = true;
    }
}

const createComputerAI = () => {
    const computer = new Player();
    return computer;
};

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
export { createComputerAI, computerPlay };
