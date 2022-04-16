(() => {

    // toc show/hide
    const contents = document.querySelector("nav");
    if(contents) {
        const button = document.getElementById("show-toc");
        button.addEventListener("click", () => contents.classList.toggle("shown"));
        button.addEventListener("focusout", () => contents.classList.remove("shown"));
    }

    // click image to preview
    const imgView = document.getElementById("img-view");
    if(imgView) {

        imgView.addEventListener("click", () => imgView.style.display = "none");
        
        document.querySelector("main").querySelectorAll("img").forEach(node => {
            if(node == imgView) return;
            node.addEventListener("click", () => {
                imgView.src = node.src;
                imgView.style.display = "";
            });
            window.addEventListener("keydown", event => {
                if(event.key === "Escape") imgView.style.display = "none";
            });
        });

    }

    const addToggle = name => document.getElementById("toggle-" + name)?.addEventListener("click", () => localStorage.setItem(name, document.documentElement.classList.toggle(name)));
    addToggle("serif");
    addToggle("darkmode");
    
})();