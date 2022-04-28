const {commentsSettings} = require("../config.json");
const {script, h1, p, a, noscript, b, div, button, img, main, nav, raw} = require("html-generator");
const renderMarkdown = require("./markdown.js");
const formatDate = require("./format-date.js");
const {optional} = require("./helpers");
const {baseURL} = require("../config.json");
const document = require("./document.js");

const tableOfContents = fragments => nav( 
    div({id: "contents"},
        p("Table of Contents"),
        Object.entries(fragments).map(entry => a({href: "#" + entry[0]}, p(raw(entry[1].title))))
    ),
    button({id: "show-toc"}, raw("&#9776; Contents"))
);

module.exports = (properties, src) => {
    const body = renderMarkdown(src);
    return document(
        {
            ...properties,
            canonicalURL: new URL(`/${properties.id}.html`, baseURL).href
        },
        main(
            optional(properties.interactive, noscript(p({style: "color: #ff0000"}, "Warning: If you are seeing this message, JS isn't supported; unfortunately, since this page relies on JS to dynamically generate content, parts of the page may be missing or brutally disfigured."))),
            optional(!properties.document, p({id: "date", class: "date"}, formatDate(new Date(properties.timestamp)))),
            h1({style: "margin-top: 0"}, properties.title),
            tableOfContents(body.fragments),
            body,
            img({id: "img-view", style: "display: none"}),
            optional(!properties.document, [
                h1("Comments"),
                noscript(b("Please enable Javascript to view the comments on this post.")),
                script({
                    src: "https://utteranc.es/client.js",
                    crossorigin: "anonymous",
                    ...commentsSettings        
                })
            ])
        )
    );
}