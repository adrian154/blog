// --- deps
const {directory, render, read} = require("./helpers.js");
const blogpost = require("./components/blogpost.js");
const rssFeed = require("./components/rss-feed.js");
const index = require("./components/index.js");
const path = require("path");

// --- configuration
const config = require("./config.json");
const DATA_DIR = path.join(__dirname, config.input);
const OUTPUT_DIR = path.join(__dirname, config.output);

// generate blogposts
const blogposts = directory(DATA_DIR).sort((a, b) => b.timestamp - a.timestamp);
blogposts.forEach(post => render(OUTPUT_DIR, post.id + ".html", blogpost, post, read(path.join(DATA_DIR, post.id + ".md"))));

// generate index and feeds
const published = blogposts.filter(blogpost => blogpost.publish);
render(OUTPUT_DIR, "index.html", index, published);
render(OUTPUT_DIR, "rss.xml", rssFeed, published);