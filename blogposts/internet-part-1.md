Some time ago, it occurred to me that I didn't *really* understand what made the Internet work. Sure, I am all too familiar with what the user experience is like, and my adventures in web development have forced me to acquire a fair bit of networking knowledge, but between the bits of light there existed vast chasms of confusion. So I decided to do some reading, some soul-searching, and publish my findings in the form of a blog post.

Please note that this post is by no means a comprehensive overview of *all* the technologies involved in the Internet; unfortunately, I only have one lifetime to waste, though I'll do my best to cover the important ones. I probably won't cover the Internet's history in very much depth, either (though that is a fascinating topic that I strongly encourage you to look into).

The word "internet" itself offers some hints about its architecture. "Internet" is short for *internetworking*, the act of connecting multiple computer networks so that they can communicate. That's essentially what the Internet is, a bunch of independently maintained networks that are joined together such that any two computers on the Internet can reach each other.

## A Word on Layers

The Internet is powered by an ever-expanding family of technologies and protocols. These systems are segregated into layers, and each layer is responsible for providing an interface that allows the next layer to do its job. This layered model serves as a great way to understand the Internet starting from the ground up. In reality, the divisions between these layers are not as concrete as one would hope, and as a result there is quite a bit of disagreement over how to best model the Internet stack (primarily between supporters of the [OSI model](https://en.wikipedia.org/wiki/OSI_model) and the [TCP/IP model](https://en.wikipedia.org/wiki/Internet_protocol_suite#Comparison_of_TCP/IP_and_OSI_layering)). Since this debate is incredibly contentious, I will do my best to avoid it.

# Physical Layer

Let's start from the very bottom. No Internet, no networks even. Consider two computers: how can digital data be transferred from one to another? The answer to this question is the **physical layer**, which describes how to transmit ones and zeroes over a physical transmission medium. On top of the physical layer lies the **link layer**, which leverages the physical layer's capabilities to transfer full *frames* of data over a network that may be more complicated than a single point-to-point link. (The link layer may also take on other responsibilities such as error correction and retransmission.)

<div class="info-box">

The idea of a "frame" is a little nebulous since their implementation varies wildly between protocols. However, for every network, there is a maximum frame size that it will accept, known as the [maximum transmission unit](https://en.wikipedia.org/wiki/Maximum_transmission_unit) or MTU. This is one of the few properties of the link-layer network that higher layers need to be aware of.

</div>

The physical layer and link layer are generally tightly coupled (out of necessity), which is the source of endless frustration. For example, the term "Ethernet" might refer to the physical cable standard, but it could also refer to the Ethernet protocol used to transfer frames over those cables. Which is it?

The full answer is that Ethernet has many sublayers, which reside at varying levels within the physical and link layers. Twisted-pair Ethernet cables themselves are governed by a flock of partially agreeing standards; here's what [Wikipedia](https://en.wikipedia.org/wiki/Category_6_cable) has to say about it:

> Confusion therefore arises because of the naming conventions and performance benchmarks laid down by the International ISO/IEC and American TIA/EIA standards, which in turn are different from the regional European standard, EN 50173-1. In broad terms, the ISO standard for Cat 6A is the most stringent, followed by the European standard, and then the American standard.

*That* is a mess that I have no interest in delving into. But Ethernet supports much more than just twisted-pair cables; it can be run over other physical media such as coaxial cable or  optical fiber. Those standards are managed by [IEEE 802.3](https://en.wikipedia.org/wiki/IEEE_802.3), which also handles the link-layer details of Ethernet. 

Beyond Ethernet, there are no shortage of other ways to physically connect devices. Here are some prolific examples:
* WiFi ([IEEE 802.11](https://en.wikipedia.org/wiki/IEEE_802.11))
* Cable ([DOCSIS](https://en.wikipedia.org/wiki/DOCSIS))
* [LTE](https://en.wikipedia.org/wiki/LTE_(telecommunication))

For every surviving technology, there are probably around ten dead ones. One example is [Token Ring](https://en.wikipedia.org/wiki/Token_Ring), IBM's Ethernet competitor, which was famously vanquished around the turn of the century.

One thing that all [IEEE 802](https://en.wikipedia.org/wiki/IEEE_802) technologies have in common is **medium access control** (**MAC**), which enables communication between devices on the same **local area network** (**LAN**). Each device (more accurately, each [interface](https://en.wikipedia.org/wiki/Network_interface_controller)) is given a unique 48-bit address. These addresses are allocated by the IEEE to equipment manufacturers, though some mobile devices simply generate a [random MAC address](https://support.apple.com/guide/security/wi-fi-privacy-secb9cb3140c/web) when connecting to a network to avoid being tracked. 

# Switches

![an ethernet switch](static/images/ethernet-switch.jpg)

*An Ethernet switch. [Photo](https://commons.wikimedia.org/wiki/File:Netgear_Gigabit_Switch_5-port.jpg) by [Simon A. Eugster](https://commons.wikimedia.org/wiki/User:LivingShadow) / [CC-BY](https://creativecommons.org/licenses/by-sa/3.0/deed.en)*

Devices called [network switches](https://en.wikipedia.org/wiki/Network_switch) allow communication between nodes on the same LAN. A switch is basically an embedded device with a large number of Ethernet ports. Because all devices on the network communicate with each other by talking through the switch, a [star topology](https://en.wikipedia.org/wiki/Star_network) is formed.

![star topology diagram](static/images/switch-star-topology.png)

*In case you can't tell, I'm not exactly the best at making diagrams.*

Ethernet frames are fairly simple in structure. As expected, each frame contains the source MAC address and destination MAC address (along with some other fields such as a checksum) before the payload, so that the frame can be routed to the correct recipient. 

When computer A wants to send a message to computer B, it sends a frame to the switch with computer B's MAC address. However, the switch doesn't know which physical port the connection to computer B is located on, so it relays the frame to all connected computers, hoping that one of them is the intended recipient. When computer B receives the frame, it might reply with another frame. That frame would contain computer B's MAC address as the source, allowing the switch to internally associate the connection it received the frame on with computer B. In the future, when the switch receives a frame with computer B as its destination, it can simply relay the frame on the correct link instead of *flooding*.

<div class="info-box">

Back in the day, when everything was slightly worse, networks were often created using [hubs](https://en.wikipedia.org/wiki/Ethernet_hub) instead of switches. Hubs are much simpler devices which simply retransmit everything that it receives to all other devices. Because of their relative lack of sophistication, hubs suffer from a littany of problems:
* Since every device needs to be able to receive the data being transmitted by the hub, if one device was slower than the others, *every* link on the switch would be forced to operate at that speed.
* Multiple devices trying to transmit at the same time would result in a garbled mess being transmitted (a condition known as a [collision](https://en.wikipedia.org/wiki/Carrier-sense_multiple_access_with_collision_detection)), requiring the hub to detect the conflict and temporarily stop all transmissions. This obviously degraded network performance.

Today, hubs have been made obsolete in favor of switches and are rarely used outside of special conditions (though evidently my school's IT department hasn't gotten the memo). Even in the early days of Ethernet, it was apparent that collisions posed a challenging problem, so other protocols approached access control differently. For example, in Token Ring setups, there is no central switch or hub; nodes are connected in a ring, and transmission rights are passed around the ring. When one node is done transmitting, it passes the *token* to the next node. Hence the name, Token Ring. \*roll credits\*

</div>

Switches are one of the most ubiquitous building blocks of computer networks, so it's no surprise that they are all over the place. If your router has more than one Ethernet port, chances are it has a built-in switch.

## WiFi

An overview of physical-layer protocols just wouldn't be complete without a mention to WiFi, standardized by [IEEE 802.11](https://en.wikipedia.org/wiki/IEEE_802.11). The idea of a point-to-point link starts to break down when it comes to wireless communications because radio signals will propagate to every connected device whether you like it or not. Thus, WiFi networks use an algorithm called [Multiple Access with Collision Avoidance](https://en.wikipedia.org/wiki/Multiple_Access_with_Collision_Avoidance) to ensure that only one device tries to transmit data at a time. Receiving frames is simpler; devices simply decode all incoming frames and pick out the ones that are actually destined for their MAC address. In this way, a WiFi network functions more closely to an Ethernet hub than a switch.

In this situation, no router or switch is necessary to relay messages between devices on the same WLAN. In fact, any WiFi-capable transceiver can [broadcast a network](https://en.wikipedia.org/wiki/Wireless_ad_hoc_network); Windows even [natively supports](https://answers.microsoft.com/en-us/windows/forum/all/how-do-i-set-up-an-ad-hoc-wifi-network-in-windows/0caa92d8-e02f-4e7f-aa5c-0abf10ed2039) this feature. Instead, your router plays the role of a [wireless access point](https://en.wikipedia.org/wiki/Wireless_access_point), aptly abbreviated to **WAP**. (In light of "WAP" becoming rather vulgar in recent years, I will use the more succinct abbreviation of just **AP** for the rest of this post.) The role of an AP is simple; it just serves as an interface between the wireless network and the regular wired network, which has access to the public Internet. Speaking of which...

# Internet Layer

We've finally reached the Internet layer of the Internet. This is where all the action happens! Buckle up, and let's explore how it works.

Relatively few protocols live in the Internet layer itself. Its primary inhabitants are the [Internet Protocol](https://en.wikipedia.org/wiki/Internet_Protocol) (IP) and [Internet Control Message Protocol](https://en.wikipedia.org/wiki/Internet_Control_Message_Protocol) (ICMP). There are two currently deployed versions of IP, IPv4 and IPv6, which are generally very similar but vary in subtle yet important ways.

In IP, every network interface (usually just one per computer) is associated with an IP address. In IPv4, this address is 32-bits long, and usually written as a series of four numbers (each corresponding to a byte or *octet* of the IP address) and separated by periods. For example, the IP of this blog at the time of writing is 142.93.26.121. IP addresses are managed by the [Internet Assigned Numbers Authority](https://en.wikipedia.org/wiki/Internet_Assigned_Numbers_Authority), which assigns blocks of IP addresses to the five [Regional Internet Registries](https://en.wikipedia.org/wiki/Regional_Internet_registry). The RIRs, in turn, deal with requests from individuals and businesses for IP allocations.

## IPv4 Exhaustion

Because IPv4 addresses are only 32 bits long, there can only be 2<sup>32</sup> = ~4 billion unique IPv4 addresses. That seems like a lot, but as early as the 90s the threat of [running out of IPv4 addresses](https://en.wikipedia.org/wiki/IPv4_address_exhaustion) has continually loomed over the Internet, made worse by the fact that many parts of IPv4 space are [reserved](https://en.wikipedia.org/wiki/Reserved_IP_addresses) for various purposes. To fix this issue, IPv6 was created. IPv6 addresses are 128 bits long, which is more than enough to serve humanity's needs at the moment. (If all IPv6 addresses were distributed equally among all living humans, every individual could have 47 octillion addresses. It's safe to say that we won't be running out any time soon, especially because sadly a lot of the Internet is still stuck on IPv4.)

![xkcd #195 internet map](static/images/xkcd-internet-map.jpg)

*[xkcd 195](https://xkcd.com/195/): A map of IPv4 space circa 2006. Things have only gotten more crowded since then.*

<div class="info-box">

*Why can't MAC addresses just be used for routing?*, you might ask. The biggest reason is that IP is meant to be mostly agnostic of the protocols used in the underlying link layer. Using MAC addresses would violate that principle; networks not running on IEEE 802 technologies wouldn't be able to join the Internet, which defeats its whole purpose of connecting numerous heterogeneous networks.

</div>

## Packets

One of the key innovations that made the Internet possible was [packet switching](https://en.wikipedia.org/wiki/Packet_switching), the idea of transferring digital data throughout a computer network by splitting it into chunks called *packets* and allowing intermediate nodes (routers) to decide where to send the packet next. Thanks to its ubiquity, packet switching probably seems incredibly mundane and obvious to most programmers today, but at the time (when the predominant paradigm for telecommunications was [circuit switching](https://en.wikipedia.org/wiki/Circuit_switching)), packet switching was revolutionary. Compared to circuit switching, packet switching allows for much more diverse network topologies, and does not require all the packets in a single data stream to travel to the recipient via the same route, making Internet routing incredibly dynamic. All of these attributes have helped the Internet scale to billions of connected devices.

An IPv4 packet consists of two parts: a header, which provides information about the packet itself, and the data contained within the packet. Some of the info contained within the header includes:
* The destination address
* The length of the packet's data
* The [type of data](https://en.wikipedia.org/wiki/Differentiated_services) in the packet, used by routers to determine how to best handle the packet (e.g. whether to prioritize latency or throughput)
* A number identifying which protocol the underlying data is being used for; see the IANA [list of protocol numbers](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml).
* A [time to live](https://en.wikipedia.org/wiki/Time_to_live) value, an integer which is decremented each time the packet is retransmitted until it reaches zero, at which point the packet is dropped. Used to prevent packets from being circulated infinitely in the event of a [routing loop](https://en.wikipedia.org/wiki/Routing_loop).
* The checksum of the header, to detect whether it was corrupted during transit. Integrity of the packet payload is not handled by IP; that responsibility is delegated to whatever protocol is built on top of IP.
* Fragmentation information. A router may break an IP packet into fragments for various reasons, usually to fit into the MTU of the link between the router and the next recipient. Packet fragments contain their offset within the original packet and a bitfield indicating whether there are more fragments, allowing for seamless reassembly along the packet's route.

So how exactly do IP packets find their way to their final destination? That's a big question. Let's figure it out.

## Obtaining an IP address

In order to send or receive IP traffic, you first need an IP address. Your computer could obtain one through several methods:
* It has already been configured to use a preset static IP address.
* It receives an IP address while connecting to the network, via the [Dynamic Host Configuration Protocol](https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol) (DHCP).
* (other less straightforward schemes)

Let's talk about DHCP. DHCP is built on top of UDP, which in turn resides above IP. It allows newly-connected clients to contact the local DHCP server and obtain an IP address. Right off the bat, there are two challenges:
* How can the computer send/receive DHCP packets, which are carried via IP, if it doesn't have an IP address yet?
* How does the computer discover the DHCP server?

To solve the first problem, clients use a source IP of 0.0.0.0 in their initial DHCP requests. The DHCP server distinguishes incoming requests not by source IP but by MAC address. To discover the DHCP server, all DHCP requests are directed to a special IPv4 address, 255.255.255.255, which broadcasts the packets to all nodes on the network. By seeing which IP replies, a device can figure out which IP the DHCP server is running on.

Okay, so we've obtained an IP address. Now what?

![diagram of an IP LAN](static/images/ip-lan.png)

Suppose computer 10.0.0.2 wants to send a message to 10.0.0.3. In order to actually deliver a message to 10.0.0.3, our sender needs to know which MAC address to send packets to. It can obtain this information via the [Address Resolution Protocol](https://en.wikipedia.org/wiki/Address_Resolution_Protocol) (ARP).

## Address Resolution Protocol

ARP is a protocol that enables the resolution of IP addresses to MAC addresses on a network. It operates on the link-layer. When a computer needs to determine the MAC address given an IP address, it broadcasts an ARP request to the local network. This is done by sending frames addressed to a MAC address of FF:FF:FF:FF:FF:FF, which signals to the switch that the message should be relayed to all connected devices. The device which has the corresponding IP responds to the request with its MAC and IP address. Both of these devices may cache each others' IP and MAC addresses to avoid making another ARP request in the future.

There also exists a second method for the discovery of IP-to-MAC mappings. Under certain circumstances, such as when a device joins a network or obtains a new IP address, it may publish an ARP announcement that prompts all other devices to update their ARP caches.

<div class="info-box">

One major weakness of ARP is its vulnerability to [spoofing attacks](https://en.wikipedia.org/wiki/ARP_spoofing), wherein a malicious device publishes an ARP announcement or responds to an ARP request not intended for them in order to masquerade as another device. For this reason, IPv6 uses [Neighbor Discovery Protocol](https://en.wikipedia.org/wiki/Neighbor_Discovery_Protocol) (NDP) instead of ARP. NDP seeks to address some of the security and usability problems which have traditionally affected ARP. To learn more, check out [this thread](https://superuser.com/questions/969831/why-is-arp-replaced-by-ndp-in-ipv6) on StackExchange.

</div>

ARP is ubiquitous among IEEE 802 networks. If your computer is on a WiFi or Ethernet-based network, you can install [Wireshark](https://www.wireshark.org/) and observe ARP requests happening right before your eyes.

![arp requests on my LAN, as seen by wireshark](static/images/arp-capture.png)

*Some ARP requests seen on my local network.*

Your computer doesn't make an ARP request for every single outgoing IPv4 connection. If configured correctly, your computer should be able to tell which addresses belong to the local network (i.e. they can be reached by MAC address) and which reside on the public internet. 

## Introduction to CIDR

During the Internet's infancy, the format of IP addresses was much simpler. As seen in [RFC 760](https://datatracker.ietf.org/doc/html/rfc760#section-3.1), published in January 1980, the first 8 bits of each IP address identified which network it originated from, and the remaining 24 bits were unique to each host. This limited the Internet to just 256 networks (technically 254 since addresses beginning with 0 are reserved for local use and addresses beginning with 255 are used for broadcast). It soon become apparent that the Internet would grow to encompass much more than just 256 networks, so the [classful network](https://en.wikipedia.org/wiki/Classful_network) scheme was adopted.

Under classful networking, each network belongs to one of three classes:
* Class A: The first 8 bits of the IP address identify the network, leaving 24 bits = 16,777,216 addresses for host identification.
* Class B: The first 16 bits of the IP address identify the network, leaving 16 bits = 65,536 addresses for host identification.
* Class C: The first 24 bits of the IP address identify the network, leaving 8 bits = 256 addresses for host identification.

(The actual scheme had some more details which are omitted here.)

Eventually, engineers realized that the classful networking scheme was still rather inefficient; the size difference between classes was far too granular, and many IP addresses were going to waste. So classful networks were done away with, and a new system, [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) (CIDR), was adopted.

Under CIDR, the number of network/host bits is variable, instead of being fixed at 8, 16, or 24. This allowed IPs to be allocated with much less overhead. In CIDR notation, the length of the network prefix is written after the IP and separated with a slash. For example, the IP of this server at the time of writing is 142.93.26.121. It belongs to a bigger subnet, 142.93.16.0/20, which encompasses all IP addresses whose first 20 bits match those of 142.93.16.0. The length of this network's prefix is 20 bits, leaving 12 bits for hosts on the subnet, which gives it a maximum capacity of 2<sup>12</sup> = 4096 hosts.

Complementary to CIDR is the idea of a *netmask*. For a given classless network, its netmask is a special 32-bit value where all the prefix bits are set to 1 while all the host bits are cleared. The routing prefix of an address can be obtained by finding the bitwise AND of the address and the netmask. If the routing prefix doesn't match that of the local network, your computer won't perform an ARP lookup, since only machines on the same LAN can be contacted via MAC address.

<div class="info-box">

Check out my [CIDR calculator](https://bithole.dev/tools/cidr.html), which performs a number of useful operations given a CIDR range.

</div>

## Going Public

So what happens when your computer encounters an IP that isn't on the LAN? Thankfully for your poor computer, handling the routing of this packet across the public Internet is mostly outside of its responsibilities. Your computer has a [*default route*](https://en.wikipedia.org/wiki/Default_route), which specifies who to contact to relay packets outside the local network. That device is called the **default gateway**, since it serves as a gateway to the rest of the world.

<div class="info-box">

Your computer uses the default gateway's IP (which can be printed via `ipconfig` on Windows or `ip a` on Linux) to figure out its MAC address via ARP. However, the IP packets sent to the default gateway still have the final recipient's IP address, since obviously the default gateway needs to know who to send it to.

Many residential routers also serve a management page from the default gateway IP. This is purely by convention. The router can distinguish traffic to the gateway itself and traffic to the public internet by looking at the destination address of incoming packets.

</div>

Your router itself has a default gateway, too. In fact, your router's view of the internet isn't really different from that of your computer's: it too is just part of a bigger network, owned by your ISP instead of you. Other than that, pretty much all the other details stay the same; your router has a subnet mask, it performs ARP requests, and it relays packets which aren't on its network to the default gateway. In fact, your router probably obtains its address from the ISP through DHCP as well. (That's why rebooting your router may result in your home network being assigned a new IP address. Realistically, however, most routers remember their previous IP address and simply request the same one when they boot up again.)

<div class="info-box">

Access to the ISP's network is controlled via MAC address. Because of this, if you choose to use your own router instead of your ISP's equipment, you may have to contact them so that they can add your router's MAC address to their records. Conversely, if you know the MAC address of a subscriber on the same WAN, you can spoof it to get free Internet. Be warned, though, this is [fairly illegal...](https://www.techdirt.com/articles/20140616/06521227593/when-aaron-swartz-spoofed-his-mac-address-it-proved-he-was-criminal-when-apple-does-it-its-good-everyone.shtml)

</div>

## NAT: A Perpetual Annoyance

Hey, remember IPv4 exhaustion? Yup. It's me again. Here to make your life slightly worse for the umpteenth time. *When will you learn?*

As I write this blogpost, IPv6 will have been available for an entire decade in just a couple months, yet [IPv6 adoption](https://www.google.com/intl/en/ipv6/statistics.html) still languishes at around 35%. As it stands, the *majority* of the Internet is only available over IPv4, yet IANA allocated all of its IP addresses to the RIRs in [2011](https://itp.cdn.icann.org/en/files/announcements/release-03feb11-en.pdf); [RIPE NCC](https://www.ripe.net/), one of the five RIRs, was the last to [run out of addresses](https://www.ripe.net/publications/news/about-ripe-ncc-and-ripe/the-ripe-ncc-has-run-out-of-ipv4-addresses) in 2019. Nowadays, if you want to get your hands onto some IPv4 addresses, you'll have to turn to the [IP aftermarket](https://auctions.ipv4.global/), where you'd be paying a price of anywhere from 40 to 120 bucks a pop. 

This ever-worsening drought of IP addresses has forced the Internet's biggest players, the ISPs, to get creative. One solution that has been used to combat IPv4 exhaustion is [Network Address Translation](https://en.wikipedia.org/wiki/Network_address_translation) (NAT). NAT precludes the need to assign every device on a household network a unique IP address. Here's how it works.

![diagram of NAT](static/images/nat.png)

*What a typical NAT setup looks like.*

Each device on the LAN has a private IP address. In this case, the addresses are from the 10.0.0.0/8 block, one of three blocks which are [reserved](https://datatracker.ietf.org/doc/html/rfc1918) for use within private networks. These are not directly usable for accessing the internet; most networks are configured to [reject](https://en.wikipedia.org/wiki/Bogon_filtering) packets originating from outside the network with a private IP. Instead, when the NAT router receives a packet from a device that is destined for the public Internet, it overwrites the original address with the router's public address before relaying it. This way, all the devices on the LAN can access the Internet through just one address.

*But wait*, you might say. *When the router receives an incoming packet, how does it know which device to forward it to?* Ah. You've stumbled across one of NAT's biggest flaws. The protocol that is being NATed must provide some way to keep track of which connection is which. For TCP, arguably the most common protocol on the Internet, this is done through the port number. For instance, if 10.0.0.1 makes a request to public IP 100.2.3.4, the router will overwrite both the source address in the IP header and the source port in the TCP header with an arbitrary, unique port. It will remember this port information and, when 100.2.3.4 sends a TCP response, the router can forward the packets to the appropriate device on the local network by reading which port they are addressed to.

The fact that the router must remember which port is associated with which local connection makes NAT *stateful*, which stands directly at odds with IP's *stateless* nature. Furthermore, NAT also violates the [end-to-end principle](https://en.wikipedia.org/wiki/End-to-end_principle), which states that protocol logic should only be handled at each end of the network route; intermediate nodes shouldn't need to know anything about the data they are relaying. Even worse, there are some protocols that simply don't work with NAT.

Finally, while NAT works reasonably well for consumers, it is for the most part fundamentally incompatible with server hosting, which requires listening on a *specific* well-defined port that often can't be changed. If you've ever tried to host a Minecraft server out of your home network, you're probably familiar with this struggle. This hasn't stopped Google from offering [cloud NAT](https://cloud.google.com/nat/docs/overview) for serving multiple unrelated services on different ports.

NAT doesn't have to stop at the residential level, though. Under [carrier-grade NAT](https://en.wikipedia.org/wiki/Carrier-grade_NAT) (CGNAT), entire WANs are encapsulated under address translation, further reducing IPv4 address usage. IANA [allocated](https://datatracker.ietf.org/doc/html/rfc6598) the 100.64.0.0/10 block for use with CGNAT in 2012.

# Where Does Internet Actually Come From?

We've established that your router doesn't really do anything special, it just serves as a gateway between your LAN and your ISP's larger network. So how does your ISP get on the Internet? This is where things really start getting interesting.

So far, our trusty little packet has faced some pretty tough trials. He was disassembled and reassembled when he crossed the NAT firewall, and now he's being bounced around the ISP's internal network. How does he find his way to the Promised Land, the destination IP?

Routing within the ISP network may be driven by any one of several protocols. [Intermediate System to Intermediate System](https://en.wikipedia.org/wiki/IS-IS) (IS-IS) and [Open Shortest Path First](https://en.wikipedia.org/wiki/Open_Shortest_Path_First) (OSPF) are often used for internal routing, from what I gather, but information on the topology of ISP networks and how they manage their routes is scarce as expected. Both IS-IS and OSPF are [link state routing protocols](https://en.wikipedia.org/wiki/Link-state_routing_protocol), meaning that routers broadcast their links to the internal network, allowing other routers to build a map of the network and calculate the optimal route to each node using an algorithm such as [Dijkstra's algorithm](https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm).

But what if the destination isn't in the ISP's network?

## Autonomous Systems

At the very top level, the Internet is organized into [autonomous systems](https://en.wikipedia.org/wiki/Autonomous_system_(Internet)). Generally, all the IPs within an AS are controlled by one organization (usually a corporation) and can reach each other without leaving the AS. The AS is defined by the list of routing prefixes that belong to the AS, and each AS is assigned a number (an ASN) by our good friend IANA.

<div class="info-box">

ASNs were initially 16-bit, but eventually it became obvious that the supply was about to run out, so IANA started allocating [32-bit ASNs](https://datatracker.ietf.org/doc/html/rfc4893) in 2007.

</div>

When you look at the Internet at the AS level, the illusion is truly stripped bare, and you can see the Internet for what it is: a bunch of servers, organized into ASes, with connections running between them.

Routing between ASes is universally done via the [Border Gateway Protocol](https://en.wikipedia.org/wiki/Border_Gateway_Protocol), which is a [path vector routing protocol](https://en.wikipedia.org/wiki/Path-vector_routing_protocol) as opposed to a link state routing protocol. Instead of broadcasting the existence of links throughout the network, BGP routers advertise which ASes they can reach and the path to take to their peers. This has the benefit of preventing the possibility of a loop, which would pose a serious problem at a global scale. In general, BGP is designed to reduce volatility in Internet routing. To reduce network usage and routing table size, BGP routers may use heuristics to selectively reject routes, a process known as [route filtering](https://en.wikipedia.org/wiki/Route_filtering). (The side-effect of route filtering is that no router on the Internet has a complete view of *all* routes, so collecting statistics on the routing table requires careful observation from numerous viewpoints.)

![diagram of interaction between internal and external networks](static/images/routing-protocols.png)

*Diagram of the various routing protocols found on the Internet. Internal links are highighted in red; border routers are highlighted in green.*

The BGP routing itself looks just like the routing table you'd find on your router or computer, just *much bigger* (around 900,000 unique prefixes at the time of writing). Its functionality remains unchanged, though. When a border router receives a packet:
* If the packet is destined to the internal network, it relays the packet based on whatever routing protocol the AS internally uses.
* Otherwise, it consults its routing table, finds the best next hop, and relays the packet to that BGP peer.

Not every AS is connected with each other; often, Internet packets will travel through networks belonging to several ASes until they reach their destination. You can see this for yourself using the [traceroute](https://linux.die.net/man/8/traceroute) utility. Many Internet infrastructure operators also run public [Looking Glass](https://en.wikipedia.org/wiki/Looking_Glass_server) servers, which allow users to run traceroutes or retrieve BGP route information from their backbone servers. In particular, SdV operates a [graphical traceroute tool](http://bgpmap.sdv.fr/) which lets you visualize all the routes to a certain IP available in their border gateways' routing tables. Here's an example output for [8.8.8.8](https://developers.google.com/speed/public-dns), which is Google's public DNS project.

![bgp map to google dns](static/images/bgp-traceroute.gif)

The red arrows signify the best path, the one that packets would actually follow in the network. As you can see, there is more than one way to reach the destination; Google is part of [France-IX](https://www.franceix.net/en/), which SdV is also a member of. The purple rectangles represent border routers within SdV's own network; they aren't shown for other networks since they are normally obscured from public view.

<div class="info-box">

The way `traceroute` works is really fascinating. Ever wonder how it figures out the route a packet takes between point A and point B when the Internet Protocol suite seemingly provides no such functionality? The answer is remarkably clever. It starts by sending a packet to the destination with a TTL of 1. This packet will travel down one hop along the route before the router sees that the TTL has reached zero, and sends an ICMP error message to the original sender. This reveals the first router along the path; a packet of TTL 2 will reveal the second router, and so on, until the destination IP is reached. 

</div>

## The Politics of Peering

In the words of [Kenneth Finnegan](https://blog.thelifeofkenneth.com/), regarding BGP peering:

> This is obviously where human networking becomes exceedingly important in computer networking.

Broadly speaking, inter-AS connections can be categorized into two types:
* **Peering** is an agreement between two ASes to share traffic, usually out of mutual benefit. Most commonly, "peering" refers to *settlement-free peering*, so no party is paying for the connection.
* **Transit** is a paid service where an AS with a highly interconnected global network offers to peer with another AS in exchange for a fee. 

Note that peering and transit are the same thing from a technical standpoint. Also, *BGP peering* simply refers to the existence of a connection between two ASes. It doesn't necessarily mean that no settlement is involved. 

Another staple of backbone routing is the [Internet Exchange Point](https://en.wikipedia.org/wiki/Internet_exchange_point) (IXP). IXPs are essentially a series of interconnected switches, usually managed by a non-profit organization, that allow many ASes to peer with each other without a huge number of cross-connections. 

![picture of an internet exchange](static/images/internet-exchange.jpg)

*A switch belonging to [AMS-IX](https://en.wikipedia.org/wiki/Amsterdam_Internet_Exchange), one of the world's biggest Internet exchanges. [Photo](https://en.wikipedia.org/wiki/File:AMS-IX_optical_patch_panel.jpg) by Fabienne Serriere / [CC BY-SA](https://creativecommons.org/licenses/by-sa/3.0/deed.en)*

IXPs are a pretty great thing for a number of reasons. They provide a way to peer with numerous other ASes, reducing latency for everyone, while avoiding the large number of physical connections that would be necessary to reach the same level of connectedness that would be necessary otherwise.

![peering diagram](static/images/peering.png)

If you are interested in internet exchanges, I encourage you to checkout the [Fremont Cabal Internet Exchange](https://fcix.net/), a burgeoning IXP based out of Fremont, California (which is also my hometown!) The [blogpost](https://blog.thelifeofkenneth.com/2018/04/creating-internet-exchange-for-even.html) about its creation is as informative as it is humorous.

## Not All ASes Are Made Equal

Some ASes are more connected than others. You may hear talk about so-called "tier 1" networks; generally speaking, tier 1 networks are ASes which don't need to pay for transit to reach any other AS on the Internet. They are [few and far between](https://en.wikipedia.org/wiki/Tier_1_network#List_of_Tier_1_networks), mostly because the Internet has grown to the point where it's very hard to reach *every* network without at least paying somewhere along the way.

Historically, many tier 1 networks were primarily located in the US, resulting in a lot of traffic flowing through US networks. This trend has [slowly eroded](https://www.nytimes.com/2008/08/30/business/30pipes.html?pagewanted=all), however, as Internet infrastructure becomes more advanced in other countries. Conversely, the NSA [diverts American traffic](https://tcf.org/content/report/surveillance-without-borders-the-traffic-shaping-loophole-and-why-it-matters/) offshore so that it can legally perform surveillance.

Tier 1 networks are followed by tier 2 (pay for transit to reach some ASes) and tier 3 (exclusively pay for transit). 

## BGP Mishaps

BGP has a history of high-profile screwups with cascading consequences, often taking down large segments of the Internet. Just last year, Facebook suffered a [total outage](https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/) due to what later turned out to be a BGP misconfiguration. BGP is in fact rather vulnerable to [hijacking attacks](https://en.wikipedia.org/wiki/BGP_hijacking), since any AS could announce a high-priority bogus route that could make affected network prefixes unroutable. [Resource Public Key Infrastructure](https://en.wikipedia.org/wiki/Resource_Public_Key_Infrastructure) (RPKI) was created to resolve this problem, but adoption still remains a challenge. Here are some notable BGP incidents:
* February 2008: Pakistan Telecom (AS17557) [brought YouTube offline](https://www.ripe.net/publications/news/industry-developments/youtube-hijacking-a-ripe-ncc-ris-case-study) by broadcasting prefixes for YouTube IPs in a severely misguided attempt to block the website.
* August 2014: Canadian hackers repeatedly [redirected traffic](https://www.secureworks.com/research/bgp-hijacking-for-cryptocurrency-profit) through their servers to steal cryptocurrency miners' earnings. 
* December 2017: A Russian autonomous system (AS39523) [announced routes](https://bgpmon.net/popular-destinations-rerouted-to-russia/) for prefixes normally leading to services run by Apple, Facebook, Microsoft, and others. This came after years of no route announcements.

BGP has faced other issues than hijacking, though. Though not a problem with the protocol itself, historically many border routers had a limit of 512K routes, so when the BGP routing table suddenly grew to above that threshold on August 12, 2014, numerous Internet companies [faced outage](https://www.theguardian.com/technology/2014/aug/14/internet-infrastructure-needs-updating-more-blackouts-will-happen) as BGP routing slowed to a crawl.

# Multicast and Anycast

So far, we've only discussed *unicast* traffic, where packets are routed from one host to the next. However, IP also supports alternative routing schemes.

**Anycast routing** allows numerous geographically separate hosts to operate under the same IP. When you send a packet to an anycast address, it is delivered to the "closest" host as seen by the core routers along the path. This allows traffic to be automatically distributed between several servers, potentially reducing latency and increasing throughput. However, because IP is stateless, packets addressed to anycast packets are not guaranteed to arrive at the same host, which could potentially disrupt stateful protocols like TCP. As a result, anycast is most popular for scaling protocols where transactions are short-lived (and thus the odds of a connection being disrupted are low). In particular, many DNS services (such as all of the [root name servers](https://en.wikipedia.org/wiki/Root_name_server) and many popular DNS resolvers) are scaled using anycast.

**Multicast routing** allows packets to be delivered to any hosts which have indicated that they are willing to participate in a given *multicast group*, managed by the [Internet Group Management Protocol](https://en.wikipedia.org/wiki/Internet_Group_Management_Protocol) (IGMP). All multicast packets have destination addresses in the 224.0.0.0/4 range as [reserved](https://datatracker.ietf.org/doc/html/rfc5771) by IANA. Senders of multicast periodically use IGMP to query the network for participants; hosts interested in receiving multicast packets on a specific address join that group by responding to the query. 

One of the most common protocols that uses multicast routing is [multicast DNS](https://en.wikipedia.org/wiki/Multicast_DNS) (mDNS), which is essentially a variant of DNS that works over multicast. It is often used to discover devices on the LAN such as printers.

![mdns traffic on my LAN](static/images/mdns-capture.png)

*mDNS traffic on my LAN. I'm pretty sure it's from my printer.*

Unlike anycast, multicast generally doesn't work outside of local networks; most providers do not route multicast traffic through their networks because it can potentially be used to amplify a [denial of service](https://en.wikipedia.org/wiki/Denial-of-service_attack) attack, flooding hosts' networks with packets and preventing users from accessing their services.

# IPv6

IPv6 is the successor of IPv4, created to solve various problems with the original Internet protocol (beyond just IPv4 exhaustion). However, it still fulfills the same role as IPv4, and as a result most protocols built on top of IP work fine with both protocols (though some modifications may be necessary to work with the longer addresses).

One of IPv6's most attractive features is its longer address length (128 bits), meaning that every device can have its own IP address instead of resorting to ugly solutions such as NAT. This restores the end-to-end principle on the Internet. In addition, IPv6 packet headers have been considerably simplified, allowing for faster processing by routers. One way this was accomplished was by removing the concept of fragmentation from IPv6; instead, the sender is responsible for discovering the maximum MTU that a given route can accept (which is guaranteed to be at least [1280 bytes](https://datatracker.ietf.org/doc/html/rfc2460)).

IPv6 also supports multicast traffic; in fact, broadcast is entirely supplanted by multicast. There are special addresses used for routing packets to all nodes or routers on a local network, but these are all implemented using [Multicast Listener Discover](https://datatracker.ietf.org/doc/html/rfc3810), IPv6's replacement for IGMP.

# To Be Continued

This blogpost is long enough already, so I will write the rest of it some other day. Here is a rough list of what I plan to include:
* Transport-layer protocols
    * TCP
    * UDP
* Application-layer
    * HTTPS
        * X.509 and TLS
        * chain of trust
    * DNS
        * types of records
        * rDNS

If there is something which you think belongs in either this blogpost or the next, please let me know.

# Further Reading / References
* [What is BGP? - Cloudflare](https://www.cloudflare.com/learning/security/glossary/what-is-bgp/)
* [What is an Internet exchange point? - Cloudflare](https://www.cloudflare.com/learning/cdn/glossary/internet-exchange-point-ixp/)
* [Creating an Autonomous System for Fun and Profit - The Life of Kenneth](https://blog.thelifeofkenneth.com/2017/11/creating-autonomous-system-for-fun-and.html)
* [Creating an Internet Exchange for Even More Fun and Less Profit - The Life of Kenneth](https://blog.thelifeofkenneth.com/2018/04/creating-internet-exchange-for-even.html)
* [RFC 791 (IPv4) - IETF](https://datatracker.ietf.org/doc/html/rfc791)
* [RFC 8200 (IPv6) - IETF](https://datatracker.ietf.org/doc/html/rfc8200)