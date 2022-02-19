<noscript><b>If you are reading this message, JavaScript is not enabled. Unfortunately, this page relies on JS to dynamically generate content which you may not be able to view.</b></noscript>

TODO: intro

# Conceptual Overview

TODO

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
<div class="segment" data-hex="f188ccbfa2d775240ed62fd5c8573dbaf119d10b9da0bf0c15691fb353b65340" data-name="Random">

The client shares 32 bytes of randomness that are used later in the handshake process.

</div>
<div class="segment" data-hex="203d6dd18b2c21c47914165344d016d885c82941c4d6e0a1fd92901f9abc04ebb0" data-name="Legacy Session ID">

Previously, this value was used to identify clients across sessions. However, since this functionality is now handled using pre-shared keys in TLS 1.3, clients just generate a random session ID each time to avoid confusing intermediate clients which may only support TLS 1.2.

* `20`: length of the session ID (between 0 and 32)
* `3d 6d d1 ... 04 eb b0`: session ID

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
<div class="segment" data-hex="000d0030002e040305030603080708080809080a080b080408050806040105010601030302030301020103020202040205020602" data-name="Extension: signature_algorithms">

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
<div class="segment" data-hex="003300260024001d0020de2919be20eef6bbb624d4627b312aa59046e0feef7adc010b59241b935bb46e" data-name="Extension: key_share">

The client sends its public keys to the server in this extension. If the server supports the algorithm of the key sent in the handshake, all messages following the ClientHello can be encrypted. If the server doesn't support any of the key share algorithms, it may ask the client to resend the ClientHello message via a [Hello Retry Request](https://datatracker.ietf.org/doc/html/rfc8446#section-4.1.4), 

* `00 33`: extension type (51 for key_share)
* `00 26`: data length (38 bytes)
    * `00 24`: length of key share list
        * `00 1d`: key exchange curve (x25519) 
        * `00 20`: key length (32 bytes)
        * `de 29 19 ... 5b b4 6e`: public key

</div>
</div>

<br>

<div class="info-box">

If all the mismatching TLS versions scattered throughout the packet are confusing, don't worry. There's a whole section in the TLS 1.3 RFC describing the various backwards compatibility measures taken to avoid confusing intermediate nodes, something they've termed [middlebox compatibiliy mode](https://datatracker.ietf.org/doc/html/rfc8446#appendix-D.4).

</div>

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
<div class="segment" data-hex="1c304968e774647efaabc5ec4381ad903510aba9206a0a3c1de417787c8ce406" data-name="Random">

Like the client, the server also provides 32 bytes of randomness, which is used later in the handshake.

</div>
<div class="segment" data-hex="20bada4ab837b92b32c76ca330c0b859485f7eac0ead4c4fba4c440cf3c3b045a1" data-name="Legacy Session ID">

The server resends the session ID found in the Client Hello message, because this field is not used in TLS 1.3.

</div>
<div class="segment" data-hex="1302" data-name="Cipher Suite">

This field indicates that the server has chosen to use TLS_AES_256_GCM_SHA384 as the cipher suite for this session.

</div>
<div class="segment" data-hex="00" data-name="Legacy Compression Methods">

The only compression method which TLS 1.3 clients are allowed to offer is `00` (no compression), so the server selects that method.

</div>
<div class="segment" data-hex="00002e" data-name="Extensions Length">

* `00 00 2e`: length of extensions (46 byte)

</div>
<div class="segment" data-hex="002b00020304" data-name="Extension: supported_versions">

* `00 2b`: extension type (43 for supported_versions)
* `00 02`: data length (2 bytes)
* `03 04`: selected TLS version (TLS 1.3)

</div>
<div class="segment" data-hex="00330024001d002061437c0eb479c516fdae53858a930a6804a8f9b4d9b24ba6c339ff175c0ae733" data-name="Extension: key_share">

The server acknowledges the public key shared in the ClientHello message by responding with a public key using the same cipher. 

* `00 33`: extension type (51 for key_share)
* `00 24`: data length (36 bytes)
    * `00 1d`: key exchange curve (x25519)
    * `00 20`: key length (32 bytes)
    * `61 43 7c ... 0a e7 33`: public key

