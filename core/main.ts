import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import * as fs from "fs";

import { InputReader, PuzzleRunner, TPuzzleInput, createPuzzleFromTemplate } from "./utils";

console.log(chalk.bold.yellow("\n🌲 Advent Of Code 2022 🌲\n"));

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
    .option("create", {
        type: "boolean",
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

if (argv.create) {
    for (const day of days) {
        if (createPuzzleFromTemplate(day)) {
            console.log(`${chalk.green("✓")} Created puzzle environment for day ${day}.`);
        } else {
            console.log(
                `${chalk.red("✗")} Failed to create puzzle environment. ` +
                    `Does an environment for day ${day} already exist?`
            );
        }
    }

    console.log();
    process.exit(0);
}

const statistics = {
    passed: 0,
    failed: 0,
};

const inputReader = new InputReader();
for (const day of days) {
    console.group(`${chalk.gray.dim("•")} ${chalk.bold.blue("Day %d")}`, day);

    let puzzle: PuzzleRunner | null = null;
    try {
        puzzle = new PuzzleRunner(day);
    } catch (e) {
        console.log(chalk.red("No puzzle model loadable."));
        continue;
    }

    let input: TPuzzleInput | null = null;
    try {
        input = inputReader.readLines(day, isTest);
    } catch {
        console.log(chalk.red("No input loadable."));
        continue;
    }

    for (const part of parts) {
        console.group(`${chalk.gray.dim("•")} ${chalk.cyanBright("Part %d")}`, part);
        const output = puzzle.solvePart(input, part);

        if (!isTest) {
            console.log(`${chalk.yellow("→")} ${output}`);
        } else {
            const expected = puzzle.getExpectedOutput(part);
            if (output == expected) {
                console.log(`${chalk.green("✓")} Passed.`);
                statistics.passed++;
            } else {
                console.log(`${chalk.red("✗")} Failed. Expected ${expected}, got ${chalk.bold(output)}.`);
                statistics.failed++;
            }
        }

        console.groupEnd();
    }
    console.groupEnd();
}
console.log();

process.exit(statistics.failed > 0 ? 1 : 0);
