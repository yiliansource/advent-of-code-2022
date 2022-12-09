import { PuzzleModel } from "../../core/utils";

export default {
    day: 9,
    expectedOutput: [88, 36],
    solvers: [
        (input) => {
            const instructions = input
                .map((r) => r.split(" "))
                .map(([dir, count]) => [dirToVec(dir), Number(count)] as [Vector, number]);

            let head: Vector = [0, 0];
            let tail: Vector = [0, 0];

            const visistedPositions = new Set<string>([tail.toString()]);

            for (const [dir, count] of instructions) {
                for (let i = 0; i < count; i++) {
                    head = addVec(head, dir);

                    if (euclideanSquared(head, tail) > 2) {
                        if (tail[0] === head[0]) {
                            tail[1] += Math.sign(head[1] - tail[1]);
                        } else if (tail[1] === head[1]) {
                            tail[0] += Math.sign(head[0] - tail[0]);
                        } else {
                            tail[1] += Math.sign(head[1] - tail[1]);
                            tail[0] += Math.sign(head[0] - tail[0]);
                        }
                    }

                    visistedPositions.add(tail.toString());
                }
            }

            return visistedPositions.size;
        },
        (input) => {
            const instructions = input
                .map((r) => r.split(" "))
                .map(([dir, count]) => [dirToVec(dir), Number(count)] as [Vector, number]);

            let parts: Vector[] = [...Array(10).keys()].map((_) => [0, 0]);

            const visistedPositions = new Set<string>([parts[9].toString()]);

            for (const [dir, count] of instructions) {
                for (let i = 0; i < count; i++) {
                    parts[0] = addVec(parts[0], dir);

                    for (let j = 1; j < parts.length; j++) {
                        const head = parts[j - 1];
                        const tail = parts[j];
                        if (euclideanSquared(head, tail) > 2) {
                            if (tail[0] === head[0]) {
                                tail[1] += Math.sign(head[1] - tail[1]);
                            } else if (tail[1] === head[1]) {
                                tail[0] += Math.sign(head[0] - tail[0]);
                            } else {
                                tail[1] += Math.sign(head[1] - tail[1]);
                                tail[0] += Math.sign(head[0] - tail[0]);
                            }
                        }
                    }

                    visistedPositions.add(parts[9].toString());
                }
            }

            return visistedPositions.size;
        },
    ],
} as PuzzleModel<number>;

type Vector = [number, number];

function addVec([ax, ay]: Vector, [bx, by]: Vector): Vector {
    return [ax + bx, ay + by];
}
function euclideanSquared([ax, ay]: Vector, [bx, by]: Vector): number {
    return (ax - bx) ** 2 + (ay - by) ** 2;
}

function dirToVec(dir: string): Vector {
    switch (dir) {
        case "R":
            return [1, 0];
        case "U":
            return [0, 1];
        case "L":
            return [-1, 0];
        case "D":
            return [0, -1];
    }
    return [0, 0];
}
