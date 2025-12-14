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

let maxX=0, maxY=0;
let minX=points[0].x, minY=points[0].y;

points.forEach(p => {
    if (p.x > maxX) {
        maxX = p.x
    }
    if (p.x < minX) {
        minX = p.x;
    }
    if (p.y  > maxY) {
        maxY = p.y;
    }
    if (p.y < minY) {
        minY = p.y;
    }
})

console.log(`${minX} ${maxX}, ${minY} ${maxY}`);

console.log(`${(maxX - minX) * (maxY - minY)}`);

let i = 1;
let minHorizontal;
let minVertical;

const toIndex = (r, c) => {
    return `${r}_${c}`
}

// create a map of redTiles
const redTiles = {}
points.forEach(p => {
    redTiles[toIndex(p.y, p.x)] = 1;
})

let sliceMap = {};
while (i <= points.length) {
    let p1;

    if (i === points.length) {
        // special case wrap back to point 0
        p1 = points[0];
    } else {
        p1 = points[i];
    }

    let p2 = points[i-1];
    if (p1.x === p2.x) {
        // vertical movement
        const vertical = Math.abs(p1.y - p2.y)
        if ((minVertical === undefined) || (vertical < minVertical)) {
            minVertical = vertical;
        }
        console.log(`vertical ${vertical}`);
        let slice = sliceMap[p1.x];
        if (slice === undefined) {
            sliceMap[p1.x] = [];
            slice = sliceMap[p1.x];
        }
        if (p1.y < p2.y) {
            slice.push({min: p1.y, max: p2.y})
        } else {
            slice.push({min: p2.y, max: p1.y})
        }

    } else if (p1.y === p2.y) {
        const horizontal = Math.abs(p1.x - p2.x);
        if ((minHorizontal === undefined) || (horizontal < minHorizontal)) {
            minHorizontal = horizontal;
        }
        console.log(`horizontal ${horizontal}`);

        if (p1.x < p2.x) {
            for (let x=p1.x; x<=p2.x; x++) {
                let slice = sliceMap[x];
                if (slice === undefined) {
                    sliceMap[x] = [];
                    slice = sliceMap[x];
                }

                // only add horizontals if they are not red tiles
                if (redTiles[toIndex(p1.y, x)] === undefined) {
                    slice.push(p1.y);
                }
            }
        } else {
            for (let x=p2.x; x<=p1.x; x++) {
                let slice = sliceMap[x];
                if (slice === undefined) {
                    sliceMap[x] = [];
                    slice = sliceMap[x];
                }
                // only add horizontals if they are not red tiles
                if (redTiles[toIndex(p1.y, x)] === undefined) {
                    slice.push(p1.y);
                }
            }
        }
    } else {
        console.log(`error`);
    }
    i++;
}

console.log(`minHorizontal ${minHorizontal} minVertical ${minVertical}`);
// console.log(sliceMap);

console.log(Object.keys(sliceMap).length);

// let's sort each of the slice arrays
let sortedSlices = {};
for (const [k, v] of Object.entries(sliceMap)) {
    const sortedSlice = v.sort((a, b) => {
        if ((typeof a === 'number') && (typeof b === 'number')) {
            return a-b;
        } else if (typeof a === 'number') {
            // compare number and a range
            return a - b.min;
        } else if (typeof b === 'number') {
            return a.min -b;
        } else {
            throw "fail here";
        }
    });

    sortedSlices[k] = sortedSlice;
}

console.log(sortedSlices);

const filteredSlices = {}
for (const [k, v] of Object.entries(sortedSlices)) {
    let numSpans = 0;
    let numBefore, numAfter, spanIndex;
    let span;
    v.forEach((item, index) => {
        if (typeof item === "object") {
            numSpans++;

            numBefore = index;
            numAfter = v.length - index - 1;
            spanIndex = index;

            span = {...item}
        }
    })

    let filteredSlice = [];
    if (numSpans > 0) {
        console.log(`slice ${k} has ${numSpans} spans ${JSON.stringify(v)}, ${numBefore}/${numAfter}`);
        let stop = spanIndex;
        let start = spanIndex+1;
        if (numBefore % 2 > 0) {
            // num before is odd, we need to throw out one point
            // make the span "bigger"
            span.min = v[spanIndex-1];
            stop--;
        }
        if (numAfter % 2 > 0) {
            // num after is odd, we need to throw out one point
            // make the span "bigger"
            span.max = v[spanIndex +1];
            start++;
        }
        for (let i=0; i<stop; i+=2) {
            filteredSlice.push({
                min:v[i],
                max: v[i+1]
            })
        }
        filteredSlice.push(span);
        for (let i=start; i<v.length; i+=2) {
            filteredSlice.push({
                min:v[i],
                max: v[i+1]
            })
        }
        console.log(v)
        console.log(filteredSlice);
    } else {
        // there are only vertices
        for (let i=0; i<v.length; i+=2) {
            // just build a new slice with ranges for every 2 points
            filteredSlice.push({
                min: v[i],
                max: v[i+1]
            })
        }
    }
    filteredSlices[k] = filteredSlice
}

const intersectSpan = (x, y, span) => {
    // return true if x and y are within the span
    let start, end;
    if (x < y) {
        start = x;
        end = y;
    } else {
        start = y;
        end = x;
    }

    return (start >= span.min && end <= span.max);
}

const intersectSlice = (x, y, slice) => {
    for (let i=0; i<slice.length; i++) {
        const span = slice[i];
        if (intersectSpan(x, y, span)) {
            return true;
        }
    }
    return false;
}

const isRectangle = (p1, p2, filteredSlices) => {
    let yStart, yEnd, xStart, xEnd;

    if (p1.y < p2.y) {
        yStart = p1.y;
        yEnd = p2.y;
    } else {
        yStart = p2.y;
        yEnd = p1.y
    }

    if (p1.x < p2.x) {
        xStart = p1.x;
        xEnd = p2.x
    } else {
        xStart = p2.x;
        xEnd = p1.x;
    }

    // walk across the xRange and check the y range against the slices
    for (let x=xStart; x<=xEnd; x++) {
        if (intersectSlice(yStart, yEnd, filteredSlices[x]) === false) {
            return false;
        }
    }

    return true;
}

maxSize = 0;
for (let i=0; i<points.length; i++) {
    for (let j=i+1; j<points.length; j++) {
        if (isRectangle(points[i], points[j], filteredSlices)) {
            // find the size of the square
            const size = squareSize(points[i], points[j]);
            if (size > maxSize) {
                maxSize = size;
            }
        }
    }
}

console.log(`maxSize part 2 ${maxSize}`);
