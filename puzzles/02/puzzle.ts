import { PuzzleModel } from "../../core/utils";

export default {
    day: 2,
    expectedOutput: [15, 12],
    solvers: [
        (input) => {
            const rounds = input.map((r) => r.split(" ")).map(([A, B]) => [A.charCodeAt(0) - 65, B.charCodeAt(0) - 88]);

            let score = 0;
            for (const [A, B] of rounds) {
                if ((A + 1) % 3 === B) {
                    // win
                    score += 6;
                } else if (A === B) {
                    // draw
                    score += 3;
                } else {
                    // loss
                    score += 0;
                }

                // move score
                score += [1, 2, 3][B];
            }

            return score;
        },
        (input) => {
            const rounds = input.map((r) => r.split(" ")).map(([A, B]) => [A.charCodeAt(0) - 65, B.charCodeAt(0) - 88]);

            let score = 0;
            for (const [A, W] of rounds) {
                let B = -1;
                if (W === 2) {
                    B = (A + 1) % 3;
                    score += 6;
                } else if (W === 1) {
                    B = A;
                    score += 3;
                } else {
                    B = (A + 2) % 3;
                    score += 0;
                }
                score += [1, 2, 3][B];
            }

            return score;
        },
    ],
} as PuzzleModel<number>;
