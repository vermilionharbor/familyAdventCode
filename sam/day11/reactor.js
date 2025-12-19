const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l !== "");

const deviceMap = {};

lines.forEach(l => {
    const terms = l.split(" ");
    const key = terms[0].slice(0, terms[0].length-1);

    const outputs = [];
    for (let i=1; i<terms.length; i++) {
        outputs.push(terms[i]);
    }

    deviceMap[key] = outputs;
});

console.log(deviceMap);

const findPaths = (deviceMap, key, amo) => {
    if (amo[key] !== undefined) {
        return amo[key];
    }
    let sum = 0;
    const outputs = deviceMap[key];
    outputs.forEach(o => {
        if (o === "out") {
            sum++;
        } else {
            sum += findPaths(deviceMap, o, amo);
        }
    })

    amo[key] = sum;
    return sum;
}

const generatePathMap = (deviceMap) => {
    const pathMap = {};
    const amo = {}
    for (const k of Object.keys(deviceMap)) {
        const numPaths = findPaths(deviceMap, k, amo);
        pathMap[k] = numPaths;
    }
    return pathMap;
}

const pathMap = generatePathMap(deviceMap);
console.log(pathMap);
console.log(`paths to out from YOU ${pathMap['you']}`);