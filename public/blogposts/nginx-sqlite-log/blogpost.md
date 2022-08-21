In case you haven't realized, I am a big fan of SQLite. In my opinion, the balance between convenience and flexibility that it offers is simply not matched by any other database out there. Since most of my projects are small and will likely remain small, I often find myself gravitating towards SQLite. Thus, one day I landed upon the idea of getting Nginx to store requests within an SQLite database instead of logging them to a text file, for two reasons:
- I am super bad at not accidentally deleting things, and having one file is a whole lot easier than dozens of logs scattered all over the place.
- Consolidating all log messages into one place makes it a lot easier to perform analysis on them, and also makes them readily consumable by other applications.

Googling revealed multiple solutions that enabled me to accomplish my goals to great degree of customizability. But I didn't feel like using any of them. For no reason. Some bizarre, neurotic, obsessive-compulsive tendency within me screamed to waste time reinventing the wheel instead of taking the easy way out, and the rest of my brain simply caved to its siren call. (It didn't help that Twitter wasn't loading on my computer at the time.)

Well, my sleep schedule was bound to deterioriate on its own anyways. Let's get to work.

# Getting Log Lines from NGINX

Nginx supports the [syslog](https://en.wikipedia.org/wiki/Syslog) protocol, so our approach will be to configure Nginx to deliver log messages to a daemon of our own design via syslog.

syslog is a pretty simple protocol, if we choose to ignore the complicated parts. We can get Nginx to send a UDP packet to some server for every request that it receives, parse the packet to extract the request data, and save it to a database. The fact that UDP is used for transport is not a problem if the two processes are running on the same machine.

Let's do a little experimenting before we start coding. We can enable logging to syslog by adding this to our Nginx configuration:

```plaintext
access_log syslog:server=localhost:1234,facility=local7,tag=nginx,severity=info;
```

For now, let's simply log the received packets to stdout with ncat. Here's what a typical log message looks like:

```plaintext
<190>Aug 21 00:06:11 bithole.dev nginx: 127.0.0.1 - - [21/Aug/2022:00:06:11 -0700] "GET / HTTP/2.0" 200 4310 "-" "curl/7.68.0"
```

Outputting JSON log messages is probably a good idea because it will make the inputs more amenable for consumption with NodeJS. We can accomplish that with a custom log format:

```plaintext
log_format json_log escape=json
    '{'
        '"timestamp": $msec,'
        '"requestLen": $request_length,'
        '"status": $status,'
        '"remoteAddr": "$remote_addr",'
        '"requestMethod": "$request_method",'
        '"requestUri": "$request_uri",'
        '"protocol": "$server_protocol",'
        '"referrer": "$http_referrer",'
        '"userAgent": "$http_user_agent",'
        '"host": "$host"'
    '}';
```

Now, we just need to tell Nginx to use the `json_log` format, which gets our log lines looking like this:

```plaintext
<190>Aug 21 11:11:16 bithole.dev nginx: {"timestamp": 1661105476.291,"requestLen": 28,"status": 200,"remoteAddr": "127.0.0.1","requestMethod": "GET","requestUri": "/","protocol": "HTTP/2.0","referrer": "","userAgent": "curl/7.68.0","host": "bithole.dev"}
```

# Storing Requests

All we have left to do is actually implement the server. In theory, this is a trivial task, but, well&hellip; it was about 1 AM, so&hellip;

<figure style="max-width: 373px">
    <img src="commits.png" alt="commit messages on 21 Aug 2022">
    <figcaption>The commits messages say it all.</figcaption>
</figure>

The code is fairly simple, though we do have to take some measures to ensure that it stays performant. Specifically, we want to avoid SQLite's default behavior of beginning a new transaction for every single row inserted into the database. The impact that this has on INSERT throughput is simply *astounding*; while working on the [Minecraft server census](/blogposts/mc-census/) blogpost, consoldating INSERTs into a single transaction increased the rate by over 1,000x. Thus, I was mindful of making the same mistake again. I ended up grouping all requests over a one-second period into a single transaction.

Here is the distilled version of the final server code:

```js
const server = dgram.createSocket("udp6");

server.on("error", console.error);
server.on("listening", () => console.log("Listening on port " + process.env.SYSLOG_PORT));

// periodically commit requests to DB
let inTransaction = false;
setInterval(() => {
    if(inTransaction) {
        db.prepare("COMMIT").run();
        inTransaction = false;
    }
}, TRANSACTION_INTERVAL);

server.on("message", msg => {
    
    const str = msg.toString("utf-8");
    const object = JSON.parse(str.slice(str.indexOf('{')));

    if(!inTransaction) {
        db.prepare("BEGIN").run();
        inTransaction = true;
    }

    insertStmt.run(object);

});

server.bind(process.env.SYSLOG_PORT);
```

# Putting It All Together

If you are content with using my shitty code, it is available on GitHub as [syslog2sqlite](https://github.com/adrian154/syslog2sqlite). There is also a Docker image available on Docker Hub as [adrian154/syslog2sqlite](https://hub.docker.com/r/adrian154/syslog2sqlite). However, you are probably better off using existing syslog tooling like syslog-ng.

That's all, folks!