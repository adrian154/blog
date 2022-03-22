(() => {

    // toc code
    const contents = document.getElementById("contents-outer");
    const button = document.getElementById("show-toc");
    button.addEventListener("click", () => contents.classList.toggle("shown"));
    button.addEventListener("focusout", () => contents.classList.remove("shown"));

    // image stuff
    const imgView = document.getElementById("img-view");
    imgView.addEventListener("click", () => {
        imgView.style.display = "none";
    });

    document.querySelectorAll("img").forEach(node => {
        if(node == imgView) return;
        node.addEventListener("click", () => {
            imgView.src = node.src;
            imgView.style.display = "";
        });
        window.addEventListener("keydown", event => {
            if(event.key === "Escape") imgView.style.display = "none";
        });
    });

})();