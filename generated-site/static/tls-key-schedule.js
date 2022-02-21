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

// client credentials
clientHandshakeKey = hkdfExpandLabel(clientHandshakeTrafficSecret, "key", Buffer.alloc(0), 32);
clientHandshakeIV = hkdfExpandLabel(clientHandshakeTrafficSecret, "iv", Buffer.alloc(0), 12);

// server credentials
serverHandshakeKey = hkdfExpandLabel(serverHandshakeTrafficSecret, "key", Buffer.alloc(0), 32);
serverHandshakeIV = hkdfExpandLabel(serverHandshakeTrafficSecret, "iv", Buffer.alloc(0), 12);

// --- end illustrative part

const packet = Buffer.from("1703030fd0836f58dec8f249d56e97053c6f014a116d5211f1fedf010887ae485855d0356556cf48b0b0a45bd5b7e87dd3e49c610603445518e2bc0515d630e00066be657c39bd3962ec2cb4745f9dead80d3951d0f9322001c4cbf82d561972f7b1fcb6c8b2e7b71be3a91ce2ee1d682ffa7ec8eb0eb71912a1c046ab8dfe108013543595269d381ebbf3248733dabb8c8c378fc50e6915a2ef384a2bcbc5abb1e7294b623eee12e695cd9ac9d1666dd7a0013a6e0d4d235b073133ec324245ea3551867bb493e52eb1fa3ddce71b17ad48fb07abae659a4d5e433cce5d1d768eab0859af7dcabd69daadc48ae39d24254db69a14621bb8fe171d9203d28b1665560fd729aa27bb5beb1c3493540223988eedf06afc7a2f5aca1967d7a8212a46be14972e72ebcc477e227f8897ca07bee37c0b5d3dd518cfd9a5c2c9f48cba4d511ce5fc6e511bc4e4910c75b653c4022dae84002a99f962df76d77b0abcc891270ceaa9649bf454470c0dfef62e08649fcc775e001e947f034b87444122749629c149afd1c5766874f3470856bfcffb964dc02ee9578410d0db93d6ebddf7bd228c2362b5a4208629428f3b51cb8b54ed08e22b9d08cff113218dbf63c8879c43df81c69c9a62d4190b902052a51bc37d31c4af3f5341371a491d0de91f1b8f2b78100170e11485298a2036350e835fec2fed5e069b49513db519ecdcced9ce2c257aa1162dc517c94b883bacb5ec87ac9b436086662fba295a288a8a522804dded54f8e058c3298e075be09c240d434cba464af37a62e6e45b981d918f02282dd6d2c1f8f5643f7d18f560b0581f67631aaabdfe8b5a7dda9f01b46db2dbf100fb6d3eaeffc97c11d9dfaa4b24e455144f0714ef637703f8225859038d07ee05fe6ccc32879604b1c8a3cf40c53d0b26b7d0626953a38960bdf74413d836236ceec61b26f6e616900b0bc2fefde71797e2eec7d6df927fb8c62cf7d2209371cd963fdec8c3908115aefdbaf84ceccc50d90e3d51857758b78f5fb2236b367ff445d43317e59011b1a37e93045687d417198d207da1649b8fd597539a199bd638904af41042bb83dc79f80d072eb38d403d3ab596fb95b971e3d45baef392cff6a4fa889082294a8ed3461f374b19c4318b018e42afbe0e610feb98858dd6e430648d062d9e6cc917fbd535c8f87adb6cd1ff8596d6d48674ac9bea1d1f9db25960cf4b2e69ff1987124473ac1b1639ca665027d95c67ba77d135f8cd1f6ececd4dc8c04fabf1718ce8344333825360d1ac01164b4b0257d83b7ddfea8f107c9d75de01f59f128339a08c29e5307b809a34053e1ed023e50750a97077aa6d126a64102be18e812c2cc76ef8870b888d2662fad7fd6fe750939637a5c70801e3a5664c6ba36708aef1c6a3743c17f45ae0c354ee38d97a7a5aea9dd88a6c45bb707e5a47cc0dca77b626e3dfc0c53f3d170a698dbae6d04d46bcaa914f8c919b13b6ebf23210288ae9c91e6236d40b3a7ca0c70eba5b5addc8c2f6efd190d55ecad8d51f133f6dfd7964dac2cbbb3e7e4990e0500dfed6b5d0d09bd5e2f4cac19d4f35d1656abf38fe5e3c900789a252682d3a91a06af61917d9a018ebdded794e7d3c66b554d8f98c2102096fee688740f17fd9edfb2c11fe1f4f802284725ef3a2f6584823012e4834100d0cd07860a5a8837dd41bff822f3868a3164c6e7b37010a865eaeeacaa0f70fc45edf2fbea6ad903a4f23f90232dab1aa7b89b931f18ebe91ef18113f28dfad9460ba737c755e5ce521e9335c179acddb0e6c64d7d4481be704dd23944b0185f62cf621ad37e4f584c4cf7217cb1db4488c1b283a12bfd239f287289b7bac711c41aeb0f3bda866899989dc55d7d1a26982c0da94ba78a7a18a842f612037ffa611b6d5c6560c7566d73b3e1920562af1d6878de507be5aa2d3429622fe42d67b4e037c40933be8b073cc632169c621a0a957be57d106be90d6bc3268dd08f7fb4011f8b0f9a8b6ddab667e4e4136d5ab2c90d09c077ad46848207cc4ea324f9229019d44620e3613e1103f8fc6b948ff88402b9144122c181942ec2e97a8109f169f524d4b7ade8f685e52f694e8dc27c7c51b7d5ae3f05f0003297e1dcabeb86ef9907a4798c4cb480bfcae884819abd8dac4403ceb1646fce67f5abf80d634d873428a9e17baef7afc9b97801c7ce8befa7af6d310e3ff09d28a860847f314859c60e331821aaa211c4a39714bf233703770bfb219f3be2c9c22a934b6eaafdf644e3b7576b89f6625db12950ee8142ac9ac740a8e791ee375d7ff3637775eb4cbd2fdc3800d6b78467625fd82f475a34b37605083ba99df033105c0da0b2ae9ca6371d2a4b7d2549ec6e584744ba84b06bb849c997435b043036eb100ce0b1971a7ec0539c0191d5beb823bb4883bf7e9a15fc7c86b7c5af46e85a27b2e0e74ed10167ec8334d63e8ae5d8e81b32abac74f7d1c1bbf5935abe9813775bb61d11cef44596d5fa129a7aa0a5531bc4a4b532f2318e141393fd7e7cad1d42bb1421154b04576296ba3ab05446034ebef2ed7952c6be9d27e146d3098fa4c030f1f366f25a95b4fc5ec3088a53a8f78bbb4a622d0234af2315e34507809a09a011a43b0729568ae22befc2109e7ab620137aa1397df15adfdd21f7e58a61412b9534274d076d9292f099536ef7d0b78bd2b21bbed4158ff3c126cee67085b3904613dacd3c09be8f937c185b03c1e0bd5377890855e8d3cc1780a8c309f07f68dd05ddd8270b51b4b5b8ccc53a73bc4bc19c95a36a4c9eac6a53dcef75c3bfc23f2b54665b3a6a3a830ed777aa0e9f08d1f4747268490332b01a83149014c38993a57f3ab7ea7b43e236858e57ceabd08d6f21240caa9a92cea7b8ae7ab9a573c4c214a366fb301ca8e678cd4fedc96416ea0505ed6e0e5eaf367dd9a79beeac3f045a242d8b4aa425544c3fd2b29935593cd76df660b063ae0fea65d8c711db8c21ddf0566cbc64bc10a63419d759d2a015b0dba4662a84789fdad3c8772b8a572cccee852a33999dd45f59ed58e21402ef30520e0e2c78eb54a06acd94d9170934b3a9631c6ca24a73d2767f9384650ca8f42e36e1c350864f92594f8651d02ce03c07fbd6231a8e09b86bc2902158e381d231afe784c85aa9d200d5fb5bb791a5a61fc32f929fd39491bfd10f72cc6aea0c2117cd92cc503baa5d74f9c88dc02b23003eae0c4dfaa6bfe4e006a062d593930bb505631f18a20143a0aefd2bb7c3ea00e245fe1495c2c6a42e51d1c90b367be391ccab91bf4aa35b2dc7c8102328df10381e72af410ffad7c42818ae9e4da243df6ce39bd7152f88c969a8d4b6007175ce11edba728dca9792555089db8dda63350974e8fac02f94f2208138e877f14d452e491240c7dd1ee203bd9347a0a63c4ace55dbc37eb225915352f2cb4e9ae28d2fbc49a9f8a4f932367d97d77b2a4045efdb771f9fcde5cf3c842ab70eca5342dddcb072d4ac4368fb65b35d967ff271759f1840dd197231d78512cf148bde0c22012d1a8b3e173b3326db3b366aeeb16ccff8b6c79d335f72a6943733cd4c41898155e372a91193c8292f021703a2281ba3c8e064e53f4d062aa1e935a9f689f735f4777016eb75c23ae41bf8d990d418bc676903c0809f2c04fe2f2c6845a7d7adaff9fe860276841cd7198e859e4df97bb6f4fcaf5542f0105f3a6dc8f7655d4ce004a3724c682b4d7275ae6fafcba9bc03119a167524e6b0472cd51cdaddc8f1a31248e485589ea6f1f91a320336d8b1be1060c0cddd8d6ad5955ffd7c208076283e96cfc9b5d0ed4bb3fe74b511a5d349b652bbb3b69208457c8f7670a8675977cc5d1070114ba90636a7eb82a0724e87941e94995c6d961b770ca609f0eeb000cbb17b74e33b0aaeb3c61d444cd156606c70509bf8495331bd39468b8f6cef7da6c9c5a9631ddc5973c40f5a32dda38657e21312d418b7c50bddaa5b683014bb203255a5dfdcf3169ab66d4f7c2b42c6b9099db1851f004997c0eee805c481ee6976a83956cf3cc67ff6ead9024b54abe750da604dcc45056a1edc985568c1674fea2526843bcb72b65cf500dfbd60115f0898177d7c1376229aa5c57fbdf6b7dfaac50b9229034ec5b43888448694ec36c5a4b83336399c421b757298c125c184fbfbce78d8e48b0eaecef90818139e899d8362e07161a3faaa3319383233e3b6ef1e52fd63065ad91d30aacdbd0c6f5c57f884fc60734c67ac59123c67291dbff05a5ca44fb227e9cd0e8d422eff20c0e85249dedc95df79df7be8b85b436fd9f4e91c444ac9229cd0094295729dba448de80406a6c9bbf8a78b4818faffa3a2e81aabf58922192bfd1e5b94165aa0b5de4940410f9b1dd4345affcbf71c46c6839708cd83fb01df180668d33e3631702fecced6f44f009fdd0fb2337257c5356f444ddfb14045dc07fbe310d9d424db74fc9f1a6b3b8b41d490d0e4654c321c6a0a80d7fa733d633ff408a6586cd46cd79037bda3fc74d51398cbfce13affdb64b560db27975b8fe13575813b48bd58433d67bac56037aa875c7012fdfb7be032ce920e3587235ea85d2bcb42dd15e3553074b89fd9c4af184bdda3f21babd1f56dff78c75e51c4a1ec4d5896be18362c2d745e3dd71413e3fed1313fa5ec1dc5b58aa479c41501d4f685930fca95e20939c1fead500e386b336c89b2fd642aeefaa6260fce237bb217a7132bdb30064834f9390c096d3ad7b75493a3d067b5e0ba4d20d7b0acb316ae6de156b701be4f31d97c3d4f2c7a22920491f5e24e1afd6378d82756c7fd5ad782019e0bfee12a2aa9e1875eb2ab7b767bf0afacea31c0683fdf6bbdaa7f1cd82d387fd46390fb580af987da590086b326d260e8ffeb2fec934248102601685e47b6e5a19a82e4001b7accba39cef437384bde5765a7927654dab8a37919dd3396985a07e264087f8be6b8c57b9314477b1d3c45ddda4fea6b140ea15e733eb0f0d50534c96b0059c79fe26fd57b557ea4c29fdd12c9c9ec83ef028679a5ab8717f93165621de4ba391504f2198f7e76011604af26c4d0603ec029ae48ac9a8278b5d8fd09af13f56e10a2c54c488b30f7d899e6d41d8019ad9993f50b3f579a97f9ebedd1b69c1a9f4f2a485a7a49db5c4057741eed3402752da2b3f9c7fa0aa9b67ad4ce21b25ef4757485dacae5beb4435b9711df7ddcea190c27d99c50dd2f02102e833401fc880db620fc4140ce31483c4e9299a4b97dacc9c4af3e38596c1371fe63aa23af446725deb7781d0f0caad5fd0d7a26d1b364987677a41a988b7283246eff40164392d3e88c426543fe8d3cf1ef41daed9d72f708527c0f9c228c4c520ca6ab6d0b5d19e91a6c5253d053052fff0352e99e62fecc788bc3a3f39061a20e3141ebfa885b48d6fa1bee1522f32457cedbe93fa7f40de1b75b34ce55c63e46eceeeeb5b39dab90c1bc925022929d8de584a37c022c567c6bf4fe62bc33d8cb1abc38b4e99be6923062d79aa7d84e1851ac532a7cf45de1210978304e3a120c98dd90298e05ca14fbca5adbc933b4bfa17db8968a4e9f419cc91739e2f266d075ba4e21cef67cad3a86629c4a74566113e0f831d3c847ab3a36be313b024e9d3fae50e7c92c8a8dfbb374a1468664812450858baeb95a1838380f5f9425706559f2e946f8931085800931f16ec97ee8d", "hex");

const aad = packet.slice(0, 5);
const ciphertext = packet.slice(5, packet.length - 16);
const authTag = packet.slice(packet.length - 16, packet.length);

// seq
serverHandshakeIV[serverHandshakeIV.length - 1] ^= 1;

const decipher = crypto.createDecipheriv("aes-256-gcm", serverHandshakeKey, serverHandshakeIV);
decipher.setAAD(aad);
decipher.setAuthTag(authTag);
console.log(decipher.update(ciphertext).toString("hex"));
decipher.final();