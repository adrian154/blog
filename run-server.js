const express = require("express");
const app = express();

app.use(express.static("public"));
app.listen(80, () => console.log("Listening"));

// watch filesystem for changes
const generator = require("./generate-site");
const fs = require("fs");

fs.watch("public/blogposts", {recursive: true}, (eventType, filename) => {
    const blogposts = JSON.parse(fs.readFileSync("blogposts.json", "utf-8"));
    const match = filename.match(/(.+)[\\\/]blogpost\.md/);
    if(match) {
        const id = match[1].replaceAll("\\", "/");
        const post = blogposts.find(post => post.id == id);
        if(post) {
            generator.renderPost(post);
            generator.generateIndexes();
        } else {
            console.error("failed to render post " + id);
        }
    }
});