// --- deps
const { h1, h2, h3, h4, h5, h6, a, code, pre, img } = require("html-generator");
const hljs = require("highlight.js");
const marked = require("marked");
const katex = require("katex");

// --- helper methods

// strip down header text to URL fragment
const headingToFragment = text => text.toLowerCase().replace(/\s+/g, "-").split("").filter(char => char.match(/[0-9a-zA-Z\-]/)).join("");

// --- global state
let fragments = null; // keep track of URL fragments so that they can always be unique

// --- rendering methods

// generate heading with section link
const HEADINGS = [h1, h2, h3, h4, h5, h6];
const renderHeading = (text, level) => {
    const fragment = headingToFragment(text);
    fragments[fragment] = {title: text, level};
    return HEADINGS[level - 1]({id: fragment}, [text, " ", a({class: "section-link", href: "#" + fragment}, {html: "&sect;"})]).html;
};

// latex kludge
/*const renderCodespan = (code) => {
    const inline = code.match(/\$([^\$]+)\$/);
    const display = code.match(/\$\$([^\$]+)\$\$/);
    if(display) return katex.renderToString(display[1], {throwOnError: false, displayMode: true});
    if(inline) return katex.renderToString(inline[1], {throwOnError: false});
    return false;
};*/

// bug: markdown's highlight method does not include the `hljs` class, which breaks formatting
const highlight = (src, language) => {

    if(!language) {
        console.warn("warning: a language wasn't specified, highlight.js's slow autodetection method will be used");
        return {html: hljs.highlightAuto(src).value};
    }

    return {html: hljs.highlight(src, {language}).value};

};

const renderCodeblock = (src, language) => pre(code({class: "hljs"}, highlight(src, language))).html;

// --- setup marked
marked.use({
    renderer: {
        heading: renderHeading,
        code: renderCodeblock
    },
    extensions: [
        {
            name: "katex",
            level: "inline",
            start: src => src.match(/\$/)?.index,
            tokenizer: (src, tokens) => {
                const match = src.match(/^(\$\$?)([^\$]+)\$\$?/);
                if(match) {
                    return {
                        type: "katex",
                        raw: match[0],
                        displayStyle: match[1] === "$$",
                        src: match[2] 
                    }
                }
            },
            renderer: token => katex.renderToString(token.src, {throwOnError: false, displayMode: token.displayStyle})
        }
    ]
});

module.exports = markdown => {
    fragments = {};
    return {html: marked.parse(markdown), fragments};
};