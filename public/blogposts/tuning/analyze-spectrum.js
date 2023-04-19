const fs = require("fs");
const data = fs.readFileSync("raw-audio.bin");
const samples = new Float32Array(data.buffer);

const spd = [];
for(let freq = 1; freq <= 6000; freq++) {

    let sum = 0;
    for(let i = 0; i < samples.length; i++) {
        sum += Math.cos(i / 48000 * 2 * Math.PI * freq) * samples[i];
    }

    spd[freq - 1] = sum**2;

}

fs.writeFileSync("spectrum.js", "const spectrum = "  + JSON.stringify(spd));