</div>
</div>

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

# S → C: Change Cipher Spec

1703030017b613b9fdc12da1f74f70c90d0e32aa221bfef5103bbefd1703030fde1c3a0f8471cd65ddcd2a362c02ce0c1dd009cc0bec8f8bc0a9939684da74ba629519948c750943abe35105fab319c8e53a8a721a3eb4ae9825f6dfeb0f329f62f29a8e47902c3b69c4dd174bc1121218c071f55a87e448fcdf5c76276e27336c24592c11687b7e8c3e69cef2d432deef8ada5eeb68fa1c0072094595b35195b33ddd9f3b23f382ac927985531eac6d168b8c7057a6c52680d8c926dd4eb6b782b6337f91e96c3a3556aa4dc705e84a191efecc86901ada3962231eeff5701ca15e8c7510a4a6209da3f6ee56ba4df21e23794d164bf861150f3f708895b1d71535d67041a6f061d0fb30eeee4499d18e3238f0fabf37e1e16dadf2ba0270bf7da26f9c77ee0acc9c233bae182f28e4ca6ae59fb812ebcfda275b4842eafeaddb96beec7909d88197aa4bf18b67e9f609e2a4fcee6e5b0485fe2f8d3a309e9a8b117733c2ca8c375cd1f4d697ccbd08332e91928786faacb7d482393d6d2de3adf46bdc56e01d7e7c7ba3885ab09608cfc7342f4a077bfc6acde25e15fc565054f21283e07449500e86776516085d81c97e4565390456fe6f0c9028c39d0ccacff2b57ecfa075778cc46842af2f364b5437381a4181ec56d9901fd6fffc4961d1b7c9eba37bcb71088f3720f298d5075023cfa6b2b5fbd9e6b8447646ea00a125c2516b935102e9ef892357c71c61b1648dbdcca6ae1c467e4cb5abe795d54be92d3b246c1f113c83547530f21a215fc59cdad10a60753e82295d3952e3701326e1f56dcfb978693cf67fdf22d58ba8197a2795fb7cbdd85de306fc8b11ed97c94c3e17914cd08ce984ee18f9167e8cb212406abf8fb3a7a9e700f8f74147a6383493d35f8db3a7655422fdefd929faa535ed5377e693f1f7e5e62d4ce9f6cda09be61b74af59a352b0e5dc142489284098e2f187a231efee43e2cdecf9379b603049075d534c1f08f939938ea5553ff5852cbc08cfc295ffdfa21575d587c2a13ad7fa1c11fc96979e5b6dc853b2827fa0b39280ff967aedd6b485d580ec7e0a640673f212d34ce10f7dc88b595052ebc58effca59d6aacbfcab52b2a1cd35bc56c59df58d70afbcd669351397209420d632743f54f0b86ef11fa081dd632f3c05aa8579a9393db8d2d62cbfcfccffe881e1404ab4054052127f3a8d4b3046551f6e75e9705b3da06c6f63db0dc2907a735ac27e85f3a2f5c777a76cfff24aa23626a7053beab012391a4187c73be16a6041e810d34ef6e7a58faa2f7f680cde7683347549dbd601aa247f79786a62585e68568626629c53158b3bf13a5fedb90f12de3f1c0e5f37890ec8fcc616f4a1ab3249f416deb55f0dd96da08466cec87228e67b5217cc0c89a8acf8f65a1ab2ded04bbdc3ca86fa2ca87199b865797f750244db2a4a2c440cd95ecc7bbdd13cdfd46bd32786485d10368dce0a4aceef981a630e8fa545494e1ea178cebcd052efe973f488af2b42f1899840625cef5ccf1369339207531de1a8d4651f3200359c150a3028f5501e1ac0cbc000cf0eb8f8baa2c4cb41143b57c3657030e7f8e0a61ad20fc220f84620ee7345f22a6be0749556454d898fe76e25123eb68462e3c05db0c2abd2bc6ad7df2f71691b2b48c0df7d0a2e0cea397e5cf4061a45d89a7bf70cd3a01854575092ab2e1ae77c2135c33406cc4b4eed64823dcd25c34bc440e1c2ca0e6bc2a10fef49b14cc8f7a398d3cfb8f8710f0abc96ac19908f7f61d478c72371170a67ce294c45681df93cbe641a27a2771a78bb1c9809fe002a7b8a5206b64c16816382d70d26c4e99b60852266b1677cb382cb3474a5d2de395a5cfe7dc6266187fd5a6f0e796e32818fd3f12ba0472dc5bf681f4b1ab654e42b5710d35d5c1a73893b258678f6b51e83e283a05d5ec31307cbbd7a9e4639e2e643aa63510fbed8bf12880a5e603a8758d842add7150086d26715df24ffec46587a64ff2fc66d40976f25b826d82b84a073bd46d4744f81d169dbf940ac17a8d46b461467128e900cc06dff40da9eb468a546e1b4066a090830486ed17eff036274f8922eb6263311fd706cb473848480c88526edce7e5340991fe667c2be8edd14a6af63b0261cf9fe84a79a97cd70c27bd91ca4406fae488c92a871074ed7616e4cda33bcd53d92cd441274df51bfa5a971488ba6c17872affa12d7a7d9b6c8b3ee1e5916f7771b3e80f44be0844f12c3138e16ab1e06320d455e0438aa48d915b49b75eb3bee50cb178e5c8dbfc69ead0b8ec3c8a0a886e82185de7a1e9f440305c025a5e78e6bcdcd848cd043eaa98cdf452b1fe15dbe32d473bd8b8338e72a8b011148c07a811b77f1920a388ad01b4ef568da61b35fc9580aeb330a2921c9d23ef87d8e578a30af712b242bd4f4811bc9b97aab630d1fb529a6652244394336d08b48c6f26debd242e928f44413ff4c1de7171ce2e4a60f872d05a58681da9e510a206a126efb57cec0c0c4c4798927f9a2a8b998a727c8b1cdc480d811f1f7b4f861d0b0c13e08e188c0399357478840eacaa49c7b6b1226fc15757742c87577cd19c305dac95854efd38dbe23a8ba1f361ec428f981e446ae683298d5f83b60d7967c0a80519831e063abf4823fd0baf0c769a2adb045a92bbed22ff1a5bae3dc24965eeed65f5c290b695edd5ef39ee614e0cfb159314bf13fc5c2b7dc828a229cc169d42fb23a05d308f91d812b0141ce242cb4ed01176ab1393ea3638e168061d632c4690f335e4030085e50cfa53eaa8051a58930eec97462d9b239cb783ec2e559094c9aac672d3d01e64c766ec6e9da07401be9f859c1272e08c76e221d2476ebd66baa021a525b93ca91f59cf96090f18181997266bf3fa334b9b00264937805fafcd1acac5d16c6d62439559a3fac45715776a61aaa307ea710307d4fe26d2c5bb628a1cc1680c20c03ab8938d9762e146b62519b5001dc066964af9b495ab0aa4a87635ca6195c0da78c4b6c78d7a57a0ec2e62a7df6e56b54aeaee4ffcf23e8ab1724af1b9e6a6658ed3a9c08602307f6a18dccf4914589740a5004f309ee21469daee53b9ffb3d36cfdc7e76808b51304552eec731cd52a23783baf1ab14b45ce2c9d9f46ad8d211ca5b8236406718cabfb4ab6d837f1678c4ca21ced4be04be6c23177bb990a483fdcb2826efaf25201ddfe9ecab737fbc1474f14d58bac022b006c72953a7a90190209f7eeaf5c0558baa6ada32fa7e362524279c94873f5269005a366562da7352bf3dda93f4f4d18f077fdc78a8ef6fe75f9f9681b95e689f31f2cb35ef877616b0ff8ad02127dc6be1d5bcf4cd67bf7c0e9b2e4cfa59cdbb89c39e748a7920bb2b3b415b0966bf85777fe21ec32bb5a8fafd5b92f2a518c4313460bdb673305e528b60dddd637e1bd4f42b5e3770d0f255dfb1a6d454d01a56135c2ef5d4d49bc82a538ee660034027ce81857ebbebc29a2d11880e2730b6405a3bf72f0e8f1c2179f26e8ecd56ac3a4b302b82d52db85db9b3ed89163aca978f0d335fc06255584cf1762da854c3f959471a9f534dec1d3a72cb472f7b5552e3e101dceca739d38655cd2df75e801371eceb9fcd01517ffbd4b848ce4bc547285bb50e8d9e6399de9887874dd76c08f39898dfa8290ed5223a34f131709ca33c01ffad7c4014a084daded06a9437b162dee5abb74cf1656e8e08460d1b1e1ba28abc65da550f834341bf07f3f811e2792ad287c285d9bc9d0a6c86fdfcea1d358346e5e0866b59f900fb7f205f8ebe6094c8bd0d93fe03824dcbad448bc0626de269cdcda3d1119001d83e85b8ca8ea07daeb87d4b61526b36d4c59c58ab26d813ca03e32000386c6122dbf66b5329a5cd7f007809eed7c9122283b57edca42660ae2f711d06e7e84f0e636736c2163680a8ecd7afed47bba0a50fe0c34a0ff03a4dd2a39ffe51d6854b3dc809204031552b3805a0fc6a4aa33ef19e9f50046e5e27a2b785cb38906ebe2a0cb9a2d2e0cc4979bd2b647635cd264ad2a81e6689eb18cf84bcabac90f6df2069ff4a238d74bd79b1222d2de4661041eae3d82046cd3fc0007b6d867cbdefe2322d65194ec6c2e660f9ebd5ae880f00ce0e466dd53fe5cc493b7ec7f0b1dc4afc1c816ec39550620b5baa08e51f62cd98ac97aab456c80c10021bf786035a73dd1033672ba98b01604e0bc9d515d7a70a0d465e6ed03bc9504271bd1945c0a1f0021dbfc181b9dac1aca3408d78547a39e5c64d1a82d798edea9787e4c15cd3110823817b528f836f03a3af10cf5dfe6c42387bc775a76763ef142c7e5b04bdc3e3d8167f8b001c4967efb175834b8bc2f0b63066cc4f40671a90f68db0a421565634d766a56cea41944eff860b3e52d6d02d422011c446067424726a7aab1d1c80e55124c66233a89720c7860e451cdf49f3622074fbdee0c173b822795163dc02409ff83e4bae01e222073303fdb559db62f87b7d7be5bed0ee4a114014b27cfc2273fbd1b14b9673fc97f3082ed6288abcdbe2853edeea1392ffe4f0c643ec9d067bab13bfc38044cf5b3d9d5ad2c5fd3291eb2d7b73a9d58865e6d55988a5e585489a9d620d5f65c31fe81f8da03631aa7539fc2f629a8e8b5d8e0fc9bd051cc26181e0ec7558379a85bad4fe9429ac75bb0655f0a4866cb59c94afebce90dfa344aba4256629f2676dcf125d63d4a4f47a12ca091ac3d99b18c8a8aa6be4a68682f19495cbaa6f69b790f9c6ca24d35f2dfe12eee074d095a2336b81108df319b0c82abf6183e71763d9a15bf7eb288cab6b8679a61698adfbcc2e4ca80cdc8777b62584a756176ea019ee07aff7e6c0bcf079eb9bc0fcd4ae9dd2dc67d9899ad01b3f164e56aeb6e8bff2f93356fd5472e0988ecfa0ff28bfc1779bc49aace27dfe55a7775e9edab77ce0fe0f0983867a0339ce328d9f60ccbcd6048c6406f8117b345efbd9c32fa60e512c0b09d23695f92fd192c6832fcbe57b5c599898ceee3a9822756edab1b322fcd0b6931f8fbca45aad4cf537c88e69653a78c65ed390037ec4605fea700e35efa6b7d7fca86fa2198ce4ff15685f8f99dc435101aa2ee101e5456c93673f980ed401648d76b6bc6bddca3a3b99705be530b56844e511693402f3fa29cba361826059a72bd9575c2d7519ceb093fae3aba75f631273aac6d1ab38c2e0431e7779b966462b1e8b423a63aa2c62409de4109a6c879c13f2dc6e4af2ffe4d28cb1c2e1a650eab1671f2cb5f9aa357b0ff5a38c23c54b0761012b0d15bf8cf22a3a3c7a9d981f68a2e979de60a4da6771de7bf8a23a1a3df42d1826063dee8893162c57641967e393b9f71787dc66b2a27f35fe6bb068925af27481ddfa2b39739893ad047674d026fb6f07836191be5303926125ef7da83af9bf870e904d0b66687cfde775bc17e3918a02d5749c91ee069103ca5499560af5f2de52c79db9139192da8cc11873e1b65565e4e4fb656a77e3382d08d3b335cc7b313f203cc9dbf643a903f233f126bb13971358fd6d93eb3774e65186a714bc2dd21fecac290ece58a207b33857e6fa6c0f0b9306a5743ad5edfbd11aacb5a51731694403818e860a99fe03e3863cc5bee6bfa6c70e7754460f047e5a68be5880a1f7dcbfa3a2531ecdebf2b2fe5bae99e79b8bb86c67bcb0b509c3353ba76e7697142bbe1f9fb8283d03c50e6e78b4ca54b5bd73dd31264b68d1f83679a95323be93370be762c42d904f7bcc9127f9dbed17030301190e5a646de9c86f5c37102168e28e08cafa74447d6075c9dd1fe082762c3fcb07fa086b9ddc082d7aa11a9dbf93665d12b56d45c78a45358d4b65eca056f72fe25b86902272b3c70b3c872cc1253c5d3828bfefc401f88066bdcadbe186e95af73ffc83ce9a2bdc1c45375529c787a4eb8324408694d754203442803b794601f3d7f8665ed1955448d8752188e10f665bf1de0da5c64cf44808bb52bd04ddcd3d288623501e95bfe836353182f28cedb7d4887ca183cbb33bb3e0f165432f63fd57dc4373a0519ecc0ea81dfb5356f41ac316f6ae5e8d62260aba49b083401f9556d7bc237b3f4e7169355bba4dc439ded999cd408238cfda5ab75fe39f49ed737c024d001df7fdeb485af0b8a387aa1434bb4f8581daa1c76d1703030045739a5a9f6ebe8cd4e3d3d01818b656c6ee5892083e8de4b6212e8fbc3703d2c45378e419f9d1d72ecfa91c8a247707fa82bf99bf2a07c1266849ea0d87dab8c0ded3049d85

