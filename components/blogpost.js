const {commentsSettings} = require("../config.json");
const {script, h1, p, a, noscript, b, div} = require("html-generator");
const renderMarkdown = require("./markdown.js");
const formatDate = require("./format-date.js");
const {baseURL} = require("../config.json");
const document = require("./document.js");
const {raw} = require("./helpers");

const tableOfContents = fragments => div({id: "contents"},
    p("Table of Contents"),
    Object.entries(fragments).map(entry => a({href: "#" + entry[0]}, p(entry[1].title)))
);

module.exports = (properties, src) => {
    const body = renderMarkdown(src);
    return document(
        {
            ...properties,
            canonicalURL: new URL(`/${properties.id}.html`, baseURL).href
        },
        p({id: "date", class: "date"}, formatDate(new Date(properties.timestamp))),
        h1({style: "margin-top: 0"}, properties.title),
        tableOfContents(body.fragments),
        body,
        noscript(b("Please enable Javascript to view the comments on this post.")),
        script({
            src: "https://utteranc.es/client.js",
            crossorigin: "anonymous",
            ...commentsSettings        
        })
    );
}