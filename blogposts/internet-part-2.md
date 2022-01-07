**Hey!** If you haven't yet, consider reading the [prequel](internet-part-1.html) to this blogpost.

Last time, we dove deep into the inner workings of the Internet, examining how IP packets get from point A to point B. Today, we're going to see how Internet access powers the [World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web).

For the uninitiated, the Web is a collection of information and applications, websites, that are accessible via URLs. (You're on one right know.) Let's see what makes it tick.

## Shortcomings of IP

The Internet Protocol is great, but it isn't perfect. It uses [best-effort delivery](https://en.wikipedia.org/wiki/Best-effort_delivery), meaning that intermediate routers will *try* to get your message to its destination, but if it gets lost on the way... don't come calling. Packet loss isn't a rare event, too; it's relatively uncommon, but just one dropped packet can severely disrupt the function of an application. Imagine downloading a large file, only to find out that it's unusuable because one part of it was dropped in transit. Furthermore, because IP is stateless (and two packets could take totally different routes), there's no guarantee that the packets which *do* make it are in the correct order, or that their contents haven't been corrupted. Clearly, we need another layer on top of IP to gracefully handle all of these conditions.

# Transmission Control Protocol

IP's unreliable nature is fairly unfriendly to most applications, so several transport-layer protocols were created to abstract away the details of IP, of which the **Transmission Control Protocol** (TCP) holds the distinction of being one of the oldest and most widespread. 

TCP offers *guaranteed delivery*, in contrast to IP's best-effort delivery. Packets will always be consumed in the order they were sent. If a packet is corrupted or dropped, retransmission will be attempted, and if guaranteed delivery isn't possible, the connection will enter an error state instead of silently failing. In addition, TCP hides all the details of packet fragmentation and reassembly, instead presenting the network as a set of readable and writeable byte streams to applications. 

## Basic Concepts

Every packet in TCP has a *sequence number*, which is used to organize packets in the event that they are received out of order. 

# Grabbing Hypertext

# What the Heck Are Domains?

When you typed `blog.bithole.dev` into your browser, it sent a request to 142.93.26.121, which replied with this blogpost. But how did it know where to send the request? The answer is the **domain name system**, or DNS. Let's see how it works.

Back in the days of ARPANET, there was no DNS. Instead, there was one server, the Host Naming Registry (maintained by [Elizabeth Feinler](https://www.internethalloffame.org/inductees/elizabeth-feinler)), which was responsible for resolving domains into IPs for the entire network.