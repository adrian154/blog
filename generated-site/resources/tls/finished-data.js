const crypto = require("crypto");
const {ClientHello, ServerHello, EncryptedExtensions, Certificate, CertificateVerify} = require("./inputs.js");

finishedKey = Buffer.from("be50c8590aa39255417d7c184604ca8da172a8889959e822d57b12643acfd967eeab3d64ce847ef69446e2d263f65c5e", "hex");
contextHash = crypto.createHash("sha384").update(Buffer.concat([
    ClientHello,
    ServerHello,
    EncryptedExtensions,
    Certificate,
    CertificateVerify
])).digest();

console.log(crypto.createHmac("sha384", finishedKey)
                  .update(contextHash)
                  .digest()
                  .toString("hex"));