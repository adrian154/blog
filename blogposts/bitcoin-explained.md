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

<aside>



</aside>

This seemingly makes our currency watertight, but... how exactly do we keep nodes from trying to spend the same output several times? The way Bitcoin approaches this problem forms the foundation of blockchain technology. Let's dig in.

# Double Spending and Consensus

Double spending is a problem that most conventional payment systems don't have. For instance, it is physically impossible to double-spend cash; if I pay someone with a five-dollar note. I can't pay someone else with that note since I no longer have it after the transaction. But the Bitcoin network suffers from incomplete knowledge: because messages have to be relayed from node-to-node, the order which members of the network receive transactions can vary wildly. 

This can easily be exploited in our current scheme. Suppose Izaan creates two transactions, one where 

# References

* [Satoshi Nakamoto - Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)