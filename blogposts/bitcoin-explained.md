There's a small chance you might have heard of this thing called [Bitcoin](https://en.wikipedia.org/wiki/Bitcoin). Well, the principles behind it are rather fascinating. Unfortunately, in the recent frenzy of hype around "decentralization" and (*retching*) Web3, it seems that nuanced discussion about how these decentralized systems actually work has been all but lost. So let's take a deep dive into the bowels of Bitcoin.

Before we begin, let's establish a baseline of how conventional payment systems work so that we can contrast it with how Bitcoin operates. The modern financial system has taken on a great deal of complexity over the ages, but a simplification will do for our purposes: a centralized organization, such as your bank, is responsible for keeping track of its clients' account balances. When a transaction is made, the bank updates the balances of each party involved in the transaction. This system works very well from a functional standpoint, but such a system has two disadvantages:

* Your account is entirely controlled by whichever organization you choose to keep your money with.

* All of your transactions must be tied to a real-world identity.

These issues can be remedied by eliminating the central authority, but this raises an obvious problem: who keeps track of transactions, then? Bitcoin solves this by keeping a full record of all transactions (the *ledger*) on every node in the network.

# The Ledger

Suppose that I (Adrian) and three other friends&mdash;we'll call them Jayant, Akarsh, and Izaan&mdash;want to create a decentralized payment system. We come up with a simple scheme: whenever one of us makes a transaction, we will record it in our personal ledger and relay it to another member of the network, who will repeat this process until everyone has seen the transaction.

This works fine, initially; we can keep track of how much money each person has by finding the difference between how much money they've received and how much money they've sent. This way, transactions where a person attempts to spend more money than they actually have can be rejected. However, this scheme has some major problems.

**Transaction Authenticity**

Anyone can make a transaction as anybody else. For example, Jayant could fabricate a transaction where I send him all of my funds, and broadcast it to the network. This is obviously unacceptable, but it's actually easily solved with cryptography. 

## Digital Signatures

<figure style="max-width: 491px">
    <img src="resources/bitcoin/digital-signature.png" alt="illustration of a digital signature scheme">
    <figcaption>A diagram of a public-key digital signature scheme. <a href="https://en.wikipedia.org/wiki/File:Private_key_signing.svg">Image</a> by <a href="https://commons.wikimedia.org/wiki/User:FlippyFlink">FlippyFlink</a> / <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA</a></figcaption>
</figure>

Thanks to the magic of cryptography, there are schemes which allow you to produce a digital signature which anyone can verify but no one can forge. Here's how it works:

* First, the signer generates a value known as a private key. An algorithm is used to derive the corresponding public key. The keypair has the property that you cannot determine the value of the private key from the value of the public key, so it is safe to distribute the public key.

* To sign a message, the signer feeds the message and the private key into a signing algorithm, which produces a fixed-length digital signature. This signature can then be distributed alongside the message to prove its authenticity.

* Anyone can input the message, the signature, and the signer's public key into a verification algorithm. The verification will fail if the message has been altered or the signature is not valid.

Digital signatures can help us secure our transaction system against impersonation. We can switch to using public keys instead of names instead of identities. By requiring that each transaction contain a valid signature, we make it essentially impossible for someone to create transactions as someone else.

