const signal = [78,76,77,77,75,74,62,35,23,56,50,26,28,28,29,29,27,26,26,26,26,16,63,43,26,95,67,84,80,65,78,80];

const signalCtx = document.getElementById("signal-only").getContext("2d");
signalCtx.canvas.width = 400;
signalCtx.canvas.height = 200;

const drawSignal = ctx => {
    
    const margin = 10;
    const stepSize = (ctx.canvas.width - margin * 2) / (signal.length - 1);
    
    // draw lines
    for(let i = 0; i < signal.length; i++) {
        ctx.lineTo(stepSize * i + margin, ctx.canvas.height - signal[i] - margin);
    }  

    ctx.stroke();

};

drawSignal(signalCtx);