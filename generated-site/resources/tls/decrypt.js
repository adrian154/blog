const crypto = require("crypto");

// inputs:
const record = Buffer.from("1703030119be9722c251e627962e508b7912a22cb352e9cab0b6bb38a877939de96a1731f5b21be8879b0e4e8da417185321a1da36f72db2b0c02b4f174df98101c3d7d344aac6334cced14e6ba58705ba9b4e3367ddd6db2b228a47e761330c609a076c417b7eff5852aa5f4351d0398d9abbc52fe221a27d7cb641ca46ac3bdd8a96b7250eff2844b82b10ee65f4e66a26c7fc192a85ffa05fce44a86cd7399d3f9251a31ddaa5aefbd33956501bc623cbf3d17ba0409b17a406320f93d15a6cc010592a9ebcef975f0eb60418e8d91c6516821cf678eafde21fd882c28fd0c15b1791d9e7d47683f4f248280845e9fbf75bd5797f54525b7b6f4203e44926f992bb75719de0dfe599a51183cfe2423ccf6fadc10f47f65eee82baf7a9", "hex");
const key = Buffer.from("a68b2ab439d3251e3786eb0eaf5cf78ef8638f57b1721c62342f26fdd6b42eec", "hex");
const IV = Buffer.from("b8e943d0bba5ec909f3ab703", "hex");

// extract associated data (record type, version, data length)
const associatedData = record.slice(0, 5);

// ...ciphertext portion
const ciphertext = record.slice(5, record.length - 16);

// ... authentication tag (last 16 bytes)
const authTag = record.slice(record.length - 16, record.length);

// the IV is XOR'd with the sequence number
// this is technically a 64-bit value, but our sequence numbers are low enough to avoid additional complexity
IV[IV.length - 1] ^= 2;

const decipher = crypto.createDecipheriv("aes-256-gcm", key, IV);
decipher.setAAD(associatedData);
decipher.setAuthTag(authTag);
const plaintext = decipher.update(ciphertext);
decipher.final();

console.log(plaintext.toString("hex"));