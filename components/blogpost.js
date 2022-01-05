const {commentsSettings} = require("../config.json");
const {script, h1, p} = require("html-generator");
const renderMarkdown = require("./markdown.js");
const formatDate = require("./format-date.js");
const {baseURL} = require("../config.json");
const document = require("./document.js");
const {raw} = require("./helpers");

module.exports = (properties, src) => document(
    {
        ...properties,
        canonicalURL: new URL(`/${properties.id}.html`, baseURL).href
    },
    p({id: "date", class: "date"}, formatDate(new Date(properties.timestamp))),
    h1({style: "margin-top: 0"}, properties.title),
    raw(renderMarkdown(src)),
    script({
        src: "https://utteranc.es/client.js",
        crossorigin: "anonymous",
        ...commentsSettings        
    })
);