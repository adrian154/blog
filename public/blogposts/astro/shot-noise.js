/* Technically, due to the way we select particles, the process as implemented 
   here is binomially distributed. However, because the number of events is
   fairly large, it approaches a Poisson distribution. */

const canvas = document.getElementById("shot-noise-demo"),
      ctx = canvas.getContext("2d");

const particles = new Set();
let lastParticleY;

// sensor count
let count = 0
    lastCount = 0,
    counts = [],
    frame = -1;

let exposureTime = 60;

const run = () => {

    if(Math.random() < 0.22) {

        let y;
        do {
            y = Math.floor(Math.random() * 10);
        } while(y == lastParticleY);
        lastParticleY = y;

        particles.add({x: 0, y});
 
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw detector
    ctx.fillStyle = "#000000";
    ctx.fillRect(canvas.width - 30, 35, 10, 75);

    ctx.fillStyle = "#ff0000";
    for(const particle of particles) {
        ctx.fillRect(particle.x - 2.5, particle.y * 7 - 2.5 + 40, 5, 5);
        particle.x += 5;
        if(particle.x >= canvas.width - 30) {
            particles.delete(particle);
            count++;
            if(frame < 0) {
                frame = 1;
            }
        }
    }

    if(frame % exposureTime == 0) {
        counts.push(count);
        lastCount = count;
        count = 0;
    }

    // draw line chart
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(20, 160);
    ctx.lineTo(20, 280);
    ctx.lineTo(580, 280);
    ctx.stroke();
    ctx.closePath();

    const max = Math.max(...counts);
    ctx.strokeStyle = "#0000ff";
    ctx.beginPath();
    for(let i = 0; i < counts.length; i++) {
        const x = i / Math.max(counts.length, 20) * 560 + 20,
              y = 280 - counts[i]/max*110;
        if(i == 0)
            ctx.moveTo(x, y);
        else
            ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();

    // compute statistics
    const mean = counts.reduce((a,c) => a + c, 0) / counts.length,
          stddev = Math.sqrt(counts.reduce((a,c) => a + (c - mean)**2, 0) / (counts.length - 1));
    ctx.fillStyle = "#000000";
    ctx.font = "16px sans-serif";
    ctx.fillText(`count=${lastCount}, \u03bc=${Number(mean || 0).toFixed(1)}, \u03c3=${Number(stddev || 0).toFixed(1)}, SNR=${Number(mean/stddev || 0).toFixed(1)}`, 20, 140);

    if(frame >= 0) {
        frame++;
    }
    requestAnimationFrame(run);

};

const updateText = () => document.getElementById("exposure-time-text").textContent = exposureTime/60+"s";
updateText();

document.getElementById("exposure-time").addEventListener("input", event => {
    counts = [];
    count = 0;
    frame = -1;
    exposureTime = event.target.value * 60;
    updateText();
});

let running = false;
ctx.font = "64px sans-serif";
ctx.fillText("click to start demo", 16, 64);
canvas.addEventListener("click", () => {
    if(!running) {
        running = true;
        run();
    }
});