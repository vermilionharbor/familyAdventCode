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

let numInvalid = 0;
let sum = 0;
ranges.forEach(r => {
    const endPoints = r.split("-");
    const start = parseInt(endPoints[0], 10);
    const end = parseInt(endPoints[1], 10);

    console.log(`${start} => ${end}`);

    for (let i=start; i<=end; i++) {
        // console.log(`..${i}`);
        const result = testInvalid(i);
        if (result === true) {
            numInvalid++;
            sum += i;
        }
    }
});

console.log(`found ${numInvalid} sum ${sum}`);



