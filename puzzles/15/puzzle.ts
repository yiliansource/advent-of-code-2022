import { PuzzleModel } from "../../core/utils";

export default {
    day: 15,
    expectedOutput: [26, 56000011],
    solvers: [
        (input) => {
            const testRow = parseInt(input[0]);
            const sensorBeaconPairs: [[number, number], [number, number]][] = input
                .slice(2)
                .map((r) =>
                    /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
                        .exec(r)!
                        .slice(1)
                        .map(Number)
                )
                .map(([sx, sy, bx, by]) => [
                    [sx, sy],
                    [bx, by],
                ]);
            const sensorDistancePairs: [[number, number], number][] = sensorBeaconPairs.map(([[sx, sy], [bx, by]]) => [
                [sx, sy],
                dist(sx, sy, bx, by),
            ]);
            const beaconXsOnY = sensorBeaconPairs
                .map(([[sx, sy], [bx, by]]) => [bx, by])
                .filter(([bx, by]) => by === testRow)
                .map(([bx, by]) => bx);

            const minX = Math.min(...sensorDistancePairs.map(([[sx, sy], d]) => sx - d));
            const maxX = Math.max(...sensorDistancePairs.map(([[sx, sy], d]) => sx + d));

            let count = 0;
            for (let x = minX; x <= maxX; x++) {
                if (
                    !beaconXsOnY.includes(x) &&
                    sensorDistancePairs.some(([[sx, sy], d]) => dist(x, testRow, sx, sy) <= d)
                ) {
                    count++;
                }
            }

            return count;
        },
        (input) => {
            const maxCoord = parseInt(input[1]);
            const sensorBeaconPairs: [[number, number], [number, number]][] = input
                .slice(2)
                .map((r) =>
                    /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
                        .exec(r)!
                        .slice(1)
                        .map(Number)
                )
                .map(([sx, sy, bx, by]) => [
                    [sx, sy],
                    [bx, by],
                ]);
            const sensorDistancePairs: [[number, number], number][] = sensorBeaconPairs.map(([[sx, sy], [bx, by]]) => [
                [sx, sy],
                dist(sx, sy, bx, by),
            ]);

            for (let y = 0; y <= maxCoord; y++) {
                // build intervals that are covered by sensors
                const intervals: [number, number][] = [];
                for (const [[sx, sy], d] of sensorDistancePairs) {
                    const distanceToRow = Math.abs(sy - y);
                    if (distanceToRow <= d) {
                        const delta = d - distanceToRow;
                        intervals.push([sx - delta, sx + delta]);
                    }
                }

                // remove redundant (overlapping) intervals
                const sortedIntervals = intervals.sort(([a1, b1], [a2, b2]) => a1 - a2);
                for (let i = 1; i < sortedIntervals.length; i++) {
                    if (sortedIntervals[i][1] <= sortedIntervals[i - 1][1]) {
                        sortedIntervals.splice(i, 1);
                        i--;
                    }
                }

                // check if intervals have gaps
                for (let i = 0; i < sortedIntervals.length - 1; i++) {
                    if (sortedIntervals[i][1] + 1 < sortedIntervals[i + 1][0]) {
                        console.log("x,y: %d,%d", sortedIntervals[i][1] + 1, y);
                        return (sortedIntervals[i][1] + 1) * 4000000 + y;
                    }
                }
            }
        },
    ],
} as PuzzleModel<number>;

function dist(x1: number, y1: number, x2: number, y2: number): number {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
