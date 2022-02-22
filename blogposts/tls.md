<noscript><b>If you are reading this message, JavaScript is not enabled. Unfortunately, this page relies on JS to dynamically generate content which you may not be able to view. Some parts of this article may be inaccessible.</b></noscript>

The Internet is, by default, not secure. In TCP and below, everything is transferred in plaintext; an attacker could snoop on your communications or, worse, masquerade as the person you think you're talking to. Yet today, most users don't have to worry about those kinds of attacks. Why not? The answer is **Transport Layer Security**, which transparently secures much of the modern Web. Strap in, because we're about to learn some cryptography.

# Conceptual Overview

TLS aims to create a secure channel with these three properties: **confidentiality**, **authenticity**, and **integrity**. These three properties go hand in hand, but each one has a distinct meaning. 

## Confidentiality

It's pretty easy to see why confidentiality is important. Nobody wants a third party to be able to read your communications, because that would obviously compromise your security. The solution is to encrypt your data with a cipher, an algorithm which accepts a plaintext and a key and produces a ciphertext, such that it is easy to retrieve the plaintext if you have the key, but virtually impossible without it. When a cipher uses the same key to encrypt and decrypt data, it is called a [symmetric cipher](https://en.wikipedia.org/wiki/Symmetric-key_algorithm).

Symmetric ciphers are great because they're usually very fast and very secure, but they do have one weakness: key exchange. The two communicating parties need to figure out a way to share a secret key without the possibility of anyone else obtaining it. This creates a bit of a chicken-and-egg problem; after all, they can't establish a private means of communication without negotiating a key first, which just brings us back to square one. To solve this problem, we need to get a little more clever.

Enter the [Diffie-Hellman Key Exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange). It enables a client and a server to generate the same secret value while only exchanging publicly knowable data, which sounds impossible until you take a look at how it works. Here's a diagram that explains the steps of Diffie-Hellman key exchange using colors of paint as a stand-in for cryptographic keys.

![DHKE diagram using paint analogy](resources/tls/DHKE-paint-analogy.png)

<br>

We can make this model a little more rigorous by replacing the paints with variables. Suppose `C` is some common value that both Alice and Bob know. The paint-mixing operation can be modeled as an operation `*`, with the following properties:

* It is easy to compute `x * y`, but even if the value of `x` or `y` is known, it should be very difficult to retrieve the other operand from the result of the operation. Examples of such operations will be discussed later.
* The operation must be associative, i.e. `(x * y) * z` = `(x * z) * y`.

