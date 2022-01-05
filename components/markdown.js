// --- deps
const { h1, h2, h3, h4, h5, h6, a, code, pre } = require("html-generator");
const hljs = require("highlight.js");
const marked = require("marked");
const katex = require("katex");

// --- helper methods

// strip down header text to URL fragment
const headingToFragment = text => text.toLowerCase().replace(/\s+/g, "-").split("").filter(char => char.match(/[0-9a-zA-Z\-]/)).join("");

// --- global state
const fragments = []; // keep track of URL fragments so that they can always be unique

// --- rendering methods

// generate heading with section link
const HEADINGS = [h1, h2, h3, h4, h5, h6];
const renderHeading = (text, level) => {
    
    let fragment = headingToFragment(text);
    
    // make sure the fragment is unique, in the most ugly way possible
    while(fragments.includes(fragment)) {
        fragment += "1";
    }

    return HEADINGS[level - 1]({id: fragment}, [text, " ", a({class: "section-link", href: "#" + fragment}, {html: "&sect;"})]).html;

};

// latex kludg
const renderCodespan = (code) => {
    const inline = code.match(/\$([^\$]+)\$/);
    const display = code.match(/\$\$([^\$]+)\$\$/);
    if(display) return katex.renderToString(display[1], {throwOnError: false, displayMode: true});
    if(inline) return katex.renderToString(inline[1], {throwOnError: false});
};

// bug: markdown's highlight method does not include the `hljs` class, which breaks formatting
const renderCodeblock = (src, language) => pre(code({class: "hljs"}, {html: language && hljs.highlight(src, {language}).value}) || hljs.highlightAuto(src)).html;

// --- setup marked
marked.use({
    renderer: {
        heading: renderHeading,
        codespan: renderCodespan,
        code: renderCodeblock
    }
});

module.exports = markdown => marked.parse(markdown);