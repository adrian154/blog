const { commentsSettings } = require("../config.json");
const { script, h1, p } = require("html-generator");
const formatDate = require("./format-date.js");
const { baseURL } = require("../config.json");
const document = require("./document.js");
const { raw } = require("./helpers");

module.exports = (properties, markdown) => document(
    {
        ...properties,
        canonicalURL: new URL(`/${properties.id}.html`, baseURL).href
    },
    p({id: "date", class: "date"}, formatDate(new Date(properties.timestamp))),
    h1({style: "margin-top: 0"}, properties.title),
    raw(markdown),
    script({
        src: "https://utteranc.es/client.js",
        crossorigin: "anonymous",
        ...commentsSettings        
    })
);