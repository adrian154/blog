(() => {
    const contents = document.getElementById("contents-outer");
    const button = document.getElementById("show-toc");
    button.addEventListener("click", () => contents.classList.toggle("shown"));
    button.addEventListener("focusout", () => contents.classList.remove("shown"));
})();