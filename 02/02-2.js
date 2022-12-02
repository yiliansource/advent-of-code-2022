const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const rounds = input.split("\n")
    .map(r => r.split(" "))
    .map(([A, B]) => [A.charCodeAt(0) - 65, B.charCodeAt(0) - 88]);
let score = 0;

for (const [A, W] of rounds) {
    let B;
    if (W === 2) {
        B = (A + 1) % 3;
        score += 6;
    }
    else if (W === 1) {
        B = A;
        score += 3;
    }
    else {
        B = (A + 2) % 3;
        score += 0;
    }
    score += [1, 2, 3][B];
}

console.log(score);