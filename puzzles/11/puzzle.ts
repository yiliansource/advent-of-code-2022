import { PuzzleModel } from "../../core/utils";

export default {
    day: 11,
    expectedOutput: [10605, 2713310158],
    solvers: [
        (input) => {
            const monkeys = parseMonkeys(input);
            const inspections: number[] = monkeys.map((_) => 0);

            for (let round = 1; round <= 20; round++) {
                console.group(`Round ${round}:`);
                for (let i = 0; i < monkeys.length; i++) {
                    console.group(`Monkey ${i}:`);
                    const monkey = monkeys[i];
                    while (monkey.items.length > 0) {
                        inspections[i]++;
                        console.group(`Monkey inspects an item with a worry level of ${monkey.items[0]}.`);
                        monkey.items[0] = monkey.operation(monkey.items[0]);
                        console.log(`Worry level is changed to ${monkey.items[0]}.`);
                        monkey.items[0] = Math.floor(monkey.items[0] / 3);
                        console.log(`Monkey gets bored with item. Worry level is decreased to ${monkey.items[0]}.`);
                        const divisible = monkey.items[0] % monkey.test.divisibleBy === 0;
                        console.log(`Compare result evaluated to ${divisible ? "true" : "false"}.`);
                        const target = divisible ? monkey.test.ifTrue : monkey.test.ifFalse;
                        console.log(`Item with worry level ${monkey.items[0]} is thrown to monkey ${target}.`);
                        monkeys[target].items.push(monkey.items.shift()!);
                        console.groupEnd();
                    }

                    console.groupEnd();
                    console.log();
                }

                console.groupEnd();
                console.log();
                console.log(`After round ${round}, the monkeys are holding items with these worry levels:`);
                console.log(monkeys.map((m, i) => `Monkey ${i}: ` + m.items.join(", ")).join("\n"));
                console.log();
            }

            console.log(inspections.map((insp, i) => `Monkey ${i} inspected items ${insp} times.`).join("\n"));

            const monkeyBusiness = inspections
                .sort((a, b) => b - a)
                .slice(0, 2)
                .reduce((acc, cur) => acc * cur, 1);

            return monkeyBusiness;
        },
        (input) => {
            const monkeys = parseMonkeys(input);
            const inspections: number[] = monkeys.map((_) => 0);

            const normalizationModulo = monkeys.map((m) => m.test.divisibleBy).reduce((acc, cur) => acc * cur, 1);

            for (let round = 1; round <= 10000; round++) {
                for (let i = 0; i < monkeys.length; i++) {
                    const monkey = monkeys[i];
                    while (monkey.items.length > 0) {
                        inspections[i]++;
                        monkey.items[0] = monkey.operation(monkey.items[0]);
                        monkey.items[0] %= normalizationModulo;
                        const divisible = monkey.items[0] % monkey.test.divisibleBy === 0;
                        const target = divisible ? monkey.test.ifTrue : monkey.test.ifFalse;
                        monkeys[target].items.push(monkey.items.shift()!);
                    }
                }
            }

            console.log(inspections.map((insp, i) => `Monkey ${i} inspected items ${insp} times.`).join("\n"));

            const monkeyBusiness = inspections
                .sort((a, b) => b - a)
                .slice(0, 2)
                .reduce((acc, cur) => acc * cur, 1);

            return monkeyBusiness;
        },
    ],
} as PuzzleModel<number>;

type UnaryOperation = (num: number) => number;

interface Monkey {
    items: number[];
    operation: UnaryOperation;
    test: {
        divisibleBy: number;
        ifTrue: number;
        ifFalse: number;
    };
}

function parseMonkeys(input: string[]): Monkey[] {
    const monkeys: Monkey[] = [];
    for (let i = 0; i < input.length; i += 7) {
        monkeys.push(parseMonkey(input.slice(i, i + 6)));
    }
    return monkeys;
}
function parseMonkey(input: string[]): Monkey {
    return {
        items: input[1].slice("  Starting items: ".length).split(", ").map(Number),
        operation: parseOperation(input[2].slice("  Operation: ".length)),
        test: {
            divisibleBy: parseInt(input[3].slice("  Test: divisible by ".length)),
            ifTrue: parseInt(input[4].slice("    If true: throw to monkey ".length)),
            ifFalse: parseInt(input[5].slice("    If true: throw to monkey ".length)),
        },
    };
}
function parseOperation(input: string): UnaryOperation {
    const expr = input.slice("new = ".length);
    return Function("old", `return (${expr});`) as UnaryOperation;
}
