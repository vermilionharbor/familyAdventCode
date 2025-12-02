const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("/n").filter(l => l !=="");

const ranges = lines[0].split(",");

const testInvalid = (x) => {
    const val = x.toString();

    // exclude odd values
    if ((val.length % 2) !== 0) {
        return false;
    }

    const index = val.length / 2
    const left = val.slice(0, index);
    const right = val.slice(index);
    // console.log(`.. testing ${left} ${right}`);

    // string compare the sides, if they are the same, it's invalid
    if (left === right) {
        console.log(` ${x} is invalid`)
        return true;
    }
    return false;
}

const testInvalid2 = (x) => {
    const val = x.toString();
    const endLoop = Math.floor(val.length / 2);

    // we loop over substring lengths up to 1/2 of the original string length
    for (let width = 1; width <= endLoop; width++) {
        // exclude odd values where width doesn't divide evenly
        if ((val.length % width) !== 0) {
            continue;
        }

        let testMap = {};
        // loop over string and insert it into our map
        let start = 0;
        while ((start < val.length) && ((Object.keys(testMap)).length < 2)) {
            const end = start + width;
            const subString = val.slice(start, end);
            testMap[subString] = 1;
            start += width;
        }

        if ((Object.keys(testMap)).length === 1) {
            // this is a repetition of 1 pattern
            console.log(`  ${val} is invalid for part2`)
            return true;
        }
    }

    return false;
}

let numInvalid = 0;
let sum = 0;
let numInvalid2 = 0;
let sum2 = 0;
ranges.forEach(r => {
    const endPoints = r.split("-");
    const start = parseInt(endPoints[0], 10);
    const end = parseInt(endPoints[1], 10);

    console.log(`${start} => ${end}`);

    for (let i=start; i<=end; i++) {
        // console.log(`..${i}`);
        // run the part 1 algorithm
        const result = testInvalid(i);
        if (result === true) {
            numInvalid++;
            sum += i;
        }

        // run the part 2 algorithm
        const result2 = testInvalid2(i);
        if (result2 === true) {
            numInvalid2 ++;
            sum2 += i;
        }
    }
});

console.log(`found ${numInvalid} sum ${sum}`);
console.log(`part2... found ${numInvalid2} sum ${sum2}`)



