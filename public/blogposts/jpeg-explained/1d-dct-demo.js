const signalCtx = document.getElementById("signal").getContext("2d");
const transformCtx = document.getElementById("transform").getContext("2d");

const signal = new Array(256).fill(0);
const approximatedSignal = new Array(signal.length).fill(0);
const transform = new Array(signal.length / 2);

const drawSignal = (ctx, signal, color, text) => {
    
    ctx.strokeStyle = color;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalAlpha = 0.5;
    ctx.font = "14px Consolas";
    ctx.fillText(text, 4, 16);
    ctx.globalAlpha = 1.0;

    ctx.beginPath();
    for(let t = 0; t < signal.length; t++) {

        const x = t / signal.length * ctx.canvas.width,
              y = (signal[t] + 1) / 2 * ctx.canvas.height;

        if(t == 0)
            ctx.moveTo(x, y);
        else 
            ctx.lineTo(x, y);

    }
    ctx.stroke();
    ctx.closePath();
};

const drawOriginal = () => drawSignal(signalCtx, signal, "#ff0000", "Original");

// convert signal canvas coords to (i, y)
const convertCoords = (x, y) => [Math.floor(x / signalCtx.canvas.width * signal.length), y / signalCtx.canvas.height * 2 - 1];

// keep track of last (i, y) so we can lerp between mousemove events
let lasti = -1, lasty;

// handle drawing on the signal canvas
// this is complicated by the fact that we need to interpolate between mouse movement events, or the waveform will come out really weirdly
signalCtx.canvas.addEventListener("mousedown", event => {
    const [i, y] = convertCoords(event.offsetX, event.offsetY);
    signal[i] = y;
    lasti = i;
    lasty = y;
    drawOriginal();
});

signalCtx.canvas.addEventListener("mousemove", event => {

    if(event.buttons == 1 && lasti >= 0) {
        
        const [i, y] = convertCoords(event.offsetX, event.offsetY);
        
        // figure out where to start/end from
        let starti, endi, starty, endy;
        if(i < lasti) {
            starti = i;
            starty = y;
            endi = lasti;
            endy = lasty;
        } else {
            starti = lasti;
            starty = lasty;
            endi = i;
            endy = y;
        }

        // lerp
        for(let index = starti; index < endi; index++) {
            signal[index] = (endy - starty) * (index - starti) / (endi - starti) + starty;
        }

        lasti = i;
        lasty = y;
        drawOriginal();

    }


});

window.addEventListener("mouseup", event => {
    lasti = -1;
    doTransform();
});

drawOriginal();

const doTransform = () => {

    for(let f = 0; f < transform.length; f++) {
        let sum = 0;
        for(let i = 0; i < signal.length; i++) {
            sum += signal[i] * Math.cos(Math.PI / signal.length * f * (i + 0.5));
        }
        transform[f] = sum / transform.length;
    }

    redrawTransform();

};


const slider = document.getElementById("num-cosines");
slider.max = transform.length;
slider.addEventListener("input", event => redrawTransform());

const redrawTransform = () => {

    // draw components
    for(let i = 0; i < approximatedSignal.length; i++) approximatedSignal[i] = 0;

    for(let f = 0; f < slider.value; f++) {
        for(let i = 0; i < signal.length; i++) {
            approximatedSignal[i] += Math.cos(Math.PI / signal.length * f * (i + 0.5)) * transform[f];
        }
    }

    drawSignal(transformCtx, approximatedSignal, "#0000ff", `Approximated (${slider.value} ${slider.value == 1 ? "coefficient" : "coefficients"})`);

}; 