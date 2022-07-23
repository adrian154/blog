const crypto = require("crypto");

// inputs:
const record = Buffer.from("170303001509666bb5a36067e79f614aac921bf3c5d86ba781ea", "hex");
const key = Buffer.from("1afc37c6aef965ffd2db82bee2d5f46a3785aa8ad47de111208aa1056a503503", "hex");
const IV = Buffer.from("632a2ed801519f7778b677ad", "hex");

// extract associated data (record type, version, data length)
const associatedData = record.slice(0, 5);

// ...ciphertext portion
const ciphertext = record.slice(5, record.length - 16);

// ... authentication tag (last 16 bytes)
const authTag = record.slice(record.length - 16, record.length);

// the IV is XOR'd with the sequence number
// this is technically a 64-bit value, but our sequence numbers are low enough to avoid additional complexity
IV[IV.length - 1] ^= 0;

const decipher = crypto.createDecipheriv("aes-256-gcm", key, IV);
decipher.setAAD(associatedData);
decipher.setAuthTag(authTag);
const plaintext = decipher.update(ciphertext);
decipher.final();

console.log(plaintext.toString("hex"));