(Don't let the notation confuse you. `*` does *not* represent regular multiplication, which wouldn't work for this process since it doesn't fulfill our first requirement.)

Now, we're ready to do the key exchange. Alice generates a random secret `A`, and Bob generates a random secret `B`. Alice sends Bob `A * C` and Bob sends Alice `B * C`. Now, Alice can compute `A * (B * C)` and Bob can compute `B * (A * C)`. Because the operation is associative, Alice and Bob arrive at the same value, which they can now use as the key to a symmetric cipher.

However, if an attacker could observe the key exchange between Alice and Bob, they would only obtain `A * C` and `B * C`. The attacker probably knows `C`, but because reversing the operation is hard, the attacker cannot calculate `A` or `B`, and thus cannot determine the shared secret.

<div class="info-box">

Diffie-Hellman key exchange is where mathematical concepts such as [groups](https://en.wikipedia.org/wiki/Group_(mathematics)) become very useful. A group is a structure consisting of a set of elements and an operation which accepts two elements and produces one element. This operation must be associative (among other requirements).

The characteristics of certain groups make them useful for key exchange, and cryptography in general. For example, [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) uses a [multiplicative group of integers modulo *n*](https://en.wikipedia.org/wiki/Multiplicative_group_of_integers_modulo_n) where the modulus is a large semiprime. RSA's security relies on the fact that [factoring large integers](https://en.wikipedia.org/wiki/Integer_factorization) is very difficult, and there are no methods fast enough to factor the extremely large semiprimes used in RSA.

Today, cryptosystems based on [elliptic curve groups](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) have become popular since they offer similar security to RSA, but with much smaller and thus more convenient keys. These constructions make use of a property which certain elliptic curve groups possess: if a starting point *P* is added to itself *n* times, it is very difficult to determine *n* even if both the starting point and the ending point are known. This is known as the elliptic curve discrete logarithm problem, and so far very little progress has been made in the way of attacking it.

I'm really terrible at explaining group theory, so if you want to learn more check out this [short introduction](https://math.mit.edu/~jwellens/Group%20Theory%20Forum.pdf).

</div>

## Authenticity

Confidentiality is worthless if you can't ensure that the person on the other end of the line is who you actually *intend* to talk to. One of TLS's jobs is to help the server prove that it is who it claims to be. This is accomplished with the help of digital signatures.

Digital signatures are a form of [public key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography), so the client first has to generate a keypair. This is usually done by creating a private key from random data, and then deriving a public key using a process specific to the signature scheme. The public key serves as the cryptographic identity of the client, and it can be distributed safely without compromising the private key.

To create a digital signature, the client uses the signing algorithm to convert their private key and a piece of data into a short piece of data known as a signature. Signatures are useful since they have the following properties:
* Anyone can prove that a signature is valid using just the public key and the signed data.
* The signature won't validate if the data doesn't match what was originally signed.
* No one can create a signature without possessing the private key.

One can imagine a scheme involving a trusted third party that leverages the power of digital signatures to associate a public key with a real-world identity. Suppose Bob wants to send a message to Alice, but he wants to assure Alice that the message was actually sent by him and not an impostor. Sure, he could sign the message, but what good is that if Alice doesn't know his public key? This is one of the fundamental problems in public key cryptography: establishing a relationship between a useful identity and a public key.

Here's how TLS approaches this problem. Bob is friends with Carol, who's so famous that everybody knows her public key. Bob asks Carol to sign the following statement:

> Bob's public key is 123456789.

Carol makes sure that the person she's talking to is actually Bob, and signs Bob's statement (which is known as a *certificate* in cryptography). Now, Bob can send Alice his certificate, allowing Alice to be sure of Bob's public key. This allows him to use digital signatures to prove the authenticity of his communications from after that point.

This, in essence, is how TLS performs authentication. Carol represents a group of organizations known as [certificate authorities](https://en.wikipedia.org/wiki/Certificate_authority), whose public keys are hardcoded into most browsers. Certificates on the web don't usually link a human name to a public key; instead, the "useful identity" they try to prove is usually a domain name. Furthermore, the CA may not directly sign a website's certificate. Instead, they may sign the certificate for an *intermediate* keypair, which does the task of actually signing end user certificates. This sequence can extend for as many signers as necessary, creating a **chain of trust**.

![chain of trust diagram](resources/tls/certificate-chain-of-trust.png)

*A rough diagram showing how a verifiable chain of trust is created using digital signatures. [Image](https://en.wikipedia.org/wiki/File:Chain_Of_Trust.svg) by Yukhih / [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/deed.en)*

You can see this at play for pretty much any website you visit. If you're on Chrome, simply click the padlock button next to the address bar in your browser, and you'll see the option to view the website's certification path. Here's what you would probably see for this page:

![picture of the ssl cert for this site](resources/tls/windows-cert-view.png)

During the TLS handshake process, all three of these certificates were sent from my server to your browser. The first certificate named `bithole.dev` contains my server's public key, as well as a reference to `R3`'s public key and a signature made with that public key. In turn, `R3` is signed by `ISRG Root X1`, whose fingerprint is hardcoded into your browser as one of several trusted **root certificates**. Your browser can follow this chain of signatures and verify that each certificate is valid.

Simply receiving a valid certificate doesn't prevent man-in-the-middle attacks, though. Certificates are public knowledge; my webserver has to actually prove ownership of the corresponding private key somehow. TLS makes the server sign the hash of all the messages sent before certificate verification. This assures the client that at no point during the handshake did an attacker mingle in their communications.

*If a CA issued a certificate to a hacker, wouldn't my computer blindly trust it?* you might ask. The answer is yes, unfortunately. That's why there are so few root CAs, which are audited frequently. This is also why most sites' certificates aren't directly signed by the root certificate. The root certificate is kept offline for maximum security, and all signing is done with an intermediate signed by the root instead. In the event that the intermediate certificate is compromised, things are *bad* but not *really bad*; the CA can simply issue a new intermediate instead of trying to get every user to adopt a new root certificate.

In theory, a trusted CA should ony issue certificates to people who can actually prove ownership of a domain&mdash;for example, Let's Encrypt checks if a specific DNS record has been deployed for verification&mdash;but ultimately you cannot be 100% sure that these entities will not try to attack your TLS connections. In response, some organizations choose to run their own internal CA and issue their own certificates. This removes the dependence on an external entity, but requires that all users manually add the CA's root certificate to their computer's list of trusted certificates. As a result, it's only really feasible to secure closed systems like enterprise environments this way.

Here's a conversational illustration of all these concepts at play in a TLS handshake.

<div class="conversation">
    <div class="conversation-header">
        <div><b>Client</b></div>
        <div><b>Server</b></div>
    </div>
    <div>
        <div class="client-says">Hello, here are the cipher suites I support, as well as a public key I have generated for this session.</div><div></div>
    </div>
    <div>
        <div></div><div class="server-says">Let's use <...> as the cipher suite for this connection. Here is the public key I have generated for this session.</div>
    </div>
    <div>
        <div class="conversation-center"><i>Both sides calculate the shared secret.</i></div>
    </div>
    <div>
        <div></div><div class="server-says">Here is my certificate. It is signed by R3, which is signed by ISRG Root X1 (which is hopefully in your trusted certificates list). In addition, here is a digital signature of all the messages I've sent so far, which you can verify using the public key contained within my certificate.</div>
    </div>
    <div>
        <div class="client-says">Your certificate appears valid, and so does the signature. I am now convinced of your identity and will start sending encrypted data.</div><div></div>
    </div>
</div>

## Integrity

Even if you have authenticated with a server and established a secure channel, there still remains a problem: an attacker who controls the network between you and your destination can still modify the ciphertext messages being exchanged. The attacker doesn't need to be able to decipher the messages; for example, simply resending the same ciphertext could result in a request being repeated if the proper protections aren't in place. This is known as a [replay attack](https://en.wikipedia.org/wiki/Replay_attack).

A system vulnerable to such an attack would be unacceptable for many applications. Ideally, we also want some strong cryptographic guarantee that the message wasn't tampered with in transit. TLS accomplishes this using [authenticated encryption](https://en.wikipedia.org/wiki/Authenticated_encryption).

In TLS 1.3, integrity is handled by only using ciphers which include **authenticated encryption with associated data (AEAD)**. When encrypting data using an AEAD cipher, an authentication tag is produced in addition to the ciphertext. The auth tag allows clients to verify that the plaintext matches what was originally encrypted. In addition, the auth tag can also guarantee the validity of some associated data not included within the ciphertext. All of this is done without leaking any information about the encrypted data itself.

With all of that being said, let's actually examine a recorded TLS session and see how all of these cryptographic concepts are implemented.

# Client Handshake Key Generation

Before the client even begins the handshake, it first generates an [x25519](https://cr.yp.to/ecdh.html) keypair for use in key exchange later down the road. The private key is simply generated by generating 32 bytes of random data. Here is the client's private key, which is never sent over the network:

```plaintext
186b7a9daf3855fa090bf29a69391dc1ee788393f2dba58a23cab0f6b96d6355
```

The public key is generated by multiplying the fixed starting point (x = 9) by the private key. The elliptic-curve discrete logarithm problem prevents attackers from calculating the private key from the starting point and the public key. This is the public key, which you will see later in the exchange:

```plaintext
4b65e1788c1999350d0a44f50646a75c392584735d96d6d0b35b61c2f9375931
```

# C → S: Client Hello

TLS handshakes begin with the Client Hello message, where the client declares its capabilities to the server. Most importantly, it lists the TLS versions it understands as well as a list of supported ciphers for encryption.

**Guide**: Click on a section of the packet to see a description of its significance. Click the hex preview on the left to return to the top. Try enabling "show all" if you want to read all the section descriptions.

<div class="client packet">
<div class="segment" data-hex="1603010158" data-name="Record Header">

Messages in a TLS session are exchanged in the form of *records*. All records begin with a [header](https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.1) that gives information about the content of the record.

* `16`: record type (22 for handshake)
* `03 01`: protocol version (TLS 1.0 for backwards compatibility)
* `01 58`: length of payload (344 bytes)

</div>
<div class="segment" data-hex="01000154" data-name="Handshake Header">

The [Client Hello](https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3) message begins with a four-byte header describing the contained data.

* `01`: message type (1 for ClientHello)
* `00 01 54`: message length (340 bytes)

</div>
<div class="segment" data-hex="0303" data-name="ClientHello Version">

In TLS 1.2 and below, this field indicated the highest version supported by the client. However, using this field for version negotiation has been deprecated in favor of the `supported_versions` extension, so in TLS 1.3 this field is set to `0x0303` (TLS 1.2) to support older servers.

</div>
<div class="segment" data-hex="035735d60c9512c61134349e99999105922738a7ee2110b0692817ec961a21dd" data-name="Random">

The client shares 32 bytes of randomness that are used later in the handshake process.

</div>
<div class="segment" data-hex="20cce0a325341c9485b11e794e263fe3c3399204aaec8dc73eb996cd79f973d1b2" data-name="Legacy Session ID">

Previously, this value was used to identify clients across sessions. However, since this functionality is now handled using pre-shared keys in TLS 1.3, clients just generate a random session ID each time to avoid confusing intermediate clients which may only support TLS 1.2.

* `20`: length of the session ID (between 0 and 32)
* `cc ce 0a ... 73 d1 b2`: session ID

</div>
<div class="segment" data-hex="0076130213031301c02fc02bc030c02c009ec0270067c028006b00a3009fcca9cca8ccaac0afc0adc0a3c09fc05dc061c057c05300a2c0aec0acc0a2c09ec05cc060c056c052c024006ac0230040c00ac01400390038c009c01300330032009dc0a1c09dc051009cc0a0c09cc050003d003c0035002f00ff" data-name="Cipher Suites">

In this section of the handshake, the client lists all the cipher suites which it supports. Each cipher is identified by a two-byte number assigned by [IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4). The server uses this info to find a preferable cipher that both sides support.

* `00 76`: length of cipher suite list (118 bytes)
* `13 02 13 ... 2f 00 ff`: list of ciphers in order of preference
    * `13 02`: TLS_AES_256_GCM_SHA384
    * `13 03`: TLS_CHACHA20_POLY1305_SHA256
    * `13 01`: TLS_AES_128_GCM_SHA256
    * `c0 2f`: TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
    * `c0 2b`: TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
    * `c0 30`: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
    * `c0 2c`: TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
    * `00 9e`: TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
    * `c0 27`: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
    * `00 67`: TLS_DHE_RSA_WITH_AES_128_CBC_SHA256
    * `c0 28`: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
    * `00 6b`: TLS_DHE_RSA_WITH_AES_256_CBC_SHA256
    * `00 a3`: TLS_DHE_DSS_WITH_AES_256_GCM_SHA384
    * `00 9f`: TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
    * `cc a9`: TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
    * `cc a8`: TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
    * `cc aa`: TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256
    * `c0 af`: TLS_ECDHE_ECDSA_WITH_AES_256_CCM_8
    * `c0 ad`: TLS_ECDHE_ECDSA_WITH_AES_256_CCM
    * `c0 a3`: TLS_DHE_RSA_WITH_AES_256_CCM_8
    * `c0 9f`: TLS_DHE_RSA_WITH_AES_256_CCM
    * `c0 5d`: TLS_ECDHE_ECDSA_WITH_ARIA_256_GCM_SHA384
    * `c0 61`: TLS_ECDHE_RSA_WITH_ARIA_256_GCM_SHA384
    * `c0 57`: TLS_DHE_DSS_WITH_ARIA_256_GCM_SHA384
    * `c0 53`: TLS_DHE_RSA_WITH_ARIA_256_GCM_SHA384
    * `00 a2`: TLS_DHE_DSS_WITH_AES_128_GCM_SHA256
    * `c0 ae`: TLS_ECDHE_ECDSA_WITH_AES_128_CCM_8
    * `c0 ac`: TLS_ECDHE_ECDSA_WITH_AES_128_CCM
    * `c0 a2`: TLS_DHE_RSA_WITH_AES_128_CCM_8
    * `c0 9e`: TLS_DHE_RSA_WITH_AES_128_CCM
    * `c0 5c`: TLS_ECDHE_ECDSA_WITH_ARIA_128_GCM_SHA256
    * `c0 60`: TLS_ECDHE_RSA_WITH_ARIA_128_GCM_SHA256
    * `c0 56`: TLS_DHE_DSS_WITH_ARIA_128_GCM_SHA256
    * `c0 52`: TLS_DHE_RSA_WITH_ARIA_128_GCM_SHA256
    * `c0 24`: TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
    * `00 6a`: TLS_DHE_DSS_WITH_AES_256_CBC_SHA256
    * `c0 23`: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
    * `00 40`: TLS_DHE_DSS_WITH_AES_128_CBC_SHA256
    * `c0 0a`: TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
    * `c0 14`: TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
    * `00 39`: TLS_DHE_RSA_WITH_AES_256_CBC_SHA
    * `00 38`: TLS_DHE_DSS_WITH_AES_256_CBC_SHA
    * `c0 09`: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
    * `c0 13`: TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
    * `00 33`: TLS_DHE_RSA_WITH_AES_128_CBC_SHA
    * `00 32`: TLS_DHE_DSS_WITH_AES_128_CBC_SHA
    * `00 9d`: TLS_RSA_WITH_AES_256_GCM_SHA384
    * `c0 a1`: TLS_RSA_WITH_AES_256_CCM_8
    * `c0 9d`: TLS_RSA_WITH_AES_256_CCM
    * `c0 51`: TLS_RSA_WITH_ARIA_256_GCM_SHA384
    * `00 9c`: TLS_RSA_WITH_AES_128_GCM_SHA256
    * `c0 a0`: TLS_RSA_WITH_AES_128_CCM_8
    * `c0 9c`: TLS_RSA_WITH_AES_128_CCM
    * `c0 50`: TLS_RSA_WITH_ARIA_128_GCM_SHA256
    * `00 3d`: TLS_RSA_WITH_AES_256_CBC_SHA256
    * `00 3c`: TLS_RSA_WITH_AES_128_CBC_SHA256
    * `00 35`: TLS_RSA_WITH_AES_256_CBC_SHA
    * `00 2f`: TLS_RSA_WITH_AES_128_CBC_SHA
    * `00 ff`: TLS_EMPTY_RENEGOTIATION_INFO_SCSV

TLS 1.3 only recommends five cipher suites, of which three are listed: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, and TLS_AES_128_GCM_SHA256. However, 56 other cipher suites were sent in this message. They are present for backwards compatibility (since the client does not know whether the server supports TLS 1.3 yet), but these are not available in TLS 1.3.

</div>
<div class="segment" data-hex="0100" data-name="Legacy Compression Methods">

Previously, compression methods were listed here. However, it was discovered that through carefully crafted messages, an attacker could infer properties about the encrypted data in a TLS connection by analyzing the size of the compressed data, an attack that has since been dubbed [CRIME](https://en.wikipedia.org/wiki/CRIME). In TLS 1.3, compression is no longer supported, so this field contains a single supported compression method (none).

* `01`: length of compression methods list
* `00`: no compression

</div>
<div class="segment" data-hex="0095" data-name="Extensions">

The extensions section contains records providing more information about the client. A full list of extensions and their respective RFCs can be found [here](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml).

* `00 95`: length of extensions (149 bytes)

</div>
<div class="segment" data-hex="000b000403000102" data-name="Extension: ec_point_formats">

This extension lists the [elliptic curve](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) encodings that the client can parse, in order of preference.

* `00 0b`: extension type (11 for ec_point_formats)
* `00 04`: extension data length (4 bytes)
    * `03`: length of format list (3 bytes)
        * `00`: uncompressed points are supported
        * `01 02`: deprecated formats ([X.962](https://standards.globalspec.com/std/1955141/ANSI%20X9.62)) which clients must still declare support for, as specified in [RFC 8422](https://www.rfc-editor.org/rfc/rfc8422.html#section-5.1.2)

</div>
<div class="segment" data-hex="000a00160014001d0017001e0019001801000101010201030104" data-name="Extension: supported_groups">

This extension lists the elliptic curves which the client supports, in order of preference. 

* `00 0a`: extension type (10 for supported_groups)
* `00 16`: extension data length (22 bytes)
    * `00 14`: length of curve list (20 bytes)
        * `00 1d`: x25519
        * `00 17`: secp256r1
        * `00 1e`: x448
        * `00 19`: secp512r1
        * `00 18`: secp384r1
        * `01 00`: ffdhe2048
        * `01 01`: ffdhe3072
        * `01 02`: ffdhe4096
        * `01 03`: ffdhe6144
        * `01 04`: ffdhe8192

</div>
<div class="segment" data-hex="00230000" data-name="Extension: session_ticket">

This extension identifies the client for [TLS session resumption](https://www.rfc-editor.org/rfc/rfc5077.html). In this case, the client doesn't have a session ticket yet, so it requests one by sending a ticket of length zero.

* `00 23`: extension type (35 for session_ticket)
* `00 00`: data length (none)

</div>
<div class="segment" data-hex="00160000" data-name="Extension: encrypt_then_mac">

This extension indicates that the client supports the [encrypt-then-MAC](https://www.rfc-editor.org/rfc/rfc7366.html) scheme, which aims to fix the security issues inherent to MAC-then-encrypt.

* `00 16`: extension type (22 for encrypt_then_mac)
* `00 00`: data length (none)

</div>
<div class="segment" data-hex="00170000" data-name="Extension: extended_master_secret">

This extension indicates that the client supports [extended master secrets](https://www.rfc-editor.org/rfc/rfc7627.html), a TLS 1.2 extension which seeks to harden the session against man-in-the-middle attacks by calculating the master secret using the hash of prior handshake messages. This is not relevant for TLS 1.3, as you will see later.

* `00 17`: extension type (23 for extended_master_secret)
* `00 00`: data length (none)

</div>
<div class="segment" data-hex="000d002a0028040305030603080708080809080a080b080408050806040105010601030303010302040205020602" data-name="Extension: signature_algorithms">

This extension allows clients to declare which digital signature algorithms they support. Since clients rely on these algorithms to verify the server's identity, the server may take these values into account later in the handshake process.

* `00 0d`: extension type (13 for signature_algorithms)
* `00 2a`: data length (42 bytes)
    * `00 28`: length of signature algorithms list (40 bytes)
        * `04 03`: ecdsa_secp256r1_sha256
        * `05 03`: ecdsa_secp384r1_sha384
        * `06 03`: ecdsa_secp521r1_sha512
        * `08 07`: ed25519
        * `08 08`: ed448
        * `08 09`: rsa_pss_pss_sha256
        * `08 0a`: rsa_pss_pss_sha384
        * `08 0b`: rsa_pss_pss_sha512
        * `08 04`: rsa_pss_rsae_sha256
        * `08 05`: rsa_pss_rsae_sha384
        * `08 06`: rsa_pss_rsae_sha512
        * `04 01`: rsa_pkcs1_sha256
        * `05 01`: rsa_pkcs1_sha384
        * `06 01`: rsa_pkcs1_sha512
        * `03 03`: SHA224 ECDSA
        * `03 01`: SHA224 RSA
        * `03 02`: SHA224 DSA
        * `04 02`: SHA256 DSA
        * `05 02`: SHA384 DSA
        * `06 02`: SHA512 DSA

</div>
<div class="segment" data-hex="002b00050403040303" data-name="Extension: supported_versions">

This extension lists the TLS versions which the client supports. This is how the server detects that the client is trying to initiate a TLS 1.3 session.

* `00 2b`: extension type (43 for supported_versions)
* `00 05`: data length (5 bytes)
    * `04`: length of version list (4 bytes)
        * `03 04`: TLS 1.3
        * `03 03`: TLS 1.2

</div>
<div class="segment" data-hex="002d00020101" data-name="Extension: psk_key_exchange_modes">

This extension lists the supported key exchange modes for pre-shared keys. This session was created to resemble what one would find in a regular HTTPS transaction, so we won't be presharing keys. 

* `00 2d`: extension type (45 for psk_key_exchange_modes)
* `00 02`: data length (2 bytes)
    * `01 01`: PSK with (EC)DHE key establishment

</div>
<div class="segment" data-hex="003300260024001d00204b65e1788c1999350d0a44f50646a75c392584735d96d6d0b35b61c2f9375931" data-name="Extension: key_share">

The client sends its public keys to the server in this extension. If the server supports the algorithm of the key sent in the handshake, all messages following the ClientHello can be encrypted. If the server doesn't support any of the key share algorithms, it may ask the client to resend the ClientHello message via a [Hello Retry Request](https://datatracker.ietf.org/doc/html/rfc8446#section-4.1.4), 

* `00 33`: extension type (51 for key_share)
* `00 26`: data length (38 bytes)
    * `00 24`: length of key share list
        * `00 1d`: key exchange curve (x25519) 
        * `00 20`: key length (32 bytes)
        * `4b 65 e1 ... 37 59 31`: public key, which was derived [earlier](#client-handshake-key-generation)

</div>
</div>

<div class="info-box">

If all the mismatching TLS versions scattered throughout the packet are confusing, don't worry. There's a whole section in the TLS 1.3 RFC describing the various backwards compatibility measures taken to avoid confusing intermediate nodes, something they've termed [middlebox compatibility mode](https://datatracker.ietf.org/doc/html/rfc8446#appendix-D.4).

</div>

# Server Handshake Key Generation

The server uses the same process as the client to generate its keypair. It starts by generating a private key:

```plaintext
d8b3916b7e1ed8d6fa07c7810eef53639b77e51e0fd8e044c1c9e1186fd63c49
```

From this, the public key is derived.

```plaintext
011b5df090006e814ab8db60f6a2765cb90fe7fce73559e914796dafe6719c40
```

# S → C: Server Hello

The server responds to Client Hello with connection parameters such as the TLS version it has chosen to use, the session ID, and its own public key in response to the key_shares sent by the client.

<div class="server packet">
<div class="segment" data-hex="160303007a" data-name="Record Header">

Similar to the previous message, the server also claims that the message version is TLS 1.2 to avoid confusing intermediate clients. However, at this point both the client and server have decided on using TLS 1.3. Some of the fields here are very similar to those in the previous message, so various sections are condensed and some redundant descriptions are omitted.

* `16`: record type (22 for handshake)
* `03 03`: protocol version (TLS 1.2 for backwards compatibility)
* `00 7a`: length of payload (122 bytes) 

</div>
<div class="segment" data-hex="02000076" data-name="Handshake Header">

* `02`: message type (2 for ServerHello)
* `00 00 76`: message length (118 bytes)
* `03 03`: version (this field must be set to TLS 1.2 as per the TLS 1.3 spec)

</div>
<div class="segment" data-hex="0303b21fc7065806a4d46abbc3efea46c59d664440debce77c19305ec080430ae7b8" data-name="Random">

Like the client, the server also provides 32 bytes of randomness, which is used later in the handshake.

</div>
<div class="segment" data-hex="20cce0a325341c9485b11e794e263fe3c3399204aaec8dc73eb996cd79f973d1b2" data-name="Legacy Session ID">

The server resends the session ID found in the Client Hello message, because this field is not used in TLS 1.3.

</div>
<div class="segment" data-hex="1302" data-name="Cipher Suite">

This field indicates that the server has chosen to use TLS_AES_256_GCM_SHA384 as the cipher suite for this session. This means that messages will be encrypted using [AES-256](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), and all operations involving cryptographic hashes will use [SHA-384](https://en.wikipedia.org/wiki/SHA-2).

</div>
<div class="segment" data-hex="00" data-name="Legacy Compression Methods">

The only compression method which TLS 1.3 clients are allowed to offer is `00` (no compression), so the server selects that method.

</div>
<div class="segment" data-hex="002e" data-name="Extensions Length">

* `00 2e`: length of extensions (46 byte)

</div>
<div class="segment" data-hex="002b00020304" data-name="Extension: supported_versions">

* `00 2b`: extension type (43 for supported_versions)
* `00 02`: data length (2 bytes)
* `03 04`: selected TLS version (TLS 1.3)

</div>
<div class="segment" data-hex="00330024001d0020011b5df090006e814ab8db60f6a2765cb90fe7fce73559e914796dafe6719c40" data-name="Extension: key_share">

The server acknowledges the public key shared in the ClientHello message by responding with a public key using the same cipher. 

* `00 33`: extension type (51 for key_share)
* `00 24`: data length (36 bytes)
    * `00 1d`: key exchange curve (x25519)
    * `00 20`: key length (32 bytes)
    * `01 1b 5d ... 71 9c 40`: public key, which was derived [earlier](#server-handshake-key-generation)

</div>
</div>

# Handshake Key Exchange 

At this point, both the client and the server are ready to perform the key exchange calculations necessary to secure the rest of the handshake. First, each party generates a shared secret by multiplying the shared secret by the other party's public key (from the key_share). On the client's side:

```plaintext
client_privkey x server_pubkey = shared_secret
186b7a9daf3855fa090bf29a69391dc1ee788393f2dba58a23cab0f6b96d6355 x
011b5df090006e814ab8db60f6a2765cb90fe7fce73559e914796dafe6719c40 =
4c75e186e47a2627bb4501955a051d516653d9570f34c660e623d26e2175b956
```

On the server's side:

```plaintext
server_privkey x client_pubkey = shared_secret
d8b3916b7e1ed8d6fa07c7810eef53639b77e51e0fd8e044c1c9e1186fd63c49 x
4b65e1788c1999350d0a44f50646a75c392584735d96d6d0b35b61c2f9375931 = 
4c75e186e47a2627bb4501955a051d516653d9570f34c660e623d26e2175b956
```

From here, TLS uses a process known as the [key schedule](https://datatracker.ietf.org/doc/html/rfc8446#section-7.1) to derive a set of keys from the shared secret. Essentially, it uses a set of cryptographic operations to take several "sources of entropy without context" (as the RFC calls it) and combine them into one state that can be used to generate new keys as needed. The importance of context will be explained in just a moment.

The key schedule begins with the calculation of an "early secret". This is normally used to include the pre-shared key in the key schedule. Since we don't have a PSK, this part is mostly irrelevant. However, we still have to do it, just with dummy values.

```js
earlySecret = hkdfExtract(
    Buffer.alloc(HASHLEN), // initial salt is zero 
    Buffer.alloc(HASHLEN)  // replace PSK with string of zeroes of the same length
);
```

Next, calculate a derived secret from the early secret.

```js
derivedSecret = deriveSecret(earlySecret, "derived", Buffer.alloc(0));
```

Create the handshake secret using the shared value from key exchange and the derived secret from the previous step.

```js
// sharedSecret = 4c 75 e1 ...
handshakeSecret = hkdfExtract(derivedSecret, sharedSecret);
```

For the next part, we need to pass the hash of the previously exchanged ClientHello and ServerHello messages to `deriveSecret` in a parameter called the *context*. This is why the Random field is included in the Hello messages: to prevent replay attacks. The Random fields change between handshakes, and thus, so does the context. This prevents an attacker from simply recording and replaying a TLS session in an attempt to repeat a request: the server will send a new Random field, creating a different context with a different secret key.

`handshakeContext` is created by applying a cryptographic hash function to the raw data of the ClientHello and Server Hello messages, excluding the record header.

```js
// client side
clientHandshakeTrafficSecret = deriveSecret(handshakeSecret, "c hs traffic", handshakeContext);

// server side
serverHandshakeTrafficSecret = deriveSecret(handshakeSecret, "s hs traffic", handshakeContext);
```

From here, we just need to calculate two additional values that we can feed to our actual cipher. In this case, our client and server settled on AES-256, so we'll need a **key** and an unpredictable **initialization vector**.

```js
// client credentials
clientHandshakeKey = hkdfExpandLabel(clientHandshakeTrafficSecret, "key", Buffer.alloc(0), 32);
clientHandshakeIV = hkdfExpandLabel(clientHandshakeTrafficSecret, "iv", Buffer.alloc(0), 12);

// server credentials
serverHandshakeKey = hkdfExpandLabel(serverHandshakeTrafficSecret, "key", Buffer.alloc(0), 32);
serverHandshakeIV = hkdfExpandLabel(serverHandshakeTrafficSecret, "iv", Buffer.alloc(0), 12);
```

The initialization vector (IV) ensures that even if the same piece of data is encrypted, a different ciphertext will result. We will explore this in a moment when we actually get to decrypting messages.

The code used to explain this section is available [here](resources/tls/tls-key-schedule.js). 

# S → C: Change Cipher Spec

Next, the server sends the Change Cipher Spec message. This isn't used in TLS 1.3, but to avoid confusing intermediate nodes, this message is still sent. From this point on, the rest of the handshake is encrypted.

<div class="server packet">
<div class="segment" data-hex="140303000101" data-name="Record Header">

* `14`: record type (20 for Change Cipher Spec)
* `03 03`: protocol version (TLS 1.2 for backwards compatibility)
* `00 01`: length of payload (1 byte)
* `01`: unused 

</div>
</div>

# S → C: Encrypted Extensions

Our first encrypted message! Here, additional TLS extensions that aren't essential for key negotation are declared, so that minimal information about the session is leaked to eavesdroppers. There aren't any additional extensions in this session, so this message is empty.

All encrypted messages are contained within application data records, which provide the necessary info to decrypt the data. For all messages after this one, we will simply be showing the decrypted payload. However, for the sake of completeness, this message will be shown in its entirety.

<div class="server packet">
<div class="segment" data-hex="1703030017" data-name="Record Header">

* `17`: record type (23 for Application Data)
* `03 03`: protocol version (TLS 1.2 for backwards compatibility)
* `00 17`: length of payload (23 bytes)

</div>
<div class="segment" data-hex="bf687d10e2f209" data-name="Encrypted Data">

The TLS plaintext, encrypted using the server's key and the initialization vector derived in the key schedule (XOR'd by the sequence number of the record&mdash;a counter starting from 0 that is increased every time a record is read&mdash;to prevent any information leakage).

</div>
<div class="segment" data-hex="661418d92aaf3626dfe5670f3127d6ed" data-name="Authentication Tag">

The cipher outputs not only a ciphertext but also an authentication tag, which allows recipients to verify that the ciphertext was not modified while not disclosing any info about the plaintext to attackers.

</div>
</div>

Here's the result that we get after decryption:

08000002000016

<div class="server packet">
<div class="segment" data-hex="080000020000" data-name="Encrypted Extensions">

All extensions not necessary for performing key exchange should only be sent here to avoid divulging information to an attacker.

* `08`: message type (8 for EncryptedExtensions)
* `00 00 02`: message length (2 bytes)
* `00 00`: length of the extensions list (0 bytes)

</div>
<div class="segment" data-hex="16" data-name="Data Type">

The last byte denotes the actual record type (22 for handshake).

</div>
</div>

# S → C: Certificate

The server sends its certificate to the client. Here, the certificate message is abridged since most of it consists of the actual certificate itself, which is explained below.

*Only the decrypted record is shown.*

<div class="server packet">
<div class="segment" data-hex="0b000fbb000fb700052a..000000051a..0000000564..000016" data-name="Handshake Header">

* `0b`: message type (11 for Certificate)
* `00 0f bb`: message length (4027 bytes)
* `00 0f b7`: certificate list length (4023 bytes)
    * First certificate
        * `00 05 2a`: length (1322 bytes)
        * `..`: certificate data
        * `00 00`: extensions length (0 bytes)
    * Second certificate
        * `00 05 1a`: length (1306 bytes)
        * `..`: certificate data
        * `00 00`: extensions length (0 bytes)
    * Third certificate
        * `00 05 64`: length (1380 bytes)
        * `..`: certificate data
        * `00 00`: extensions length (0 bytes)
* `16`: actual record type (22 for handshake)

</div>
</div>

The certificates themselves are serialized using a scheme called [Distinguished Encoding Rules](https://en.wikipedia.org/wiki/X.690#DER_encoding), or just DER.  DER is rather complicated, so this section doesn't aim to really explain its nuances; instead, it's meant to give you an idea of what's actually in a certificate and how it's stored. There's a lot of information in the certificate that isn't really necessary for understanding the TLS cryptosystem. Pay the most attention to the parts that associate the server's keypair with its identity (its domain name), as well as the parts proving the certificate's trustworthiness.

Here's the first certificate, dissected:

<div class="server packet">
<div class="segment" data-hex="30820526" data-name="Certificate Header">

A certificate actually has two components: the to-be-signed certificate, and the actual signature.

* `30`: datatype (sequence)
* `82 05 26`: data length (1318 bytes)

</div>
<div class="segment" data-hex="3082040e" data-name="To-Be-Signed Certificate Header">

The to-be-signed certificate is where all the interesting information is stored, including the domain names which the certificate covers.

* `30`: datatype (sequence)
* `82 04 0e`: data length (1038 bytes)

</div>
<div class="segment" data-hex="a003020102" data-name="Version">

This certificate uses [X.509](https://en.wikipedia.org/wiki/X.509) version 3.

* `a0`: datatype (context-specific, 'version')
* `03`: data length (3 bytes)
* `02`: datatype (integer)
* `01`: data length (1 byte)
* `02`: version (2 for v3)

</div>
<div class="segment" data-hex="021204f99a1b9df5e7f17bb9f19166129e3ff810" data-name="Serial Number">

Each certificate has a unique 20-byte serial number, which distinguishes it from other certificates issued by the same CA.

* `02`: datatype (integer)
* `12`: data length (12 bytes)
* `04 f9 9a ... 3f f8 10`: serial number

</div>
<div class="segment" data-hex="300d06092a864886f70d01010b0500" data-name="Signature Algorithm">

This section identifies the signature algorithm used by the issuer to sign the certificate. Signature algorithms are one of the many things in DER-land that are referenced through [object identifiers](https://en.wikipedia.org/wiki/Object_identifier), a hierarchical naming system created by the [ITU](https://en.wikipedia.org/wiki/International_Telecommunication_Union) and the ISO/IEC. Object identifiers consist of a series of integers separated by periods.

* `30`: datatype (sequence)
* `0d`: length
* **Signature Algorithm**
    * `06`: datatype (object identifier)
    * `09`: data length (9 bytes)
    * `2a 86 48 ... 01 01 0b`: 1.2.840.113549.1.1.11, the object identifier for `sha256WithRSAEncryption`
* **Parameters**
    * `05`: datatype (NULL)
    * `00`: data length (0)

</div>
<div class="segment" data-hex="3032" data-name="Issuer Header">

The following sections provides information about the issuer of the certificate through a pair of key-value attributes.

* `30`: datatype (sequence)
* `32`: data length (50 bytes)

</div>
<div class="segment" data-hex="310b3009060355040613025553" data-name="Issuer Country">

This field identifies the country code of the issuer.

* `31`: datatype (set)
* `0b`: data length (11 bytes)
* `30`: datatype (sequence)
* `09`: data length (9 bytes)
* `06 03 55 04 06`: 2.5.4.6, the object identifier for the `id-at-countryname` property
* `13 02 55 53`: string ("US")

</div>
<div class="segment" data-hex="31163014060355040a130d4c6574277320456e6372797074" data-name="Issuer Organization Name">

This field identifies the name of the issuer's organization

* `31`: datatype (set)
* `16`: data length (22 bytes)
* `30`: datatype (sequence)
* `14`: data length (20 bytes)
* `06 03 55 04 0a`: 2.5.4.10, the object identifier for the `id-at-organizationName` property
* `13 0d 4c ... 79 70 74`: string ("Let's Encrypt")

</div>
<div class="segment" data-hex="310b3009060355040313025233" data-name="Issuer Certificate Common Name">

This field specifies the human-readable name of the signing certificate.

* `31`: datatype (set)
* `0b`: data length (11 bytes)
* `30`: datatype (sequence)
* `09`: data length (9 bytes)
* `06 03 55 04 03`: 2.5.4.3, the object identifier for the `id-at-commonName` property
* `13 02 52 33`: string ("R3")

</div>
<div class="segment" data-hex="301e170d3232303231383036353132385a170d3232303531393036353132375a" data-name="Validity">

This section provides the dates between which the certificate is valid. This is how certificate expiration works.

* `30`: datatype (sequence)
* `1e`: data length (30 bytes)
* `17 0d 32 ... 32 38 5a`: earliest valid time (Feb 18, 2022 6:51:28)
* `17 0d 32 ... 32 37 5a`: latest valid time (May 19, 2022 6:51:27)

This is the last of the issuer properties included in this certificate.

</div>
<div class="segment" data-hex="301b3119301706035504031310746573742e626974686f6c652e646576" data-name="Common Name">

This field specifies the human-readable name for our certificate.

* `30`: datatype (sequence)
* `1b`: data length (27 bytes)
* `31`: datatype (set)
* `19`: data length (25 bytes)
* `30`: datatype (sequence)
* `17`: data length (23 bytes)
* `06 03 55 04 03`: 2.5.4.3, the object identifier for `id-at-commonName`
* `13 10 74 ... 64 65 76`: string ("test.bithole.dev")

</div>
<div class="segment" data-hex="30820122300d06092a864886f70d0101010500" data-name="Subject Public Key Info">

This part provides information about our public key. (Recall that the point of a certificate is to establish a connection between our identity and our public key.)

* `30`: datatype (sequence)
* `82 01 22`: data length (290 bytes)
* `30`: datatype (sequence)
* `0d`: data length (13 bytes)
* `06 09 2a ... 01 01 01`: 1.2.840.113549.1.1.1, the object identifier for `rsaEncryption`
* `05 00`: paramters (NULL)

</div>
<div class="segment" data-hex="0382010f003082010a0282010100b587501904bd9198c9c9eab873d4a249dcc37632e5ed3d22bcbab4126b5727fbfedc8975d073cd2e9f9faef3243c145a6458531b831515778bf76125c07a4148fe39b6eaddd38539d5f7bdf1dbc3a9bc014cb4fbce004879f4cdf84164bcd8d6f1f95ce730f4cfe91908cf2b15a4a60b26d2c4d31c4c850976d40d775f103bf33deb293bc8a6412865c596e0a07e8c38d72b8d4a981b518738cb6843ddc2574c2e279db10e4ce88d5fbe0502ca4ed97eee1f820894258d6a8deb78aa0f69b6ebddd5e991732cc19642bec153e6c874c3393a90dde0aae55b61417e96c0e695eb66fb9ddcbc2af5e6b8af4e61357ed1b0abe8a2efe9323c5fd14f6af30afa19b90203010001" data-preview-truncate="47" data-name="Subject Public Key">

* `03`: datatype (bitstring)
* `82010f`: data length (271 bytes)
* `00 30 82 ... 01 00 01`: our RSA public key

</div>
<div class="segment" data-hex="a382024b30820247" data-name="Extensions Header">

The following sections contain X.509 *extensions*, which provide additional certificate info.

* `a3`: datatype (context-specific, 'Extensions')
* `82 02 4b`: data length (587 bytes)
* `30`: datatype (sequence)
* `82 02 47`: data length (583 bytes)

</div>
<div class="segment" data-hex="300e0603551d0f0101ff0404030205a0" data-name="Extension: Key Usage">

This extension lists the tasks which a key can be used for. For example, a CA may want to restrict the ability to sign certificates to only a handful of intermediate CAs. The Certificate Sign bit in this extension allows CAs to control the capabilities of each certificate they issue.

* `30`: datatype (sequence)
* `0e`: data length (14 bytes)
* `06 03 55 1d 0f`: 2.5.29.15, the object identifier for `id-ce-keyUsage`
* `01 01 ff`: the extension is critical; parsers cannot accept this certificate unless they are able to understand this extension
* `04`: datatype (octet string)
* `04`: data length (4 bytes)
* `03`: datatype (bitstring)
* `02`: data length (2 bytes)
* `05`: padding bits (5)
* `a0`: bitfields describing the key usage

`0xa0` in binary is 10100000; the two set bits represent the Digital Signature and Key Encipherment usages.

</div>
<div class="segment" data-hex="301d0603551d250416301406082b0601050507030106082b06010505070302" data-name="Extension: Extended Key Usage">

This extension is included in end certificates. It further restricts them to **only** the purposes listed within this extension. In this case, this certificate is valid for server authentication and client authentication.

* `30`: datatype (sequence)
* `1d`: data length (29 bytes)
* `06 03 55 1d 25`: 2.5.92.37, the object identifier for `id-ce-extKeyUsage`
* `04`: datatype (octet string)
* `16`: data length (22 bytes)
* `30`: datatype (sequence)
* `14`: data length (20 bytes)
* `06 08 2b ... 07 03 01`: 1.3.6.1.5.5.7.3.1, the object identifier for `id-kp-serverAuth` 
* `06 08 2b ... 07 03 02`: 1.3.6.1.5.5.7.3.2, the object identifier for `id-kp-clientAuth`

</div>
<div class="segment" data-hex="300c0603551d130101ff04023000" data-name="Extension: Basic Constraints">

This extension offers more fine-grained controls over what certificates can be issued using this certificate. Since we aren't a CA and can't issue *any* certificates, no constraints are listed here.

* `30`: datatype (sequence)
* `0c`: data length (12 bytes)
* `06 03 55 1d 13`: 2.5.29.19, the object identifier for `id-ce-basicConstraints`
* `01 01 ff`: the extension is critical; parsers cannot accept this certificate unless they are able to understand this extension
* `04`: datatype (octet string)
* `02`: data length (2 bytes)
* `30`: datatype (sequence)
* `00`: data length (0)

</div>
<div class="segment" data-hex="301d0603551d0e04160414e7a1622dade131944f1341c83a37a5b96336263e" data-name="Extension: Subject Key Identifier">

This extension uniquely identifies the certificate based on its public key. This value can be referenced in any certificates issued using this certificate.

* `30`: datatype (sequence)
* `1d`: data length (29 bytes)
* `06 03 55 1d 0e`: 2.5.29.14, the object identifier for `id-ce-subjectKeyIdentifier`
* `04`: datatype (octet string)
* `16`: data length (22 bytes)
* `04 14 e7 ... 36 26 3e`: the subject key identifier

</div>
<div class="segment" data-hex="301f0603551d23041830168014142eb317b75856cbae500940e61faf9d8b14c2c6" data-name="Extension: Authority Key Identifier">

This extension contains the subject key identifier of the signing certificate(s), i.e. the authorities. The purpose of this extension is to assist in establishing a chain of trust.

* `30`: datatype (sequence)
* `1f`: data length (31 bytes)
* `06 03 55 1d 23`: 2.5.29.35, the object identifier for `id-ce-authorityKeyIdentifier`
* `04`: datatype (octet string)
* `18`: data length (24 bytes)
* `80 14 14 ... 14 2c c6`: the subject key identifier

</div>
<div class="segment" data-hex="305506082b0601050507010104493047302106082b060105050730018615687474703a2f2f72332e6f2e6c656e63722e6f7267302206082b060105050730028616687474703a2f2f72332e692e6c656e63722e6f72672f" data-name="Extension: Authority Information Access">

This extension provides information about where to access various services offered by the certificate issuer, such as [OCSP](https://en.wikipedia.org/wiki/Online_Certificate_Status_Protocol) (which allows clients to query the issuer regarding the validity of a certificate online).

* `30`: datatype (sequence)
* `55`: data length (85 bytes)
* `06 08 2b 06 01 05 05 07 01 01`: 1.3.6.1.5.5.7.1.1, the object identifier for `id-pe-authorityInfoAccess`
* `04`: datatype (octet string)
* `49`: data length (73 bytes)
* `30`: datatype (sequence)
* `47`: data length (71 bytes)
* **OCSP**
    * `30`: datatype (sequence)
    * `21`: data length (33 bytes)
    * `06 08 2b 06 01 05 05 07 30 01`: 1.3.6.1.5.5.7.48.1, the object identifier for `id-ad-ocsp`
    * `86 15 68 ... 6f 72 67`: URL (http://r3.o.lencr.org)
* **CA Issuer**
    * `30`: datatype (sequence)
    * `22`: data length (34 bytes)
    * `06 08 2b 06 01 05 05 07 30 02`: 1.3.6.1.5.5.7.48.2, the object identifier for `id-ad-caIssuers`
    * `86 16 68 ... 72 67 2f`: URL (http://r3.i.lencr.org/)

</div>
<div class="segment" data-hex="301b0603551d11041430128210746573742e626974686f6c652e646576" data-name="Extension: Subject Alternative Names">

This extension allows the certificate to identify other hostnames in addition to the subject name field which the subject may authenticate as. This certificate just serves one domain, `test.bithole.dev`, so this extension isn't very interesting.

* `30`: datatype (sequence)
* `1b`: data length (27 bytes)
* `06 03 55 1d 11`: 2.5.29.17, the object identifier for `id-ce-subjectAltName`
* `04`: datatype (octet string)
* `14`: data length (20 bytes)
* `30`: datatype (sequence)
* `12`: data length (18 bytes)
* `82 10 74 ... 64 65 76`: string ("test.bithole.dev")

</div>
<div class="segment" data-hex="304c0603551d20044530433008060667810c0102013037060b2b0601040182df130101013028302606082b06010505070201161a687474703a2f2f6370732e6c657473656e63727970742e6f7267" data-name="Extension: Policy Information">

This extension describes where to access the issuer's Certificate Practice Statement, which describes the CA's policy for issuing certificates.

* `30`: datatype (sequence)
* `4c`: data length (76 bytes)
* `06 03 55 1d 20`: 2.5.29.32, the object identifier for `id-ce-certificatePolicies`
* `04`: datatype (octet string)
* `45`: data length (69 bytes)
* `30`: datatype (sequence)
* `43`: data length (67 bytes)
* **Policy 1**
    * `30`: datatype (sequence)
    * `08`: data length (8 bytes)
    * `06 06 67 81 0c 01 02 01`: 2.23.140.1.2.1, the object identifier for [baseline requirements](https://cabforum.org/object-registry/)
* **Policy 2**
    * `30`: datatype (sequence)
    * `37`: data length (55 bytes)
    * `06 0b 2b ... 01 01 01`: 1.3.6.1.4.1.44947.1.1.1, the object identifier for Let's Encrypt's CPS
    * `30`: datatype (sequence)
    * `28`: data length (40 bytes)
    * `30`: datatype (sequence)
    * `26`: data length (38 bytes)
    * `06 08 2b ... 07 02 01`: 1.3.6.1.5.5.7.2.1, the object identifier for `id-qt-cps`
    * `16 1a 68 ... 6f 72 67`: URL (https://cps.letsencrypt.org)

</div>
<div class="segment" data-hex="30820104060a2b06010401d6790204020481f50481f200f00076006f5376ac31f03119d89900a45115ff77151c11d902c10029068db2089a37d9130000017f0bd084e50000040300473045022100eee2822add6ff5c9cc507f0a8a5f174551205becfbf0031e962d8f4ce916090b022049cf3e53e653385c0745902e8c7901e4971b25b436eafb22f2b83c222747b3c500760046a555eb75fa912030b5a28969f4f37d112c4174befd49b885abf2fc70fe6d470000017f0bd084e10000040300473045022018c8aee5cff4fdc7b19232bc8533de5890f75820f85ac40d11c5696e9ab9912e022100a1dddb603ec9b815f067ac0ac6a5229146fdcf932b5ad4ff28ae892aee813caa" data-name="Extension: Certificate Transparency" data-x="1">

[Certificate Transparency](https://certificate.transparency.dev/) is a standard for... well... certificate transparency! The idea is for CAs to permanently log every certificate they issue, making it easier to track down malicious or mistakenly issued certificates. There are three types of groups involved in CT:

* CAs, who submit certificates to logs
* Logs, which validate certificates and log them, returning a Signed Certificate Timestamp (a promise that the certificate will be added to the log). The data structure which logs store issuances in (a [Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)) is constructed using cryptographic primitives such that it is impossible to remove an entry without consumers of the log noticing.
* Monitors, which receive updates from logs and ensure that the logs are not misbehaving. Monitors may also offer services that contact you when a new certificate is issued for one of your domains.

Certificate Transparency is further strengthened by the fact that some browsers (such as [Chrome](https://chromium.googlesource.com/chromium/src/+/master/net/docs/certificate-transparency.md)) now display an SSL error if a certificate lacks Certificate Transparency information, preventing CAs from issuing certificates off the record.

This is all a very surface-level description of the Certificate Transparency ecosystem. For more information, you should check out the [official website](https://certificate.transparency.dev/howctworks/).

* `30`: datatype (sequence)
* `820104`: data length (260 bytes)
* `06 0a 2b ... 02 04 02`: 1.3.6.1.4.1.11129.2.4.2, the object identifier for `SignedCertificateTimestampList`
* `04`: datatype (octet string)
* `81 f5`: data length (245 bytes)
* `04`: datatype (octet string)
* `81 f2`: data length (242 bytes)
* `00 f0`: list length (240 bytes)
* **SCT #1 (Sectigo)** 
    * `00 76`: length
    * `00`: version 
    * `6f 53 76 ... 37 d9 13`: log ID (Sectigo "Mammoth")
    * `00 00 01 7f 0b d0 84 e5`: timestamp (Feb 17, 2022)
    * `00 00`: extensions length (0 bytes)
    * `04 03`: signature algorithm (0x0403 for ecdsa_secp256r1_sha256)
    * `00 47`: signature length (71 bytes)
    * `30 45 02 ... 47 b3 c5`: signature
* **SCT #2 (Google)**
    * `00 76`: length
    * `00`: version 
    * `46 a5 55 ... fe 6d 47`: log ID (Google "Xenon2022")
    * `00 00 01 7f 0b d0 84 e1`: timestamp (Feb 17, 2022)
    * `00 00`: extensions length (0 bytes)
    * `04 03`: signature algorithm (0x0403 for ecdsa_secp256r1_sha256)
    * `00 47`: signature length (71 bytes)
    * `30 45 02 ... 81 3c aa`: signature

</div>
<div class="segment" data-hex="300d06092a864886f70d01010b0500" data-name="Signature Algorithm Identifier">

This field identifies the signature algorithm the issuer used to sign the certificate.

* `30`: datatype (sequence)
* `0d`: data length (13 bytes)
* `06 09 2a ... 01 01 0b`: 1.2.840.113549.1.1.11, the object identifier for sha256WithRSAEncryption
* `05 00`: parameters (NULL)

</div>
<div class="segment" data-hex="03820101007c8acf6d06a816072795343919d9bb769fca5fe24838129408127831eec82333ed91463dbb46fcbdb4640a156969f87dd65a724f10b36628dc109ac26f763e04210d9a44296c6a7952ff4cb3a5d885e9069feea17ef2ab8b858b293cc3217d7cc1b3316db027cd78a5ef546c76352d4016815674e4e093847d691fab2fe8d8ece833355c3e15e96586d12729bd97117b64437c69050488b2b09d8cf690345ce80507c58e5ecffd3ed8e242d12d6e2677a40c0c608d055cfd370dc6b00da27f1df0003b7b427b8f6c8049deba5d040beba054b1dafa6881669a41ff9d815f31bfa52175ddd0b41be5e72b82ea51f9a10d62e6b617d9ad63bedaf7cadb1cefbcd5" data-name="Signature">

The actual signature of the certificate.

* `03`: datatype (bitstring)
* `82 01 01`: data length (257 bytes)
* `00 7c 8a ... ef bc d5`: the signature

</div>
</div>

We can actually verify the signature of the certificate using OpenSSL. {TODO}

The three certificates are available for download: [test.bithole.dev](resources/tls/cert1.crt), [R3](resources/tls/cert2.crt), [ISRG Root X1](resources/tls/cert3.crt).

# Epilogue

This article only shows part of what makes TLS tick. There's much more beneath the surface; things like session resumption, 0-RTT messages, client authentication, SNI, ALPN, the list goes on. To learn more, the RFC is your best friend. Skip ahead to the Further Reading section for some good references.

# Behind the Scenes 

Making the interactive TLS session turned out to be surprisingly treacherous. I approached this blogpost with such fervor that I ended up developing a perverse affection towards TLS, one that left me waking up in the middle of night, sweating profusely, drifting in and out of consciousness as my sleep-addled brain tried in vain to comprehend X.509. In this case, it involved modifying OpenSSL to log the private keys used in the handshake key exchange process and rebuilding NodeJS from source. Here's the patch I applied before rebuilding:

```patch
diff --git a/deps/openssl/openssl/ssl/statem/extensions_clnt.c b/deps/openssl/openssl/ssl/statem/extensions_clnt.c
index 7b46074232..bd765f43f0 100644
--- a/deps/openssl/openssl/ssl/statem/extensions_clnt.c
+++ b/deps/openssl/openssl/ssl/statem/extensions_clnt.c
@@ -613,6 +613,11 @@ static int add_key_share(SSL *s, WPACKET *pkt, unsigned int curve_id)
         }
     }
 
+    /* print out the key like the sneaky devils we are */
+    BIO *bp = BIO_new_fp(stdout, BIO_NOCLOSE);
+    EVP_PKEY_print_private(bp, key_share_key, 1, NULL);
+    BIO_free(bp);
+
     /* Encode the public key. */
     encodedlen = EVP_PKEY_get1_encoded_public_key(key_share_key,
                                                   &encoded_point);
diff --git a/deps/openssl/openssl/ssl/statem/extensions_srvr.c b/deps/openssl/openssl/ssl/statem/extensions_srvr.c
index 0b6e843e8a..757c49190c 100644
--- a/deps/openssl/openssl/ssl/statem/extensions_srvr.c
+++ b/deps/openssl/openssl/ssl/statem/extensions_srvr.c
@@ -1670,6 +1670,11 @@ EXT_RETURN tls_construct_stoc_key_share(SSL *s, WPACKET *pkt,
             return EXT_RETURN_FAIL;
         }
 
+	/* more devilish key printing */
+	BIO *bp = BIO_new_fp(stdout, BIO_NOCLOSE);
+	EVP_PKEY_print_private(bp, skey, 1, NULL);
+	BIO_free(bp);
+
         /* Generate encoding of server key */
         encoded_pt_len = EVP_PKEY_get1_encoded_public_key(skey, &encodedPoint);
         if (encoded_pt_len == 0) {

```

After that, it was a simple matter of using NodeJS to create a TLS client and server, then capturing the exchange using `tcpdump`. Here's the client/server code.

```js
// run with --tls-keylog=...

const tls = require("tls");
const fs = require("fs");

const port = 8443, host = "test.bithole.dev";

const server = tls.createServer({
    cert: fs.readFileSync("fullchain.pem", "utf-8"),
    key: fs.readFileSync("privkey.pem", "utf-8")
});

server.on("secureConnection", tlsSocket => {
    console.log("connection");
    tlsSocket.on("data", data => console.log("data received:", data));
});

server.listen(port, () => console.log("Started listening"));

const secureSocket = tls.connect({host, port});
secureSocket.on("secureConnect", () => {
    console.log("client connected");
    setTimeout(() => secureSocket.write(Buffer.from([0xde,0xad,0xbe,0xef])), 1000);
});
```

I created a subdomain `test.bithole.dev` resolving to `127.0.0.1` and grabbed a certificate through Let's Encrypt to make this example a little more realistic.

You can download the full packet capture of the exchange which this page is based on [here](resources/tls/capture.pcap). You'll also need the [keylog](resources/tls/keylog.txt) to decrypt the capture.

# Further Reading
* [TLS 1.3 Illustrated](https://tls13.ulfheim.net/)
* [IETF - RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3](https://datatracker.ietf.org/doc/html/rfc8446)
* [IETF - RFC 8448: Example Handshake Traces for TLS 1.3](https://datatracker.ietf.org/doc/html/rfc8448)
* [IETF - RFC 5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)](https://datatracker.ietf.org/doc/html/rfc5869)
* [IETF - RFC 5280: Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile](https://datatracker.ietf.org/doc/html/rfc5280)
* [Cloudflare Fundamentals - TLS](https://developers.cloudflare.com/fundamentals/internet/protocols/tls)
* [Certificate Transparency - How CT Works](https://certificate.transparency.dev/howctworks/)
* [Let's Encrypt - A Warm Welcome to ASN.1 and DER](https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/)