Mojang recently announced that a [chat report system](https://www.minecraft.net/en-us/article/minecraft-1-19-1-pre-release-1) would be coming to Minecraft in 1.19.1, which has sparked a great deal of controversy amongst players. I'm not going to discuss whether this is a good idea in this article; instead, we're going to be taking a look at how exactly the reporting system works and what this means for server operators. Hopefully this will allow for some more enlightened discussion.

# Crypto Background: Digital Signatures

One of the most obvious issues with the report system is that of authenticity. When a report is received, how does the reviewer know that the accused player actually sent the message in question? To ensure that no one can forge a report, Mojang has since implemented functionality that would require all messages to be digitally signed using a key associated with the sender's account.

How do digital signatures work? Here's the process, in a nutshell:
* The user generates a random value known as a private key, which is kept secret. An algorithm is used to derive a public key from the private key. The keypair has the property that the value of the private key cannot be easily determined from the public key, so the public key is safe to distribute.
* To sign a message, the user feeds the message and the private key into a signing algorithm, which produces the digital signature. The user then distributes the signature alongside their message to prove its authenticity.
* If I know the user's public key, I can verify that the message they've sent hasn't been tampered with by running a verification algorithm on the user's public key, message, and signature. This algorithm will fail if the signature is invalid, or if the message has been altered in any way.

<figure style="max-width: 491px">
    <img src="resources/bitcoin/digital-signature.png" alt="illustration of a digital signature scheme">
    <figcaption>A diagram of a public-key digital signature scheme. <a href="https://en.wikipedia.org/wiki/File:Private_key_signing.svg">Image</a> by <a href="https://commons.wikimedia.org/wiki/User:FlippyFlink">FlippyFlink</a> / <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">CC BY-SA</a></figcaption>
</figure>

This is not the exact scheme used by Minecraft, but it serves to explain the concept of digital signatures. Let's see how Minecraft implements it.

# Minecraft Key Management

First things first, let's understand how Minecraft manages the user's keypair. To do this, I decompiled the game, something which I recently wrote a [blogpost](decompiling-mc.html) about. Anyways, some digging around eventually brings us to a class called `ProfileKeyPairManager`, which reveals that your profile keys are stored in a JSON file in the `.minecraft/profilekeys` folder. A quick look at this file reveals its structure:

```json
{
    "private_key": "PEM-encoded RSA private key",
    "public_key": {
        "expires_at": "ISO 8601 timestamp",
        "key": "PEM-encoded RSA public key",
        "signature": "base64 signature"
    },
    "refreshed_after": "ISO 8601 timestamp"
}
```

(Obviously, I've gone ahead and replaced all the actual values with strings describing each field's purpose.)

OpenSSL shows that the RSA private keys are 2048 bits in length. The expiration date suggests that the profile keys have a lifespan of 48 hours. Finally, the player's keypair is signed by Mojang, as reflected by the `signature` field. 

## Obtaining a Keypair

`ProfileKeyPairManager` also contains details about how keypairs are fetched via Mojang's API. It's a very simple API; the client makes a POST request to `https://api.minecraftservices.com/player/certificates`, and the server responds with a JSON object like the one shown above.

## Keypair Verification

During the login sequence, the client sends its public key to the server. Whether the server verifies that the public key is valid is controlled by a setting in `server.properties` called `enforce-secure-profile`. At the time of writing (1.19.1-pre1), this setting is **false** by default.

If this setting is enabled, the server will verify the public keys sent by clients and prevent clients which don't present a valid keypair from connecting. The verification consists of two checks:
* The `expires_at` timestamp must not be in the past.
* The `expires_at` timestamp is converted to epoch milliseconds and concatenated with the public key. This is used as the payload which the signature is validated against.

The public key that the server uses to verify the signature is stored in a file called `yggdrasil_session_pubkey.der`, which can be found in the root of `authlib-x.x.xx.jar`. Here's some NodeJS code that simulates the verification process:

```js
const fs = require("fs"),
      crypto = require("crypto");

const playerPubkey = { /* ... omitted ... */},
      mojangPubkey = crypto.createPublicKey({
          key: fs.readFileSync("yggdrasil_session_pubkey.der"),
          format: "der",
          type: "spki"
      });

const signedPayload = Buffer.from(new Date(playerPubkey.expires_at).getTime() + playerPubkey.key, "utf-8");

console.log(crypto.verify(
    "sha1WithRSAEncryption",
    signedPayload,
    mojangPubkey,
    Buffer.from(playerPubkey.signature, "base64")
)); // -> true
```

TL;DR: Because all player public keys are signed using a keypair known to all servers, a server can verify that a key presented by a player is valid without ever contacting Mojang.

# Signed Chat

To accomodate the chat reporting system, chat messages are now signed using the user's keypair. There is a setting under <kbd>Options</kbd> &rarr; <kbd>Chat Settings...</kbd> &rarr; <kbd>Only Show Secure Chat</kbd> that toggles whether messages with invalid signatures are hidden. This setting is **off** by default at the time of writing (1.19.1-pre1).

<aside>

Chat messages can also have both signed and unsigned parts. I have yet to research how exactly this works.

</aside>

## Chat Message Signing

Since 1.19, this has been the on-wire structure of the serverbound chat packet:

| Field         | Type              |
|---------------|-------------------|
| message       | String            |
| timestamp     | Instant           |
| saltSignature | SaltSignaturePair |
| signedPreview | Boolean           |

For more information on how these types are serialized, check out the [protocol documentation](https://wiki.vg/Protocol) at [wiki.vg](https://wiki.vg/). A `SaltSignaturePair` (which is yet to be documented on wiki.vg at the time of writing) has the following structure:

| Field     | Type      |
|-----------|-----------|
| salt      | Long      |
| signature | ByteArray |

To construct the `SaltSignaturePair`, the client first generates a random 8-byte salt using Java's `SecureRandom`. The signed payload is constructed in `MessageSignature`; it consists of the following fields, concatenated:

* The salt
* The 64 most significant bits of the UUID, as returned by `java.util.UUID#getMostSignificantBits()`
* The 64 least significant bits of the UUID, as returned by `java.util.UUID#getLeastSignificantBits()` 
* The epoch timestamp in seconds as a `long`
* The JSON of the signed chat component, encoded in UTF-8

All `long`s are encoded in big-endian order. The signature is generated using the `SHA256withRSA` algorithm.

## Chat Message Verification

In 1.19 the [Player Info](https://wiki.vg/Protocol#Player_Info) packet was updated so that players would receive the public keys of other players on the same server. This allows incoming chat messages to be verified. I didn't write code to simulate this verification process, but the procedure is fairly simple; the client simply needs to reconstruct the signed payload based on the fields in the packet, and feed it to the signature verifier.

# Report API

When an abuse report is submitted, a POST request is made to `https://api.minecraftservices.com/player/report`. The body is an `AbuseReportRequest`, serialized as JSON. Requests are authorized using a standard Yggdrasil authorization token.

Here is the structure of the body, as far as I can tell, though I have yet to successfully capture an actual report payload.

```json
{
    "id": UUID,
    "report": {
        "type": String,
        "opinionComments": String,
        "reason": String,
        "evidence": {
            "messages": [
                {
                    "profileID": UUID,
                    "timestamp": Instant,
                    "salt": long,
                    "signature": String,
                    "message": String,
                    "overriddenMessage": String,
                    "messageReported": boolean
                }
            ]
        },
        "reportedEntity": {
            "profileId": UUID
        },
        "createdTime": Instant
    },
    "clientInfo": {
        "clientVersion": String
    },
    "thirdPartyServerInfo": {
        "address": String
    },
    "realmInfo": {
        "realmId": String,
        "slotId": int
    }
}
```

One thing that stood out to me was that as far as I can tell, the player's public key is not included in the report, meaning that Mojang has to have a database of player public keys to validate reports with. Since they must cull old keypairs after a certain amount of time, this puts an upper limit on the maximum age after which a message can't be reported because Mojang will be unable to validate the signature. I obviously have no idea what Mojang's internal policy on this is, though. My totally baseless speculation is that expired keypairs will be deleted instantly, but take that with a grain of salt.

# The Big Picture

How does this change affect the community? Here are my thoughts.

For starters, unless Mojang backports the chat signing changes to 1.18 and below, this change is mostly limited to versions 1.19 and above. However, odds are bans will be enforced through the auth servers, so if you are banned for a message sent while playing on 1.19 you won't be able to play on any version.

Some players have made the claim that reporting will be limited to Realms, based on pages on the Minecraft website. This is probably not the case; the aformentioned pages are for Bedrock, and there are no communications from Mojang suggesting that this report system will be Realms-only. Surely, if the change wasn't meant to affect private servers, they would have made a clarification in response to the widespread backlash.

Even on affected versions, reporting is weakened by a few main factors:
* On servers that have custom chat plugins, odds are player messages are broadcast using the [System Chat Message](https://wiki.vg/Protocol#System_Chat_Message_.28clientbound.29) packet and not the Player Chat Message packet. System messages are not signed and thus cannot be reported.
* A modified client can refuse to send the server a valid public key and refuse to include valid signatures with messages.
* A modified server can allow players to join without valid public keys and strip signatures from messages to prevent players from reporting them.

A [mod]() that implements the latter two changes is already available.

**WARNING:** Everything below this line is my opinion.

What do I think about the reports system? I'm not a huge fan, for two main reasons. First, I think this change violates an implicit contract that has existed between Mojang and server operators since the inception of multiplayer in the game, wherein Mojang gives operators full control over what happens on their server, including how punishments are doled out. Now, as a server owner, you are no longer the sole party with a say in who gets to play on your server, since Mojang can overrule your moderation decisions. While they have always technically had this power, the introduction of the report system marks the first instance where they have publicly demonstrated their intent to exercise it. Unsurprisingly, many server admins have perceived the announcement as a violation of their trust.

Second, I don't have much faith in Mojang's ability to moderate chat in a way that the community will find satisfactory, hence my continued support for player-based moderation. In the worst-case scenario, Minecraft goes the way of Roblox or Club Penguin, where the chat becomes a desolte wasteland threatening to get your account banned for the slightest transgression. I find this outcome extremely unlikely due to the technical limitations listed earlier, but nevertheless, odds are there will be little recourse for players who get banned.

All in all, I consider the report system as it exists today a poor implementation of a poorly thought-out idea, and I am very disappointed that Mojang hasn't even acknowledged the overwhelmingly negative response to its introduction. I also think that the change marks a shift towards the worse in the relationship between Mojang and server owners, as well as the Minecraft community as a whole.