const fs = require('fs');

const lines = fs.readFileSync(`input.txt`).toString().split("\n").filter(l => l !== "");

const equations = [];
lines.forEach(l => {
    let terms = l.split(" ").filter(t => t !== "");
    console.log(terms);
    equations.push(terms);
});

const operators = equations[equations.length-1];

console.log(`operators`);
console.log(operators);

const operands = equations.slice(0, equations.length-1);
console.log(operands);

const width = operands.length;
const height = operands.length;

let sum = 0;
operators.forEach((op, index) => {
    let acc = parseInt(operands[0][index], 10);
    for (let i=1; i<height; i++) {
        const term = parseInt(operands[i][index], 10);
        if (op === "*") {
            acc = acc * term;
        } else if (op === "+") {
            acc = acc + term;
        }
    }
    console.log(`acc ${index} => ${acc}`);
    sum += acc;
})

console.log(`sum part 1 ${sum}`);