In my opinion, the most annoying thing about traveling to China is, by and large, the [Great Firewall](https://en.wikipedia.org/wiki/Great_Firewall)&mdash;a collective term for various technologies used by the PRC to block a plethora of Western websites. For most people, this means no Google services, which is a very painful sacrifice to live with. So, let's learn about how we can circumvent the GFW.

At the most basic level, the Great Firewall blocks content through DNS hijacking IP-based packet dropping. For example, if we try to resolve the domain `google.com`, we receive a bogus response generated by the GFW. Even if you send the query to a host that isn't even running a resolver, you'll still receive the spoofed response.

(TODO: DNS hijacking demo)

DNS hijacking can be easily bypassed using DNS over TLS or DNS over HTTPS, but even if we have the real IPs of the services we're trying to connect to, any packets to blocked IPs will be dropped by the GFW.

(TODO: packet blocking demo)

This requires us to disguise the destination of our traffic. Usually, this is accomplished by routing through a tunnel, but common VPN protocols like OpenVPN and Wireguard are detected and dropped by the firewall. Thus, we need to take further measures to mask our VPN traffic as regular Internet usage.



## Active Probing
