const path = require("path");
const fs = require("fs");

const directory = (dir) => fs.readdirSync(dir).flatMap(filename => {
    
    // if it's a directory, recursively enter
    const itemPath = path.join(dir, filename);
    if(fs.statSync(itemPath).isDirectory()) {
        return directory(itemPath);      
    }

    // if it's a JSON, parse
    if(path.extname(filename) === ".json") {
        const item = require(itemPath);
        if(!item.timestamp) item.timestamp = Date.now();
        item.id = path.basename(filename, ".json");
        item.src = path.join(dir, item.id + ".md");
        return item;
    }

}).filter(Boolean);

const render = (destDir, name, template, ...args) => {
    const begin = Date.now();
    fs.writeFileSync(path.join(destDir, name), template(...args), {encoding: "utf-8"});
    console.log(`Rendered document ${name} in ${Date.now() - begin}ms`);
};

const read = path => fs.readFileSync(path, "utf-8");

module.exports = {directory, render, read};