import { PuzzleModel } from "../../core/utils";

export default {
    day: 4,
    expectedOutput: [2, 4],
    solvers: [
        (input) => {
            return input
                .map((r) => r.split(",").map((e) => e.split("-").map(Number)))
                .filter(([[a1, b1], [a2, b2]]) => (a1 <= a2 && b1 >= b2) || (a1 >= a2 && b1 <= b2)).length;
        },
        (input) => {
            return input
                .map((r) => r.split(",").map((e) => e.split("-").map(Number)))
                .map((g) => g.map(([a, b]) => [...Array(b - a + 1).keys()].map((i) => i + a)) as [number[], number[]])
                .filter(([e1, e2]) => e1.length + e2.length - new Set(e1.concat(...e2)).size).length;
        },
    ],
} as PuzzleModel<number>;
