// Simulate the TLS key schedule

const crypto = require("crypto");
const {ClientHello, ServerHello} = require("./inputs.js");

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

// HKDF-Expand-Label and Derive-Secret as defined in RFC8446
const hkdfExpandLabel = (secret, label, context, length) => {

    const labelBytes = Buffer.from("tls13 " + label, "utf-8");

    // create hkdf-label
    const hkdfLabel = Buffer.concat([
        Buffer.from([length >> 8, length & 0xff, labelBytes.length]),
        labelBytes,
        Buffer.from([context.length]),
        context
    ]);

    return hkdfExpand(secret, hkdfLabel, length);

};

const deriveSecret = (secret, label, context) => hkdfExpandLabel(secret, label, crypto.createHash(HASH).update(context).digest(), HASHLEN);

// session values
const sharedSecret = Buffer.from("4c75e186e47a2627bb4501955a051d516653d9570f34c660e623d26e2175b956", "hex");

// --- begin illustrative part

earlySecret = hkdfExtract(
    Buffer.alloc(HASHLEN), // initial salt is zero 
    Buffer.alloc(HASHLEN)  // replace PSK with string of zeroes of the same length
);

derivedSecret = deriveSecret(earlySecret, "derived", Buffer.alloc(0));
handshakeSecret = hkdfExtract(derivedSecret, sharedSecret); // sharedSecret = 4c 75 e1 ...

// derive handshake traffic secrets
handshakeContext = Buffer.concat([ClientHello, ServerHello]);
clientHandshakeTrafficSecret = deriveSecret(handshakeSecret, "c hs traffic", handshakeContext);
serverHandshakeTrafficSecret = deriveSecret(handshakeSecret, "s hs traffic", handshakeContext);

// client credentials
clientHandshakeKey = hkdfExpandLabel(clientHandshakeTrafficSecret, "key", Buffer.alloc(0), 32);
clientHandshakeIV = hkdfExpandLabel(clientHandshakeTrafficSecret, "iv", Buffer.alloc(0), 12);

// server credentials
serverHandshakeKey = hkdfExpandLabel(serverHandshakeTrafficSecret, "key", Buffer.alloc(0), 32);
serverHandshakeIV = hkdfExpandLabel(serverHandshakeTrafficSecret, "iv", Buffer.alloc(0), 12);

// --- end illustrative part

console.log(`Client: key=${clientHandshakeKey.toString("hex")}, IV=${clientHandshakeIV.toString("hex")}`);
console.log(`Server: key=${serverHandshakeKey.toString("hex")}, IV=${serverHandshakeIV.toString("hex")}`);