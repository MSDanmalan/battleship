const fs = require('fs');
const path = require('path');

class TestElement {
    constructor(tagName) {
        this.tagName = tagName;
        this.children = [];
        this.attributes = {};
        this.dataset = {};
        this.listeners = {};
        this.classNames = new Set();
        this.classList = {
            add: (name) => this.classNames.add(name),
            remove: (name) => this.classNames.delete(name),
            contains: (name) => this.classNames.has(name),
        };
        this.tabIndex = undefined;
        this.textContent = '';
    }

    setAttribute(name, value) {
        this.attributes[name] = value;
    }

    getAttribute(name) {
        return this.attributes[name] ?? null;
    }

    appendChild(child) {
        this.children.push(child);
        child.parent = this;
        return child;
    }

    querySelectorAll(selector) {
        const matches = [];
        const visit = (element) => {
            element.children.forEach((child) => {
                if (selector === '.cell' && child.classList.contains('cell')) {
                    matches.push(child);
                }
                visit(child);
            });
        };
        visit(this);
        return new NodeListLike(matches);
    }

    addEventListener(type, callback) {
        this.listeners[type] = callback;
    }

    dispatch(type, event = {}) {
        const dispatched = {
            key: event.key,
            ctrlKey: Boolean(event.ctrlKey),
            defaultPrevented: false,
            preventDefault() {
                this.defaultPrevented = true;
            },
        };
        this.listeners[type]?.(dispatched);
        return dispatched;
    }

    focus() {
        global.document.activeElement = this;
    }
}

class NodeListLike {
    constructor(elements) {
        this.length = elements.length;
        elements.forEach((element, index) => {
            this[index] = element;
        });
    }

    forEach(callback) {
        Array.from(this).forEach(callback);
    }

    *[Symbol.iterator]() {
        for (let index = 0; index < this.length; index += 1) {
            yield this[index];
        }
    }
}

