// Simulate the TLS key schedule

const crypto = require("crypto");
const {ClientHello, ServerHello, EncryptedExtensions, Certificate, CertificateVerify, ServerFinished} = require("./inputs.js");

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

// >>> after certificate and certificateverify

clientFinishedKey = hkdfExpandLabel(clientHandshakeTrafficSecret, "finished", Buffer.alloc(0), HASHLEN);
serverFinishedKey = hkdfExpandLabel(serverHandshakeTrafficSecret, "finished", Buffer.alloc(0), HASHLEN);

// >>> after server finished

derivedSecret2 = deriveSecret(handshakeSecret, "derived", Buffer.alloc(0));
masterSecret = hkdfExtract(derivedSecret2, Buffer.alloc(HASHLEN));

applicationContext = Buffer.concat([handshakeContext, EncryptedExtensions, Certificate, CertificateVerify, ServerFinished]);
clientApplicationTrafficSecret = deriveSecret(masterSecret, "c ap traffic", applicationContext);
serverApplicationTrafficSecret = deriveSecret(masterSecret, "s ap traffic", applicationContext);

clientApplicationKey = hkdfExpandLabel(clientApplicationTrafficSecret, "key", Buffer.alloc(0), 32);
clientApplicationIV = hkdfExpandLabel(clientApplicationTrafficSecret, "iv", Buffer.alloc(0), 12);

serverApplicationKey = hkdfExpandLabel(serverApplicationTrafficSecret, "key", Buffer.alloc(0), 32);
serverApplicationIV = hkdfExpandLabel(serverApplicationTrafficSecret, "iv", Buffer.alloc(0), 12);

// --- end illustrative part

console.log(">>> After ServerHello sent");
console.log(`client:\n\tkey=${clientHandshakeKey.toString("hex")}\n\tIV=${clientHandshakeIV.toString("hex")}`);
console.log(`server:\n\tkey=${serverHandshakeKey.toString("hex")}\n\tIV=${serverHandshakeIV.toString("hex")}`);

console.log(">>> After CertificateVerify");
console.log(`client finished key: ${clientFinishedKey.toString("hex")}`);
console.log(`server finished key: ${serverFinishedKey.toString("hex")}`);

console.log(">>> After Finished");
console.log(`client:\n\tkey=${clientApplicationKey.toString("hex")}\n\tIV=${clientApplicationIV.toString("hex")}`);
console.log(`server:\n\tkey=${serverApplicationKey.toString("hex")}\n\tIV=${serverApplicationIV.toString("hex")}`);
