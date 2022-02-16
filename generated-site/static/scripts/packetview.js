document.querySelectorAll(".packet").forEach(packet => {

    // create packet view
    const packetHex = document.createElement("div");
    packetHex.classList.add("packet-hex");

    // store state about which section is selected
    let selected = null, selectedContent = null;

    document.querySelectorAll(".hex-data").forEach(section => {

        // clone node and create header
        const container = document.createElement("div");
        container.style.position = "relative";

        const content = section.cloneNode(true);

        // create header
        const header = document.createElement("h2");
        header.textContent = section.dataset.name;

        // create button
        const button = document.createElement("button");
        button.textContent = "+";
        button.classList.add("expand-button");
        
        const toggle = () => {
            if(content.classList.toggle("shown")) {
                button.textContent = "\u2212";
                return true;
            }
            button.textContent = "+";
            return false;
        };

        button.addEventListener("click", toggle);

        // set up container
        container.append(header, button, content);
        section.remove();
        packet.append(container);

        // create span
        const spanOuter = document.createElement("span");
        spanOuter.style.position = "relative";
        const span = document.createElement("span");
        span.classList.add("hex-segment");
        span.textContent = section.dataset.hex.match(/../g).join(" ");
        spanOuter.append(span);

        span.addEventListener("click", () => {
            if(toggle()) {
                selected?.classList.remove("highlighted");
                selectedContent.classList.remove("shown");
                spanOuter.classList.add("highlighted");
                selected = spanOuter;
                selectedContent = content;
            } else {
                spanOuter.classList.remove("highlighted");
            }
        });

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

    packet.prepend(packetHex);

});