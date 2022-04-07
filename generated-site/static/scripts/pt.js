const drawBG = ctx => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#0000ff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "#ff0000";
    ctx.beginPath();
    ctx.arc(0, ctx.canvas.height, ctx.canvas.width, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
};

// random sampler
(() => {

    const canvas = document.getElementById("pi-mc");
    const ctx = canvas.getContext("2d"); 
    const stats = document.getElementById("pi-stats");
    let hits = 0, total = 0;
        
    drawBG(ctx);

    const sample = () => {
        const x = Math.random(), y = Math.random();
        if(x*x+y*y < 1) {
            hit++;
            ctx.fillStyle = "#ff0000";
        } else {
            ctx.fillStyle = "#0000ff";
        }
        ctx.beginPath();
        ctx.arc(x * canvas.width, (1-y) * canvas.height, 2, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        total++;
        const estimate = 4 * hit / total;
        stats.textContent = `\u03c0 \u2248 4 \u00d7 ${hit}/${total} = ${estimate.toPrecision(5)}, error = ${Number(Math.abs(100 * (estimate - Math.PI) / Math.PI)).toFixed(1)}%`;
        if(total < 300) {
            setTimeout(sample, 30);
        }
    };

    document.getElementById("pi-button").addEventListener("click", () => {
        drawBG(ctx);
        hit = 0; total = 0;
        sample();
    });

})();