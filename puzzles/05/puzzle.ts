import { PuzzleModel } from "../../core/utils";

export default {
    day: 5,
    expectedOutput: ["CMZ", "MCD"],
    solvers: [
        (input) => {
            const [stacks, instructions] = parseInput(input);

            for (const [count, from, to] of instructions) {
                const pop = stacks[from].splice(stacks[from].length - count, count).reverse();
                stacks[to].push(...pop);
            }

            return stacks.map((s) => s[s.length - 1]).join("");
        },
        (input) => {
            const [stacks, instructions] = parseInput(input);

            for (const [count, from, to] of instructions) {
                const pop = stacks[from].splice(stacks[from].length - count, count);
                stacks[to].push(...pop);
            }

            return stacks.map((s) => s[s.length - 1]).join("");
        },
    ],
} as PuzzleModel<string>;

function parseInput(input: string[]): [stacks: string[][], instructions: [number, number, number][]] {
    const rowCount = input.findIndex((l) => !l.trimStart().startsWith("["));
    const columnLabels = input[rowCount].split(/\s+/).filter(Boolean);
    const columnCount = parseInt(columnLabels[columnLabels.length - 1]);
    const stacks: string[][] = [];
    for (let i = 0; i < columnCount; i++) {
        stacks.push([]);
        for (let j = rowCount - 1; j >= 0; j--) {
            const cursor = i * 4;
            if (input[j][cursor] !== " ") {
                stacks[i].push(input[j][cursor + 1]);
            }
        }
    }

    const instructions = input
        .slice(rowCount + 2)
        .map((r) =>
            Array.from(r.matchAll(/move (\d+) from (\d+) to (\d+)/g))[0]
                .slice(1, 4)
                .map(Number)
        )
        .map(([count, from, to]) => [count, from - 1, to - 1] as [number, number, number]);

    return [stacks, instructions];
}
