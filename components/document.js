const { html, head, meta, title, link, p, body, a, script, footer, raw} = require("html-generator");
const { stylesheet } = require("./helpers");
const fs = require("fs");

const APPLY_SETTINGS_CODE = fs.readFileSync("public/scripts/apply-settings-stub.js", "utf-8");

module.exports = (properties, ...content) => "<!DOCTYPE html>" + html({lang: "en", class: "serif"},
    head(

        meta({charset: "utf-8"}),
        meta({name: "viewport", content: "width=device-width, initial-scale=1"}),
        title(properties.title),

        // opengraph tags
        meta({property: "og:title", content: properties.title}),
        meta({property: "og:type", content: "website"}),
        properties.description && [
            meta({property: "og:description", content: properties.description}),
            meta({name: "description", content: properties.description})
        ],

        // stylesheets
        stylesheet("/stylesheets/highlight-style.css"),
        stylesheet("https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css"),
        stylesheet("/stylesheets/main.css"),
        properties.stylesheets?.map(stylesheet),

        // scripts
        properties.scripts?.map(scriptSrc => script({defer: null, src: scriptSrc})),
        script(raw(APPLY_SETTINGS_CODE)),
        script({defer: null, src: "/scripts/ui.js"}),

        // misc.
        link({rel: "icon", type: "image/png", sizes: "16x16", href: "/images/favicon.png"}),
        properties.canonicalURL && link({rel: "canonical", href: properties.canonicalURL})
    
    ),
    body(
        ...content,
        footer(p(
            raw("&copy; 2022 "),
            a({href: "https://bithole.dev/"}, "Adrian Zhang"),
            raw(" &bull; "),
            a({href: "/rss.xml"}, "rss"),
            raw(" &bull; "),
            a({href: properties.githubLink || "https://github.com/adrian154/blog"}, "source"),
            raw(" &bull; "),
            a({href: "https://creativecommons.org/licenses/by-sa/3.0/legalcode"},
            "CC BY-SA 3.0"
        )))
    )
).html;