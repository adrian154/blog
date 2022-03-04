// --- deps
const {directory, render, read} = require("./helpers.js");
const blogpost = require("./components/blogpost.js");
const index = require("./components/index.js");
const path = require("path");
const fs = require("fs");

// --- configuration
const config = require("./config.json");
const DATA_DIR = path.join(__dirname, config.input);
const OUTPUT_DIR = path.join(__dirname, config.output);

// re-render blogposts only if they were modified
const blogposts = directory(DATA_DIR).sort((a, b) => b.timestamp - a.timestamp);
blogposts.forEach(post => {

    // paths
    const mdPath = path.join(DATA_DIR, post.id + ".md");
    const destPath = path.join(OUTPUT_DIR, post.id + ".html");

    if(!fs.existsSync(destPath) || fs.statSync(destPath).mtimeMs < fs.statSync(mdPath).mtimeMs || process.argv[2] === "all") {
        render(OUTPUT_DIR, post.id + ".html", blogpost, post, read(mdPath));
    }

});

// generate index and feeds
const published = blogposts.filter(blogpost => blogpost.publish);
render(OUTPUT_DIR, "index.html", index, published);