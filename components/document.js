const { html, head, meta, title, link, p, body, div, img } = require("html-generator");

module.exports = (properties, ...content) => "<!DOCTYPE html>" + html(
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
        link({rel: "stylesheet", href: "static/stylesheets/main.css"}),
        link({rel: "stylesheet", href: "static/stylesheets/highlight-style.css"}),
        link({rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"})
    ),
    body(
        img({src: "static/images/banners/0.jpg"}),
        ...content,
        p({class: "footnote"}, {html: "&copy; 2022 Adrian Zhang"})
    )
).html;