However, digital signatures do not fully solve our problems. For example, if I made a transaction sending Akarsh some money, while he's unable to create a transaction using my identity since he cannot forge the signature, he can simply rebroadcast the same transaction sending him money as many times as he'd like, executing a [replay attack](https://en.wikipedia.org/wiki/Replay_attack). We can fix this scheme by embracing the notion of unspent transaction outputs.

## Unspent Transaction Outputs

So far, we've regarded our digital currency as only existing in abstract quantities. The truth is, Bitcoin handles things a little differently.

In the Bitcoin protocol, each transaction is an entity with inputs and outputs. Each input references the output of a previous transaction. By mandating that a given output can only be spent once, we prevent replay attacks from succeeding. This also simplifies transaction validation, since nodes can simply maintain a list of unspent transaction outputs ([UTXOs](https://en.wikipedia.org/wiki/Unspent_transaction_output)) instead of going through every single transaction in the ledger.

Here's an example of how UTXOs work. Suppose Akarsh sends me 10 coins. He would use one of his UTXOs as the input to the transaction, which would have an output of 10 coins to my public key and another output back to Akarsh if the value of the input was not exactly equal to 10, kind of like change in a cash transaction. If I wanted to send 7 coins to Jayant, I would create a transaction with the output of the prior transaction as the input. The new transaction would have two outputs, one addressed to Jayant worth 7 coins, and one addressed to me worth 3 coins. 

<figure style="max-width: 793px">
    <img src="resources/bitcoin/utxo.png" alt="diagram of the previously described exchange">
    <figcaption>A visual representation of the exchange, totally not drawn in MS Paint. Note that this is a simplification; today, most transactions have multiple inputs and outputs.</figcaption>
</figure>

This seemingly makes our currency watertight, but... how exactly do we keep nodes from trying to spend the same output several times? The way Bitcoin approaches this problem forms the foundation of blockchain technology. Let's dig in.

# Double Spending and Consensus

Double spending is a problem that most conventional payment systems don't have. For instance, it is physically impossible to double-spend cash; if I pay someone with a five-dollar note. I can't pay someone else with that note since I no longer have it after the transaction. But the Bitcoin network suffers from incomplete knowledge: because messages have to be relayed from node-to-node, the order which members of the network receive transactions can vary wildly. 

This can easily be exploited in our current scheme. Suppose Jayant and Adrian both operate online businesses which accept our hypothetical cryptocurrency. Izaan could create two transactions, one to Adrian and one to Jayant, and send them both into the network at the same time. Nodes which receive his transaction to Adrian first will reject the one to Jayant, and nodes which receive his transaction to Jayant first will reject the one to Adrian. Essentially, there is disagreement about the order of transactions. Without resolving conflicts like this, the network cannot function.

One logical solution to this problem is to take a vote. All nodes will accept the most popular option, and the network will come to agreement about the state of the ledger. But how do we allocate these votes? A naive solution would be to assign each host (each IP address) one vote, but as explained in the Bitcoin whitepaper, this has obvious pitfalls:

> If the majority were based on one-IP-address-one-vote, it could be subverted by anyone able to allocate many IPs. 

The way Bitcoin gets around this problem is insanely clever (in my book), but it is also the #1 contributor to Bitcoin's inefficiency and high environmental impact. Here's how it works.

# Blockchain and Proof of Work

<figure style="max-width: 1022px">
    <img src="resources/bitcoin/blockchain.png" alt="diagram of the blockchain from the bitcoin whitepaper">
    <figcaption>The blockchain, as depicted in the Bitcoin whitepaper, in all its unadulterated glory.</figcaption>
</figure>


Now is probably a good time to drop the concept of the ledger and introduce the concept of the [blockchain](https://en.wikipedia.org/wiki/Blockchain). The two are very similar datastructures; ultimately, both serve as linear records of transactions. However, if the entire network had to come to an agreement over every single transaction, the overhead would be tremendous (especially since *most* transactions aren't double-spend attempts, so wasting time on synchronization is pointless). Thus, we aggregate transactions into *blocks*, each of which can contain hundreds of transactions.

Before we can discuss how Bitcoin is secured, we must first introduce the concept of a [cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function), or just a hash. Cryptographic hashes are functions which take an input of any size and output a fixed-size hash. These functions have a couple important properties:

* It is very difficult to determine the input based on the output.
* As a corollary, it is very difficult to determine which input will produce a specific output.
* A small change in the input will result in a very significant change in the output.

Bitcoin is built around the [SHA-256](https://en.wikipedia.org/wiki/SHA-2) hash function. SHA-256 is one if not *the* most popular cryptographic hash function; it has withstood over 20 years of cryptanalysis while still remaining very secure.

During normal operation of the network, nodes known as *miners* continually accept incoming transactions and validate them. Then, they combine the transactions with a couple of fields to create a new block header. A block header contains the following fields:
* A version number
* The hash of the previous block in the chain
* The hash of all the transactions contained within the block
* The time at which the block was mined
* The target
* The nonce

<aside>

TODO: Talk about Merkle trees and why they're useful in SPV

</aside>

Since each header contains a reference to the previous header in the form of a cryptographic hash, the blockchain can be thought of as a singly-linked list of block headers.

There are two fields here whose meaning is not self-apparent: the target, and the nonce. Both have to do with the **mining** process, which is how new blocks are generated. Biascally, there's a 256-bit value called the *target*, which every node calculates independently based on previous blocks. The job of the miner is to adjust the nonce so that the SHA256 hash of the block header is lower than the target. The miner has no way to intelligently determine what value of the nonce will fulfill this condition; their only choice is to repeatedly hash the block, incrementing the nonce one at a time, until they've successfully mined the block. 

<aside>

To incentivize mining, miners are allowed to include a **coinbase transaction** in each block, crediting themselves with a certain amount of Bitcoin as a reward for their efforts. Coinbase transactions have non-zero outputs but no inputs, so they are how new Bitcoins are introduced into the system. 

The maximum amount which a miner can claim from a new block is hard-coded into all nodes on the network. The reward from the first block was 50 Bitcoins; subsequently, the reward is halved every 210,000 blocks. Nodes will reject blocks where the miners try to reward themselves too much Bitcoin.

</aside>

What purpose does this serve? Recall the vote allocation problem from earlier. Mining is how members of the Bitcoin network cast a vote for whichever version of the blockchain they believe is correct. You can't forge a vote because it's not possible to mine a new block without doing all the work; mining is a very computationally expensive process, so an attacker would have to procure an astonishing amount of processing power to overrule legitimate miners on the network.

<aside>

This is where the concept of the **51% attack** (also known as the majority attack) arises. If an attacker can produce new blocks faster than the rest of the network, they could create an alternative chain that will be preferred by nodes on the network, giving them the ability to replace recent blocks. Thankfully, the network hashrate is high enough that such an attack is very implausible.

</aside>

It can be shown that proof-of-work effectively addresses the double spending problem. Consider a situation where we've created two conflicting transactions, and broadcast them simultaneously. Each miner will accept only one of the conflicting transactions to be included in a block. Eventually, one miner will "win", and other miners will forget the other transaction to work on the longest chain.

This is what makes Bitcoin transactions irreversible: to replace an old block, you'd need to create a new blockchain with more work put into it than the primary chain. The difficulty of performing such an attack increases rapidly over time. As a result, the older the transaction is, the harder it is to reverse. As a rule of thumb, once a transaction has 6 "confirmations" (6 blocks mined after the one it was included in), it is considered irreversible. For low-value transactions, it's OK to accept them when they have 1 or even 0 confirmations.

# Difficulty Adjustment

Since the creation of Bitcoin, more and more miners have joined the network, causing the rate at which blocks are being attacked to increase tremendously. As of the writing of this article, the Bitcoin network performs around around 225 exahashes per second, which is an unimaginably large number. For reference, 225 exaseconds is equal to approximately 7 trillion years. If the target remained constant, so many blocks would be mined per second that the network would surely collapse.

To counteract this, Bitcoin nodes are programmed to automatically readjust the target from time to time so that blocks are produced at a steady rate. This process is known as difficulty adjustment.

Difficulty adjustment is implemented as a recalculation of the target value every 2,016 blocks. The formula which Bitcoin clients use to determine the new target is tailored to produce a block time of 10 minutes, on average.

# References

* [Satoshi Nakamoto - Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)
* [Bitcoin-Akka (full Bitcoin implementation in Scala with associated commentary)](http://hhanh00.github.io/bitcoin-akka-tutorial/index.html)
* [Bitcoin.org Developer Documentation](https://developer.bitcoin.org/devguide/index.html)
* [Andreas Antonopoulos - Mastering Bitcoin](https://aantonop.com/books/mastering-bitcoin/)