// --- deps
const { h1, h2, h3, h4, h5, h6, a, code, pre, raw } = require("html-generator");
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
    
    // make sure the fragment id is unique
    let fragment = headingToFragment(text);
    if(fragments[fragment]) {
        let i = 0, newFragment = null;
        do {
            i++;
            newFragment = `${fragment}-${i}`;
        } while(fragments[newFragment]);
        fragment = newFragment;
    }   

    fragments[fragment] = {title: text, level};
    return HEADINGS[level - 1]({id: fragment}, [raw(text), " ", a({class: "section-link", href: "#" + fragment}, {html: "&sect;"})]).html;
};

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
    return {html: marked.parse(markdown).replaceAll("<img", '<img loading="lazy"')}; // kludge: force images to lazy load
};