describe('board accessibility and keyboard interaction', () => {
    let playerBoardUI;
    let computerBoardUI;
    let playerBoardPanel;
    let computerBoardPanel;
    let initializeGameUI;
    let gameController;
    let status;
    let startButton;

    beforeEach(() => {
        jest.resetModules();

        status = new TestElement('p');
        startButton = new TestElement('button');
        const elements = {
            '#game-status': status,
            '#start-game': startButton,
        };

        global.document = {
            activeElement: null,
            createElement: (tagName) => new TestElement(tagName),
            querySelector: (selector) => elements[selector],
        };

        gameController = {
            gameOver: false,
            player: {},
            winner: null,
            playTurn: jest.fn((x, y) => {
                if (x === 0 && y === 0) {
                    return { playerAttack: { status: 'already-attacked' } };
                }
                if (x === 0 && y === 1) {
                    return { playerAttack: { status: 'invalid-coordinate' } };
                }
                if (x === 0 && y === 3) {
                    return {
                        playerAttack: {
                            status: 'hit',
                            sunk: true,
                            square: { ship: mockShip },
                        },
                        computerAttack: null,
                    };
                }
                return {
                    playerAttack: {
                        status: 'hit',
                        sunk: false,
                        square: { ship: null },
                    },
                    computerAttack: null,
                };
            }),
        };

        const mockShip = {};
        const mockComputerBoard = {
            board: [
                { x: 0, y: 2, ship: mockShip },
                { x: 0, y: 3, ship: mockShip },
            ],
        };

        jest.doMock('../game', () => ({
            playerBoard: { board: [] },
            computerBoard: mockComputerBoard,
            playerShipPositions: [{ x: 1, y: 2 }],
            gameController,
        }));

        ({
            playerBoardUI,
            computerBoardUI,
            playerBoardPanel,
            computerBoardPanel,
            initializeGameUI,
        } = require('../dom'));
    });

    afterEach(() => {
        delete global.document;
        jest.dontMock('../game');
    });

    test('makes hit, miss, and sunk markers visible', () => {
        const styleSheet = fs.readFileSync(
            path.resolve(__dirname, '../style.css'),
            'utf8'
        );

        expect(styleSheet).toMatch(
            /\.attacked-ship \.cell-marker,\s*\.missed-attack \.cell-marker,\s*\.sunk-ship \.cell-marker\s*\{\s*display: inline;/
        );
    });

    test('uses table semantics for the read-only board and grid semantics for the computer board', () => {
        initializeGameUI();
        const playerCells = Array.from(playerBoardUI.querySelectorAll('.cell'));
        const computerCells = Array.from(
            computerBoardUI.querySelectorAll('.cell')
        );

        expect(playerBoardUI.getAttribute('role')).toBe('table');
        expect(playerBoardUI.getAttribute('aria-label')).toBe('Your fleet');
        expect(computerBoardUI.getAttribute('aria-label')).toBe('Computer fleet');
        expect(playerCells[0].getAttribute('role')).toBe('cell');
        expect(computerBoardUI.getAttribute('role')).toBe('grid');
        expect(computerCells[0].getAttribute('role')).toBe('gridcell');
        expect(playerCells[0].getAttribute('aria-label')).toBe(
            'Row 1, column 1'
        );
        expect(computerCells[0].tabIndex).toBe(0);
        expect(computerCells[1].tabIndex).toBe(-1);
        expect(playerCells.every((cell) => cell.tabIndex === undefined)).toBe(true);
        expect(playerCells[12].getAttribute('aria-label')).toContain('your ship');
        expect(playerBoardPanel.children[0].textContent).toBe('Your Fleet');
        expect(computerBoardPanel.children[0].textContent).toBe('Computer Fleet');
        expect(computerBoardUI.getAttribute('aria-describedby')).toBe(
            'computer-board-instructions'
        );
    });

    test('supports arrow navigation in all directions and keeps focus at boundaries', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));
        cells[0].focus();

        cells[0].dispatch('keydown', { key: 'ArrowLeft' });
        expect(global.document.activeElement).toBe(cells[0]);
        cells[0].dispatch('keydown', { key: 'ArrowUp' });
        expect(global.document.activeElement).toBe(cells[0]);

        cells[0].dispatch('keydown', { key: 'ArrowRight' });
        expect(global.document.activeElement).toBe(cells[1]);
        expect(cells[0].tabIndex).toBe(-1);
        expect(cells[1].tabIndex).toBe(0);

        for (let step = 1; step < 9; step += 1) {
            global.document.activeElement.dispatch('keydown', {
                key: 'ArrowRight',
            });
        }
        expect(global.document.activeElement).toBe(cells[9]);
        cells[9].dispatch('keydown', { key: 'ArrowRight' });
        expect(global.document.activeElement).toBe(cells[9]);

        cells[9].dispatch('keydown', { key: 'ArrowDown' });
        expect(global.document.activeElement).toBe(cells[19]);
        cells[19].dispatch('keydown', { key: 'ArrowLeft' });
        expect(global.document.activeElement).toBe(cells[18]);

        for (let row = 2; row < 10; row += 1) {
            global.document.activeElement.dispatch('keydown', {
                key: 'ArrowDown',
            });
        }
        expect(global.document.activeElement).toBe(cells[98]);
        cells[98].dispatch('keydown', { key: 'ArrowDown' });
        expect(global.document.activeElement).toBe(cells[98]);

        for (let step = 0; step < 8; step += 1) {
            global.document.activeElement.dispatch('keydown', {
                key: 'ArrowLeft',
            });
        }
        expect(global.document.activeElement).toBe(cells[90]);
        cells[90].dispatch('keydown', { key: 'ArrowLeft' });
        expect(global.document.activeElement).toBe(cells[90]);
    });

    test('Home and End move to the row edges and Ctrl+Home/End move to grid corners', () => {
        initializeGameUI();
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));
        cells[45].focus();

        cells[45].dispatch('keydown', { key: 'Home' });
        expect(global.document.activeElement).toBe(cells[40]);
        cells[40].dispatch('keydown', { key: 'End' });
        expect(global.document.activeElement).toBe(cells[49]);
        cells[49].dispatch('keydown', { key: 'Home', ctrlKey: true });
        expect(global.document.activeElement).toBe(cells[0]);
        cells[0].dispatch('keydown', { key: 'End', ctrlKey: true });
        expect(global.document.activeElement).toBe(cells[99]);
    });

    test('Space activates a valid attack exactly once and retains focus', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));
        cells[4].focus();

        const space = cells[4].dispatch('keydown', { key: ' ' });
        expect(space.defaultPrevented).toBe(true);
        expect(gameController.playTurn).toHaveBeenCalledTimes(1);
        expect(gameController.playTurn).toHaveBeenCalledWith(0, 4);
        expect(global.document.activeElement).toBe(cells[4]);
    });

    test('invalid and repeated attacks leave keyboard focus in place', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));

        cells[0].focus();
        cells[0].dispatch('keydown', { key: 'Enter' });
        expect(global.document.activeElement).toBe(cells[0]);
        expect(status.textContent).toContain('already attacked');

        cells[1].focus();
        cells[1].dispatch('keydown', { key: ' ' });
        expect(global.document.activeElement).toBe(cells[1]);
        expect(status.textContent).toContain('Invalid target');
    });

    test('announces attack results and blocks attacks once the game is over', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));

        cells[2].focus();
        cells[2].dispatch('keydown', { key: 'Enter' });
        expect(cells[2].classList.contains('attacked-ship')).toBe(true);
        expect(cells[2].getAttribute('aria-label')).toContain('hit');
        expect(status.textContent).toContain('You hit a ship!');

        gameController.gameOver = true;
        cells[3].dispatch('keydown', { key: 'Enter' });
        expect(gameController.playTurn).toHaveBeenCalledTimes(1);
    });

    test('sunk ships are marked across every segment and announced accessibly', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));

        cells[2].focus();
        cells[2].dispatch('keydown', { key: 'Enter' });
        expect(gameController.playTurn).toHaveBeenCalledTimes(1);
        expect(cells[2].classList.contains('attacked-ship')).toBe(true);

        cells[3].dispatch('keydown', { key: 'Enter' });
        expect(gameController.playTurn).toHaveBeenCalledTimes(2);
        expect(cells[2].classList.contains('sunk-ship')).toBe(true);
        expect(cells[3].classList.contains('sunk-ship')).toBe(true);
        expect(cells[2].getAttribute('aria-label')).toContain('sunk ship segment');
        expect(status.textContent).toContain('You sank a ship!');
    });

    test('invalid and repeated mouse clicks restore the previously focused element', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const cells = Array.from(computerBoardUI.querySelectorAll('.cell'));
        const priorFocus = cells[5];

        priorFocus.focus();
        cells[0].dispatch('mousedown');
        cells[0].focus();
        cells[0].dispatch('click');
        expect(global.document.activeElement).toBe(priorFocus);

        cells[1].dispatch('mousedown');
        cells[1].focus();
        cells[1].dispatch('click');
        expect(global.document.activeElement).toBe(priorFocus);
    });

    test('uses a NodeList-like query result without relying on indexOf', () => {
        initializeGameUI();
        startButton.dispatch('click');
        const queriedCells = computerBoardUI.querySelectorAll('.cell');
        expect(typeof queriedCells.indexOf).toBe('undefined');
        const cells = Array.from(queriedCells);

        cells[4].dispatch('mousedown');
        cells[4].dispatch('click');
        expect(gameController.playTurn).toHaveBeenCalledWith(0, 4);
        expect(global.document.activeElement).toBe(cells[4]);
    });
});
