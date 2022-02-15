<noscript><b>If you are reading this message, JavaScript is not enabled. Unfortunately, this page relies on JS to dynamically generate content which you may not be able to view.</b></noscript>

You can download the full packet capture of the exchange [here](static/tls-capture.pcapng). You'll also need the [keylog](tls-keylog.txt) to decrypt the capture.

# C → S: Client Hello

TLS handshakes begin with the Client Hello message, where the client declares to the server its capabilities, e.g. TLS version and supported ciphers.

<div class="packet">
<div class="hex-data" data-hex="1603010154">

## Record Header

All records begin with a [header](https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.1) that gives information about the content of the record.

* `16`: record type (22 for handshake)
* `03 01`: protocol version (TLS 1.0 for backwards compatibility)
* `01 54`: length of payload (340 bytes)

</div>
<div class="hex-data" data-hex="01000150">

## Handshake Header

The [Handshake](https://datatracker.ietf.org/doc/html/rfc8446#appendix-B.3) record begins with a four-byte header describing the contained data.

* `01`: message type (1 for ClientHello)
* `00 01 50`: message length (336 bytes)

</div>
<div class="hex-data" data-hex="0303">

## ClientHello Version

In TLS 1.2 and below, this field indicated the highest version supported by the client. However, using this field for version negotiation has been deprecated in favor of the `supported_versions` extension, so in TLS 1.3 this field *must* be set to `0x0303` (TLS 1.2).

</div>
<div class="hex-data" data-hex="f70d1790e5eb5b81c70815f47bf41703165542f3b734f609924fb0e4f16a7c6f">

## Random

The client provides 32 bytes of randomness that are used in {TODO} later in the handshake.

</div>
<div class="hex-data" data-hex="20bada4ab837b92b32c76ca330c0b859485f7eac0ead4c4fba4c440cf3c3b045a1">

## Legacy Session ID

Previously, this value was used to identify clients across sessions. However, since this functionality is now handled by pre-shared keys in TLS 1.3, clients just generate a random session ID each time to avoid confusing intermediate clients which may only support TLS 1.2.

* `20`: length of the session ID (between 0 and 32)
* `ba da 4a ... b0 45 a1`: session id

</div>
<div class="hex-data" data-hex="0076130213031301c02fc02bc030c02c009ec0270067c028006b00a3009fcca9cca8ccaac0afc0adc0a3c09fc05dc061c057c05300a2c0aec0acc0a2c09ec05cc060c056c052c024006ac0230040c00ac01400390038c009c01300330032009dc0a1c09dc051009cc0a0c09cc050003d003c0035002f00ff">

## Cipher Suites

In this section of the handshake, the client lists all the cipher suites which it supports. Each cipher is identified by a two-byte number assigned by [IANA](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-4).

* `00 76`: length of cipher suite list (118 bytes)
* `13 02 13 ... 2f 00 ff`: list of ciphers in order of preference.
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

TLS 1.3 only recommends five cipher suites, of which three are listed: TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, and TLS_AES_128_GCM_SHA256. However, 56 other cipher suites are listed. They are present for backwards compatibility, but using these ciphers is discouraged. Prior to TLS 1.3, the cipher suite also included the key exchange and signature algorithm, creating many possible permutations of algorithms. In TLS 1.3, many vulnerable ciphers are completely removed, signature algorithms are determined by the signature_algorithms extension, and there are fewer key exchange algorithms, so far fewer cipher suites are necessary.

</div>
<div class="hex-data" data-hex="0100">

## Legacy Compression Methods

Previously, compression methods were listed here. In TLS 1.3, this field is no longer used, so it just contains a single null byte.

* `01`: field length
* `00`: null

</div>
<div class="hex-data" data-hex="0091">

## Extensions

The extensions section contains records providing more information about the client. A full list of extensions and their respective RFCs can be found [here](https://www.iana.org/assignments/tls-extensiontype-values/tls-extensiontype-values.xhtml).

* `00 91`: length of extensions (145 bytes)

</div>
<div class="hex-data" data-hex="000b000403000102">

## Extension: ec_point_formats

This extension lists the [elliptic curve](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography) encodings that the client can parse.

* `00 0b`: extension type (11 for ec_point_formats)
* `00 04`: extension data length (4 bytes)
    * `03`: length of format list (3 bytes)
        * `00`: uncompressed points are supported
        * `01 02`: deprecated formats ([X.962](https://standards.globalspec.com/std/1955141/ANSI%20X9.62)) which clients must still declare support for, as specified in [RFC 8422](https://www.rfc-editor.org/rfc/rfc8422.html#section-5.1.2)

</div>
<div class="hex-data" data-hex="000a000c000a001d0017001e00190018">

## Extension: supported_groups

This extension lists the elliptic curves which the client supports, in order of preference. 

* `00 0a`: extension type (10 for supported_groups)
* `00 0c`: extension data length (12 bytes)
    * `00 0a`: length of curve list (10 bytes)
        * `00 1d`: x25519
        * `00 17`: secp256r1
        * `00 1e`: x448
        * `00 19`: secp512r1
        * `00 18`: secp384r1

</div>
<div class="hex-data" data-hex="00230000">

## Extension: session_ticket

This extension identifies the client for [TLS session resumption](https://www.rfc-editor.org/rfc/rfc5077.html). In this case, the client signals that it does not have a session ticket yet but is ready to receive one by sending a ticket of length zero.

* `00 23`: extension type (35 for session_ticket)
* `00 00`: data length (none)

</div>
<div class="hex-data" data-hex="00160000">

## Extension: encrypt_then_mac

This extension indicates that the client supports the [encrypt-then-MAC](https://www.rfc-editor.org/rfc/rfc7366.html) scheme, which aims to fix the security issues inherent to MAC-then-encrypt.

* `00 16`: extension type (22 for encrypt_then_mac)
* `00 00`: data length (none)

</div>
<div class="hex-data" data-hex="00170000">

## Extension: extended_master_secret

This extension indicates that the client supports [extended master secrets](https://www.rfc-editor.org/rfc/rfc7627.html), which hardens TLS sessions against man-in-the-middle attacks by calculating the master secret using the hash of prior handshake messages.

* `00 17`: extension type (23 for extended_master_secret)
* `00 00`: data length (none)

</div>
<div class="hex-data" data-hex="000d0030002e040305030603080708080809080a080b080408050806040105010601030302030301020103020202040205020602">

## Extension: signature_algorithms

This extension allows clients to declare which digital signature algorithms they support.

* `00 0d`: extension type (13 for signature_algorithms)
* `00 30`: data length (48 bytes)
    * `00 2e`: length of signature algorithms list (46 bytes)
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
        * `02 03`: ecdsa_sha1
        * `03 01`: SHA224 RSA
        * `02 01`: rsa_pkcs1_sha1
        * `03 02`: SHA224 DSA
        * `02 02`: SHA1 DSA
        * `04 02`: SHA256 DSA
        * `05 02`: SHA384 DSA
        * `06 02`: SHA512 DSA

</div>
<div class="hex-data" data-hex="002b00050403040303">
</div>
</div>

1603010154
01000150
0303
f70d1790e5eb5b81c70815f47bf41703165542f3b734f609924fb0e4f16a7c6f
20bada4ab837b92b32c76ca330c0b859485f7eac0ead4c4fba4c440cf3c3b045a1
0076130213031301c02fc02bc030c02c009ec0270067c028006b00a3009fcca9cca8ccaac0afc0adc0a3c09fc05dc061c057c05300a2c0aec0acc0a2c09ec05cc060c056c052c024006ac0230040c00ac01400390038c009c01300330032009dc0a1c09dc051009cc0a0c09cc050003d003c0035002f00ff
0100
0091
000b000403000102
000a000c000a001d0017001e00190018
00230000
00160000
00170000
000d0030002e040305030603080708080809080a080b080408050806040105010601030302030301020103020202040205020602
002b00050403040303
002d00020101003300260024001d002044070648c76db55ef1d560a2e70a10c620432748a134b3065802d08cc801243a

# Further Reading

* [RFC 8446: TLS 1.3 Specification (IETF)](https://datatracker.ietf.org/doc/html/rfc8446)