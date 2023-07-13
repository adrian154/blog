In the age of gigabit Ethernet and fast userspace networking, it's easier than ever to scan the Internet. So simple, in fact, that I've done just that and wrote a [blogpost](https://blog.bithole.dev/blogposts/mc-census/) about it. But what about the other people running these scans? What are *they* looking for?

To answer that question, I decided to set up a server that would collect and analyze all the unsolicited traffic it received, which experts call the [Internet background noise](https://en.wikipedia.org/wiki/Internet_background_noise). Let's see what our little experiment might reveal.

# Setup

I needed a device with a public IP for this project, so I spun up a VPS from DigitalOcean. Conveniently, DigitalOcean offers "reserved" IPs which we can attach to our machine, freeing up the primary IP for SSH'ing and other activities that we don't want to include in our data.

It's easy enough to see *who's* sending you traffic and what protocols and ports they're using, but I wanted to capture the payloads, too. This is easy for UDP, which is stateless, but TCP requires us to accept the connection first before we can see what the other party is trying to send us. We could accomplish this by listening on all 65,536 ports, but a cleaner solution is to use iptables to redirect every TCP connection to the probe IP to one port:

```
sudo iptables -t nat -A PREROUTING -p tcp -d 10.48.0.5/32 -m multiport --dports 1:65535 -j REDIRECT --to-port 1337
```

To accept and handle the connections, I wrote a simple NodeJS server that does nothing for now, though in the future we can use this to interact with the connecting clients.

```js
const net = require("net");
const server = net.createServer(socket => {
    // ...
});

server.on("error", console.error);
server.listen(1337, () => console.log("listening"));
```

Finally, we can run tcpdump to actually capture some packets.

```plaintext
tcpdump -i ens3 -w capture.pcap -s 0 host 10.0.0.198
```

We can also repeat this process for UDP.

# References/Further Reading

* [maz - Background noise of
the Internet](https://conference.apnic.net/48/assets/files/APIC778/Background-noise-of-the-Internet.pdf)
* [Pang et. al 2004 - Characteristics of Internet Background Radiation](https://pages.cs.wisc.edu/~pb/background_final.pdf)
* [Wustrow et. al 2010 - Internet Background Radiation Revisited](https://faculty.cc.gatech.edu/~mbailey/publications/imc10-wustrow.pdf)
* [Zolotykh 2020 - Comprehensive Classification of Internet Background Noise](https://sci-hub.se/https://ieeexplore.ieee.org/document/9267850)