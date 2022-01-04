// --- deps
const document = require("./components/document.js");
const markdown = require("./components/markdown.js");
const path = require("path");
const fs = require("fs");

// --- configuration
const config = require("./config.json");
const DATA_DIR = path.join(__dirname, config.input);
const OUTPUT_DIR = path.join(__dirname, config.output);

// inform marked about our custom hijinks
fs.readdirSync(DATA_DIR).filter(file => path.extname(file) === ".json").forEach(file => {
    const id = path.basename(file, ".json");
    const meta = require(path.join(DATA_DIR, file));
    const rendered = document(meta, markdown(fs.readFileSync(path.join(DATA_DIR, id + ".md"), "utf-8")));
    fs.writeFileSync(path.join(OUTPUT_DIR, id + ".html"), rendered, {encoding: "utf-8"});
});