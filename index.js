// --- deps
const blogpost = require("./components/blogpost.js");
const markdown = require("./components/markdown.js");
const index = require("./components/index.js");
const path = require("path");
const fs = require("fs");

// --- configuration
const config = require("./config.json");
const DATA_DIR = path.join(__dirname, config.input);
const OUTPUT_DIR = path.join(__dirname, config.output);

// read blogposts
const blogposts = fs.readdirSync(DATA_DIR).filter(file => path.extname(file) === ".json").map(file => ({...require(path.join(DATA_DIR, file)), id: path.basename(file, ".json")})).sort((a, b) => b.timestamp - a.timestamp);

blogposts.forEach(meta => fs.writeFileSync(
    path.join(OUTPUT_DIR, meta.id + ".html"),
    blogpost(meta, markdown(fs.readFileSync(path.join(DATA_DIR, meta.id + ".md"), "utf-8"))),
    {encoding: "utf-8"}
));

fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), index(blogposts));