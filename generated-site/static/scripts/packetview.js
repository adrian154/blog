let counter = 0;

// for each packet...
document.querySelectorAll(".packet").forEach(packet => {

    // create packet hex
    const packetHex = document.createElement("div");
    packetHex.classList.add("packet-hex");
    packet.prepend(packetHex);

    // create show-all button
    const showAllCheckbox = document.createElement("input");
    showAllCheckbox.type = "checkbox";
    showAllCheckbox.id = `showall-${counter}`;
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
    showAllLabel.htmlFor = `showall-${counter}`;
    packet.prepend(showAllCheckbox, showAllLabel);

    // store state about which section is selected
    let selected = null, selectedContent = null;
    const hide = () => {
        if(!showAllCheckbox.checked) selected?.classList.remove("shown");
        selectedContent?.classList.remove("highlighted");
    };
    
    const containers = [];
    packet.querySelectorAll(".segment").forEach(section => {

        // increment id counter
        counter++;

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
        preview.textContent = section.dataset.previewTruncate ? bytes.slice(0, section.dataset.previewTruncate).join(" ") + " .." : bytes.join(" ");
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