const formatDate = require("./format-date.js");
const { baseURL } = require("../config.json");
const { h1, p, a, article, div, b } = require("html-generator");
const document = require("./document.js");

module.exports = blogposts => document(
    {
        title: "Adrian's Blog",
        description: "A collection of potentially interesting posts.",
        canonicalURL: baseURL,
        stylesheets: ["static/stylesheets/homepage.css"]
    },
    div({id: "blog-intro"},
        p("Hello, I'm Adrian. Welcome to my blog, a loose collection of technology-related ramblings on various topics. Hopefully, you'll find them interesting."),
        p(b("Update (4/3): "), "I've been experimenting with a new serif look to the site. Let me know how it looks.")
    ),
    blogposts.map(blogpost => article(
        p({class: "date"}, formatDate(new Date(blogpost.timestamp))),
        a({href: blogpost.id + ".html"}, h1(blogpost.title)),
        p(blogpost.description),
    ))
);