const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l!== "");

const points = [];

lines.forEach(l => {
    const terms = l.split (',');
    const x = parseInt(terms[0], 10);
    const y = parseInt(terms[1], 10);
    const z = parseInt(terms[2], 10);

    points.push({
        x,y,z
    });
})

// console.log(points);

const toKey = (x, y) => {
    return `${x}_${y}`
}

const keyToIndex = (key) => {
    const terms = key.split("_");
    const x = parseInt(terms[0], 10);
    const y = parseInt(terms[1], 10);
    return [x, y];
}

const distance = (a, b) => {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) +
        (a.y - b.y) * (a.y - b.y) +
        (a.z - b.z) * (a.z - b.z)
    );
}

const distMap = {};
for (let i=0; i<points.length; i++) {
    for (let j=i+1; j<points.length; j++) {
        const dist = distance(points[i], points[j]);
        // console.log(`${i}=>${j}  ${dist}`);
        distMap[toKey(i, j)] = dist;
    }
}

const entries = [];
for (const [k, v] of Object.entries(distMap)) {
    entries.push({
        key: k,
        value: v
    });
}

// console.log(entries);

const testFindSmallest = () => {
    let smallest = entries[0].value;
    let smallest_index = 0;
    entries.forEach((x, index) => {
        if (x.value < smallest) {
            smallest = x.value;
            smallest_index = index;
        }
    })

    console.log(`${smallest_index} ${smallest} ${entries[smallest_index].key}`);

    const [x, y] = keyToIndex(entries[smallest_index].key)

    console.log(`${x} ${y} ${JSON.stringify(points[x])} ${JSON.stringify(points[y])}`);
}

const prettyPrint = (points, entries, index) => {
    const [x, y] = keyToIndex(entries[index].key)

    console.log(`${x} ${y} ${JSON.stringify(points[x])} ${JSON.stringify(points[y])}`);
}
const sortedEntries = entries.sort((a, b) => {
    return a.value - b.value;
});

const solve = (points, sortedEntries, count) => {
    const circuitMap = {}
    let nextCircuit = 0

    // walk through count connections
    for (let i=0; i<count; i++) {
        const [x, y] = keyToIndex(sortedEntries[i].key);

        // check the two points if they are both not part of a circuit connect them
        if ((circuitMap[x] === undefined) && (circuitMap[y] === undefined)) {
            circuitMap[x] = nextCircuit;
            circuitMap[y] = nextCircuit;
            nextCircuit++;
        } else if (circuitMap[x] === undefined) {
            // y undefined, connect it to x
            circuitMap[x] = circuitMap[y]
        } else if (circuitMap[y] === undefined) {
            // x undefined, connect it to y
            circuitMap[y] = circuitMap[x];
        } else if (circuitMap[x] === circuitMap[y]) {
            // they are the same, do nothing
        } else if (circuitMap[x] !== circuitMap[y]) {
            // they are different,  we need to walk through the map and unify
            // under one circuit
            let nextVal = circuitMap[x];
            let target = circuitMap[y];
            for (let k of Object.keys(circuitMap)) {
                if (circuitMap[k] === target) {
                    circuitMap[k] = nextVal;
                }
            }
        }
    }

    // at this point the circuitMap should contain all the circuits
    // walk through it and create a new map with circuit sizes
    const circuitSizes = {};

    for (const [k, v] of Object.entries(circuitMap)) {
        if (circuitSizes[v] === undefined) {
            circuitSizes[v] = 1;
        } else {
            circuitSizes[v] = circuitSizes[v] + 1;
        }
    }

    console.log(JSON.stringify(circuitSizes));

    // now we sort the circuit sizes
    const largestCircuits = Object.values(circuitSizes).sort((a, b) => b-a);

    console.log(largestCircuits);

    const answer = largestCircuits[0] * largestCircuits[1] * largestCircuits[2]
    console.log(`product ${answer}`);
}

solve(points, sortedEntries, 1000);