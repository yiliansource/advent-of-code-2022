import { PuzzleModel } from "../../core/utils";

export default {
    day: 3,
    expectedOutput: [157, 70],
    solvers: [
        (input) => {
            return input
                .map((r) => [r.slice(0, r.length / 2).split(""), r.slice(r.length / 2).split("")])
                .map(([a, b]) => a.find((e) => b.includes(e))!)
                .map((o) => o.charCodeAt(0))
                .map((c) => (c >= 97 ? c - 96 : c - 64 + 26))
                .reduce((acc, cur) => acc + cur, 0);
        },
        (input) => {
            const rucksacks = input.map((r) => r.split(""));
            const groups: [string[], string[], string[]][] = [];
            for (let i = 0; i < rucksacks.length; i += 3) {
                groups.push(rucksacks.slice(i, i + 3) as [string[], string[], string[]]);
            }

            const overlap = groups.map(([r1, r2, r3]) => r1.find((e) => r2.includes(e) && r3.includes(e))!);
            const sum = overlap
                .map((o) => o.charCodeAt(0))
                .map((c) => (c >= 97 ? c - 96 : c - 64 + 26))
                .reduce((acc, cur) => acc + cur, 0);

            return sum;
        },
    ],
} as PuzzleModel<number>;
