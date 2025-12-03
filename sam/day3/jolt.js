const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l !== "");


const createMap = (l, startIndex) => {
    // scan right to left to find the max for each row starting at that index
    let i = startIndex;
    let maxMap = {}

    let maxIndex = i;
    let max = parseInt(l[i], 10);
    // the last index is already the max
    maxMap[i] = {
        val: max,
        index: i
    }

    i--;

    while (i >= 0) {
        let val = parseInt(l[i], 10);
        if (max > val) {
            val = max;
        } else {
            max = val;
            maxIndex = i;
        }
        maxMap[i] = {val, index: maxIndex};
        i--;
    }

    return maxMap;
}

const getJolt = (maxTenMap, maxOneMap) => {
    // we just read the max 10s digit from reading the first position of the ten map
    // we get the max 1s digit from reading the second position of the one map

    const max10 = maxTenMap[0].val;
    const max10Index = maxTenMap[0].index;
    const maxOnes = maxOneMap[max10Index+1].val;
    return max10 * 10 + maxOnes;
}

let sum = 0;
lines.forEach(l => {
    // console.log(l);
    const maxTenMap = createMap(l, l.length-2);
    // console.log(maxTenMap);
    const maxMap = createMap(l, l.length-1);
    // console.log(maxMap);
    const jolt = getJolt(maxTenMap, maxMap);
    console.log(`${l} => jolt ${jolt}`);
    sum += jolt;
});

console.log(`sum ${sum}`);