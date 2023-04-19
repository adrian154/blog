const canvas = document.getElementById("harmonics"),
      ctx = canvas.getContext("2d");

const audioCtx = new AudioContext();

const PALETTE = ["#e3342f", "#f6993f", "#ffed4a", "#38c172", "#4dc0b5", "#3490dc", "#6574cd", "#9561e2", "#f66d9b"];
const INTERVALS = ["octave", "perfect fifth", "perfect fourth", "major third", "minor third", "(...)", "(...)", "major second"];
const draw = harmonic => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Arial";
    for(let i = 1; i <= 9; i++) {
        if(i == harmonic || i == harmonic + 1)
            ctx.strokeStyle = PALETTE[i - 1];
        else
            ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        ctx.fillText(i, 25, i * 50 + 9);
        ctx.beginPath();
        ctx.moveTo(60, i * 50);
        for(let x = 0; x <= 400; x++) {
            ctx.lineTo(60 + x, i * 50 + Math.sin(x / 400 * i * Math.PI) * 12);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(60, i * 50);
        for(let x = 0; x <= 400; x++) {
            ctx.lineTo(60 + x, i * 50 - Math.sin(x / 400 * i * Math.PI) * 12);
        }
        ctx.stroke();
    }
    for(let i = 0; i < 8; i++) {
        if(i + 1 == harmonic) {
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.fillStyle = "#ff0000";
        } else {
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.fillStyle = "#000000";
        }
        ctx.beginPath();
        ctx.moveTo(470, i * 50 + 52);
        ctx.bezierCurveTo(480, i * 50 + 75, 480, i * 50 + 75, 470, i * 50 + 98);
        ctx.stroke();
        ctx.fillText(INTERVALS[i], 490, (i + 1) * 50 + 34);
    }
};

const playNote = (freq, length, attack) => {
    
    const envelope = audioCtx.createGain();
    const time = audioCtx.currentTime;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(0.3, time + attack);
    setTimeout(() => {
        envelope.gain.setValueAtTime(0.3, audioCtx.currentTime);
        envelope.gain.linearRampToValueAtTime(0, audioCtx.currentTime + attack);
    }, 1000 * (length - attack));
    envelope.connect(audioCtx.destination);

    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(envelope);
    osc.start();

};

const play = () => {
    audioCtx.resume();
    let harmonic = 1;
    const run = () => {
        draw(harmonic, harmonic + 1);
        playNote(110 * harmonic, 0.75, 0.1);
        setTimeout(() => {
            playNote(110 * (harmonic + 1), 0.75, 0.1);
            setTimeout(() => {
                playNote(110 * harmonic, 0.5, 0.1);
                playNote(110 * (harmonic + 1), 0.5, 0.1);
                harmonic++;
                if(harmonic < 9) {
                    setTimeout(run, 600);
                } else {
                    setTimeout(draw, 600);
                }
            }, 750);
        }, 650);
    };
    run();
};

draw();