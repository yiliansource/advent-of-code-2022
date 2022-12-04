import { PuzzleModel } from "../../core/utils";

export default {
    day: 1,
    expectedOutput: [24000, 45000],
    solvers: [
        (input) => {
            return Math.max(
                ...input
                    .join("\n")
                    .split("\n\n")
                    .map((g) =>
                        g
                            .split("\n")
                            .map(Number)
                            .reduce((acc, cur) => cur + acc, 0)
                    )
            );
        },
        (input) => {
            return input
                .join("\n")
                .split("\n\n")
                .map((g) =>
                    g
                        .split("\n")
                        .map(Number)
                        .reduce((acc, cur) => cur + acc, 0)
                )
                .sort((a, b) => b - a)
                .slice(0, 3)
                .reduce((acc, cur) => cur + acc, 0);
        },
    ],
} as PuzzleModel<number>;
