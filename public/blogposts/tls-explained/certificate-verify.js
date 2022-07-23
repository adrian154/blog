const crypto = require("crypto");
const {ClientHello, ServerHello, EncryptedExtensions, Certificate} = require("./inputs.js");

// inputs
const signature = Buffer.from("394fbf6cbd019e90b4a97a405d3f16ee5510dc3b34b5e1e844c75974be587137e7e25482a10decc7ba97219e880715c766e78d0fafad963cb95996a111fe798bc47060f2eb45b398b50a2e616c5566720865b7572d5ada5a5ea9168311c5ed3e1b49b03b04c463fca9ba1c7621b940731db06f4cda19c78933f1be5a40d4fda7848bd5c67cfe2d7c85dadd9d52a1d9db6b853ac877926ed5ea72cb35f852c664e98c2ac377cd8b3217d059356df20c3e86b6042ad88a39b676f2a338fb4909710b1c208336415959891f5e522ea6e7468f128adc391b643749ed56cda3280d59ef92ce26f66bb0b89f5c9ccfdf8fab7da7b5882bca27cc496ea0767f9ca44e9e", "hex");
const keyBytes = Buffer.from("30820122300d06092a864886f70d01010105000382010f003082010a0282010100b587501904bd9198c9c9eab873d4a249dcc37632e5ed3d22bcbab4126b5727fbfedc8975d073cd2e9f9faef3243c145a6458531b831515778bf76125c07a4148fe39b6eaddd38539d5f7bdf1dbc3a9bc014cb4fbce004879f4cdf84164bcd8d6f1f95ce730f4cfe91908cf2b15a4a60b26d2c4d31c4c850976d40d775f103bf33deb293bc8a6412865c596e0a07e8c38d72b8d4a981b518738cb6843ddc2574c2e279db10e4ce88d5fbe0502ca4ed97eee1f820894258d6a8deb78aa0f69b6ebddd5e991732cc19642bec153e6c874c3393a90dde0aae55b61417e96c0e695eb66fb9ddcbc2af5e6b8af4e61357ed1b0abe8a2efe9323c5fd14f6af30afa19b90203010001", "hex");
const key = crypto.createPublicKey({key: keyBytes, format: "der", type: "spki"});

// --- begin illustrative part

// calculate transcript hash
contextHash = crypto.createHash("sha384").update(Buffer.concat([
    ClientHello,
    ServerHello,
    EncryptedExtensions,
    Certificate
])).digest();

// create the value which was actually signed
data = Buffer.concat([
    Buffer.from(new Array(64).fill(0x20)), // 64 spaces
    Buffer.from("TLS 1.3, server CertificateVerify", "ascii"), // context string
    Buffer.alloc(1), // null byte
    contextHash // content to be signed
]);

// validate the signature
console.log(crypto.verify(
    "sha256",
    data,
    {key, padding: crypto.constants.RSA_PKCS1_PSS_PADDING},
    signature
)); // -> true

// --- end illustrative part