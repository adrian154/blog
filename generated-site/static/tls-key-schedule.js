// Simulate the TLS key schedule

// deps
const crypto = require("crypto");

const HASH = "sha384", HASHLEN = 384 / 8;
const hmacHash = (salt, key) => crypto.createHmac(HASH, salt).update(key).digest();

// HKDF functions as defined in RFC5869
const hkdfExtract = (salt, IKM) => hmacHash(salt, IKM);
const hkdfExpand = (PRK, info, L) => {
    const N = Math.ceil(L / HASHLEN);
    let T = [Buffer.alloc(0)];
    for(let i = 1; i <= N; i++) {
        T.push(hmacHash(PRK, Buffer.concat([T[i - 1], info, Buffer.from([i])])));
    }
    return Buffer.concat(T).slice(0, L);
};

// Derive-Secret as defined in RFC8446
const deriveSecret = (secret, label, context) => {

    // create hkdf-label
    const hdkfLabel = Buffer.concat([
        Buffer.from([HASHLEN & 0xff00 >> 8, HASHLEN & 0xff]),
        Buffer.from("tls13 " + label).toString("utf-8"), 
        context
    ]);

    return hkdfExpand(secret, hdkfLabel, HASHLEN);

};

// session values
const sharedSecret = Buffer.from("4c75e186e47a2627bb4501955a051d516653d9570f34c660e623d26e2175b956", "hex");

// --- illustrative part

// The key schedule begins with the calculation of an "early secret". This is normally used to include the pre-shared key in the key schedule. Since we don't have a PSK, this part is mostly irrelevant. However, we still have to do it, just with dummy values
earlySecret = hkdfExtract(
    Buffer.from([0]),      // initial salt is zero 
    Buffer.alloc(HASHLEN)  // replace PSK with string of zeroes of the same length
);

// Next, calculate a derived secret from the early secret.
derivedSecret = deriveSecret(earlySecret, "derived", Buffer.alloc(0));

// Create the handshake secret using the shared value from key exchange + derived secret
handshakeSecret = hkdfExtract(derivedSecret, sharedSecret); // sharedSecret = 4c 75 e1 ...

// For the next part, we need to pass the hash of the previously exchanged ClientHello and ServerHello messages to deriveSecret()
// this is why the `random` field is included in the Hello messages: to prevent replay attacks
// bceause the hash will change each time, all secrets derived in this context are bound to the handshake
// this prevents an attacker from simply *replaying* a TLS session to, say, repeat a request
// 
clientHandshakeTrafficSecret = deriveSecret(handshakeSecret, "c hs traffic", )

// --- end illustrative part