const path = require("path");
const fs = require("fs");

const directory = dir => fs.readdirSync(dir).filter(file => path.extname(file) == ".json").map(file => ({
    ...require(path.join(dir, file)),
    id: path.basename(file, ".json")
}));

const render = (destDir, name, template, ...args) => {
    const begin = Date.now();
    fs.writeFileSync(path.join(destDir, name + ".html"), template(...args), {encoding: "utf-8"});
    console.log(`Rendered document ${name} in ${Date.now() - begin}ms`);
};

const read = path => fs.readFileSync(path, "utf-8");

module.exports = {directory, render, read};