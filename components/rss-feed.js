const { tag } = require("html-generator");
const config = require("../config.json");

module.exports = blogposts => '<?xml version="1.0" encoding="UTF-8" ?>' + tag("rss", {version: "2.0"},
    tag("channel",
        tag("title", "Adrian's Blog"),
        tag("link", config.baseURL),
        tag("description", "Adrian's Blog (Now With 100% More RSS!)"),
        tag("language", "en-us"),
        tag("lastBuildDate", new Date().toUTCString()),
        blogposts.map(blogpost => tag("item", 
            tag("title", blogpost.title),
            tag("link", new URL(`/${blogpost.id}.html`, config.baseURL).toString()),
            tag("description", blogpost.description),
            tag("pubDate", new Date(blogpost.timestamp).toUTCString())
        ))
    )
).html;