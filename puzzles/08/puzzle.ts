import { PuzzleModel } from "../../core/utils";

export default {
    day: 8,
    expectedOutput: [21, 8],
    solvers: [
        (input) => {
            const cells = input.map((r) => r.split("").map(Number));
            const width = cells[0].length;
            const height = cells.length;

            let visible = width * 2 + height * 2 - 4;

            function isVisible(i: number, j: number): boolean {
                const dirs = [
                    [0, 1],
                    [1, 0],
                    [0, -1],
                    [-1, 0],
                ];
                for (const [dy, dx] of dirs) {
                    if (isVisibleInDir(i, j, [dy, dx])) {
                        return true;
                    }
                }
                return false;
            }
            function isVisibleInDir(i: number, j: number, [dy, dx]: [number, number]): boolean {
                const tree = cells[i][j];
                const iterator = new GridIterator(cells, [dy, dx], i + dy, j + dx);

                let result = iterator.next();
                while (!result.done) {
                    if (result.value >= tree) {
                        return false;
                    }
                    result = iterator.next();
                }
                return true;
            }

            for (let i = 1; i < height - 1; i++) {
                for (let j = 1; j < width - 1; j++) {
                    if (isVisible(i, j)) {
                        visible++;
                    }
                }
            }

            return visible;
        },
        (input) => {
            const cells = input.map((r) => r.split("").map(Number));
            const width = cells[0].length;
            const height = cells.length;

            function scenicScore(i: number, j: number): number {
                let score = 1;
                const dirs = [
                    [0, 1],
                    [1, 0],
                    [0, -1],
                    [-1, 0],
                ];
                for (const [dy, dx] of dirs) {
                    score *= treesVisibleInDir(i, j, [dy, dx]);
                }
                return score;
            }
            function treesVisibleInDir(i: number, j: number, [dy, dx]: [number, number]): number {
                let count = 0;
                const tree = cells[i][j];
                const iterator = new GridIterator(cells, [dy, dx], i + dy, j + dx);

                let result = iterator.next();
                while (!result.done) {
                    count++;
                    if (result.value >= tree) {
                        break;
                    }
                    result = iterator.next();
                }

                return count;
            }

            let maxScore = Number.NEGATIVE_INFINITY;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const score = scenicScore(i, j);
                    if (score > maxScore) {
                        maxScore = score;
                    }
                }
            }

            return maxScore;
        },
    ],
} as PuzzleModel<number>;

class GridIterator<T> implements Iterator<T> {
    private done = false;

    constructor(private grid: T[][], private d: [number, number], private i = 0, private j = 0) {}

    next(): IteratorResult<T, undefined> {
        if (this.done) {
            return {
                done: this.done,
                value: undefined,
            };
        }

        if (this.i < 0 || this.j < 0 || this.i >= this.grid.length || this.j >= this.grid[0].length) {
            this.done = true;
            return {
                done: this.done,
                value: undefined,
            };
        }

        const value = this.grid[this.i][this.j];
        this.i += this.d[0];
        this.j += this.d[1];

        return {
            done: false,
            value,
        };
    }
}
