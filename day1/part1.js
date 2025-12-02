const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split('\n').filter(l => l !== "");

console.log(lines);

let position = 50;
let numZeros = 0;

lines.forEach(l => {
    const direction = l[0];
    const rawMagnitude = l.slice(1);
    const magnitude = parseInt(rawMagnitude, 10);
    console.log(`${direction} .. ${magnitude}`);

    // move the dial
    if (direction === 'L') {
        // figure out the magnitude if the rotation is really big
        let rotation = magnitude % 100;
        // left is the same thing as right with (100 - magnitude)
        position += (100 - rotation);
    } else if (direction === 'R') {
        // figure out the magnitude if the rotation is really big
        let rotation = magnitude % 100;
        position += rotation;
    }

    // clamp if we've rotated past 0
    position = position % 100;
    console.log(`new position ${position}`);

    // test if we landed on zero
    if (position === 0) {
        numZeros++;
    }
});

console.log(`The solution is ${numZeros}`);

