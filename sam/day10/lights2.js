// This is one of the few AoC puzzles that stumped me algorithm wise
// The algorithm here was inspired by Reddit from here
// https://www.reddit.com/r/adventofcode/comments/1pk87hl/2025_day_10_part_2_bifurcate_your_way_to_victory/
// and from the subsequent blog post here by Josiah Winslow
// https://aoc.winslowjosiah.com/solutions/2025/day/10/
// the solution proposed in reddit is elegant and does not require re-learning linear algebra

const fs = require ('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l!== "");

const lightsToNumber = (light) => {
    // convert a light state to a number for hashing
    let place = 1;
    let acc = 0;
    let index = light.length-1;
    while (index >= 0) {
        if (light[index] === 1) {
            acc += place;
        }
        place *=2;
        index--;
    }

    // console.log(`light ${light} => ${acc}`)
    return acc;
}

const lightsToArray = (light) => {
    const result = [];
    for (let i=0; i<light.length; i++) {
        if (light[i] === "#") {
            result.push(1);
        } else {
            result.push(0);
        }
    }
    return result;
}

const statesEqual = (state, target) => {
    for (let i=0; i<state.length; i++) {
        if (state[i] !== target[i]) {
            return false;
        }
    }
    return true;
}

const stateIsZero = (state) => {
    for (let i=0; i<state.length; i++) {
        if (state[i] !== 0) {
            return false;
        }
    }
    return true;
}

const findOdds = (state) => {
    // return an array that has 0 if state is even and 1 if state is odd
    return state.map(val => {
        return val % 2;
    })
}

const useAmoTable = true;

const _findAllPresses = (useAmoTable) => (endState, toggles, amoTable) => {
    // end state is an array of leds or 0s and 1s
    // we need to find all combinations of toggles which result in the endState

    // first check if we computed this result before
    const hash = lightsToNumber(endState);
    if (useAmoTable) {
        if (amoTable[hash] !== undefined) {
            return amoTable[hash];
        }
    }


    // we can do this by running a loop from 0 to 2^(number of bits, number of columns in endState)
    const maxCombination = Math.pow(2, toggles.length);

    // console.log(`${toggles.length} => ${maxCombination}`);

    const solutions = [];
    for (let index=0; index <maxCombination; index++) {
        // console.log(`index ${index}`)
        const sums = endState.map(x => 0);
        // console.log(sums);
        const presses = [];
        for (let bit=0; bit<toggles.length; bit++) {
             const t = (index >> bit)&1;
             // console.log(`t ${t}`);
             if (t) {
                 // console.log(`bit ${bit} => ${t}, ${JSON.stringify(toggles[bit])}`)
                 // add toggle[bit] to sums
                 toggles[bit].forEach(z => {
                     sums[z] ++;
                 })
                 presses.push(toggles[bit]);
             }
        }
        // mod the sums to find led state
        for (let j=0; j<endState.length; j++) {
            sums[j] = sums[j] % 2;
        }
        //
        // console.log(`${index} => ${sums}`);
        //
        if (statesEqual(sums, endState)) {
            // found a match
            // console.log(`solution matched ${JSON.stringify(presses)}`);
            solutions.push(presses);
        }
    }

    if (useAmoTable) {
        amoTable[hash] = solutions;
    }
    return solutions;
}

const findAllPresses = _findAllPresses(useAmoTable);

const solvePart1 = (endState, toggles) => {
    const solutions = findAllPresses(endState, toggles, {});

    let min = toggles.length + 1;
    solutions.forEach(s => {
        if (s.length < min) {
            min = s.length;
        }
    })
    return min;
}

const applyPresses = (target, press) => {
    // target is the jolt state
    // press is an array of buttons which are pressed
    // it's actually `anti-press`
    // compute the state that preceded this state had the buttons been pressed, ie) decrement
    const result = [...target];
    press.forEach(button => {
        button.forEach(led => {
            result[led] --;
        })
    })
    return result;
}

const isInvalidState = (state) => {
    // a state is invalid if any terms ever go negative
    for (let i=0; i<state.length; i++) {
        if (state[i] < 0) {
            return true;
        }
    }

    return false;
}

const findMinPresses = (target, toggles, amoTable) => {
    if (stateIsZero(target)) {
        // the zero state is the base case
        return 0;
    }

    // compute the vector where the end state is odd
    const oddLeds = findOdds(target);

    const presses = findAllPresses(oddLeds, toggles, amoTable);

    // console.log(`findMinPresses ${JSON.stringify(target)}`)
    let min = undefined;
    // iterate through each sequence of presses
    presses.forEach(press => {
        // calculate the next state based on the presses
        const prevState = applyPresses(target, press);

        if (isInvalidState(prevState)) {
            // early exit out of loop, return is for node forEach loop, looks like continue
            return;
        }

        // prevState has all leds off (all even).  find the presses that got us to 1/2 of that state
        // leverages our algorithm recursively
        const halfPrev = prevState.map(val => val / 2);

        const halfPressSolution = findMinPresses(halfPrev, toggles, amoTable);
        if (halfPressSolution === undefined) {
            // early exit because this state can not be solved
            return;
        }
        let result = press.length + 2 * halfPressSolution;
        // console.log(`pressLength ${press.length}, halfPressSoln ${halfPressSolution}, ${result}`)
        if ((min === undefined) || (result < min)) {
            min = result;
        }
    });

    // if there were no solutions to reach this state, we returned undefined
    return min;
}


let numPress = 0;
const startTime = new Date();
lines.forEach((l, index) => {
    const terms = l.split(" ");
    console.log(terms);

    const light = terms[0].slice(1, terms[0].length-1);
    const endState = lightsToArray(light);
    const jolts = terms[terms.length-1].slice(1, terms[terms.length-1].length-1).split(",").map(x => parseInt(x, 10));
    console.log(`processing line ${index} ${light} ${endState} {${jolts}}`);

    let toggles = [];
    for (let i=1; i<terms.length-1; i++) {
        const toggleString = terms[i].slice(1, terms[i].length - 1);
        const toggleTerms = toggleString.split(",");
        const toggleInts = toggleTerms.map(v => parseInt(v, 10));
        toggles.push(toggleInts)
    }

    console.log(toggles);

    // const result = solvePart1(endState, toggles);
    // console.log(`result ${index} => ${result}`);
    // numPress += result;
    const result = findMinPresses(jolts, toggles, {});
    console.log(`result ${result}`);
    numPress += result;
});

console.log(`total presses ${numPress}`);
const endTime = new Date();
console.log(`elapsed time ${(endTime - startTime)/1000} seconds`)

