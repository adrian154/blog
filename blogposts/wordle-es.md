My friend recently sent me a [Spanish version](https://wordle.danielfrg.com/) of [Wordle](https://www.powerlanguage.co.uk/wordle/). English Wordle simply includes all current and future solutions in the source code sent to the browser, so naturally I wondered if that was also the case for Wordle ES. What I found was quite interesting! Here's a blogpost about my attempts to disassemble this curious game, written in real time.

# First Impressions

The site appears to be built using [Next.js](https://nextjs.org/), so the source code is a frightening nightmare. There's two obfuscated scripts ([here](/resources/wordle-es/wordle-invisible.js) and [here](/resources/wordle-es/wordle-app.js)) that appears to implement the logic for the game. 

# Experimentation

Some fiddling with devtools guides us to the code which checks if the answer is correct:

```js
if (U(c), G(a(X).concat([n])), b(a(S).concat(a(r))), E(a(x).concat(a(i))), T(a(N).concat(a(s))), t == (0, o.pe)(m)) setTimeout((function () {
    A("WIN"), et(a(tt).concat([c.length]))
}), 2e3);
else if (6 == c.length) setTimeout((function () {
    A("LOSE"), et(a(tt).concat([-1]))
}), 2e3)
```

Basically this code does a few things:

```js
var e = ut(t),
    n = e.newMatrixRow,
    r = e.newTried,
    i = e.newPresent,
    s = e.newCorrect,
    c = a(V).concat([t]);

U(c)
G(a(X).concat([n]))
b(a(S).concat(a(r)))
E(a(x).concat(a(i)))
T(a(N).concat(a(s)))
t == (0, o.pe)(m)
```

The last part appears to be the most important. We need to figure out what `t`, `o.pe`, and `m` are; nothing a quick override can't fix. `t` is just the guessed word. `m` is a base64 value, `U2FsdGVkX19YlMJMbsvp5tFryTPxtaJOcFpisHmdFFw=` at the time of writing, which decodes to mostly unprintable nonsense but is prepended with `Salted__`. It's part of an array of similar base64 values on line 6374, maybe this will become significant later. `o.pe` is this function:

```js
function d(t) {
    var e = i().AES.decrypt(t, c).toString(i().enc.Utf8);
    return e.startsWith(u) && (e = e.slice(u.length)), e
}
```

Some more probing shows that this function returns the correct answer in plaintext! Success!

# Final Touches

Okay, now we just need to automate the process by fleshing out all the other details of this code; namely, how it gets the ciphertext, and how it picks which key to decrypt with.

Some quick googling suggests that the site is probably using [crypto-js](https://www.npmjs.com/package/crypto-js) for its cryptographic primitives, meaning the array of values from earlier is probably a list of current and future ciphertexts. The key is just `atob("bGxhbm9z")`, or "llanos". And finally, decrypting the list of ciphertexts reveals the full [list of solutions](/resources/wordle-es/wordle-words.txt).

# Closing Remarks

The developers made a valiant effort to defend their game, but it was ultimately no match for my procrastination.