const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l !== "");


const toIndex = (r, c) => `${r}_${c}`;
const board = {}
let startColumn;
lines.forEach((l, r) => {
    for (let c=0; c<l.length; c++) {
        board[toIndex(r, c)] = l[c];
        if (l[c] === 'S') {
            startColumn = c;
        }
    }
});

const height = lines.length;
const width = lines[0].length;

const prettyPrint = (board, width, height) => {
    for (let r=0; r<height; r++) {
        let lineBuf = "";
        for (let c=0; c<width; c++) {
            lineBuf += board[toIndex(r, c)];
        }
        console.log(lineBuf)
    }

}

prettyPrint(board, width, height);

console.log(`startColumn ${startColumn}`);

let beamMap = {};
beamMap[startColumn] = 1;
let numSplits = 0;
for (let row=1; row<height-1; row++) {
    let nextMap = {};
    let nextRow = row+1;

    // console.log(`processing row ${row} width ${width}`);
    for (let b of Object.keys(beamMap)) {
        // there's a beam at each b
        const col = parseInt(b, 10);
        const val = board[toIndex(nextRow, col)];
        if (val === ".") {
            // beam continues
            nextMap[b] = 1;
        } else if (val === "^") {
            numSplits++;
            console.log(`split at ${row+1}, ${col}`)
            // hit a splitter, split the values
            if (col-1 >= 0) {
                nextMap[col-1] = 1;
            }
            if (col+1 < width) {
                nextMap[col+1] = 1;
            }
        }
    }
    // console.log(`${JSON.stringify(nextMap)} row ${row}`);
    beamMap = nextMap;
}

console.log(`Complete, numSplits ${numSplits}`);