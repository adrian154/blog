const {script, h1, p, a, noscript, b, div, img, main, header} = require("html-generator");
const {commentsSettings} = require("../config.json");
const renderMarkdown = require("./markdown.js");
const formatDate = require("./format-date.js");
const {baseURL} = require("../config.json");
const document = require("./document.js");
const {optional} = require("./helpers");

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
            canonicalURL: new URL(`/blogposts/${properties.id}`, baseURL).href,
            githubLink: `https://github.com/adrian154/blog/tree/main/public/blogposts/${properties.id}`
        },
        optional(!properties.bodyOnly, 
            header(
                p(a({id: "home-link", href: "/"}, "\u00ab more posts")),
                h1({id: "post-title"}, properties.title),
                optional(properties.timestamp, p({class: "date"}, "Published ", formatDate(new Date(properties.timestamp))))
            )
        ),
        main(
            optional(properties.interactive, noscript(p({style: "color: #ff0000"}, "Warning: If you are seeing this message, JS isn't supported; unfortunately, since this page relies on JS to dynamically generate content, parts of the page may be missing or brutally disfigured."))),
            body,
            img({id: "img-view", style: "display: none"}),
            optional(properties.status === "published" || properties.status === "hidden", [
                noscript(b("Please enable Javascript to view the comments on this post.")),
                comments(properties)
            ])
        )
    );

}