If you've ever looked at the logs of a public-facing webserver before, you've probably noticed that there are hundreds of requests per day from unknown sources requesting nonexistent URLs. In fact, most of these are malicious probes from automated scans searching for vulnerable hosts. These attacks are not limited to just HTTP; every Internet-facing server receives thousands of unsolicited packets every day. Together, this traffic makes up what is known as the [Internet background noise](https://en.wikipedia.org/wiki/Internet_background_noise). Today, we're going to take a crack at analyzing what this background noise is composed of.

# Basic Preparation

Most existing studies on Internet background noise were conducted using [network telescopes](https://en.wikipedia.org/wiki/Network_telescope), e.g. large blocks of unused addresses. I don't have access to such luxuries, so in this blogpost I'll just be analyzing the traffic to a single IP from my cloud provider.

## Making our Server Discoverable

Before we go further, now is probably a good time to address one of the most obvious questions about this whole project: how do hackers find your server, anyways?

The simplest method is to simply sweep the entire IPv4 space. This is much more efficient than it seems; by distributing traffic across a botnet, every single IPv4 address can easily be scanned multiple times a day. We don't need to do anything to make our server more visible to this type of scan besides simply having a public IPv4 address.

Another method that attackers use to identify targets is by looking at Certificate Transparency logs. Here's the 10,000 foot overview of CT:
- HTTPS protects against man-in-the-middle attacks by requiring servers to prove their identity using a certificate issued by a certificate authority. 
- If a CA is compromised, clients can be fooled into communicating with an attacker using a phony certificate, even though the connection appears to be secured using TLS.
- To mitigate the impact of such incidents, Certificate Transparency requires CAs to record all certificate issuances in a public append-only log, allowing webmasters to be quickly notified if an unknown certificate has been issued for one of their domains.

Today, most major web browsers will reject certificates if they do not contain proof that the issuance was logged using CT, thwarting attempts to issue malicious certificates under the radar.

In summary, CT is *awesome*, but attackers can go through the logs and harvest the domain names for automated scans. Thankfully, this is merely a nuisance if all of your services are properly secured. For our experiment, we're going to register a cheap domain, point it at our server, and obtain a certificate for it through [Let's Encrypt](https://letsencrypt.org/) to see what kind of traffic it brings in.

<aside>

If you want to learn more about how certificates are used to secure the web, you should check out my blogpost on [TLS](https://blog.bithole.dev/blogposts/tls-explained/#authenticity)!

</aside>

The Certificate Transparency route may seem like a lot of unnecessary work, so why do attackers bother with it? The simple answer is that many webservers are hosted behind reverse proxies, which will ignore requests with an unknown `Host` header. For example, all of the following sites are hosted on the same server:
- https://bithole.dev/
- https://apis.bithole.dev/
- https://blog.bithole.dev/
- https://pixels.bithole.dev/
- https://soccer.bithole.dev/
- https://wiregame.bithole.dev/

NGINX figures out which backend to forward your request to based on the `Host` header. If you simply navigate to the IP of the server in your browser (142.93.26.121), you will find that you are greeted with an empty response, which is probably not what you wanted. Similarly, attackers usually don't want to talk to the proxy itself, they generally want to get at whatever services are hosted behind it.

I suspect that some attackers may also be using reverse DNS to accomplish the same goal, so I set up a PTR record for the test server's IP and pointed it at a subdomain to distinguish requests made through this method from requests made using a domain obtained through CT. 

# First Experiment

I decided to start with a very low-interaction setup, just to see what was out there. This seems easy enough; capturing incoming packets is easy using tcpdump, but ideally we also want to write a program to automatically accept all TCP connections

Ultimately, I chose to add a second IP to the observing server to avoid interference with the primary IP. This turned out to be harder than expected, partially because I am a total networking n00b but also because OCI makes everything harder than it should be.

This post isn't about how to wrangle with Oracle Cloud, but if you ever find yourself needing a second public IP address here's the basic process:
- Go to Instances &rarr; (your instance) &rarr; Attached VNICs &rarr; (the first VNIC) &rarr; IPv4 Addresses
- Click "Add Secondary Private IPv4 Address". You can provision a new reserved public IP from this interface.
- Add the *private* address using iproute2, and you're set! You will need to modify some config files for the change to persist across reboots.

There are still quite a few things we need to do, however. For starters, now's a good time to disable firewalld and add modify the subnet's security list to allow all inbound packets.

Next, we also need some program to accept all incoming connections. We could accomplish this by listening on all 65,536 ports, but we can achieve the same thing using iptables and NAT. Our goal here is to translate all inbound TCP connections so that they end up connecting to some program listening on a local address.

```
sudo iptables -t nat -A PREROUTING -p tcp -d 10.0.0.198/32 -m multiport --dports 1:65535 -j REDIRECT --to-port 1337
```

We still need something to accept all those TCP connections. For our purposes, ncat will do fine.

```
ncat -lkp 1337 > /dev/null &
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