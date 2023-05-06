const formatDate = require("./format-date.js");
const { baseURL } = require("../config.json");
const { h1, p, a, article, div, b, button, main, img } = require("html-generator");
const document = require("./document.js");

module.exports = blogposts => document(
    {
        title: "Adrian's Blog",
        description: "A collection of potentially interesting posts.",
        canonicalURL: baseURL,
        stylesheets: ["/stylesheets/homepage.css"]
    },
    main(
        img({src: "/images/banner.jpg", alt: "blog banner"}),
        div({id: "blog-intro"},
            p("Hi, I'm Adrian, and I like to write about stuff. Welcome to my blog."),
            button({id: "toggle-serif"}, "Toggle serif"), " ", button({id: "toggle-darkmode"}, "Toggle darkmode")
        ),
        div({id: "blogposts"},
            blogposts.map(blogpost => article(
                p({class: "date"}, formatDate(new Date(blogpost.timestamp))),
                a({href: `/blogposts/${blogpost.id}/`}, h1(blogpost.title)),
                p(blogpost.description),
            ))
        )
    )
);