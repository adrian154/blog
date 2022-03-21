If you've ever read any of my past blogposts, you'll know that I often lament the fact that much of the Internet still runs on IPv4. Still, with greater IPv6 adoption looming on the horizon, I decided to do something that I've always wanted to do: scan the public Internet for Minecraft servers.

*That can't possibly be possible*, you might say. Well, it's actually not as Herculean a task as it seems. IPv4 addresses are 32 bits long, so there are around four billion possible IP addresses. Some of these are reserved for things like private networks or multicast, leaving us with about 3,970,693,888 hosts to scan. At 20,000 hosts/second, we'll have scanned every publicly accessible IP in under three days.

# Building the Scanner

I'm not a very patient person, so I knew that much of my time spent working on this project would be devoted towards making it go *fast*. I had already tried an experiment like this once, using NodeJS to manually connect to every single IP in 0.0.0.0/0. However, the scan took five days to complete, and after it finished I accidentally deleted half the data in a stupid blunder which I will never forgive myself for. This time, I started by finding the fastest TCP port scanner available, which brought me to [MASSCAN](https://github.com/robertdavidgraham/masscan).

MASSCAN is a TCP port scanning tool created by [Robert David Graham](https://github.com/robertdavidgraham). It's distinguished from its port-scanning siblings like `nmap` by the fact that it can go *really* fast: up to 25 million packets per second, enough to scan the entire IPv4 Internet in just five minutes. It achieves this ludicrously high speed by implementing a stripped-down TCP/IP stack, tailored for porst scanning. It can also conduct basic interactions with a scanned server to retrieve information about the services running on that port, retrieving what masscan refers to as a "banner". This makes it perfect for our purposes.

Unsurprisingly, masscan doesn't come with Minecraft support out of the box. No problem, we can implement it ourselves. I started by brushing up on the Minecraft protocol, for which [wiki.vg](https://wiki.vg/Main_Page) is an invaluable reference.

Thankfully, a Minecraft server list ping is basically 1-RTT, so all we have to do is send this magic packet and read the response:

```plaintext
0000000 0015 ffff ffff 0b0f 7865 6d61 6c70 2e65
0000010 6f63 dd6d 0136 0001
```

Interestingly enough, this means that you can actually use `netcat` to ping a Minecraft server from the console. Here's what that looks like:

```plaintext
$ cat pingpayload | nc mc.bithole.dev 25565
�8�8{"description":{"extra":[{"extra":[{"obfuscated":true,"text":"aa"}],"text":"          "},{"text":" "},{"bold":true,"color":"green","text":"Welcome to BitCraft! "},{"obfuscated":true,"text":"aa"}],"text":""},"players":{"max":30,"online":0},"version":{"name":"Paper 1.18.1","protocol":757},"favicon":"data:image/png;base64,iVBORw0KGgo...
```

With that, I started coding. The process was rather uneventful, save for a couple brief moments of frustration which have since been memorialized in my commit history.

<figure style="max-width: 294px">
    <img src="resources/mcmap/frustration.png" alt="humorous git commit history">
    <figcaption>This was after I realized that the reason the masscan binary kept disappearing was that Windows Defender was flagging it as malware and deleting it.</figcaption>
</figure>

You can check out my finished code [here](https://github.com/adrian154/masscan).

With that done, all that was left to do was start the scan...

```
$ nohup masscan --excludefile exclude.txt -p25565 0.0.0.0/0 --source-port 61000 --banners -oD log.ndjson &
```

...and we were off to the races!

# Data Processing 

The next day, while the scan was still running, I began thinking about how to process the data. One challenge I quickly noticed was that the data is strewn with false positives, i.e. the server responded with a SYN/ACK, but the Minecraft server ping couldn't be completed. While a tiny fraction of these are probably represented by servers with `enable-status` set to false, most are probably not running Minecraft at all. Hits like these represent around 90% of the data collected, inflating file size considerably. Thankfully, this didn't end up being too much of a problem besides making download times annoyingly long.

Another issue is that our data is way too large for NodeJS to swallow in one gulp. I naively tried to simply `require` the enormous JSON file, only for Node to spit out this error message:

```plaintext
Error: Cannot create a string longer than 0x1fffffe8 characters
```

Bummer. Oh well, it was foolish of me to expect that to work. My goal is to store the data in an SQLite database, which will hopefully make it more convenient to work with. So, I whipped up a short script:

```js
const Database = require("better-sqlite3"), fs = require("fs"), readline = require("readline");

const db = new Database("data2.db");
db.exec(`CREATE TABLE IF NOT EXISTS servers (ip TEXT NOT NULL, json TEXT NOT NULL);`);
const insertStmt = db.prepare("INSERT OR IGNORE INTO servers (ip, json) VALUES (?, ?)");

const inStream = fs.createReadStream("log-19-Mar-2022-1354.json");
const rl = readline.createInterface({input: inStream, terminal: false});

rl.on("line", line => {
    if(line[0] == '{') {
        const server = JSON.parse(line);
        const port = server.ports[0];
        if(port.service) {
            insertStmt.run(server.ip, port.service.banner);
        }
    }
});
```

Great, but it's running slow as a dog. A little profiling reveals the problem, and it's SQLite. If we comment out the line which inserts the record into the database, we can blast through the dataset at around 600,000 lines per second. Uncomment it, and that rate absolutely plummets. I took the liberty of making a chart to illustrate the difference.

![line chart showing processing rates with and without the sqlite insert](resources/mcmap/chart.png)

Yeah... not very promising. It starts out slow, and quickly falls off a cliff into the absolutely abysmal range. At this rate, I calculated that it would take almost two hours for the data to be fully processed, and I wasn't even 50% done with the scan!  We need to figure out how to drastically increase our SQLite insert rate, or I may have to ditch SQLite altogether.

With that, I embarked on my optimization journey, anticipating another sleepless night of running tests and creating charts. However, it turns out that my mistake was actually very simple. Some Googling brought me to the official SQLite FAQ, which has [this](https://www.sqlite.org/faq.html#q19) to say about INSERT performance:

> SQLite will easily do 50,000 or more INSERT statements per second on an average desktop computer. But it will only do a few dozen transactions per second.

> By default, each INSERT statement is its own transaction. But if you surround multiple INSERT statements with BEGIN...COMMIT then all the inserts are grouped into a single transaction. The time needed to commit the transaction is amortized over all the enclosed insert statements and so the time per insert statement is greatly reduced.

Sounds easy enough to implement. I first collected a baseline measurement, where I measured the time it took to insert 1,000 rows into the table. This yielded an incredible rate of **8.2 rows/second**.

Next, I modified the program to wrap our INSERTs in a single transaction. The change only involved two lines of code:

```js
db.prepare("BEGIN").run();

// ... line handling code ...

rl.on("close", () => db.prepare("COMMIT").run())
```

Lo and behold, our INSERT rate had jumped to over **8,400 rows/second!** When the number came onto my screen, I sat there for a moment, mouth agape, pupils dilated, sweat running down my forehead, my feeble brain struggling to comprehend the tremendous difference that two measly lines of code could have. Then, disbelief set in. I opened up the database and ran some queries, but the data had been flawlessly imported.

I was suddenly overcome by emotion. A sensation of immense relief washed over me, as I realized that in just two lines I had made the program over 1,000 times faster. I felt as though I had just witnessed the hell-fire of the underworld, only to be told that I would be spared. At the same time, my earlobes burned with embarassment&mdash;after all, how could I have missed something so obvious? Am I even worthy of SQLite? No. I can't be. I am a lowly, dirty, JSON lover, and that is all I will ever be.

Okay, my reaction obviously wasn't as melodramatic as my reenactment suggests, but I was pretty relieved that the solution was so simple. Now I had a different problem on my hands: lots of seemingly invalid responses. About 4% of all the banners collected were not valid JSON. A vanishingly small percentage, sure, but I wasn't about to let those precious datapoints slip through my fingers. So, I began combing through the banners which failed to parse.

There were a couple low-hanging fruit which I chose to tackle first. For starters, MASSCAN doesn't have any understanding of character encodings. When it encounters a byte that isn't printable ASCII, it directly converts the byte to a Unicode codepoint. Thus, multibyte UTF-8 characters get absolutely mangled. Luckily, the fix was easy:

```js
const actual = Buffer.from(server.json.split("").map(c => c.charCodeAt(0))).toString("utf-8");
```

Much nicer!

There was another, bigger problem, though. In my attempts to [fix](https://github.com/adrian154/masscan/commit/2b3ee07704b3f863fef481f6422394d5740dcf43) my hopelessly broken packet parser, I ended up getting rid of the code which actually reads the response length, instead opting to log everything received from the server after the packet header as part of the banner. This resulted in a lot of JSON with extra garbage at the end, which greatly upsets `JSON.parse`. I needed a way to figure out where the actual JSON ended... but how?

<figure style="max-width: 501px">
    <img src="resources/mcmap/advice.png" alt="advice from a wise sage">
    <figcaption>Thanks, kind stranger!</figcaption>
</figure>

Before I got to work on that, I decided to first sift through the data and identify any oddities&mdash;things that definitely weren't Minecraft servers. These were quite numerous; about 68% of the responses did not begin with an opening brace `{`. Of these, the vast majority just sent back the probe baked into our custom build of MASSCAN. Three Minecraft servers had somehow made their way into this dejected pile of rejects, far too few for me to go about diagnosing the issue. There were also plenty of MySQL/MariaDB servers, and whatever this is:

![weird response](resources/mcmap/weird-server.png)

Ok, back to work. My first attempt at extracting the JSON actually made things *much* worse, but a couple stabs at the problem brought me to this:

```js
const extractJSON = str => {
    let braces = [], skip = false;
    for(let i = 0; i < str.length; i++) {
        if(skip) { skip = false; continue; }
        const char = str[i], brace = braces[braces.length - 1];
        if(char === '"') {
            if(char === brace) 
                braces.pop();
            else
                braces.push(char);
        } else if(brace === '"') {
            if(char === '\\') skip = true;
        } else {
            if(brace === '[' && char === ']' || brace === '{' && char === '}')
                braces.pop();
            else if(char === '[' || char === '{')
                braces.push(char);
        }
        if(braces.length == 0) {
            return str.slice(0, i + 1);
        }
    }
};    
```

This takes us down to around 4,530 unparseable responses. Of these, 891 responses start with a '{' yet cannot be extracted currently. A cursory look at these misfits suggests that most of them were cut off&mdash;maybe re-scan these later? That'll have to wait until another day. (Keep in mind that the scan still hasn't finished yet, but since MASSCAN iterates through IPs randomly, I can be fairly confident that these numbers will be representative of our final dataset.)

<figure style="max-width: 475px">
    <img src="resources/mcmap/funny-server.png" alt="funny server">
    <figcaption>Me too, buddy. Me too.</figcaption>
</figure>

# Analyzing the Data

