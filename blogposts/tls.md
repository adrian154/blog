<noscript><b>If you are reading this message, JavaScript is not enabled. Unfortunately, this page relies on JS to dynamically generate content which you may not be able to view.</b></noscript>

The Internet is, by default, not secure. In TCP and below, everything is transferred in plaintext, meaning an attacker could read your communications or masquerade as the person you *think* you're talking to in order to steal your credentials or gain access to privileged systems. Yet today, most individuals will never fall prey to such a man-in-the-middle attack. What changed? The answer is the **Transport Layer Security (TLS)** protocol, which transparently secures much of the modern-day web. How does it pull off this seemingly impossible feat? Let's find out.

# Conceptual Overview

TLS solves three cryptographic problems: **confidentiality**, **authentication**, and **integrity**. These three properties go hand in hand, but each one has a distinct meaning. 

## Confidentiality

It's pretty easy to see why confidentiality is important. Nobody wants a third party to be able to read your communications, because that would obviously compromise your security. The solution is to encrypt your data with a cipher, an algorithm which accepts a plaintext and a key and produces a ciphertext, such that it is only feasible to retrieve the plaintext if you have the key. When a cipher uses the same key to encrypt and decrypt data, it is called a [symmetric cipher](https://en.wikipedia.org/wiki/Symmetric-key_algorithm).

Symmetric ciphers are preferred for the bulk encryption of data because they are much faster than their asymmetric counterparts, but they have one fatal flaw: key exchange. The two communicating parties need to figure out a way to share a single key in order to read each other's messages, but this creates a bit of a chicken-and-egg situation: how do you transmit the key if the channel isn't secure? To solve this problem, we need to get a little more clever.

Enter the [Diffie-Hellman Key Exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange). It enables a client and a server to generate the same secret value while only exchanging publicly knowable data, which sounds impossible until you take a look at how it works. Here's a diagram that explains the Diffie-Hellman key exchange process using colors of paint as a stand-in for cryptographic keys.

![DHKE diagram using paint analogy](static/images/DHKE-paint-analogy.png)

<br>

We can make this model a little more rigorous by replacing the paints with variables. Suppose `C` is some common value that both Alice and Bob know. The paint-mixing operation can be modeled as a function `F`, with the following properties:
* It is easy to compute `F(x, y)`, but very difficult to retrieve `x` and `y` given the output of the function. (Examples of such functions will be discussed later).
* `F` is associative, i.e. `F(x, F(y, z)) = F(y, F(x, z))`.

Now, we're ready to do the key exchange. Alice generates a random secret `A`, and Bob generates a random secret `B`. Alice sends Bob `F(A, C)` and Bob sends Alice `F(B, C)`. Now, Alice can compute `F(A, F(B, C))` and Bob can compute `F(B, F(A, C))`. Because `F` is associative, Alice and Bob arrive at the same value, which they can now use as the key to a symmetric cipher. However, an attacker who only has the common value and the values sent over the network still doesn't have enough information to break the scheme. The attacker needs to know either `A` or `B` to calculate the secret, but because it is difficult to reverse `F`, the attacker is unable to retrieve the individual secrets and can't determine the shared secret.

<div class="info-box">

