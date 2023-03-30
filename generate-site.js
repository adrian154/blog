const blogpostTemplate = require("./components/blogpost.js");
const rssFeedTemplate = require("./components/rss-feed.js");
const archiveTemplate = require("./components/archive.js");
const indexTemplate = require("./components/index.js");
const fs = require("fs");

const blogposts = require("./blogposts.json");
const goal = process.argv[2] || "render";

// render blogposts
blogposts.forEach(post => {

    const mdPath = `public/blogposts/${post.id}/blogpost.md`;
    const destPath = `public/blogposts/${post.id}/index.html`;

    const shouldRender = !fs.existsSync(destPath) || fs.statSync(destPath).mtimeMs < fs.statSync(mdPath).mtimeMs;
    if(goal == "render" && shouldRender || goal == "all") {
        const startTime = Date.now();
        fs.writeFileSync(destPath, blogpostTemplate(post, fs.readFileSync(mdPath, "utf-8")), "utf-8");
        console.log(`rendered ${post.id} in ${Date.now() - startTime}ms`);
    } else if(goal === "clean") {
        if(fs.existsSync(destPath)) {
            fs.unlinkSync(destPath);
        }
    }

});

// generate index and RSS feed
const published = blogposts.filter(post => post.publish).sort((a, b) => b.timestamp - a.timestamp);
fs.writeFileSync("public/index.html", indexTemplate(published), "utf-8");
fs.writeFileSync("public/rss.xml", rssFeedTemplate(published), "utf-8");
fs.writeFileSync("public/archive.html", archiveTemplate(blogposts), "utf-8");