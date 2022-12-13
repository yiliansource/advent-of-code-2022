import fs from "fs";
import path from "path";

export class InputReader {
    public readLines(day: number, isTest: boolean): string[] {
        const filename = `input${isTest ? ".test" : ""}.txt`;
        const filepath = path.join(__dirname, `../puzzles/${day.toString().padStart(2, "0")}/`, filename);
        return fs.readFileSync(filepath, "utf8").split("\n");
    }
}

export type TPuzzleInput = string[];
export type TPuzzleSolver<TPuzzleOutput> = (input: TPuzzleInput) => TPuzzleOutput;

export interface PuzzleModel<TPuzzleOutput extends unknown = unknown> {
    readonly day: number;
    readonly expectedOutput: TPuzzleOutput[];
    readonly solvers: TPuzzleSolver<TPuzzleOutput>[];
}

export class PuzzleRunner<TPuzzleOutput extends unknown = unknown> {
    private model: PuzzleModel<TPuzzleOutput>;

    public constructor(day: number) {
        const modelPath = path.join(__dirname, "..", "puzzles", day.toString().padStart(2, "0"), "puzzle.ts");
        if (fs.existsSync(modelPath)) {
            this.model = require(modelPath).default as PuzzleModel<TPuzzleOutput>;
        } else {
            throw new Error("No model found.");
        }
    }

    public solvePart(input: TPuzzleInput, part: number): TPuzzleOutput {
        const solver = this.model.solvers[part - 1]!;
        const result = solver(input);
        return result;
    }

    public getExpectedOutput(part: number): TPuzzleOutput {
        return this.model.expectedOutput[part - 1];
    }
}

export function createPuzzleFromTemplate(day: number): boolean {
    const environmentPath = path.join(__dirname, "..", "puzzles", day.toString().padStart(2, "0"));
    if (fs.existsSync(environmentPath)) {
        return false;
    }

    fs.mkdirSync(environmentPath, { recursive: true });
    fs.copyFileSync(path.join(__dirname, "puzzle.ts.template"), path.join(environmentPath, "puzzle.ts"));
    fs.writeFileSync(path.join(environmentPath, "input.txt"), "");
    fs.writeFileSync(path.join(environmentPath, "input.test.txt"), "");

    return true;
}
