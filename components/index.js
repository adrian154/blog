const formatDate = require("./format-date.js");
const { baseURL } = require("../config.json");
const { h1, p, a, article, div, b, button } = require("html-generator");
const document = require("./document.js");

module.exports = blogposts => document(
    {
        title: "Adrian's Blog",
        description: "A collection of potentially interesting posts.",
        canonicalURL: baseURL,
        stylesheets: ["/stylesheets/homepage.css"],
        scripts: ["/scripts/homepage.js"]
    },
    div({id: "blog-intro"},
        p("Hello, I'm Adrian. Welcome to my blog, a loose collection of technology-related ramblings on various topics. Hopefully, you'll find them interesting."),
        button({id: "toggle-serif"}, "Toggle serif"), " ", button({id: "toggle-darkmode"}, "Toggle darkmode")
    ),
    div({id: "blogposts"},
        blogposts.map(blogpost => article(
            {
                "data-wordcount": blogpost.wordCount,
                "data-timestamp": blogpost.timestamp
            },
            p({class: "date"}, formatDate(new Date(blogpost.timestamp))),
            a({href: `/blogposts/${blogpost.id}/`}, h1(blogpost.title)),
            p(blogpost.description),
        ))
    )
);