# Behind the Scenes 

Making the interactive TLS session was a bizarre experience that turned out to be surprisingly treacherous. It turns out, I have a penchant for doing things the wrong way. In this case, it involved modifying OpenSSL to log the private keys used in the handshake key exchange process and rebuilding NodeJS from source. Here's the patch I applied before rebuilding:

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

You can download the full packet capture of the exchange which this page is based on [here](static/tls-tcpdump.txt). You'll also need the [keylog](static/tls-keylog.txt) to decrypt the capture. Alternatively, you can make your own using the [code](https://gist.github.com/adrian154/5dd6a3231d49f3783688b176afd025e7). 

```plaintext
 X25519 Private-Key:
 priv:
     18:6b:7a:9d:af:38:55:fa:09:0b:f2:9a:69:39:1d:
     c1:ee:78:83:93:f2:db:a5:8a:23:ca:b0:f6:b9:6d:
     63:55
 pub:
     4b:65:e1:78:8c:19:99:35:0d:0a:44:f5:06:46:a7:
     5c:39:25:84:73:5d:96:d6:d0:b3:5b:61:c2:f9:37:
     59:31
 X25519 Private-Key:
 priv:
     d8:b3:91:6b:7e:1e:d8:d6:fa:07:c7:81:0e:ef:53:
     63:9b:77:e5:1e:0f:d8:e0:44:c1:c9:e1:18:6f:d6:
     3c:49
 pub:
     01:1b:5d:f0:90:00:6e:81:4a:b8:db:60:f6:a2:76:
     5c:b9:0f:e7:fc:e7:35:59:e9:14:79:6d:af:e6:71:
     9c:40
```