const { link } = require("html-generator");

module.exports = {
    stylesheet: href => link({rel: "stylesheet", href}),
    raw: str => ({html: str})
};