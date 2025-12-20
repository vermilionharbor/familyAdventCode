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

const _findPaths = (dest) => (deviceMap, key, amo) => {
    if (amo[key] !== undefined) {
        return amo[key];
    }
    let sum = 0;
    const outputs = deviceMap[key];
    if (outputs === undefined) {
        return 0;
    }
    outputs.forEach(o => {
        if (o === dest) {
            sum++;
        } else {
            sum += _findPaths(dest) (deviceMap, o, amo);
        }
    })

    amo[key] = sum;
    return sum;
}


const generatePathMap = (dest) => (deviceMap) => {
    const pathMap = {};
    const amo = {}
    const findPaths = _findPaths(dest);
    for (const k of Object.keys(deviceMap)) {
        const numPaths = findPaths(deviceMap, k, amo);
        pathMap[k] = numPaths;
    }
    return pathMap;
}


const run = () => {
    const pathMap = generatePathMap("out")(deviceMap);
    console.log(pathMap);
    console.log(`paths to out from svr ${pathMap['svr']}`);

    const pathMapFft = generatePathMap("fft")(deviceMap);
    const svrToFft = pathMapFft['svr']
    console.log(`paths from svr to fft${svrToFft}`);

    const fftToOut = pathMap['fft'];
    console.log(`paths from fft to out ${fftToOut}`);

    const pathMapDac = generatePathMap("dac")(deviceMap);
    const svrToDac = pathMapDac['svr']
    console.log(`paths from svr to dac ${svrToDac}`);
    const dacToOut = pathMap['dac']
    console.log(`paths from dac to out ${dacToOut}`);

    const fftToDac = pathMapDac['fft']
    console.log(`paths from fft to dac ${fftToDac} `);

    const svrFftDacOut = svrToFft * fftToDac * dacToOut;
    console.log(`paths from svr to out via fft then dac ${svrFftDacOut}`);

    const dacToFft = pathMapFft['dac'];
    console.log(`paths from dac to fft ${dacToFft}`);

    const svrDacFftOut = svrToDac * dacToFft * fftToOut;
    console.log(`paths from svr to out via dac then fft ${svrDacFftOut}`);

    const totalPaths = svrFftDacOut + svrDacFftOut;
    console.log(`total paths ${totalPaths}`);
}

run();
