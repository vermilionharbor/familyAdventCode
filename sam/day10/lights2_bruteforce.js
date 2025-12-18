// lights2_bruteforce.js is my first attempt at the brute force search solution
// it runs fine on the test data, but the real input 's run time is not acceptable

const fs = require ('fs');

const lines = fs.readFileSync('test.txt').toString().split("\n").filter(l => l!== "");

const solve = (endState, toggles) => {
    const queue = [];
    let startState = 0;
    queue.push({state: startState, depth: 0});
    let lastDepth = -1;
    const visited = {}
    while(queue.length > 0) {
        const curState = queue.shift();
        // check if we've gotten to the end state
        if (lastDepth !== curState.depth) {
            console.log(`processing depth ${curState.depth} ${curState.state} ${endState} ${queue.length} ${Object.keys(visited).length}`);
            lastDepth = curState.depth;
        }
        if (curState.state === endState) {
            return curState.depth;
        }

        // we haven't gotten to the end state so queue all the subsequent states
        toggles.forEach(t => {
            // next state is the xor
            const nextState = curState.state ^ t

            // only queue the next state if we haven't seen it before
            if (visited[nextState] === undefined) {
                queue.push({
                    state: nextState,
                    depth: curState.depth + 1
                });

                // mark the next state as visited
                visited[nextState] = 1;
            }
        });
    }
}

const getNextState = (state, toggle) => {
    const nextState = [...state];
    toggle.forEach(index => {
        nextState[index] ++;
    });
    return nextState;
}

const toKey = (state) => {
    // walk through state and convert it to _ separated integer
    let result = `${state[0]}`;
    for (let i=1; i<state.length; i++) {
        result += `_${state[i]}`;
    }
    return result;
}

const joltsExceeded = (state, jolts) => {
    for (let i=0; i<state.length; i++) {
        if (state[i] > jolts[i]) {
            return true;
        }
    }
    return false;
}

const solve2 = (jolts, toggles) => {
    const queue = [];
    let startState = jolts.map(x => 0);
    queue.push({state: startState, depth: 0});
    const endState = toKey(jolts);

    const visited = {}

    let maxDepth = 0;
    while(queue.length > 0) {
        const curState = queue.shift();

        // check if we've gotten to the end state
        if (toKey(curState.state) === endState) {
            return curState.depth;
        }

        if (curState.depth > maxDepth) {
            console.log(`depth ${curState.depth} ${Object.keys(visited).length} ${queue.length}`);
            maxDepth = curState.depth;
        }

        // we haven't gotten to the end state so queue all the subsequent states
        toggles.forEach(t => {
            // compute the next state
            const nextState = getNextState(curState.state, t);
            const nextStateKey = toKey(nextState);
            // only queue the next state if we haven't seen it before
            if ((visited[nextStateKey] === undefined) && (!joltsExceeded(nextState, jolts))) {
                queue.push({
                    state: nextState,
                    depth: curState.depth + 1
                });

                // mark the next state as visited
                visited[nextStateKey] = 1;
            }
        });
    }
}


const vectorSum = (presses, toggles, width) => {
    const sums = Array(width).fill(0);

    toggles.forEach((t, index) => {
        const press = presses[index];
        t.forEach(i => {
            sums[i] += press;
        })
    });

    return sums;
}

const isEqual = (sums, jolts) => {
    for (let i=0; i<sums.length; i++) {
        if (sums[i] !== jolts[i]) {
            return false;
        }
    }
    return true;
}

const isExceeds = (sums, jolts) => {
    for (let i=0; i<sums.length; i++) {
        if (sums[i] > jolts[i]) {
            return true;
        }
    }
    return false;
}

const countPresses = (presses) => {
    return presses.reduce((acc, val) => {
        return acc+val;
    }, 0);
}

