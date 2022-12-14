import { PuzzleModel } from "../../core/utils";

export default {
    day: 14,
    expectedOutput: [24, 93],
    solvers: [
        (input) => {
            const grid: Record<string, string> = {};
            const pathGroups = input.map((s) => s.split(" -> ").map((p) => p.split(",").map(Number)));
            for (const path of pathGroups) {
                for (let i = 0; i < path.length - 1; i++) {
                    const v1 = path[i];
                    const v2 = path[i + 1];
                    const dx = v2[0] - v1[0];
                    const dy = v2[1] - v1[1];
                    for (let j = 0; j <= Math.abs(dx) + Math.abs(dy); j++) {
                        const v = [v1[0] + j * Math.sign(dx), v1[1] + j * Math.sign(dy)];
                        grid[v.toString()] = "#";
                    }
                }
            }

            const lowerBound = 1 + Math.max(...Object.keys(grid).map((c) => Number(c.split(",")[1])));
            function isOccupied(x: number, y: number): boolean {
                return ["o", "#"].includes(grid[[x, y].toString()]);
            }

            let sandIterations = 0;
            let outOfBounds = false;
            while (!outOfBounds) {
                let v = [500, 0];
                let hasSettled = false;

                while (!hasSettled) {
                    const [vx, vy] = v;
                    if (vy >= lowerBound) {
                        outOfBounds = true;
                        hasSettled = true;
                    } else if (!isOccupied(vx, vy + 1)) {
                        v[1]++;
                    } else if (!isOccupied(vx - 1, vy + 1)) {
                        v[1]++;
                        v[0]--;
                    } else if (!isOccupied(vx + 1, vy + 1)) {
                        v[1]++;
                        v[0]++;
                    } else {
                        hasSettled = true;
                    }
                }

                if (!outOfBounds) {
                    grid[v.toString()] = "o";
                    sandIterations++;
                }
            }

            return sandIterations;
        },
        (input) => {
            const grid: Record<string, string> = {};
            const pathGroups = input.map((s) => s.split(" -> ").map((p) => p.split(",").map(Number)));
            for (const path of pathGroups) {
                for (let i = 0; i < path.length - 1; i++) {
                    const v1 = path[i];
                    const v2 = path[i + 1];
                    const dx = v2[0] - v1[0];
                    const dy = v2[1] - v1[1];
                    for (let j = 0; j <= Math.abs(dx) + Math.abs(dy); j++) {
                        const v = [v1[0] + j * Math.sign(dx), v1[1] + j * Math.sign(dy)];
                        grid[v.toString()] = "#";
                    }
                }
            }

            const spawnPos = [500, 0];
            const lowerBound = 2 + Math.max(...Object.keys(grid).map((c) => Number(c.split(",")[1])));
            function isOccupied(x: number, y: number): boolean {
                return y === lowerBound || ["o", "#"].includes(grid[[x, y].toString()]);
            }

            let sandIterations = 0;
            while (true) {
                let v = [500, 0];
                let hasSettled = false;

                while (!hasSettled) {
                    const [vx, vy] = v;
                    if (!isOccupied(vx, vy + 1)) {
                        v[1]++;
                    } else if (!isOccupied(vx - 1, vy + 1)) {
                        v[1]++;
                        v[0]--;
                    } else if (!isOccupied(vx + 1, vy + 1)) {
                        v[1]++;
                        v[0]++;
                    } else {
                        hasSettled = true;
                    }
                }

                grid[v.toString()] = "o";
                sandIterations++;

                if (isOccupied(spawnPos[0], spawnPos[1])) {
                    break;
                }
            }

            return sandIterations;
        },
    ],
} as PuzzleModel<number>;
