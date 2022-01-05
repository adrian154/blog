Some time ago, it occurred to me that I didn't *really* understand what made the Internet work. Sure, I am all too familiar with what the user experience is like, and my adventures in web development have forced me to acquire a fair bit of networking knowledge, but between the bits of light there existed vast chasms of confusion. So I decided to do some reading, some soul-searching, and publish my findings in the form of a blog post.

The word "internet" itself offers some hints about its architecture. "Internet" is short for *internetworking*, the act of connecting multiple computer networks so that they can communicate. That's essentially what the Internet is, a bunch of independently maintained networks that are connected such that any two computers on the Internet can reach each other.

## A Word on Layers

The Internet is powered by an ever-expanding family of technologies and protocols. These systems are segregated into layers, and each layer is responsible for providing an interface that allows the next layer to do *its* job. This layered model serves as a great way to understand the Internet starting from the ground up. In reality, the divisions between these layers are not as concrete as one would hope, and as a result there is quite a bit of disagreement over how to best model the Internet stack (primarily between supporters of the OSI model and the TCP/IP model). Since this debate is incredibly contentious, I will do my best to avoid it.

# Physical Layer

Let's start from the very bottom. No Internet, no networks even. Consider two computers: how can digital data be transferred from one to another? The answer to this question is the **physical layer**, which describes how to transmit ones and zeroes over a physical transmission medium. On top of the physical layer lies the **link layer**, which leverages the physical layer's capabilities to transfer full *frames* of data over a network that may be more complicated than a single point-to-point link. (The link layer may also take on other responsibilities such as error correction and retransmission.)

The physical layer and link layer are generally tightly coupled (out of necessity), which is the source of endless frustration. For example, the term "Ethernet" might refer to the physical cable standard, but it could also refer to the Ethernet protocol used to transfer frames over those cables.

The full answer is that Ethernet has many sublayers, which reside at varying levels within the physical and link layers. Twisted-pair Ethernet cables themselves are governed by a flock of partially agreeing standards; here's what [Wikipedia](https://en.wikipedia.org/wiki/Category_6_cable) has to say about it:

> Confusion therefore arises because of the naming conventions and performance benchmarks laid down by the International ISO/IEC and American TIA/EIA standards, which in turn are different from the regional European standard, EN 50173-1. In broad terms, the ISO standard for Cat 6A is the most stringent, followed by the European standard, and then the American standard.

