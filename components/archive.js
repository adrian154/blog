const { html, head, meta, title, body, table, a, tr, th, thead, td, tbody, style, link } = require("html-generator");
const format = new Intl.DateTimeFormat([], {dateStyle: "medium"});

module.exports = blogposts => "<!DOCTYPE html>" + html(
    head(
        meta({charset: "utf-8"}),
        meta({name: "viewport", content: "width=device-width, initial-scale=1"}),
        title("bithole.dev tracker"),
        link({rel: "stylesheet", href: "/stylesheets/tracker.css"})
    ),
    body(
        table(
            thead(
                tr(
                    th("Blogpost"),
                    th("Date"),
                    th("Status")
                )
            ),
            tbody(
                ...blogposts.sort((a,b) => a.title.localeCompare(b.title)).map(blogpost => tr(
                    td(a({href: `/blogposts/${blogpost.id}/`}, blogpost.title)),
                    td(blogpost.timestamp ? format.format(new Date(blogpost.timestamp)) : ""),
                    td({class: blogpost.status}, blogpost.status)
                ))
            )
        )
    )
).html;