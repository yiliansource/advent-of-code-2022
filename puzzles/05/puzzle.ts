import { PuzzleModel } from "../../core/utils";

export default {
    day: 5,
    expectedOutput: ["CMZ", "MCD"],
    solvers: [
        (input) => {
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

            const instructions = input.slice(rowCount + 2).map((r) =>
                Array.from(r.matchAll(/move (\d+) from (\d+) to (\d+)/g))[0]
                    .slice(1, 4)
                    .map(Number)
            );

            for (const [count, from, to] of instructions) {
                const pop = stacks[from - 1].splice(stacks[from - 1].length - count, count).reverse();
                stacks[to - 1].push(...pop);
            }

            return stacks.map((s) => s[s.length - 1]).join("");
        },
        (input) => {
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

            const instructions = input.slice(rowCount + 2).map((r) =>
                Array.from(r.matchAll(/move (\d+) from (\d+) to (\d+)/g))[0]
                    .slice(1, 4)
                    .map(Number)
            );

            for (const [count, from, to] of instructions) {
                const pop = stacks[from - 1].splice(stacks[from - 1].length - count, count);
                stacks[to - 1].push(...pop);
            }

            return stacks.map((s) => s[s.length - 1]).join("");
        },
    ],
} as PuzzleModel<string>;

function partitionString(str: string, length: number, gap: number = 0): string[] {
    const output: string[] = [];
    for (let i = 0; i < str.length; i += length + gap) {
        output.push(str.slice(i, i + length));
    }
    return output;
}
