const signalCtx = document.getElementById("signal").getContext("2d");
const transformCtx = document.getElementById("transform").getContext("2d");

const signal = new Array(256).fill(0);

const drawSignal = () => {
    signalCtx.clearRect(0, 0, signalCtx.canvas.width, signalCtx.canvas.height);
    signalCtx.beginPath();
    for(let t = 0; t < signal.length; t++) {

        const x = t / signal.length * signalCtx.canvas.width,
              y = (signal[t] + 1) / 2 * signalCtx.canvas.height;

        if(t == 0)
            signalCtx.moveTo(x, y);
        else 
            signalCtx.lineTo(x, y);

    }
    signalCtx.stroke();
    signalCtx.closePath();
};

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
    drawSignal();
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
        drawSignal();

    }


});

window.addEventListener("mouseup", event => {
    lasti = -1;
});

drawSignal();