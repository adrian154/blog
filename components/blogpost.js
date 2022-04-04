const {commentsSettings} = require("../config.json");
const {script, h1, p, a, noscript, b, div, button, img, main, nav} = require("html-generator");
const renderMarkdown = require("./markdown.js");
const formatDate = require("./format-date.js");
const {baseURL} = require("../config.json");
const document = require("./document.js");

const tableOfContents = fragments => nav( 
    div({id: "contents"},
        p("Table of Contents"),
        Object.entries(fragments).map(entry => a({href: "#" + entry[0]}, p(entry[1].title)))
    ),
    button({id: "show-toc"}, {html: "&#9776 Contents"})
);

module.exports = (properties, src) => {
    const body = renderMarkdown(src);
    return document(
        {
            ...properties,
            canonicalURL: new URL(`/${properties.id}.html`, baseURL).href
        },
        main(
            p({id: "date", class: "date"}, formatDate(new Date(properties.timestamp))),
            h1({style: "margin-top: 0"}, properties.title),
            tableOfContents(body.fragments),
            body,
            img({id: "img-view", style: "display: none"}),
            noscript(b("Please enable Javascript to view the comments on this post.")),
            script({
                src: "https://utteranc.es/client.js",
                crossorigin: "anonymous",
                ...commentsSettings        
            })
        )
    );
}