const { html, head, meta, title, link, p, body, a, img, script } = require("html-generator");
const { stylesheet, raw } = require("./helpers");

module.exports = (properties, ...content) => "<!DOCTYPE html>" + html({lang: "en"},
    head(
        meta({charset: "utf-8"}),
        meta({name: "viewport", content: "width=device-width, initial-scale=1"}),
        title(properties.title),
        meta({property: "og:title", content: properties.title}),
        meta({property: "og:type", content: "website"}),
        properties.description && [
            meta({property: "og:description", content: properties.description}),
            meta({name: "description", content: properties.description})
        ],
        properties.canonicalURL && link({rel: "canonical", href: properties.canonicalURL}),
        stylesheet("static/stylesheets/main.css"),
        stylesheet("static/stylesheets/highlight-style.css"),
        stylesheet("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"),
        link({rel: "icon", type: "image/png", sizes: "16x16", href: "static/images/favicon.png"}),
        properties.stylesheets?.map(stylesheet),
        properties.scripts?.map(scriptSrc => script({defer: null, src: scriptSrc}))
    ),
    body(...content)
).html;