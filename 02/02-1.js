const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const rounds = input.split("\n")
    .map(r => r.split(" "))
    .map(([A, B]) => [A.charCodeAt(0) - 65, B.charCodeAt(0) - 88]);
let score = 0;

for (const [A, B] of rounds) {
    const moveScore = [1, 2, 3][B];

    if ((A + 1) % 3 === B) {
        // win
        score += 6;
    }
    else if (A === B) {
        // draw
        score += 3;
    }
    else {
        // loss
        score += 0;
    }

    score += moveScore;
}

console.log(score);