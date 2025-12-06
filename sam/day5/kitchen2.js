const fs = require('fs')

const lines = fs.readFileSync('input.txt').toString().split("\n");

let index = 0;
let ranges = [];
let points = [];

while (lines[index] !== "") {
    console.log(lines[index]);
    const terms = lines[index].split("-");
    const min = parseInt(terms[0], 10);
    const max = parseInt(terms[1], 10);
    ranges.push({
        min,
        max,
    });
    points.push({val: min, type: "min"});
    points.push({val: max, type: "max"});
    index++;
}

console.log(points);

points = points.sort((a, b) => {
    return a.val - b.val;
});

console.log(points);

// walk down the list, and count the min and maxes,   when the min and maxes match perfectly, we can
// count the range

let i = 0;
let curMin = points[0].val;
let rangeStack = 0;
let sum = 0;
let lastVisited = 0;
let sumCleared = true;

while (i < points.length) {
    let curVal = points[i].val
    do {
        if (points[i].type === "min") {
            if ((rangeStack === 0) && (sumCleared === true)) {
                console.log(`started a range at ${points[i].val}, ${rangeStack}`);
                curMin = points[i].val;
                sumCleared = false;
            }
            rangeStack++;
        } else {
            rangeStack--;
        }
        lastVisited = points[i].val;
        i++;
    } while ((i < points.length) && (points[i].val === curVal))

    if (rangeStack === 0) {
        // we have completed the range, count the members
        sum += (lastVisited - curMin + 1);
        console.log(`ended a range at ${points[i-1].val}, ${rangeStack}`)
        sumCleared = true;
    }
}

console.log(`sum ${sum}`);


