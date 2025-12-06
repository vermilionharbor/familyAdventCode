const fs = require('fs');

const lines = fs.readFileSync(`input.txt`).toString().split("\n").filter(l => l !== "");


console.log(lines);

const operators = lines[lines.length-1];

console.log(`operators`);
console.log(operators);

// we need to walk down columns for this exercise
let width = 0;
lines.forEach(l => {
    if (l.length > width) {
        width = l.length;
    }
});

const height = lines.length-1;

console.log(`width ${width}, height, ${height}`)


const getColumn = (lines, col, height) => {
    // return a string that accumulates column col
    let acc = "";
    for (let r = 0; r<height; r++) {
        if (lines[r][col]) {
            acc += lines[r][col]
        }
    }

    return acc.trim();
}

let c = 0;
let acc;
let op;
let sum = 0;
for (c=0; c<width; c++) {
    if (operators[c] && (operators[c] !== " ")) {
        console.log(`${operators[c]}`);
        op = operators[c];
        if (op === "*") {
            acc = 1;
        } else {
            acc = 0;
        }
    }
    const column = getColumn(lines, c, height)

    if (column !== "") {
        console.log(`${column}`);
        let operand = parseInt(column, 10);
        // console.log(operand);
        if (op === '*') {
            acc *= operand;
            // console.log(`acc ${acc}`)
        } else {
            acc += operand;
            // console.log(`acc ${acc}`)
        }

    } else {
        console.log(`acc ${c} ${acc}`);
        sum += acc;
    }
}

console.log(`acc ${c} ${acc}`);
sum += acc;
console.log(`sum part2 ${sum}`);