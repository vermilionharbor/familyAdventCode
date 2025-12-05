const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l!== "");

const boardMap = {}
const height = lines.length;
const width = lines[0].length;
const toIndex = (r, c) => {
    return `${r}_${c}`;
}

lines.forEach((l, r) => {
    for (let c=0; c<l.length; c++) {
        if (l[c] === '@') {
            boardMap[toIndex(r, c)] = '@'
        }
    }
})

const prettyPrint = (board, width, height) => {
    for (let i = 0; i < height; i++) {
        let lineBuf = "";
        for (let j = 0; j < width; j++) {
            if (board[toIndex(i, j)] === "@") {
                lineBuf += "@"
            } else {
                lineBuf += "."
            }
        }
        console.log(lineBuf);
    }
}

const searchRolls = (board, width, height) => {
    const accessMap = {}
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            let numAdjacent = 0;

            if (board[toIndex(i, j)] !== "@") continue;
            // check the 8 adjacent
            if (board[toIndex(i-1, j-1)] === "@") { numAdjacent++ }
            if (board[toIndex(i-1, j)] === "@") { numAdjacent++ }
            if (board[toIndex(i-1, j+1)] === "@") { numAdjacent++ }

            if (board[toIndex(i, j-1)] === "@") { numAdjacent++ }
            if (board[toIndex(i, j+1)] === "@") { numAdjacent++ }

            if (board[toIndex(i+1, j-1)] === "@") { numAdjacent++ }
            if (board[toIndex(i+1, j)] === "@") { numAdjacent++ }
            if (board[toIndex(i+1, j+1)] === "@") { numAdjacent++ }

            if (numAdjacent < 4) {
                accessMap[toIndex(i, j)] = "@";
            }
        }
    }

    return accessMap;
}

prettyPrint(boardMap, width, height);

const part1 = () => {
    const accessMap = searchRolls(boardMap, width, height);
    const numAccessible = Object.keys(accessMap).length;
    console.log(`Part1: num accessible ${numAccessible}`);
}

part1();

const part2 = () => {
    let board = {...boardMap};

    let numAccessible = 0;
    let numRemoved = 0;
    do  {
        const accessMap = searchRolls(board, width, height);
        numAccessible = Object.keys(accessMap).length;
        console.log(`num accessible ${numAccessible}`);
        numRemoved += numAccessible;

        for (let k of Object.keys(accessMap)) {
            // remove the ones that are accessible
            delete board[k];
        }
    } while (numAccessible > 0);

    console.log(`num removed ${numRemoved}`);
}

part2();

