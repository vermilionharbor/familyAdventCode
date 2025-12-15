const fs = require ('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l!== "");

const lightsToNumber = (light) => {
    // convert a light string to a number
    let place = 1;
    let acc = 0;
    let index = light.length-1;
    while (index >= 0) {
        if (light[index] === "#") {
            acc += place;
        }
        place *=2;
        index--;
    }

    return acc;
}

const toggleToNumber = (toggles, numBits) => {
    let acc = 0;
    for (let i=0; i<toggles.length; i++) {
        acc += Math.pow(2, numBits-toggles[i]-1);
    }
    return acc;
}


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


let numPress = 0;
lines.forEach((l, index) => {
    const terms = l.split(" ");
    console.log(terms);

    const light = terms[0].slice(1, terms[0].length-1);
    const endState = lightsToNumber(light);
    console.log(`processing line ${index} ${light} ${endState}`);

    let toggles = [];
    for (let i=1; i<terms.length-1; i++) {
        const toggleString = terms[i].slice(1, terms[i].length - 1);
        const toggleTerms = toggleString.split(",");
        const toggleInts = toggleTerms.map(v => parseInt(v, 10));
        const result =  toggleToNumber(toggleInts, light.length);
        // console.log(`${toggleInts} => ${result}`);
        toggles.push(result)
    }

    console.log(toggles);

    const result = solve(endState, toggles);
    console.log(`solution ${result}`);
    numPress += result;
});

console.log(`total presses ${numPress}`);

