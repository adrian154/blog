*[This article is part of a series.](internet-part-2.html)*

When you typed `blog.bithole.dev` into your browser, it sent a request addressed towards my server at 142.93.26.121, which replied with this blogpost. But how did it know where to send the request? The answer is the **domain name system**, or DNS. Let's see how it works.

Back in the days of ARPANET, there was no DNS. Instead, there was one server, the Host Naming Registry (maintained by [Elizabeth Feinler](https://www.internethalloffame.org/inductees/elizabeth-feinler)). If you wanted to know who was behind a domain, you would send a query to this server, and it would respond with the corresponding IP address. This worked fine for some time, but it quickly became apparent that as the nascent Internet grew, a system which scaled beyond a single node would be necessary. And thus, the present incarnation of the domain name system was born.

DNS is a *distributed database*, organized into a hierarchical structure. Essentially, the responsibility of answering queries for a given *zone* of the domain name space is delegated to a *nameserver*, operated by whoever is in charge of that zone. They can, in turn, delegate their own subzones. Furthermore, DNS can do more than mapping domains to IPs; there are numerous types of **resource records** (or just records) that can be associated with a domain, storing anything not just IPs but also metadata such as where to relay email for the domain to.

Every domain name represents a series of zones, separated by periods. For example, let's look at `wikipedia.org`. This domain can be split into three parts:
* The **root zone**, where the DNS namespace begins. This zone is usually omitted, but in a *fully qualified* domain name, it's indicated by the presence of an additional period at the end; for example, `wikipedia.org` is technically `wikipedia.org.`. 
* `org`, the a **top level domain** (TLD). TLDs are administered by [ICANN](https://www.icann.org/).
* `wikipedia`, the final part of the domain.

Each zone within a domain is serviced by its own *authoritative nameserver*, which is the ultimate source of truth for queries regarding that domain. For example, there are 13 [root nameservers](https://en.wikipedia.org/wiki/DNS_root_zone) that serve as the topmost authorities for DNS namespace; each TLD has its own nameservers, and the same is true for domains registered at those TLDs, like `wikipedia.org`. Here's the basic "thought process" which all authoritative nameservers use to handle a query:
* If the nameserver is authoritative for the domain in question, it indicates that by setting a flag in the response message, and returns any available records that answer the query.
* If the nameserver is not authoritative, it tries to refer the requester to a nameserver which will bring them closer to the authoritative nameserver for the domain.

Talk is cheap, so let's manually resolve a domain by actually making requests to some nameservers. The details of the various bitfields involved in the DNS protocol are out of the scope of this blogpost (go read [RFC 1035](https://datatracker.ietf.org/doc/html/rfc1035) if you're interested), but here's the gist: you can conduct a DNS transaction with a nameserver via several different transport mechanisms. The oldest way involves communicating with the server using UDP packets on port 53. However, the RFC 1035 places a rather strict limitation of up to 512 bytes per message, which simply isn't enough for some queries. If the nameserver indicated that it couldn't fit the entire response into 512 bytes, clients are supposed to retry the query over TCP on port 53. Today, [EDNS](https://en.wikipedia.org/wiki/Extension_Mechanisms_for_DNS) allows clients to signal to servers that they are capable of accepting larger responses, though it is entirely up to the server to honor this request. DNS can also be transported over [TLS](https://en.wikipedia.org/wiki/DNS_over_TLS) or [HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) for increased security.

I'm not exactly interested in building a robust or performant DNS resolver, so for the purpose of this blogpost I chose to stick with DNS over TCP to avoid dealing with truncation.

<div class="info-box">
</div>

# Further Reading / References
* [RFC 1034, 1035 (DNS) - IETF](https://datatracker.ietf.org/doc/html/rfc1034)