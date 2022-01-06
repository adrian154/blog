const formatDate = require("./format-date.js");
const { baseURL } = require("../config.json");
const { h1, p, a } = require("html-generator");
const document = require("./document.js");

module.exports = blogposts => document(
    {
        title: "Adrian's Blog",
        description: "A collection of potentially interesting posts.",
        canonicalURL: baseURL,
        stylesheets: ["static/stylesheets/homepage.css"]
    },
    blogposts.map(blogpost => [
        p({class: "date"}, formatDate(new Date(blogpost.timestamp))),
        a({href: blogpost.id + ".html"}, h1(blogpost.title)),
        p(blogpost.description),
        p(a({href: blogpost.id + ".html"}, "Read..."))
    ])
);