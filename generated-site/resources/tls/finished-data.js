const crypto = require("crypto");
const {ClientHello, ServerHello, EncryptedExtensions, Certificate, CertificateVerify, ServerFinished} = require("./inputs.js");

finishedKey = Buffer.from("81f67cc161fdbae8eb80e8585833e6e60c48131f3f162994d13cef3579950e6355ec9573e6c0bec377ecdd2834db1028", "hex");
contextHash = crypto.createHash("sha384").update(Buffer.concat([
    ClientHello,
    ServerHello,
    EncryptedExtensions,
    Certificate,
    CertificateVerify,
    ServerFinished
])).digest();

console.log(crypto.createHmac("sha384", finishedKey)
                  .update(contextHash)
                  .digest()
                  .toString("hex"));