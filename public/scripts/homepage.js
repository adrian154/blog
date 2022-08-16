const articles = [...document.querySelectorAll("article")];

const sortArticles = (func) => {
    const sorted = articles.sort(func);
    document.getElementById("blogposts").replaceChildren(...sorted);
};

//sortArticles((a, b) => b.dataset["wordcount"] - a.dataset["wordcount"]);