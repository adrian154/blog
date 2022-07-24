Let's say someone has visited your website; is it possible to determine what DNS resolvers their computer is configured to use?

Well, yes. Of course you can! This blogpost wouldn't be very long if the answer was no. Let's find out how. But before we begin...

<button id="button">Find My Resolvers</button>

<noscript>You'll need JavaScript for this to work.</noscript>

<div id="resolvers">
</div>

Note that if your DNS resolver uses [anycast](https://en.wikipedia.org/wiki/Anycast), the IPs found here will not match the ones in your configuration. This is because those resolvers send out their queries on a separate non-anycast interface, to make sure that responses from nameservers are routed correctly. 

<script>

const randomid = () => {
    let str = "";
    for(let i = 0; i < 32; i++) {
        str += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random()*26)];
    }
    return str; 
};

const resolvers = document.getElementById("resolvers");

document.getElementById("button").addEventListener("click", async event => {
    
    resolvers.replaceChildren();
    const set = new Set();
    event.target.disabled = true;

    // keep track of # of requests since a new resolver was discovered
    let i = 0;

    while(true) {

        // trigger a DNS query to our server
        const name = `${randomid()}.g4vmltbq.xyz.`
        await fetch(`https://${name}/`).catch(() => {});
        
        i++;

        // retrieve who did it
        const resp = await (await fetch(`https://apis.bithole.dev/dns-query-addrs?name=${encodeURIComponent(name)}`)).json();
        for(const addr of resp) {
            if(set.has(addr)) continue;
            i = 0;
            set.add(addr);
            const span = document.createElement("span");
            span.textContent = addr;
            resolvers.append(span);
        }

        // stop if we've made 5 requests and no new resolvers found
        if(i == 10) {
            break;
        }

    }

    event.target.disabled = false;

});


</script>

# How?

Earliest this year, I wrote an incomplete implementation of the DNS protocol in NodeJS to create a [tool](https://bithole.dev/tools/dns/) for tracing DNS delegations in the browser. I soon realized that I could probably create a very rudimentary DNS server with what I had. Fast-forward to this morning, when I got the idea for identifying the user's resolvers by logging requests to the DNS server. And thus, I got to coding.

The code for the server is actually remarkably simple. In fact, pretty much all the logic is contained in a single method.

```js
server.on("message", (data, rinfo) => {

    const reader = new DNS.DNSReader(data);
    const message = DNS.DNSMessage.read(reader);
    const response = new DNS.DNSBuilder();
    response.writeUInt16BE(message.id);
    response.writeUInt16BE(DNS.FLAG.AUTHORITATIVE | DNS.FLAG.RESPONSE);

    const answers = message.questions.filter(question => question.type == DNS.RECORD_TYPE.A).map(question => question.domain);

    response.writeUInt16BE(message.questions.length) // # questions
            .writeUInt16BE(answers.length) // # answers
            .writeUInt16BE(0).writeUInt16BE(); // no NS/additional records

    for(const question of message.questions) {
        DNS.Question.write(response, question);
    }

    for(const name of answers) {
        response.writeDomainName(name);
        response.writeUInt16BE(DNS.RECORD_TYPE.A);
        response.writeUInt16BE(1); // class 1 (IN)
        response.writeUInt32BE(0); // 0 TTL
        response.writeUInt16BE(4);
        response.writeUInt8(142).writeUInt8(93).writeUInt8(26).writeUInt8(121);

        const list = queries.get(name) || [];
        list.push(rinfo.address);
        queries.set(name, list);
    }

    const buf = response.build();
    server.send(buf, 0, buf.length, rinfo.port, rinfo.address);

});
```

As you can see, this server is not very smart. The only thing it is capable of is blindly responding to all A requests with a fixed IP. However, for our case, that's sufficient.

The client code is even simpler. If you open up the network tab for this page and click the button again, you can see it at work; it simply generates a long random domain name, triggers a DNS query for that domain by initiating a request via `fetch`, and asks our crappy DNS server about which IPs have queried for those domains. To make it all work, I bought a cheap domain (g4vmltbq.xyz) and added a wildcard NS record pointing resolvers to my DNS server.

# Applications

What could this be useful for? I have no idea, to be honest, but I would like to hear what you think in the comments :)