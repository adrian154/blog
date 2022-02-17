// TODO:
// * next,prev buttons for mobile
// * when user clicks preview, corresponding segment is highlighted

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
        console.log("h");
        if(!showAllCheckbox.checked) selected?.classList.remove("shown");
        selectedContent?.classList.remove("highlighted");
    };

    const containers = [];
    document.querySelectorAll(".segment").forEach(section => {

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

        // create top link
        const backToTopLink = document.createElement("a");
        backToTopLink.textContent = "Back to top...";
        backToTopLink.addEventListener("click", () => {
            packetHex.scrollIntoView();
        });
        
        const show = () => {
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
            if(showAllCheckbox.checked) {
                selected.scrollIntoView();
            }
        };

        // set up container
        container.append(header, content, backToTopLink);
        section.remove();
        packet.append(container);

        // create span
        const spanOuter = document.createElement("span");
        spanOuter.style.position = "relative";
        const span = document.createElement("span");
        span.classList.add("hex-segment");
        span.textContent = section.dataset.hex.match(/../g).join(" ");
        spanOuter.append(span);

        const preview = span.cloneNode(true);
        preview.classList.add("preview");
        container.append(preview);

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