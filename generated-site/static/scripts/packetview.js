document.querySelectorAll(".packet").forEach(packet => {

    // create packet view
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
    packet.prepend(showAllCheckbox);

    // store state about which section is selected
    let selected = null, selectedContent = null;
    const hide = () => {
        if(!showAllCheckbox.checked) selected?.classList.remove("shown");
        selectedContent?.classList.remove("highlighted");
    };

    const containers = [];
    document.querySelectorAll(".hex-data").forEach(section => {

        // clone node and create header
        const container = document.createElement("div");
        container.classList.add("container");
        container.style.position = "relative";
        containers.push(container);

        const content = section.cloneNode(true);

        // create header
        const header = document.createElement("h2");
        header.textContent = section.dataset.name;
        
        const show = () => {
            hide();
            if(selected != container) {
                container.classList.add("shown");
                spanOuter.classList.add("highlighted");
                selected = container;
                selectedContent = spanOuter;
            }
        };

        // set up container
        container.append(header, content);
        section.remove();
        packet.append(container);

        // create span
        const spanOuter = document.createElement("span");
        spanOuter.style.position = "relative";
        const span = document.createElement("span");
        span.classList.add("hex-segment");
        span.textContent = section.dataset.hex.match(/../g).join(" ");
        spanOuter.append(span);

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