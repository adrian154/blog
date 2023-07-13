const { html, head, meta, title, body, ul, li, a, p, h1 } = require("html-generator");
const format = new Intl.DateTimeFormat([], {dateStyle: "medium"});

module.exports = blogposts => "<!DOCTYPE html>" + html(
    head(
        meta({charset: "utf-8"}),
        meta({name: "viewport", content: "width=device-width, initial-scale=1"}),
        title("bithole.dev archive")
    ),
    body(
        h1("Published"),
        ul(...blogposts.filter(blogpost => blogpost.status === "published").map(blogpost => li(a({href: `/blogposts/${blogpost.id}/`}, blogpost.title), " ", `(${format.format(new Date(blogpost.timestamp))})`))),
        h1("WIP"),
        ul(...blogposts.filter(blogpost => blogpost.status === "wip").map(blogpost => li(a({href: `/blogposts/${blogpost.id}/`}, blogpost.title)))),
        h1("Hidden"),
        ul(...blogposts.filter(blogpost => blogpost.status === "hidden").map(blogpost => li(a({href: `/blogposts/${blogpost.id}/`}, blogpost.title)))),
        h1("Pages"),
        ul(...blogposts.filter(blogpost => blogpost.status === "page").map(blogpost => li(a({href: `/blogposts/${blogpost.id}/`}, blogpost.title))))
    )
).html;