*That* is a mess that I have no interest in delving into. But Ethernet supports much more than just twisted-pair cables; it can be run over other physical media such as coaxial cable or  optical fiber. Those standards are managed by [IEEE 802.3](https://en.wikipedia.org/wiki/IEEE_802.3), which also handles the link-layer details of Ethernet. 

Beyond Ethernet, there are no shortage of other ways to physically connect devices. Here are some prolific examples:
* WiFi ([IEEE 802.11](https://en.wikipedia.org/wiki/IEEE_802.11))
* Cable ([DOCSIS](https://en.wikipedia.org/wiki/DOCSIS))
* [LTE](https://en.wikipedia.org/wiki/LTE_(telecommunication))

For every surviving technology, there are probably around ten dead ones. One example is [Token Ring](https://en.wikipedia.org/wiki/Token_Ring), IBM's Ethernet competitor that was famously vanquished around the turn of the century.

One thing that all [IEEE 802](https://en.wikipedia.org/wiki/IEEE_802) technologies have in common is **medium access control** (**MAC**), which enables communication between devices on the same **local area network** (**LAN**). Each device (more accurately, each [interface](https://en.wikipedia.org/wiki/Network_interface_controller)) is given a unique 48-bit address. These addresses are allocated by the IEEE to equipment manufacturers, though some mobile devices simply generate a [random MAC address](https://support.apple.com/guide/security/wi-fi-privacy-secb9cb3140c/web) when connecting to a network to avoid being tracked. 

Devices called [network switches](https://en.wikipedia.org/wiki/Network_switch) allow communication between devices on the same LAN. A switch is basically an embedded device with a large number of Ethernet ports. Because all devices on the network communicate with each other by talking through the switch, a [star topology](https://en.wikipedia.org/wiki/Star_network) is formed.

![star topology diagram](static/images/switch-star-topology.png)

*In case you can't tell, I'm not exactly the best at making diagrams.*

When computer A wants to send a message to computer B, it sends a frame to the switch; the frame header indicates that its destination is computer B's MAC address. However, the switch doesn't know which physical port the connection to computer B is located on, so it relays the frame to all connected computers, hoping that one of them is the intended recipient. When computer B receives the frame, it might reply with another frame. Since each frame has the sender's MAC address as well as the recipient's, when the switch receives a frame from computer B it will associate the port that computer B is connected on with computer B's MAC address, and in the future when the switch receives a frame with computer B as its destination it can simply relay the frame on the correct link instead of *flooding*.

<div class="info-box">

Back in the day, when everything was slightly worse, networks were often created using [hubs](https://en.wikipedia.org/wiki/Ethernet_hub) instead of switches. Hubs are much simpler devices which simply retransmit everything that it receives to all other devices. Because of their relative lack of sophistication, hubs suffer from a littany of problems:
* Since every device needs to be able to receive the data being transmitted by the hub, if one device was slower than the others, *every* link on the switch would be forced to operate at that speed.
* Multiple devices trying to transmit at the same time would result in a garbled mess being transmitted (a condition known as a [collision](https://en.wikipedia.org/wiki/Carrier-sense_multiple_access_with_collision_detection)), requiring the hub to detect the conflict and temporarily stop all transmissions. This obviously degraded network performance.

Today, hubs have been made obsolete in favor of switches and are rarely used outside of special conditions (though evidently my school's IT department hasn't gotten the memo). Even in the early days of Ethernet, it was apparent that collisions posed a challenging problem, so other protocols approached access control differently. For example, in Token Ring setups, there is no central switch or hub; nodes are connected in a ring, and transmission rights are passed around the ring. When one node is done transmitting, it passes the *token* to the next node. Hence the name, Token Ring. \*roll credits\*

</div>

Switches are one of the most ubiquitous building blocks of computer networks, so it's no surprise that they are all over the place. If your router has more than one Ethernet port, chances are it has a built-in switch.

## WiFi

An overview of physical-layer protocols just wouldn't be complete without a mention to WiFi, standardized by [IEEE 802.11](https://en.wikipedia.org/wiki/IEEE_802.11). The idea of a point-to-point link starts to break down when it comes to wireless communications because radio signals will propagate to every connected device whether you like it or not. Thus, WiFi networks use an algorithm called [Multiple Access with Collision Avoidance](https://en.wikipedia.org/wiki/Multiple_Access_with_Collision_Avoidance) to ensure that only one device tries to transmit data at a time. Receiving frames is simpler; devices simply decode all incoming frames and pick out the ones that are actually destined towards their MAC address. In this way, a WiFi network functions more closely to an Ethernet hub than a switch.

In this situation, no router or switch is necessary to relay messages between devices on the same WLAN. In fact, any WiFi-capable transceiver can [broadcast a network](https://en.wikipedia.org/wiki/Wireless_ad_hoc_network); in fact, Windows [natively supports](https://answers.microsoft.com/en-us/windows/forum/all/how-do-i-set-up-an-ad-hoc-wifi-network-in-windows/0caa92d8-e02f-4e7f-aa5c-0abf10ed2039) this feature! Instead, your router plays the role of a [wireless access point](https://en.wikipedia.org/wiki/Wireless_access_point), aptly abbreviated to **WAP**. (In light of "WAP" becoming rather vulgar in recent years, I will use the more succinct abbreviation of just **AP** for the rest of this post.) The role of an AP is simple; it just serves as an interface between the wireless network and the regular wired network, which has access to the public Internet. Speaking of which...

# Internet Layer

We've finally reached the Internet layer of the Internet. This is where all the action happens! Buckle up, and let's explore how it works.

At this point, the dirty details of the physical connections have all been abstracted away. IP knows nothing about Ethernet or .