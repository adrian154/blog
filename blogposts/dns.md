*[This article is part of a series.](internet-part-2.html)*

When you typed `blog.bithole.dev` into your browser, it sent a request to 142.93.26.121, which replied with this blogpost. But how did it know where to send the request? The answer is the **domain name system**, or DNS. Let's see how it works.

Back in the days of ARPANET, there was no DNS. Instead, there was one server, the Host Naming Registry (maintained by [Elizabeth Feinler](https://www.internethalloffame.org/inductees/elizabeth-feinler)). If you had a domain, you would send a query to this server, and it would respond with the corresponding IP address. This worked fine for some time, but it quickly became apparent that as the nascent Internet grew, a system which scaled beyond a single node would be necessary. And thus, the present incarnation of the domain name system was born.

DNS is a *distributed database*, organized into a hierarchical structure. Essentially, the responsibility of answering queries for a given *zone* of the domain name space is delegated to a *nameserver*, operated by whoever is in charge of that zone. They can, in turn, delegate their own subzones. 

Every domain name represents a zone. For example, let's look at `wikipedia.org`. 

# Further Reading / References
* [RFC 1034, 1035 (DNS) - IETF](https://datatracker.ietf.org/doc/html/rfc1034)