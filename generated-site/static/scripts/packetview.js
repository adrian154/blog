const s = '308205263082040ea003020102021204f99a1b9df5e7f17bb9f19166129e3ff810300d06092a864886f70d01010b05003032310b300906035504061302555331163014060355040a130d4c6574277320456e6372797074310b3009060355040313025233301e170d3232303231383036353132385a170d3232303531393036353132375a301b3119301706035504031310746573742e626974686f6c652e64657630820122300d06092a864886f70d01010105000382010f003082010a0282010100b587501904bd9198c9c9eab873d4a249dcc37632e5ed3d22bcbab4126b5727fbfedc8975d073cd2e9f9faef3243c145a6458531b831515778bf76125c07a4148fe39b6eaddd38539d5f7bdf1dbc3a9bc014cb4fbce004879f4cdf84164bcd8d6f1f95ce730f4cfe91908cf2b15a4a60b26d2c4d31c4c850976d40d775f103bf33deb293bc8a6412865c596e0a07e8c38d72b8d4a981b518738cb6843ddc2574c2e279db10e4ce88d5fbe0502ca4ed97eee1f820894258d6a8deb78aa0f69b6ebddd5e991732cc19642bec153e6c874c3393a90dde0aae55b61417e96c0e695eb66fb9ddcbc2af5e6b8af4e61357ed1b0abe8a2efe9323c5fd14f6af30afa19b90203010001a382024b30820247300e0603551d0f0101ff0404030205a0301d0603551d250416301406082b0601050507030106082b06010505070302300c0603551d130101ff04023000301d0603551d0e04160414e7a1622dade131944f1341c83a37a5b96336263e301f0603551d23041830168014142eb317b75856cbae500940e61faf9d8b14c2c6305506082b0601050507010104493047302106082b060105050730018615687474703a2f2f72332e6f2e6c656e63722e6f7267302206082b060105050730028616687474703a2f2f72332e692e6c656e63722e6f72672f301b0603551d11041430128210746573742e626974686f6c652e646576304c0603551d20044530433008060667810c0102013037060b2b0601040182df130101013028302606082b06010505070201161a687474703a2f2f6370732e6c657473656e63727970742e6f726730820104060a2b06010401d6790204020481f50481f200f00076006f5376ac31f03119d89900a45115ff77151c11d902c10029068db2089a37d9130000017f0bd084e50000040300473045022100eee2822add6ff5c9cc507f0a8a5f174551205becfbf0031e962d8f4ce916090b022049cf3e53e653385c0745902e8c7901e4971b25b436eafb22f2b83c222747b3c500760046a555eb75fa912030b5a28969f4f37d112c4174befd49b885abf2fc70fe6d470000017f0bd084e10000040300473045022018c8aee5cff4fdc7b19232bc8533de5890f75820f85ac40d11c5696e9ab9912e022100a1dddb603ec9b815f067ac0ac6a5229146fdcf932b5ad4ff28ae892aee813caa300d06092a864886f70d01010b050003820101007c8acf6d06a816072795343919d9bb769fca5fe24838129408127831eec82333ed91463dbb46fcbdb4640a156969f87dd65a724f10b36628dc109ac26f763e04210d9a44296c6a7952ff4cb3a5d885e9069feea17ef2ab8b858b293cc3217d7cc1b3316db027cd78a5ef546c76352d4016815674e4e093847d691fab2fe8d8ece833355c3e15e96586d12729bd97117b64437c69050488b2b09d8cf690345ce80507c58e5ecffd3ed8e242d12d6e2677a40c0c608d055cfd370dc6b00da27f1df0003b7b427b8f6c8049deba5d040beba054b1dafa6881669a41ff9d815f31bfa52175ddd0b41be5e72b82ea51f9a10d62e6b617d9ad63bedaf7cadb1cefbcd5';

// for each packet...
document.querySelectorAll(".packet").forEach(packet => {

    // create packet hex
    const packetHex = document.createElement("div");
    packetHex.classList.add("packet-hex");
    packet.prepend(packetHex);

    // create show-all button
    const showAllCheckbox = document.createElement("input");
    showAllCheckbox.type = "checkbox";
    showAllCheckbox.addEventListener("input", () => {
        for(const container of containers) {
            if(showAllCheckbox.checked) {
                container.classList.add("shown");
            } else if(container != selected) {
                container.classList.remove("shown");
            }
        }
    });

    const showAllLabel = document.createElement("label");
    showAllLabel.textContent = "show all";
    packet.prepend(showAllCheckbox, showAllLabel);

    // store state about which section is selected
    let selected = null, selectedContent = null;
    const hide = () => {
        if(!showAllCheckbox.checked) selected?.classList.remove("shown");
        selectedContent?.classList.remove("highlighted");
    };
    
    const containers = [];
    packet.querySelectorAll(".segment").forEach(section => {

        // clone node and create header
        const container = document.createElement("div");
        container.classList.add("container");
        container.style.position = "relative";
        containers.push(container);

        const content = section.cloneNode(true);
        content.style.display = "block";

        // create header
        const header = document.createElement("h2");
        header.textContent = section.dataset.name;
        
        const show = (options) => {
            hide();
            if(selected != container) {
                container.classList.add("shown");
                spanOuter.classList.add("highlighted");
                selected = container;
                selectedContent = spanOuter;
            } else {
                selected = null;
                selectedContent = null;
            }
            if(options?.reverse) {
                label.scrollIntoView();
            } else if(showAllCheckbox.checked) {
                selected.scrollIntoView();
            }
        };

        // set up container
        container.append(header, content);
        section.remove();
        packet.append(container);

        const bytes = section.dataset.hex.match(/../g);

        // create span
        const spanOuter = document.createElement("span");
        spanOuter.style.position = "relative";
        const span = document.createElement("span");
        span.classList.add("hex-segment");
        span.textContent = bytes.join(" ");
        spanOuter.append(span);

        const preview = document.createElement("span");
        preview.classList.add("hex-segment");
        preview.textContent = section.dataset.previewTruncate ? bytes.slice(0, section.dataset.previewTruncate).join(" ") + ".." : bytes.join(" ");
        preview.classList.add("preview");
        container.append(preview);

        preview.addEventListener("click", () => show({reverse: true}));
        span.addEventListener("click", show);

        // create label
        const div = document.createElement("div");
        div.classList.add("label-outer");
        const label = document.createElement("span");
        label.classList.add("hex-segment-label");
        label.textContent = section.dataset.name;
        div.append(label);
        spanOuter.append(div);

        // add span
        packetHex.append(spanOuter, " ");

    });

});