// --- deps
const {directory, render, read} = require("./helpers.js");
const blogpost = require("./components/blogpost.js");
const rssFeed = require("./components/rss-feed.js");
const index = require("./components/index.js");
const path = require("path");
const fs = require("fs");

// --- configuration
const config = require("./config.json");
const DATA_DIR = path.join(__dirname, config.input);
const OUTPUT_DIR = path.join(__dirname, config.output);

// regenerate blogposts as necessary
let renderTimes;
try {
    renderTimes = require("./render-times.json");
} catch(err) {
    renderTimes = {};
}

const blogposts = directory(DATA_DIR).sort((a, b) => b.timestamp - a.timestamp);
blogposts.forEach(post => {
    const mdPath = path.join(DATA_DIR, post.id + ".md");
    if((renderTimes[post.id] || 0) < fs.statSync(mdPath).mtimeMs) {
        render(OUTPUT_DIR, post.id + ".html", blogpost, post, read(mdPath));
        renderTimes[post.id] = Date.now();
    } else {
        console.log(`${post.id} not modified, skipping...`);
    }
});

// save render times
fs.writeFileSync("render-times.json", JSON.stringify(renderTimes));

// generate index and feeds
const published = blogposts.filter(blogpost => blogpost.publish);
render(OUTPUT_DIR, "index.html", index, published);
render(OUTPUT_DIR, "rss.xml", rssFeed, published);