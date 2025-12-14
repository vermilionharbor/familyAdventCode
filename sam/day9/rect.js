const fs = require('fs');

const lines = fs.readFileSync('input.txt').toString().split("\n").filter(l => l!== "");

const points = [];
lines.forEach(l => {
    const terms = l.split(",");
    const x= parseInt(terms[0], 10);
    const y = parseInt(terms[1], 10);
    points.push ({x, y});
});


const squareSize = (a, b) => {
    const width = Math.abs(a.x - b.x) + 1;
    const height = Math.abs(a.y - b.y) + 1;
    return width * height;
}


let maxSize = 0;
for (let i=0; i<points.length; i++) {
    for (let j=i+1; j<points.length; j++) {
        // find the size of the square
        const size = squareSize(points[i], points[j]);
        if (size > maxSize) {
            maxSize = size;
        }
    }
}

console.log(`max size ${maxSize}`);