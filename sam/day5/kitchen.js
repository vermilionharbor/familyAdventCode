const fs = require('fs')

const lines = fs.readFileSync('input.txt').toString().split("\n");

let index = 0;
let ranges = [];
while (lines[index] !== "") {
    console.log(lines[index]);
    const terms = lines[index].split("-");
    ranges.push({
        min: parseInt(terms[0], 10),
        max: parseInt(terms[1], 10)
    });
    index++;
}
let inputs = [];
console.log('inputs');
while(index < lines.length) {
    inputs.push(lines[index]);
    console.log(lines[index])
    index++;
}

const testFresh = (i, ranges) => {
    let index = 0;
    for (index = 0; index<ranges.length; index++) {
        if (i >= ranges[index].min && i <= ranges[index].max) {
            return true;
        }
    }
    return false;
}


let numFresh = 0;
inputs.forEach(i => {
    const result = testFresh(i, ranges);
    if (result === true) {
        console.log(`${i} is fresh`)
        numFresh++;
    }
})
console.log(`numFresh ${numFresh}`);

