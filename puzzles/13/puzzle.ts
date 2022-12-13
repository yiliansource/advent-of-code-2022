import { PuzzleModel } from "../../core/utils";

export default {
    day: 13,
    expectedOutput: [13, 140],
    solvers: [
        (input) => {
            return input
                .join("\n")
                .split("\n\n")
                .map((g) => g.split("\n").map((p) => JSON.parse(p) as Packet))
                .map(([left, right], i) => (comparePackets(left, right) === 1 ? i + 1 : 0))
                .reduce((acc, cur) => acc + cur, 0);
        },
        (input) => {
            const ordered = input
                .filter(Boolean)
                .map((p) => JSON.parse(p) as Packet)
                .concat([[[2]], [[6]]])
                .sort((left, right) => -comparePackets(left, right))
                .map((p) => JSON.stringify(p));
            const decoderKey = (ordered.indexOf("[[2]]") + 1) * (ordered.indexOf("[[6]]") + 1);
            return decoderKey;
        },
    ],
} as PuzzleModel<number>;

type Packet = number | Packet[];

function comparePackets(left: Packet, right: Packet): number {
    if (typeof left === "number" && typeof right === "number") {
        if (left < right) {
            return 1;
        } else if (left > right) {
            return -1;
        } else {
            return 0;
        }
    } else if (typeof left === "number") {
        return comparePackets([left], right);
    } else if (typeof right === "number") {
        return comparePackets(left, [right]);
    } else {
        for (let i = 0; i < left.length && i < right.length; i++) {
            const result = comparePackets(left[i], right[i]);
            if (result !== 0) {
                return result;
            }
        }
        if (left.length < right.length) {
            return 1;
        } else if (left.length > right.length) {
            return -1;
        } else {
            return 0;
        }
    }
}
