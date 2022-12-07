import { PuzzleModel } from "../../core/utils";

export default {
    day: 7,
    expectedOutput: [95437, 24933642],
    solvers: [
        (input) => {
            const root = parseFilesystem(input);

            function sumChildFileSizesRecursive(dir: FSEntity): number {
                let sum = 0;
                for (const child of dir.children!) {
                    if (child.type === FSType.FILE) {
                        sum += child.size!;
                    }
                    if (child.type === FSType.DIR) {
                        sum += sumChildFileSizesRecursive(child);
                    }
                }
                return sum;
            }
            function sumRelevantDirectoriesRecursive(dir: FSEntity): number {
                let sum = 0;

                let dirSize = sumChildFileSizesRecursive(dir);
                if (dirSize <= 100_000) {
                    sum += dirSize;
                }

                for (const child of dir.children!) {
                    if (child.type === FSType.DIR) {
                        sum += sumRelevantDirectoriesRecursive(child);
                    }
                }

                return sum;
            }

            return sumRelevantDirectoriesRecursive(root);
        },
        (input) => {
            const root = parseFilesystem(input);

            function sumChildFileSizesRecursive(dir: FSEntity): number {
                let sum = 0;
                for (const child of dir.children!) {
                    if (child.type === FSType.FILE) {
                        sum += child.size!;
                    }
                    if (child.type === FSType.DIR) {
                        sum += sumChildFileSizesRecursive(child);
                    }
                }
                return sum;
            }

            const totalSize = 70_000_000;
            const updateSpace = 30_000_000;
            const usedSize = sumChildFileSizesRecursive(root);
            const unusedSize = totalSize - usedSize;
            const requiredSize = updateSpace - unusedSize;

            function findMinimalViableDirectoryRecursive(dir: FSEntity): number {
                let minSize = sumChildFileSizesRecursive(dir);

                for (const child of dir.children!) {
                    if (child.type === FSType.DIR) {
                        const childSize = findMinimalViableDirectoryRecursive(child);
                        if (childSize >= requiredSize && childSize < minSize) {
                            minSize = childSize;
                        }
                    }
                }

                return minSize;
            }

            return findMinimalViableDirectoryRecursive(root);
        },
    ],
} as PuzzleModel<number>;

interface FSEntity {
    type: FSType;
    name: string;
    parent: FSEntity | null;
    size?: number;
    children?: FSEntity[];
}

const enum FSType {
    DIR = "DIR",
    FILE = "FILE",
}

function parseFilesystem(input: string[]): FSEntity {
    const root: FSEntity = {
        type: FSType.DIR,
        name: "/",
        parent: null,
        children: [],
    };

    const parsedInput: [string[], string[]][] = [];
    for (let i = 0; i < input.length; i++) {
        const cmd = input[i].slice(2).split(" ");
        const output: string[] = [];
        while (i + 1 < input.length && !input[i + 1].startsWith("$")) {
            output.push(input[i + 1]);
            i++;
        }
        parsedInput.push([cmd, output]);
    }

    let cwd = root;
    for (const [[cmd, ...args], output] of parsedInput) {
        if (cmd === "cd") {
            const dir = args[0];
            if (dir === "/") {
                cwd = root;
            } else if (dir === "..") {
                if (!cwd.parent) throw new Error("Cannot move up further, cwd is root.");
                cwd = cwd.parent;
            } else {
                const newcwd = cwd.children?.find((c) => c.name === dir);
                if (!newcwd) throw new Error("Cannot find requested change directory.");
                cwd = newcwd;
            }
        } else if (cmd === "ls") {
            for (const line of output) {
                const [a, b] = line.split(" ");
                if (a === "dir") {
                    cwd.children!.push({
                        type: FSType.DIR,
                        name: b,
                        children: [],
                        parent: cwd,
                    });
                } else {
                    cwd.children!.push({
                        type: FSType.FILE,
                        name: b,
                        parent: cwd,
                        size: parseInt(a),
                    });
                }
            }
        }
    }

    return root;
}
