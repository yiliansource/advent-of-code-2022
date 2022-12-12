import { PuzzleModel } from "../../core/utils";

export default {
    day: 12,
    expectedOutput: [31, 29],
    solvers: [
        (input) => {
            const grid = input.map((r) => r.split(""));

            // find start & end positions
            const initialRow = grid.findIndex((r) => r.includes("S"));
            const initialCol = grid[initialRow].indexOf("S");
            const targetRow = grid.findIndex((r) => r.includes("E"));
            const targetCol = grid[targetRow].indexOf("E");

            // replace heights in grid
            grid[initialRow][initialCol] = "a";
            grid[targetRow][targetCol] = "z";

            // generate heightmap
            const heightmap: number[][] = [];
            for (let j = 0; j < grid.length; j++) {
                heightmap.push([]);
                for (let i = 0; i < grid[j].length; i++) {
                    heightmap[j].push(grid[j][i].charCodeAt(0) - "a".charCodeAt(0));
                }
            }

            // run pathfinding
            const path = findPath(heightmap, initialRow, initialCol, targetRow, targetCol);
            return path ? path.length : Number.POSITIVE_INFINITY;
        },
        (input) => {
            const grid = input.map((r) => r.replace("S", "a").split(""));
            const targetRow = grid.findIndex((r) => r.includes("E"));
            const targetCol = grid[targetRow].indexOf("E");

            // replace height in grid
            grid[targetRow][targetCol] = "z";

            // generate heightmap
            const heightmap: number[][] = [];
            for (let j = 0; j < grid.length; j++) {
                heightmap.push([]);
                for (let i = 0; i < grid[j].length; i++) {
                    heightmap[j].push(grid[j][i].charCodeAt(0) - "a".charCodeAt(0));
                }
            }

            // find possible starting position
            const initialPositions: [number, number][] = [];
            for (let j = 0; j < grid.length; j++) {
                for (let i = 0; i < grid.length; i++) {
                    if (grid[j][i] === "a") {
                        initialPositions.push([j, i]);
                    }
                }
            }

            // i'm lazy, we got time, let's just bruteforce it
            // technically we could immediately discard paths that go onto the lowest elevation to speed things up
            let minLength = Number.POSITIVE_INFINITY;
            let progress = 0;
            for (const [initialRow, initialCol] of initialPositions) {
                // console.log(
                //     "ponder starting position (%d,%d) [%d%]",
                //     initialRow,
                //     initialCol,
                //     Math.round((100 * progress) / initialPositions.length)
                // );
                const path = findPath(heightmap, initialRow, initialCol, targetRow, targetCol, minLength);
                if (path && path.length < minLength) {
                    minLength = path.length;
                }
                progress++;
            }

            return minLength;
        },
    ],
} as PuzzleModel<number>;

const deltas = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];

function findPath(
    heightmap: number[][],
    initialRow: number,
    initialCol: number,
    targetRow: number,
    targetCol: number,
    maxPathLength: number = Number.POSITIVE_INFINITY
): [number, number][] | null {
    const distmap: number[][] = heightmap.map((r) => r.map((_) => Number.POSITIVE_INFINITY));
    const prevmap: ([number, number] | null)[][] = heightmap.map((r) => r.map((_) => null));
    const visitedmap: boolean[][] = heightmap.map((r) => r.map((_) => false));

    distmap[initialRow][initialCol] = 0;

    while (true) {
        // find cell with minimal distance
        let minDist = Number.POSITIVE_INFINITY;
        let [currentRow, currentCol] = [-1, -1];
        for (let j = 0; j < distmap.length; j++) {
            for (let i = 0; i < distmap[j].length; i++) {
                if (!visitedmap[j][i] && distmap[j][i] < minDist) {
                    currentRow = j;
                    currentCol = i;
                    minDist = distmap[j][i];
                }
            }
        }

        if (minDist > maxPathLength) {
            // we exceeded the maximum search length.
            return null;
        }

        if (currentRow < 0 || currentRow < 0) {
            // all nodes are either visited or infinity distance, so theres no connected path.
            return null;
        }

        if (targetRow === currentRow && targetCol === currentCol) {
            // path found
            break;
        }

        visitedmap[currentRow][currentCol] = true;

        for (const [dRow, dCol] of deltas) {
            const [neighbourRow, neighbourCol] = [currentRow + dRow, currentCol + dCol];
            if (
                neighbourRow < 0 ||
                neighbourRow >= heightmap.length ||
                neighbourCol < 0 ||
                neighbourCol >= heightmap[neighbourRow].length
            ) {
                // out of bounds
                continue;
            }
            if (heightmap[currentRow][currentCol] + 1 < heightmap[neighbourRow][neighbourCol]) {
                // too steep
                continue;
            }

            const newPathLength = distmap[currentRow][currentCol] + 1;
            if (newPathLength < distmap[neighbourRow][neighbourCol]) {
                distmap[neighbourRow][neighbourCol] = newPathLength;
                prevmap[neighbourRow][neighbourCol] = [currentRow, currentCol];
            }
        }
    }

    const path: [number, number][] = [];
    let [currentRow, currentCol] = [targetRow, targetCol];
    while (currentRow !== initialRow || currentCol !== initialCol) {
        path.unshift([currentRow, currentCol]);
        [currentRow, currentCol] = prevmap[currentRow][currentCol]!;
    }

    return path;
}
