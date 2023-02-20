/* Technically, due to the way we select particles, the process as implemented 
   here is binomially distributed. However, because the number of events is
   fairly large, it approaches a Poisson distribution. */

const canvas = document.getElementById("shot-noise-demo"),
      ctx = canvas.getContext("2d");

const particles = new Set();
let lastParticleY;

const run = () => {

    if(Math.random() < 0.1) {

        let y;
        do {
            y = Math.floor(Math.random() * 10);
        } while(y == lastParticleY);
        lastParticleY = y;

        particles.add({x: 0, y});
 
    }

    // step particles
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff0000";

    for(const particle of particles) {
        ctx.fillRect(particle.x - 2.5, particle.y * 7 - 2.5 + 40, 5, 5);
        particle.x += 5;
        if(particle.x == canvas.width) {
            particles.delete(particle);
        }
    }

    requestAnimationFrame(run);

};

run();