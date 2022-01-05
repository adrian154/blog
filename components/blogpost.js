const { commentsSettings } = require("../config.json");
const { baseURL } = require("../config.json");
const { script } = require("html-generator");
const document = require("./document.js");

module.exports = (properties, markdown) => document(
    {
        ...properties,
        canonicalURL: new URL(`/${properties.id}.html`, baseURL).href
    },
    {html: markdown},
    script({
        src: "https://utteranc.es/client.js",
        crossorigin: "anonymous",
        ...commentsSettings        
    })
);