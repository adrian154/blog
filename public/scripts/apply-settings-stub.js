const loadSetting = name => {
    if(localStorage.getItem(name) === "true")
        document.documentElement.classList.add(name);
    else
        document.documentElement.classList.remove(name);
};

loadSetting("serif");
loadSetting("darkmode");