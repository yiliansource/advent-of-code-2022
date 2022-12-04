import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { InputReader, PuzzleRunner, TPuzzleInput } from "./utils";

const argv = yargs(hideBin(process.argv))
    .option("days", {
        alias: "d",
        type: "number",
        array: true,
        description: "The day(s) of the puzzle(s) to run. Defaults to the current day of the month.",
    })
    .option("parts", {
        alias: "p",
        type: "number",
        array: true,
        description: "The part of the puzzle to run. Defaults to '1,2', so all.",
    })
    .option("test", {
        type: "boolean",
        default: false,
        describe: "Whether to run in test mode. Defaults to 'false'.",
    })
    .parseSync();

const days = argv.days || [new Date().getDate()];
const parts = argv.parts || [1, 2];
const isTest = argv.test;

const inputReader = new InputReader();

console.log(chalk.bold.yellow("\n🌲 Advent Of Code 2022 🌲\n"));
for (const day of days) {
    console.log(`${chalk.gray.dim("•")} ${chalk.bold.blue("Day %d")}`, day);

    let puzzle: PuzzleRunner | null = null;
    try {
        puzzle = new PuzzleRunner(day);
    } catch (e) {
        console.log(`  ${chalk.red("No puzzle model loadable.")}`);
        continue;
    }

    let input: TPuzzleInput | null = null;
    try {
        input = inputReader.readLines(day, isTest);
    } catch {
        console.log(`  ${chalk.red("No input loadable.")}`);
        continue;
    }

    for (const part of parts) {
        console.log(`  ${chalk.gray.dim("•")} ${chalk.cyanBright("Part %d")}`, part);
        const output = puzzle.solvePart(input, part);

        if (!isTest) {
            console.log(`    ${chalk.yellow("→")} ${output}`);
        } else {
            const expected = puzzle.getExpectedOutput(part);
            if (output == expected) {
                console.log(`    ${chalk.green("✓")} Passed.`);
            } else {
                console.log(`    ${chalk.red("✗")} Failed. Expected ${expected}, got ${chalk.bold(output)}.`);
            }
        }
    }
}
console.log();
