class Ship {
    constructor(length) {
        this.length = length;
        this.hits = null;
        this.sunk = false;
    }

    hit() {
        if (this.hits < this.length) {
            this.hits += 1;
        }
        return this.hits;
    }

    isSunk() {
        if (this.length === this.hits) {
            this.sunk = true;
        }

        return this.sunk;
    }
}

export default Ship;
