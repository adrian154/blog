document.querySelectorAll(".packet").forEach(packet => {

    // create packet view
    const packetHex = document.createElement("div");
    packetHex.classList.add("packet-hex");

    document.querySelectorAll(".hex-data").forEach(section => {

        // create header
        const header = document.createElement("h2");
        header.textContent = section.dataset.name;
        section.prepend(header);

        // create span
        const span = document.createElement("span");
        span.classList.add("hex-segment");
        span.textContent = section.dataset.hex.match(/../g).join(" ");
        
        // create label
        const div = document.createElement("div");
        const label = document.createElement("span");
        label.classList.add("hex-segment-label");
        label.textContent = section.querySelector("h2").textContent;
        div.append(label);
        span.append(div);

        // add span
        packetHex.append(span, " ");

    });

    packet.prepend(packetHex);

});