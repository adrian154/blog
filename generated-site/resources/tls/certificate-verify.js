const crypto = require("crypto");

// calculate transcript hash
const contextHash = crypto.createHash("SHA-384").update(Buffer.concat([
    
    Buffer.from("", "hex"),

    // certificate
    Buffer.from("", "hex")

])).digest();

// create the value which was actually signed
const data = Buffer.concat([

    // padding
    Buffer.from(new Array(64).fill(0x20)),
    
    // context string
    Buffer.from("TLS 1.3, client CertificateVerify", "ascii"),
    
    // null byte
    Buffer.alloc(1), 

    // "content to be signed" (context hash)
    contextHash

]);

// validate the signature
const signature = Buffer.from("394fbf6cbd019e90b4a97a405d3f16ee5510dc3b34b5e1e844c75974be587137e7e25482a10decc7ba97219e880715c766e78d0fafad963cb95996a111fe798bc47060f2eb45b398b50a2e616c5566720865b7572d5ada5a5ea9168311c5ed3e1b49b03b04c463fca9ba1c7621b940731db06f4cda19c78933f1be5a40d4fda7848bd5c67cfe2d7c85dadd9d52a1d9db6b853ac877926ed5ea72cb35f852c664e98c2ac377cd8b3217d059356df20c3e86b6042ad88a39b676f2a338fb4909710b1c208336415959891f5e522ea6e7468f128adc391b643749ed56cda3280d59ef92ce26f66bb0b89f5c9ccfdf8fab7da7b5882bca27cc496ea0767f9ca44e9e", "hex");