Here, I use the function `F` as simplified way of explaining operations over elements of a [finite cyclic group](https://en.wikipedia.org/wiki/Cyclic_group). Groups are an especially useful when it comes to Diffie-Hellman key exchange since it is guaranteed that the group operation is associative. For example, [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) uses a [multiplicative group of integers modulo *n*](https://en.wikipedia.org/wiki/Multiplicative_group_of_integers_modulo_n) where the modulus is a large semiprime; its security relies on the difficulty of [integer factorization](https://en.wikipedia.org/wiki/Integer_factorization).

Today, cryptosystems based on [elliptic curve groups](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) have become popular since they offer similar security to RSA with much smaller and thus more convenient keys. Elliptic curve cryptograph is secured by the elliptic curve discrete logarithm problem. Essentially, given a point *P* and integer *n*, it is very difficult to retrieve *n* (the discrete logarithm) knowing *nP* and *P* alone.

I'm really terrible at explaining group theory, so if you want to learn more check out this [short introduction](https://math.mit.edu/~jwellens/Group%20Theory%20Forum.pdf).

</div>

## Authenticity

Confidentiality is worthless if you can't ensure that the person on the other end of the line is who you actually *intend* to talk to. One of TLS's central goals is to prevent impersonation by enabling clients to securely verify the identity of the remote server, a process known as **authentication**. It accomplishes this with the help of digital signatures.

To create a digital signature, you need to first create a keypair. The details of this process depend on which digital signature algorithm you're using. Once you've got a keypair, you can use the signing algorithm to create a digital signature from the data which you want to sign and your private key. Then, anyone can use the verification algorithm to confirm that *you* (or whoever has your private keys) created that signature by providing it the signature, the data, and your public key. This way, only you can create valid signatures, but anyone can prove their validity.

One can imagine a scheme involving a trusted third party that leverages the power of digital signatures to perform authentication. If Bob wanted to prove his identity to Alice, he could combine his public key and name into a *certificate*, and then get Carol to sign it. Carol is a very well-trusted member of society, so everyone already knows her public key. Now, to prove his identity to anyone, Bob can simply present his certificate signed by Carol, and prove that he controls the private key corresponding to the public key in the certificate by creating a valid signature with it. Essentially, this method establishes a chain of trust back to Carol.

![chain of trust diagram](static/images/certificate-chain-of-trust.png)

*A rough diagram showing how a verifiable chain of trust is created using digital signatures. [Image](https://en.wikipedia.org/wiki/File:Chain_Of_Trust.svg) by Yukhih / [CC BY-SA](https://creativecommons.org/licenses/by-sa/4.0/deed.en)*

This is essentially how TLS performs authentication. The trusted organization which signs certificates is known as a [certificate authority](https://en.wikipedia.org/wiki/Certificate_authority), and instead of including human names, most certificates contain the bearer's domain name. If you're on Chrome, you can click the padlock icon next to the URL of this page to view the SSL certificate of the webserver running this blog. Here's what you might expect to see:

![picture of the ssl cert for this site](static/images/windows-cert-view.png)

During the TLS handshake process, all three of these certificates were sent from my server to your browser. The first certificate named `bithole.dev` contains my server's public key, as well as a signature that your browser can use to validate my certificate by looking at `R3`'s public key. In turn, `R3` is signed by `ISRG Root X1`, whose fingerprint is hardcoded into your browser as one of several trusted **root certificates**. Your browser can follow this chain of signatures and verify that the certificate is valid.

My webserver also signed the public key generated during the Diffie-Hellman key exchange process earlier in the handshake, which an attacker could never do without somehow gaining ownership of the certificate's private key. This guarantees to your browser that the server it was talking to earlier was actually `blog.bithole.dev` and not an attacker.

Ultimately, your trust is figuratively and *literally* rooted in the legitimacy of these organizations. For the most part, they are all sufficiently strict about only issuing certificates to people who can actually prove ownership of a domain&mdash;for example, Let's Encrypt checks if a specific DNS record has been deployed for verification&mdash;but ultimately you cannot be 100% sure that these entities will not try to attack your TLS connections. For this reason, some organizations choose to run their own internal CA and issue their own certificates. This removes the dependence on an external entity, but requires that all users manually add the CA's root certificate to their computer's list of trusted certificates. As a result, it's only really feasible to secure closed systems like enterprise environments this way.

Here's a conversational illustration of all these concepts at play in a TLS handshake.

<table class="conversation">
    <tr>
        <th>Client</th>
        <th>Server</th>
    </tr>
    <tr>
        <td class="client-says">Hello, here are the cipher suites I support, as well as a public key I have generated for this session.</td><td></td>
    </tr>
    <tr>
        <td></td><td class="server-says">Let's use <...> as the cipher suite for this connection. Here is the public key I have generated for this session. We can now calculate a shared secret value.</td>
    </tr>
    <tr>
        <td></td><td class="server-says">Here is my certificate. It is signed by R3, which is signed by ISRG Root X1 (which is hopefully in your trusted certificates list). In addition, here is a digital signature of the public key I sent earlier, which you can verify using the public key contained within my certificate.</td>
    </tr>
    <tr>
        <td class="client-says">Your certificate appears valid, and so does the signature of your public key. I can now send you sensitive data encrypted using the shared secret we established earlier via Diffie-Hellman key exchange.</td><td></td>
    </tr>
</table>

## Integrity

Even if you have authenticated with a server and established a secure channel, there still remains a problem: an attacker who controls the network between you and your destination can still modify the ciphertext messages being exchanged. Even if they are doing so blindly, it still presents a vulnerability. Ideally, we would also want some strong cryptographic guarantee that the message wasn't tampered with in transit. TLS accomplishes this using [authenticated encryption](https://en.wikipedia.org/wiki/Authenticated_encryption).

In TLS 1.3, integrity is handled by only using ciphers which include **authenticated encryption with associated data (AEAD)**. AEAD ensures that no one can read the plaintext without the key, of course, but it also allows recipients to reject messages which have been modified *without* leaking any information about the plaintext (which was the source of several vulnerabilities in TLS 1.2). The "associated data" part means that the integrity of unencrypted data (such as the record header fields) can be ensured as well. This is accomplished with the help of [message authentication codes](https://en.wikipedia.org/wiki/Message_authentication_code). We will explore AEAD in depth later when we actually observe how messages are decrypted.

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

TLS 1.3 only recommends five cipher suites, of which three are listed: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, and TLS_AES_128_GCM_SHA256. However, 56 other cipher suites were sent in this message. They are present for backwards compatibility, but using these ciphers is discouraged.

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

This extension indicates that the client supports [extended master secrets](https://www.rfc-editor.org/rfc/rfc7627.html), which hardens TLS sessions against man-in-the-middle attacks by calculating the master secret using the hash of prior handshake messages.

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
<div class="segment" data-hex="02000076" data-name="Handshake">

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

This field indicates that the server has chosen to use TLS_AES_256_GCM_SHA384 as the cipher suite for this session.

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

From here, TLS uses a process known as the [key schedule](https://datatracker.ietf.org/doc/html/rfc8446#section-7.1) to derive a set of keys from the shared secret. 

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
<div class="segment" data-hex="bf687d10e2f209661418d92aaf3626dfe5670f3127d6ed" data-name="Encrypted Data">



</div>
</div>

# Behind the Scenes 

Making the interactive TLS session turned out to be surprisingly treacherous. In this case, it involved modifying OpenSSL to log the private keys used in the handshake key exchange process and rebuilding NodeJS from source. Here's the patch I applied before rebuilding:

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

You can download the full packet capture of the exchange which this page is based on [here](static/tls-capture.pcap). You'll also need the [keylog](static/tls-keylog.txt) to decrypt the capture.

# Further Reading
* [Cloudflare Fundamentals - TLS](https://developers.cloudflare.com/fundamentals/internet/protocols/tls)