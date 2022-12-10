import { PuzzleModel } from "../../core/utils";

export default {
    day: 10,
    expectedOutput: [13140, undefined],
    solvers: [
        (input) => {
            const instructions = input.map((r) => r.split(" ")).map(([cmd, ...args]) => [cmd, args.map(Number)]) as (
                | [string, []]
                | [string, [number]]
            )[];

            const readAt = [20, 60, 100, 140, 180, 220];

            let signalSum = 0;
            const memory: Memory = {
                cycle: 1,
                registerX: 1,
            };

            let currentInstruction: Instruction | null = null;
            let currentInstructionPointer = 0;

            while (memory.cycle <= 240) {
                if (!currentInstruction) {
                    const [cmd, [arg]] = instructions[currentInstructionPointer++];
                    if (cmd === "noop") {
                        currentInstruction = new NoopInstruction();
                    } else if (cmd === "addx") {
                        currentInstruction = new AddxInstruction(arg!);
                    } else {
                        throw new Error(`Invalid instruction ${cmd}.`);
                    }
                }

                if (!currentInstruction.started) {
                    console.log("Start cycle %d: begin executing %s", memory.cycle, currentInstruction.format());
                    currentInstruction.onCycleStart?.(memory);
                }

                currentInstruction.onCycleDuring?.(memory);
                if (readAt.includes(memory.cycle)) {
                    const signalStrength = memory.cycle * memory.registerX;
                    signalSum += signalStrength;
                    console.log("Reading cycle %d: signal strength %d", memory.cycle, signalStrength);
                }

                currentInstruction.onCycleEnd?.(memory);
                if (currentInstruction.done) {
                    console.log(
                        "End of cycle %d: finish executing %s (register X is now %d)",
                        memory.cycle,
                        currentInstruction.format(),
                        memory.registerX
                    );

                    currentInstruction = null;
                }

                memory.cycle++;
                console.log();
            }

            return signalSum;
        },
        (input) => {
            const instructions = input.map((r) => r.split(" ")).map(([cmd, ...args]) => [cmd, args.map(Number)]) as (
                | [string, []]
                | [string, [number]]
            )[];

            const output: string[] = [""];
            const memory: Memory = {
                cycle: 1,
                registerX: 1,
            };

            let currentInstruction: Instruction | null = null;
            let currentInstructionPointer = 0;

            while (memory.cycle <= 240) {
                if (!currentInstruction) {
                    const [cmd, [arg]] = instructions[currentInstructionPointer++];
                    if (cmd === "noop") {
                        currentInstruction = new NoopInstruction();
                    } else if (cmd === "addx") {
                        currentInstruction = new AddxInstruction(arg!);
                    } else {
                        throw new Error(`Invalid instruction ${cmd}.`);
                    }
                }

                if (!currentInstruction.started) {
                    console.log("Start cycle %d: begin executing %s", memory.cycle, currentInstruction.format());
                    currentInstruction.onCycleStart?.(memory);
                }

                currentInstruction.onCycleDuring?.(memory);
                const crtCursor = (memory.cycle - 1) % 40;

                console.log("During cycle %d: CRT draws pixel in position %d", memory.cycle, crtCursor);
                output[output.length - 1] += Math.abs(memory.registerX - crtCursor) <= 1 ? "#" : ".";

                console.log("Current CRT row: %s", output[output.length - 1]);

                currentInstruction.onCycleEnd?.(memory);
                if (currentInstruction.done) {
                    console.log(
                        "End of cycle %d: finish executing %s (register X is now %d)",
                        memory.cycle,
                        currentInstruction.format(),
                        memory.registerX
                    );
                    console.log("Sprite position: %s", "XXX".padStart(memory.registerX + 2, ".").padEnd(40, "."));

                    currentInstruction = null;
                }

                if (memory.cycle % 40 === 0) {
                    output.push("");
                }

                memory.cycle++;
                console.log();
            }

            console.log("Result:");
            console.log(output.join("\n"));
        },
    ],
} as PuzzleModel<number>;

interface Memory {
    cycle: number;
    registerX: number;
}
interface Instruction {
    started: boolean;
    done: boolean;

    onCycleStart?(mem: Memory): void;
    onCycleDuring?(mem: Memory): void;
    onCycleEnd?(mem: Memory): void;
    format(): string;
}

class NoopInstruction implements Instruction {
    public started = false;
    public done = false;

    public onCycleStart(mem: Memory) {
        this.started = true;
    }
    public onCycleEnd(mem: Memory) {
        this.done = true;
    }
    public format(): string {
        return "noop";
    }
}

class AddxInstruction implements Instruction {
    public started = false;
    public done = false;

    private internalCycle = 0;

    public constructor(public value: number) {}

    public onCycleStart(mem: Memory) {
        this.started = true;
    }
    public onCycleEnd(mem: Memory) {
        this.internalCycle++;
        if (this.internalCycle > 1) {
            this.done = true;
            mem.registerX += this.value;
        }
    }
    public format(): string {
        return `addx ${this.value}`;
    }
}
