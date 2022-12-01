const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

const elfCalories = input.split("\n\n") // split input into elf groups
    .map(g => g.split("\n") // split group into individual calorie packs
        .map(Number) // map strings to numbers
        .reduce((acc, cur) => cur + acc, 0) // sum
    ) // map elf groups to their calorie sums

const top3 = elfCalories.sort((a, b) => b - a).slice(0, 3);
const calorieTotal = top3.reduce((acc, cur) => cur + acc, 0);

console.log(calorieTotal);
