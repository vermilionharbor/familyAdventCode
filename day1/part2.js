const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split('\n').filter(l => l !== "");

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
        let numPasses = Math.floor( magnitude / 100);
        // we know that numPasses will cause that many passes over 0
        numZeros += numPasses;
        if (numPasses) {
            console.log(`numZeros left ${numZeros} numPasses ${numPasses}`)
        }

        if ((position !== 0) && (rotation > position)) {
            // we know we're rotating left past 0
            numZeros ++;
            console.log(`numZeros left ${numZeros}`)
        }

        // left is the same thing as right with (100 - magnitude)
        position += (100 - rotation);
    } else if (direction === 'R') {
        // figure out the magnitude if the rotation is really big
        let rotation = magnitude % 100;
        let numPasses = Math.floor( magnitude / 100);
        // we know that numPasses will cause that many passes over 0
        console.log(`numpasses ${numPasses}`)
        numZeros += numPasses;
        if (numPasses) {
            console.log(`numZeros left ${numZeros}`)
        }

        position += rotation;
        // if we rotated pass 100, we need to increment numZeros
        if (position > 100) {
            numZeros ++;
        }
    }

    // clamp if we've rotated past 0
    position = position % 100;
    console.log(`new position ${position}`);



    // test if we landed on zero
    if (position === 0) {
        numZeros++;
        console.log(`landed at zero ${numZeros}`);
    }
});

console.log(`The solution is ${numZeros}`);

