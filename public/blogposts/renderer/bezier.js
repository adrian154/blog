const lerp = (x1, x2, t) => x1 + (x2 - x1) * t;
const lerp2 = (x1, x2, t) => [lerp(x1[0], x2[0], t), lerp(x1[1], x2[1], t)];

const setupBezierDemo = () => {

    const canvas = document.getElementById("bezier-demo");
    const ctx = canvas.getContext("2d");

    const sizeCanvas = () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = canvas.width / 2;
        draw();
    };

    let t = 0.5;

    const draw = () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const ANCHOR1 = [canvas.width * 0.2, canvas.height * 0.9],
        ANCHOR2 = [canvas.width * 0.8, canvas.height * 0.8],
        CONTROL = [canvas.width * 0.4, canvas.height * 0.2];

        // draw lines
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#aaa";
        ctx.beginPath();
        ctx.moveTo(...ANCHOR1);
        ctx.lineTo(...CONTROL);
        ctx.lineTo(...ANCHOR2);
        ctx.stroke();
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(...CONTROL, 3, 0, 2 * Math.PI);
        ctx.fill();

        // draw spline
        ctx.strokeStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(...ANCHOR1);
        ctx.quadraticCurveTo(...CONTROL, ...ANCHOR2);
        ctx.stroke();

        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(...ANCHOR1, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(...ANCHOR2, 3, 0, 2 * Math.PI);
        ctx.fill();

        // draw interpolated line
        const U = lerp2(ANCHOR1, CONTROL, t),
        V = lerp2(CONTROL, ANCHOR2, t);
        
        ctx.strokeStyle = ctx.fillStyle = "#0000ff";
        ctx.beginPath();
        ctx.moveTo(...U);
        ctx.lineTo(...V);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(...U, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(...V, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(...lerp2(U, V, t), 3, 0, 2 * Math.PI);
        ctx.fill();

        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(10, 10, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("control point", 18, 14);
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(10, 27, 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText("anchor point", 18, 31);
        ctx.fillStyle = "rgba(0, 0, 0, 75%)";
        ctx.fillText(`t = ${t.toPrecision(2)}`, 7, 48)

    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    const slider = document.getElementById("bezier-t");
    slider.addEventListener("input", event => {
        console.log(event.target.value, event.target.max);
        t = event.target.value / event.target.max;
        draw();
    });

};

setupBezierDemo();