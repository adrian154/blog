My friend recently sent me a [Spanish version](https://wordle.danielfrg.com/) of [Wordle](https://www.powerlanguage.co.uk/wordle/). English Wordle simply includes all current and future solutions in the source code sent to the browser, so naturally I wondered if that was also the case for Wordle ES. What I found was quite interesting! Here's a blogpost about my attempts to disassemble this curious game, written in real time.

# First Impressions

The site appears to be built using [Next.js](https://nextjs.org/), so the source code is a frightening nightmare. Looking at the source, there's a piece of script sent along with the webpage that appears important.

```js
(function () {
    window['__CF$cv$params'] = {
        r: '6d896d400cd59450',
        m: '5EPFU1FmlNSH_hjSJkdRx9lE5_0c8H5pqc6zJyNVesk-1644035671-0-AUNM63OowGUzDsEJsdBE03Nyoyhum2aCVewdVwQo3GfH6NrSWDSsFpr3LwJECLR4q807WjCDPC1AQVdI2/JQx8U9wP+GTjRTuQmnQEcYg6oYDsrGPQvVYUrP/OihJtRUAg==',
        s: [0x4271d96856, 0x0f8ab574ad],
        u: '/cdn-cgi/challenge-platform/h/g'
    }
})();
```
*Prettified here for your viewing pleasure.*

Looks kind of like a password hash, but I doubt it's a real hash since then the code wouldn't be able to let us know which of our guessed letters were correct. Visiting [https://wordle.danielfrg.com/cdn-cgi/challenge-platform/h/g](https://wordle.danielfrg.com/cdn-cgi/challenge-platform/h/g) yields nothing. There's two obfuscated scripts ([here](/static/wordle-invisible.js) and [here](/static/wordle-app.js)) that appears to implement the logic for the game. 

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

Some quick googling suggests that the site is probably using [crypto-js](https://www.npmjs.com/package/crypto-js) for its cryptographic primitives, meaning the array of values from earlier is probably a list of current and future ciphertexts. The key is just `atob("bGxhbm9z")`, or "llanos". And finally, decrypting the list of ciphertexts reveals the full [list of solutions](/static/wordle-words.txt).

# Closing Remarks

The developers made a valiant effort to defend their game, but it was ultimately no match for my procrastination.