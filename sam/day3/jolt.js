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


const part1 = () => {
    let sum = 0;
    lines.forEach(l => {
        // console.log(l);
        const maxTenMap = createMap(l, l.length - 2);
        // console.log(maxTenMap);
        const maxMap = createMap(l, l.length - 1);
        // console.log(maxMap);
        const jolt = getJolt(maxTenMap, maxMap);
        console.log(`${l} => jolt ${jolt}`);
        sum += jolt;
    });

    console.log(`sum part 1 ${sum}`);
}


const getJolt2 = (maxMaps) => {
    // there are 12 digits now and we will get 12 maps indexed 11..0
    let digit = 11;
    let offset = 0;
    let acc = "";
    // console.log(maxMaps);
    while (digit >= 0) {
        const digitMap = maxMaps[digit];
        const val = digitMap[offset].val;
        // add 1 to start the next cycle one place to the right
        const nextIndex = digitMap[offset].index + 1;
        acc += val.toString();
        digit--;
        offset = nextIndex;
    }

    return parseInt(acc, 10);
}

const part2 = () => {
    let sum = 0;
    lines.forEach(l => {
        // there are 12 digits now
        let maxMaps = {};
        // offset 11 is the most significant digit
        let offset = 11;
        while (offset >= 0) {
            // console.log(`computing map ${offset}`);
            const digitMap = createMap(l, l.length - 1 - offset);
            maxMaps[offset] = digitMap;
            offset --;
        }

        const jolt = getJolt2(maxMaps)

        console.log(`${l} => jolt ${jolt}`);
        sum += jolt;
    });

    console.log(`sum part 2 ${sum}`);
}

console.log(`*** PART 1 ***`);
part1();
console.log(`\n\n*** PART 2 ***`);
part2();