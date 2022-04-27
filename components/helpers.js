// more stuff goes here eventually, promise
const { link } = require("html-generator");

module.exports = {
    stylesheet: href => link({rel: "stylesheet", href}),
    optional: (condition, content) => condition ? content : null
};