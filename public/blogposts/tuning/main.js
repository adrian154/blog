const canvas = document.getElementById("harmonics"),
      ctx = canvas.getContext("2d");

const audioCtx = new AudioContext();

canvas.style.border = "1px solid black";
const draw = () => {
    ctx.font = "24px Arial";
    for(let i = 1; i <= 9; i++) {
        ctx.fillText(i, 20, 15 + i * 50);
        ctx.beginPath();
        ctx.moveTo(60, 7 + i * 50);
        for(let x = 0; x < 400; x++) {
            ctx.lineTo(60 + x, 7 + i * 50 + Math.sin(x / 400 * i * Math.PI) * 12);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(60, 7 + i * 50);
        for(let x = 0; x < 400; x++) {
            ctx.lineTo(60 + x, 7 + i * 50 - Math.sin(x / 400 * i * Math.PI) * 12);
        }
        ctx.stroke();
        ctx.closePath();
    }
};

const playNote = (freq, length, attack) => {
    
    const envelope = audioCtx.createGain();
    const time = audioCtx.currentTime;
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(0.5, time + attack);
    setTimeout(() => {
        envelope.gain.setValueAtTime(0.5, audioCtx.currentTime);
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
    playNote(440*9/8, 0.75, 0.1);
    setTimeout(() => playNote(440*9/8*9/8, 0.5, 0.1), 650);
};

draw();