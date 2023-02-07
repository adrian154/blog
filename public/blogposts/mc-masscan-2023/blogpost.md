Recently, someone's been running a scan of the Internet for Minecraft servers and attempting to join all the ones they've found using the username "masscan". This has led to many people googling some combination of "minecraft" and "masscan" and finding the [blogpost](https://blog.bithole.dev/blogposts/mc-census/) I wrote on scanning for Minecraft servers last year. To make it easier to respond to people regarding the whole situation, I've decided to consolidate answers to all the questions I've received in one place.

## Are you behind this scan?

I am not, and I don't know who is.

## What are the scanner's intentions? Are they trying to hack me?

This remains unclear, although any scans *should* be treated as a security risk. Last year, when the Log4Shell vulnerability was first disclosed, an unidentified individual scanned the Internet for vulnerable servers. Due to poor security practices, a large number of servers (potentially hundreds to thousands) were compromised. I wrote about the technical details of the incident [here](https://blog.bithole.dev/blogposts/dissecting-log4shell/).

## How did this person find my server? I never told anyone the IP.

There are only four billion possible IP addresses, and with a high-speed Internet connection it's possible to connect to every single routable address to check if there's a Minecraft server running there. This is as easy as downloading some off-the-shelf tools like [MASSCAN](https://github.com/robertdavidgraham/masscan) and running a few commands.

## How do I protect my server?

Here are the preventative measures you should be taking:

* Make sure that your server is running in online mode, which is the default. You can do this by opening your server.properties file and ensuring that the `online-mode` setting is set to `true`. If your server is running in offline mode, it blindly trusts that connecting clients are being honest about their identities instead of reaching out to Mojang's authentication servers, leaving your server vulnerable to all sorts of attacks.

    The *only* valid reason to run a server in offline mode is if it is running behind a proxy as part of a multi-server network. If this describes your setup, ensure that people are not capable of directly connecting to the proxied server. This can be accomplished in a number of ways:

    - If the proxy and the proxied server are running on the same machine, configuring the proxied server to bind to `localhost` will prevent it from receiving connections from external hosts.

    - If the servers are running on separate machines, some more planning is necessary. If the servers are on the same LAN, you could bind to a [private IP address](https://en.wikipedia.org/wiki/Private_network). Otherwise, you may need to set up a VPN. I recommend [WireGuard](https://www.wireguard.com/) for this task.

    For more information on securing proxies, check out the PaperMC's [guide](https://docs.papermc.io/velocity/security) on the subject.

* Turn on the whitelist, if your server is not meant to be publicly discoverable. Combined with online mode, this will ensure that no one beyond the players you have whitelisted can join your server.

Things that are *not* sufficient security measures:

* Running your server on a port other than 25565.
* Setting `enable-status` to false.
* Praying that your server won't be scanned (it will be).
