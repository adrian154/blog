const { baseURL } = require("../config.json");
const { article, div, b, main, span, br, p, a, script } = require("html-generator");
const document = require("./document.js");

const format = new Intl.DateTimeFormat([], {dateStyle: "short"});

module.exports = blogposts => document(
    {
        title: "Adrian's Blog",
        description: "A collection of potentially interesting posts.",
        canonicalURL: baseURL,
        stylesheets: ["/stylesheets/homepage.css"]
    },
    main(
        p({id: "title"}, "blog@bithole.dev:~$"),
        div({id: "timeline"},
            blogposts.map(blogpost => [
                span({class: "timeline-date"}, format.format(new Date(blogpost.timestamp))),
                div({class: "timeline-element"}),
                article(
                    a({href: `/blogposts/${blogpost.id}/`}, b(blogpost.title)),
                    span(blogpost.description)
                )
            ])
        ),
    )
);