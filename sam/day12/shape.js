const fs = require('fs')

const lines = fs.readFileSync(`input2.txt`).toString().split("\n").filter(l => l!== "");

// size of shapes by inspection
const shapeSizes = [7, 6, 7, 7, 7, 5];

const findAllAreas = (quantities, sizes) => {
    let sum = 0;
    for (let i=0; i<quantities.length; i++) {
        sum += quantities[i]*sizes[i];
    }
    return sum;
}

const findTotalPieces = (quantities) => {
    let sum=0;
    for (let i=0; i<quantities.length; i++) {
        sum += quantities[i];
    }
    return sum;
}

const findNumThreeByThree = (width, height) => {
    const gridWidth = Math.floor(width/3);
    const gridHeight = Math.floor(height/3);
    return gridWidth*gridHeight;
}

let earlyRejects = 0;
let numValid = 0;
let needToSearch = 0;
lines.forEach(l => {
    // console.log(l);
    const terms = l.split(" ");
    const gridVals = terms[0].slice(0, terms[0].length-1).split("x").map(x => parseInt(x, 10));
    let quantities = [];
    for (let i=1; i<terms.length; i++) {
        quantities.push(parseInt(terms[i], 10));
    }
    // console.log(gridVals);
    // console.log(quantities);

    const area = findAllAreas(quantities, shapeSizes);
    const gridArea = gridVals[0]*gridVals[1];

    const bigGridSize = findNumThreeByThree(gridVals[0], gridVals[1]);
    const totalPieces = findTotalPieces(quantities);
    if (area > gridArea) {
        earlyRejects++;
    } else if (totalPieces <= bigGridSize) {
        numValid ++;
        console.log(`** total pieces ${totalPieces},  bigGridSize ${bigGridSize}`)
    } else {
        needToSearch++;
    }


    // console.log(`area ${area}, ${gridArea}, ${area > gridArea} ${totalPieces <= bigGridSize}`);
})

console.log(`early rejects ${earlyRejects}/${lines.length}, ${numValid}, needToSearch ${needToSearch}`);