const dfs = (context, presses, toggles, depth, ranges, jolts, maxJoltIndex) => {
    context.numSearches++;
    // if (context.numSearches % 100000 === 0) {
    //     console.log(`${context.numSearches} ${depth} ${toggles.length}`);
    // }
    // check for termination
    const numPresses = countPresses(presses);
    if (numPresses > context.minPress) {
        // we've exceeded the best solution and don't need to search further
        return;
    }
    const sums = vectorSum(presses, toggles, jolts.length);
    // console.log(`sums ${sums} ${presses}`)
    if (isEqual(sums, jolts)) {
        // we terminated;
        // const numPresses = countPresses(presses);
        console.log(`we found solution of ${numPresses} presses`)
        if (numPresses < context.minPress) {
            context.minPress = numPresses;
        }
        return;
    } else if (isExceeds(sums, jolts)) {
        // we already exceeded the sum
        // console.log(`exceeded ${sums} ${jolts}`);
        return;
    }

    // walk through the maxJoltIndexes
    for (let i=0; i<jolts.length; i++) {
        if ((depth > maxJoltIndex[i]) && (sums[i] < jolts[i])) {
            // we used all the vectors for that jolt stop searching
            return;
        }
    }

    if (depth >= ranges.length) {
        return;
    }

    if (depth > context.maxDepth) {
        console.log(`depth ${depth}`);
        context.maxDepth = depth;
    }

    // we are at depth, search through depth +1
    for (let p=0; p<=ranges[depth]; p++) {
        const nextPresses = [...presses];
        nextPresses[depth] = p;
        dfs(context, nextPresses, toggles, depth+1, ranges, jolts, maxJoltIndex);
    }
}


let numPress = 0;
lines.forEach((l, index) => {
    const terms = l.split(" ");
    console.log(terms);

    const joltState = terms[terms.length-1].slice(1, terms[terms.length-1].length-1);
    console.log(`processing line ${index} ${joltState}`);
    const jolts = joltState.split(",").map(x => parseInt(x, 10));

    let toggles = [];
    for (let i=1; i<terms.length-1; i++) {
        const toggleString = terms[i].slice(1, terms[i].length - 1);
        const toggleTerms = toggleString.split(",");
        const toggleInts = toggleTerms.map(v => parseInt(v, 10));
        toggles.push(toggleInts)
    }

    console.log(toggles);

    const lightMaps = {};
    let j = 0;
    const maxJoltIndex = jolts.map(x => 0);
    while (j < jolts.length) {
        console.log(`processing jolt ${j}`);
        toggles.forEach((t, index) => {
            if(t.includes(j)) {
                console.log(`toggle ${index} affects jolt ${j}`)
                maxJoltIndex[j] = index;

                if (lightMaps[index] === undefined) {
                    lightMaps[index] = {};
                    for (let i=0; i<jolts[j]; i++) {
                        lightMaps[index][i] = 1;
                    }
                } else {
                    // we visited this before, find the intersection
                    const newMap = {};
                    for (let i=0; i<jolts[j]; i++) {
                        if (lightMaps[index][i] !== undefined) {
                            newMap[i] = 1;
                        }
                    }
                    lightMaps[index] = newMap;
                }
            }
        });

        j++;
    }

    // console.log(lightMaps);
    const ranges = [];
    for (const [k, v] of Object.entries(lightMaps)) {
        console.log(`${k} ${Object.entries(v).length}`);
        ranges[parseInt(k, 10)] = Object.entries(v).length;
    }

    let acc = 1;
    for (const v of Object.values(lightMaps)) {
        acc *= Object.keys(v).length
    }
    console.log(`possible ${acc}`);
    console.log(maxJoltIndex);
    // console.log(ranges);
    //
    const presses = ranges.map(x => 0);
    const joltsSum = jolts.reduce((acc, val) => {
        return acc + val
    }, 0);
    // initialize minPress to something too large
    const context = {
        minPress: joltsSum,
        numSearches: 0,
        maxDepth: 0
    }
    dfs(context, presses, toggles, 0, ranges, jolts, maxJoltIndex);
    console.log(context);


});



