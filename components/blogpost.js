const {script, h1, p, a, noscript, b, div, button, img, main, nav, raw} = require("html-generator");
const {commentsSettings} = require("../config.json");
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

const comments = properties => {
    const settings = Object.assign({}, commentsSettings);
    if(properties.issueNumber) {
        delete settings["issue-term"];
        settings["issue-number"] = properties.issueNumber;
    }
    return script({
        src: "https://utteranc.es/client.js",
        crossorigin: "anonymous",
        ...settings   
    });
};

module.exports = (properties, src) => {

    const body = renderMarkdown(src);

    return document(
        {
            ...properties,
            canonicalURL: new URL(`/blogposts/${properties.id}`, baseURL).href
        },
        main(
            body,
            img({id: "img-view", style: "display: none"})
        )
    );

}