[*This post is part of a series.*](internet-series.html)

When you typed `blog.bithole.dev` into your browser, it sent a request addressed towards my server at 142.93.26.121, which replied with this blogpost. But how did it know where to send the request? The answer is the **domain name system**, or DNS. Let's see how it works.

Back in the days of ARPANET, there was no DNS. Instead, there was one server, the Host Naming Registry (maintained by [Elizabeth Feinler](https://www.internethalloffame.org/inductees/elizabeth-feinler)), which answered all queries about domain names with IP addresses. This worked fine for some time, but it quickly became apparent that as the nascent Internet grew, a system which scaled beyond a single node would be necessary. And thus, the present incarnation of the domain name system was born.

We're about to dive deep into the guts of DNS, so brace yourself for some terminology! DNS organizes all domains into a tree data structure. Each section within a domain name (the strings separated by periods) represents a layer in the tree; these layers are called **zones**. Each zone belongs to a parent zone, culminating in the **root zone**, a special zone which is administered by [ICANN](https://www.icann.org/). Zones are serviced by two or more **authoritative nameservers**, which store **resource records** for domains within the zone and respond to queries. Authoritative nameservers are discovered by contacting the authoritative nameserver for the parent zone; the nameservers for the root zone are hardcoded into DNS clients. A resource record is basically a database entry which maps some information to a domain name. For the purposes of domain resolution, this piece of data is usually an IP address, but resource records can also associate a domain with a mailserver, administrative metadata, and a littany of other properties.

To get a better understanding of how DNS works, let's resolve a domain ourselves by querying the nameservers. We can use [dig](https://linux.die.net/man/1/dig) to make DNS requests from the command line.

We'll start from the root zone. There are 13 [logical servers](https://en.wikipedia.org/wiki/Root_name_server) in the root zone, with domains `a.root-servers.net` through `m.root-servers.net`. In reality requests to the root nameservers are spread out among hundreds of physical servers using [anycast routing](https://en.wikipedia.org/wiki/Anycast), but this process is totally transparent, so we don't need to worry about it. Let's ask the J root server if it knows where `docs.google.com` lives.

```plaintext
$ dig A docs.google.com @j.root-servers.net

; <<>> DiG 9.16.1-Ubuntu <<>> A docs.google.com @j.root-servers.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54547
;; flags: qr rd; QUERY: 1, ANSWER: 0, AUTHORITY: 13, ADDITIONAL: 27
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;docs.google.com.               IN      A

;; AUTHORITY SECTION:
com.                    172800  IN      NS      e.gtld-servers.net.
com.                    172800  IN      NS      b.gtld-servers.net.
com.                    172800  IN      NS      j.gtld-servers.net.
com.                    172800  IN      NS      m.gtld-servers.net.
com.                    172800  IN      NS      i.gtld-servers.net.
com.                    172800  IN      NS      f.gtld-servers.net.
com.                    172800  IN      NS      a.gtld-servers.net.
com.                    172800  IN      NS      g.gtld-servers.net.
com.                    172800  IN      NS      h.gtld-servers.net.
com.                    172800  IN      NS      l.gtld-servers.net.
com.                    172800  IN      NS      k.gtld-servers.net.
com.                    172800  IN      NS      c.gtld-servers.net.
com.                    172800  IN      NS      d.gtld-servers.net.

;; ADDITIONAL SECTION:
e.gtld-servers.net.     172800  IN      A       192.12.94.30
e.gtld-servers.net.     172800  IN      AAAA    2001:502:1ca1::30
b.gtld-servers.net.     172800  IN      A       192.33.14.30
b.gtld-servers.net.     172800  IN      AAAA    2001:503:231d::2:30
j.gtld-servers.net.     172800  IN      A       192.48.79.30
j.gtld-servers.net.     172800  IN      AAAA    2001:502:7094::30
m.gtld-servers.net.     172800  IN      A       192.55.83.30
m.gtld-servers.net.     172800  IN      AAAA    2001:501:b1f9::30
i.gtld-servers.net.     172800  IN      A       192.43.172.30
i.gtld-servers.net.     172800  IN      AAAA    2001:503:39c1::30
f.gtld-servers.net.     172800  IN      A       192.35.51.30
f.gtld-servers.net.     172800  IN      AAAA    2001:503:d414::30
a.gtld-servers.net.     172800  IN      A       192.5.6.30
a.gtld-servers.net.     172800  IN      AAAA    2001:503:a83e::2:30
g.gtld-servers.net.     172800  IN      A       192.42.93.30
g.gtld-servers.net.     172800  IN      AAAA    2001:503:eea3::30
h.gtld-servers.net.     172800  IN      A       192.54.112.30
h.gtld-servers.net.     172800  IN      AAAA    2001:502:8cc::30
l.gtld-servers.net.     172800  IN      A       192.41.162.30
l.gtld-servers.net.     172800  IN      AAAA    2001:500:d937::30
k.gtld-servers.net.     172800  IN      A       192.52.178.30
k.gtld-servers.net.     172800  IN      AAAA    2001:503:d2d::30
c.gtld-servers.net.     172800  IN      A       192.26.92.30
c.gtld-servers.net.     172800  IN      AAAA    2001:503:83eb::30
d.gtld-servers.net.     172800  IN      A       192.31.80.30
d.gtld-servers.net.     172800  IN      AAAA    2001:500:856e::30

;; Query time: 4 msec
;; SERVER: 2001:503:c27::2:30#53(2001:503:c27::2:30)
;; WHEN: Wed Feb 02 12:12:41 PST 2022
;; MSG SIZE  rcvd: 840
```

Wow. That's a lot to take in. Let's break down what `dig` outputted.

First, the command basically tells `dig` to contact `j.root-servers.net` via the DNS protocol and ask if it has an A record for the domain `docs.google.com`. An A record associates a domain with an IPv4 address; similarly, AAAA records are the IPv6 counterpart of A records. However, the J root nameserver, as expected, doesn't have the requested record. Instead, it referred us to the nameservers for the `com.` zone:

```plaintext
com.                    172800  IN      NS      e.gtld-servers.net.
com.                    172800  IN      NS      b.gtld-servers.net.
com.                    172800  IN      NS      j.gtld-servers.net.
com.                    172800  IN      NS      m.gtld-servers.net.
com.                    172800  IN      NS      i.gtld-servers.net.
com.                    172800  IN      NS      f.gtld-servers.net.
com.                    172800  IN      NS      a.gtld-servers.net.
com.                    172800  IN      NS      g.gtld-servers.net.
com.                    172800  IN      NS      h.gtld-servers.net.
com.                    172800  IN      NS      l.gtld-servers.net.
com.                    172800  IN      NS      k.gtld-servers.net.
com.                    172800  IN      NS      c.gtld-servers.net.
com.                    172800  IN      NS      d.gtld-servers.net.
```

The act of redirecting queries to another nameserver is known as a **delegation**.

These are NS records, which associate a zone with its authoritative nameserver. In this case, we have 13 nameservers to choose from. Let's just go with the first one, `e.gtld-servers.net`.

<aside>

In addition to NS records, the J root also sent A and AAAA records for the domains of these nameservers:

```plaintext
e.gtld-servers.net.     172800  IN      A       192.12.94.30
e.gtld-servers.net.     172800  IN      AAAA    2001:502:1ca1::30
```

These records are called [glue records](https://datatracker.ietf.org/doc/html/rfc7719#section-6). Why are glue records necessary? Well, `e.gtld-servers.net` is authoritative for multiple top-level domains&mdash;including .net!&mdash;meaning that we wouldn't be able to resolve `e.gtld-servers.net` without contacting `e.gtld-servers.net` first. To break this circular dependency, the parent zone's nameserver sends a glue record.

</aside>

```plaintext
$ dig A docs.google.com @e.gtld-servers.net

; <<>> DiG 9.16.1-Ubuntu <<>> A docs.google.com @e.gtld-servers.net
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 35138
;; flags: qr rd; QUERY: 1, ANSWER: 0, AUTHORITY: 4, ADDITIONAL: 9
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;docs.google.com.               IN      A

;; AUTHORITY SECTION:
google.com.             172800  IN      NS      ns2.google.com.
google.com.             172800  IN      NS      ns1.google.com.
google.com.             172800  IN      NS      ns3.google.com.
google.com.             172800  IN      NS      ns4.google.com.

;; ADDITIONAL SECTION:
ns2.google.com.         172800  IN      AAAA    2001:4860:4802:34::a
ns2.google.com.         172800  IN      A       216.239.34.10
ns1.google.com.         172800  IN      AAAA    2001:4860:4802:32::a
ns1.google.com.         172800  IN      A       216.239.32.10
ns3.google.com.         172800  IN      AAAA    2001:4860:4802:36::a
ns3.google.com.         172800  IN      A       216.239.36.10
ns4.google.com.         172800  IN      AAAA    2001:4860:4802:38::a
ns4.google.com.         172800  IN      A       216.239.38.10

;; Query time: 4 msec
;; SERVER: 2001:502:1ca1::30#53(2001:502:1ca1::30)
;; WHEN: Wed Feb 02 12:17:24 PST 2022
;; MSG SIZE  rcvd: 292
```

The nameserver for the `.com` TLD (top-level domain) doesn't have an A record for `docs.google.com`, either, but it does know the authoritative nameservers for the `google.com` zone, again bringing us closer to an authoritative answer. Let's query `ns2.google.com`.

```plaintext
$ dig A docs.google.com @ns2.google.com

; <<>> DiG 9.16.1-Ubuntu <<>> A docs.google.com @ns2.google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 21549
;; flags: qr aa rd; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1
;; WARNING: recursion requested but not available

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;docs.google.com.               IN      A

;; ANSWER SECTION:
docs.google.com.        300     IN      A       172.217.5.110

;; Query time: 20 msec
;; SERVER: 2001:4860:4802:34::a#53(2001:4860:4802:34::a)
;; WHEN: Wed Feb 02 12:20:20 PST 2022
;; MSG SIZE  rcvd: 60
```

Success! We got an answer to our query. More importantly, take a look at the `flags` section; the `aa` flag means that according to the nameserver, the response we received is authoritative. The process we just did is called an **iterative query**, where we followed the chain of DNS delegations until we reached the source of truth for the zone in question.

<aside>

If you prefer GUIs, you can use an [online tool](https://bithole.dev/tools/dns/) I made to trace DNS delegations. Just click the "iteratively query from root" checkbox and type in the hostname you are interested in.


</aside>

As a quick aside: for all intents and purposes, a top-level domain such as ".com" functions just like a regular domain. ICANN has [stated](https://www.icann.org/en/announcements/details/new-gtld-dotless-domain-names-prohibited-30-8-2013-en) that TLDs should never have A or AAAA records, but this hasn't stopped some TLDs like [.ai](http://ai./) from doing so.

# Recursive Resolvers

Generally speaking, your computer never performs iterative queries by itself. That job is instead offloaded to a special server called a **recursive resolver**. When your computer needs to resolve a domain, it contacts the resolver through the DNS protocol; in turn, the resolver contacts the appropriate nameservers and returns and answer to your machine. This has the benefit of enabling resolvers to cache records for many clients, which is an essential part of how DNS reduces latency and reduces network traffic.

Caching is regulated by the **time-to-live** (TTL) value of each record, which indicates the maximum age of the cached record before it should be considered expired and re-retrieved from the authoritative nameserver. Setting the TTL involves a tradeoff: a value which is too low will result in more unnecessary requests, potentially increasing latency for users. On the other hand, if the TTL is set very high, it could take hours or even days for changes to the DNS records to propagate globally, since it would take a long time before the old cached records expired.

In recent times sysadmins appear to have opted for the former disadvantage in the name of increased flexibility and faster failover. A [2019 analysis](https://blog.apnic.net/2019/11/12/stop-using-ridiculously-low-dns-ttls/) found that nearly half of all domains had TTLs of under a minute.

Your computer probably uses a resolver hosted by your ISP for its customers, though there are also similar, publicly-available services like Cloudflare's [1.1.1.1](https://1.1.1.1/) and Google's [8.8.8.8](https://developers.google.com/speed/public-dns) resolvers.

# Reverse DNS

Under some situations, one might want a service that does the opposite of what regular ("forward") DNS does; that is, discovering a domain name for a given IP address. This is possible using a system known as **reverse DNS**. Reverse DNS queries are virtually identical to regular DNS queries, except they use a special domain known as `in-addr.arpa`. Suppose I have the IP address 198.51.100.0; to look up the domain associated with it, it first needs to be transformed into a domain name by reversing the octets and attaching it to `in-addr.arpa` (yielding `0.100.51.198.in-addr.arpa` in this case). Next, I can look up the PTR record associated with the domain, which will contain the regular domain name which maps to 198.51.100.0.

Reverse DNS is powered by delegations, just like forward DNS. The `in-addr.arpa` zone, which is run by IANA, refers clients to an RIR's reverse DNS nameservers based on the first octet of the IP address. This works out neatly since all IANA allocations are /8's, anyways. However, this scheme tends to break down for classless allocations (i.e. ones which do not fall along an octet boundary) because reverse DNS only splits up each address into four 8-bit sections, meaning that reverse DNS only natively supports blocks of size /8, /16, /24, and /32. If you want finer than 8 bits in granularity, you'll need multiple delegations. For example, if you had a /20, a /16 delegation would be too big and possibly include other organizations' addresses, so you would need to register 2<sup>24 - 20</sup> = 16 /24 delegations to service your allocation.

IPv6 reverse DNS uses the `ip6.arpa` domain, and unlike IPv4 every single hex digit within the address counts as a separate zone. This yields rather unwieldy domain names like `3.5.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.e.7.3.0.0.0.2.6.2.ip6.arpa`, but it offers a much higher granularity of 4 bits. However, the huge number of IPv6 addresses *does* present a scaling challenge to organizations that manage large numbers of IPv6 networks (such as ISPs); approaches towards mangaging reverse DNS for many IPv6 networks are discussed in [RFC 8501](https://datatracker.ietf.org/doc/html/rfc8501). 

# Epilogue

If you liked this article, check out its siblings which talk about other Internet technologies [here](internet-series.html).

# Further Reading / References
* [RFC 1034: DNS Concepts (IETF)](https://datatracker.ietf.org/doc/html/rfc1034)
* [RFC 1035: DNS Protocol (IETF)](https://datatracker.ietf.org/doc/html/rfc1035)
* [RFC 2317: Classless Reverse DNS (IETF)](https://datatracker.ietf.org/doc/html/rfc2317)