const {commentsSettings} = require("../config.json");
const {script, h1, p, noscript, b} = require("html-generator");
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
    raw(renderMarkdown(src))
);