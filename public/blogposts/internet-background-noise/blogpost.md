If you've ever looked at the logs of a public-facing webserver before, you've probably noticed that there are hundreds of requests per day from unknown sources requesting nonexistent URLs. These are, in fact, malicious probes from automated scans searching for vulnerable hosts. 

How do these attackers find your server? The most na&iuml;ve approach is to sweep the entire IPv4 space, sending requests to every address. This strategy has two downsides. First, most hosts aren't running webservers, so a lot of network bandwidth is wasted scanning addresses that have nothing to show. Second, many sites are hosted behind a reverse proxy, meaning that requests with an incorrect `Host` header will not be correctly routed. 

Domain names known to host websites can also be discovered through [Certificate Transparency](https://certificate.transparency.dev/). Here's the 10,000 foot overview of CT: when you connect to a website using HTTPS, the website proves its identity using a digital certificate. Clients only accept certificates that have been signed by a small group of certificate authorities, so these CAs have a responsibility to conduct due diligence before issuing a certificate to ensure that the requester is actually who they claim to be. Still, this has not always been the case in the past, and there have been several high profile incidents where compromised CAs were used to attack secure websites. Thus, CT was created to make auditing CAs easier. The protocol is built around a set of append-only logs tracking certificate issuances. Today, almost all major browsers require certificates to contain proof that the issuance was publicly logged, thwarting attempts to issue a malicious certificate under the radar.

<aside>

If you want to learn more about how certificates are used to secure the web, you should check out my blogpost on [TLS](https://blog.bithole.dev/blogposts/tls-explained/#authenticity)!

</aside>

CT is *awesome*, but it does make it easy for attackers to discover domain names associated with webservers. Obviously, the resulting attacks are not harmful unless you are running insecure code, but they are a waste of bandwidth nonetheless.

Another protocol that is often attacked is SSH. A shocking amount of servers still use SSH password authentication with easily-guessed passwords. Thus, port 22 is often scanned by botnets.

I had long been aware of this type of traffic, but recently (during a very boring math class) I had the idea of setting up a server and actually creating a breakdown of all the unsolicited traffic received. This concept is already implemented by companies like [GreyNoise](https://www.greynoise.io/), but that's never stopped me before.

# Setting Up

Often, when researchers want to study Internet background noise, they utilize a [network telescope](https://en.wikipedia.org/wiki/Network_telescope). This amounts to a viewpoint that allows them to analyze all the traffic addressed towards an unused block of IPs. I don't have access to such luxuries, so in this blogpost I'll just be analyzing the traffic to a single IP from my cloud provider.

To distinguish unsolicited traffic from actual traffic, I attached a second IP to the node solely for receiving background noise. This way, I can communicate with the server on its primary IP without worrying about contaminating the results.

First, I conducted a preliminary study, where I simply logged the incoming packets to get an idea of what protocols were being attacked.