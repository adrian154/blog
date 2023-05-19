(() => {

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

    // homepage
    const title = document.getElementById("title");
    if(title) {
        let state = false;
        setInterval(() => {
            if(state = !state) {
                title.textContent = "blog@bithole.dev:~$";
            } else {
                title.textContent = "blog@bithole.dev:~$ \u2588";
            }
        }, 500);
    }

})();