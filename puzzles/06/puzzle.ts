import { PuzzleModel } from "../../core/utils";

export default {
    day: 6,
    expectedOutput: [7, 19],
    solvers: [
        (input) => input[0].split("").findIndex((_, i, o) => new Set(o.slice(i, i + 4)).size === 4) + 4,
        (input) => input[0].split("").findIndex((_, i, o) => new Set(o.slice(i, i + 14)).size === 14) + 14,
    ],
} as PuzzleModel<number>;
