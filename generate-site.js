const blogpostTemplate = require("./components/blogpost.js");
const rssFeedTemplate = require("./components/rss-feed.js");
const archiveTemplate = require("./components/archive.js");
const indexTemplate = require("./components/index.js");
const fs = require("fs");

const blogposts = require("./blogposts.json");

const renderPost = (post, force) => {

    const mdPath = `public/blogposts/${post.id}/blogpost.md`;
    const destPath = `public/blogposts/${post.id}/index.html`;

    // if the output file does not exist or is outdated, render
    if(!fs.existsSync(destPath) || fs.statSync(destPath).mtimeMs < fs.statSync(mdPath).mtimeMs || force) {
        const startTime = Date.now();
        fs.writeFileSync(destPath, blogpostTemplate(post, fs.readFileSync(mdPath, "utf-8")), "utf-8");
        console.log(`rendered ${post.id} in ${Date.now() - startTime}ms`);
    }

};

const generateIndexes = () => {
    const published = blogposts.filter(post => post.publish).sort((a, b) => b.timestamp - a.timestamp);
    fs.writeFileSync("public/index.html", indexTemplate(published), "utf-8");
    fs.writeFileSync("public/rss.xml", rssFeedTemplate(published), "utf-8");
    fs.writeFileSync("public/archive.html", archiveTemplate(blogposts), "utf-8");
};

// render blogposts
blogposts.forEach(post => renderPost(post, process.argv.includes("force")));

module.exports = {renderPost, generateIndexes};