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

    const contextHash = crypto.createHash(HASH).update(context).digest();
    const labelBytes = Buffer.from("tls13 " + label, "utf-8");

    // create hkdf-label
    const hdkfLabel = Buffer.concat([
        Buffer.from([HASHLEN >> 8, HASHLEN & 0xff, labelBytes.length]),
        labelBytes,
        Buffer.from([contextHash.length]),
        contextHash
    ]);

    console.log([...hdkfLabel].map(byte => byte.toString(16).padStart(2, '0')).join(' '));

    return hkdfExpand(secret, hdkfLabel, HASHLEN);

};

// session values
const sharedSecret = Buffer.from("4c75e186e47a2627bb4501955a051d516653d9570f34c660e623d26e2175b956", "hex");
const handshakeContext = Buffer.from("010001540303035735d60c9512c61134349e99999105922738a7ee2110b0692817ec961a21dd20cce0a325341c9485b11e794e263fe3c3399204aaec8dc73eb996cd79f973d1b20076130213031301c02fc02bc030c02c009ec0270067c028006b00a3009fcca9cca8ccaac0afc0adc0a3c09fc05dc061c057c05300a2c0aec0acc0a2c09ec05cc060c056c052c024006ac0230040c00ac01400390038c009c01300330032009dc0a1c09dc051009cc0a0c09cc050003d003c0035002f00ff01000095000b000403000102000a00160014001d0017001e0019001801000101010201030104002300000016000000170000000d002a0028040305030603080708080809080a080b080408050806040105010601030303010302040205020602002b00050403040303002d00020101003300260024001d00204b65e1788c1999350d0a44f50646a75c392584735d96d6d0b35b61c2f9375931020000760303b21fc7065806a4d46abbc3efea46c59d664440debce77c19305ec080430ae7b820cce0a325341c9485b11e794e263fe3c3399204aaec8dc73eb996cd79f973d1b2130200002e002b0002030400330024001d0020011b5df090006e814ab8db60f6a2765cb90fe7fce73559e914796dafe6719c40", "hex");

// --- begin illustrative part

earlySecret = hkdfExtract(
    Buffer.alloc(HASHLEN), // initial salt is zero 
    Buffer.alloc(HASHLEN)  // replace PSK with string of zeroes of the same length
);

derivedSecret = deriveSecret(earlySecret, "derived", Buffer.alloc(0));
handshakeSecret = hkdfExtract(derivedSecret, sharedSecret); // sharedSecret = 4c 75 e1 ...

// client side
clientHandshakeTrafficSecret = deriveSecret(handshakeSecret, "c hs traffic", handshakeContext);

// server side
serverHandshakeTrafficSecret = deriveSecret(handshakeSecret, "s hs traffic", handshakeContext);

console.log(clientHandshakeTrafficSecret, serverHandshakeTrafficSecret);

// --- end illustrative part