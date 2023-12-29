> I've written a diffie hellman server. I made sure not to let people select their parameters, and I use only strong primes. Those are safe, right?

We're given five files: alice.py, server.py, auth.log, strong_primes.txt, and gen_agreed_primes.py. alice.py performs a [Diffie&ndash;Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange), which consists of the following steps:

* alice.py invokes server.py
* server.py selects a random 2048-bit prime number $p$ from strong_primes.txt 
* server.py generates a random secret $b$, and computes public value $B = 2^b \bmod p$
* server.py sends $p$ and $B$ to alice.py
* alice.py computes $A = 2^a \bmod p$, where $a$ is a fixed, unknown secret
* alice.py sends this value to server.py
* Both parties compute the shared secret
* server.py uses the shared secret to encrypt the flag using AES
* server.py sends the ciphertext to alice.py, which decrypts the flag

For each exchange, server.py logs the ciphertext, $A$, $B$, and $p$ to auth.log. However, normally this information is not enough to compute the shared secret. The security of DH relies on the fact that it is generally difficult to determine $x$ given the value of $g^x$ for cyclic groups. This is called the [discrete logarithm problem](https://en.wikipedia.org/wiki/Discrete_logarithm). 

gen_agreed_primes.py contains the code used to generate the primes used for the exchanges. We see that the primes were generated using pycrypto's `Crypto.Util.number.getStrongPrime()` function, "strong" meaning that $p - 1$ has at least one large prime factor.

The factorization of $p - 1$ matters, because for prime values of $p$ the order of the multiplicative group of integers mod $p$ is equal to $p - 1$. If the order of a cyclic group has prime factor $r$, we can compute the value of $x \bmod r$ in $\sqrt{r}$ time.

To identify factors of $p - 1$, we can simply try dividing it against a list of primes. In my case I used a list of primes up to $10^7$. This revealed that for many of the primes used in the authentication, $p - 1$ contains "small" prime factors. 

Suppose we are able to calculate $x \bmod r$ for values $r_1, r_2, \dots\, r_n$. The [Chinese remainder theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem) states that from these values we can compute the value of $x \bmod (r_1 \times r_2 \times \dots \times r_n)$. If we are able to do this for enough values of $r$, we can leak Alice's entire secret value, whic allows us to compute the shared secret and decrypt the ciphertexts. (The server uses a different secret value each time, so we can't apply the same strategy there.) 

We have to be careful, since $2$ may only generate a subgroup of the full group. However, we know that the order of the full group divisible by the order of the subgroup ([Lagrange's theorem](https://en.wikipedia.org/wiki/Lagrange%27s_theorem_(group_theory))), so we can easily determine whether a factor of $p - 1$ is also a factor of the subgroup's order:

```js
let order = p - 1n;
const subgroupFactors = [];
for(const factor of factorize(order)) {
    // if order/factor is equal to or a multiple of the subgroup's order, 2^order/factor will be equal to 1
    if(powMod(2n, order / factor, p) == 1n) {
        order /= factor;
    } else {
        subgroupFactors.push(factor);
    }
}
```

To determine $x \bmod r$, we start by transforming our $g$ and $y = g^x$ to elements of a cyclic group of order $r$:

$$g' = g^\frac{p - 1}{r}$$
$$y' = y^\frac{p - 1}{r}$$

Then, we just need to solve $(g')^{x'} = y'$ for $x'$. For this I made a small implementation of the [baby-step giant-step algorithm](https://en.wikipedia.org/wiki/Baby-step_giant-step) since there wasn't one for JS, but you can easily accomplish this using tools like SageMath. Because $r$ is small, this process is fast.

```js
const discreteLog = (g, y, p, order) => {

    if(y==1n) return order;

    const m = sqrt(order);

    const arr = new Array(m);
    for(let j = 0n; j < m; j++) {
        arr[powMod(g, j, p)] = j; 
    }

    const c = powMod(g, m * (order - 1n), p);
    let gamma = y;
    for(let i = 0n; i < m; i++) {
        if(gamma in arr) {
            return i * m + arr[gamma];
        }
        gamma = (gamma * c) % p;
    }

};
```

So at this point, we have a list of values for $r$ and $x \bmod r$. We just need to solve this system of congruences and check if $g^x$ matches Alice's public value (meaning we have retrieved the full key):

```js
const factors = Object.keys(map).map(BigInt);
let N = factors.reduce((a,c) => a*c, 1n);
let ans = 0n;
for(const factor of factors) {
    ans += map[factor] * (N / factor) * inverse(N / factor, factor);
}
ans %= N;

// test if we have the full secret
if(powMod(g, ans, p) == y) {
    console.log(ans);
    process.exit(0);
}
```

Once we have Alice's secret, we can use it to compute the encryption key and decrypt any ciphertext of your choosing from auth.log.

```py
import hashlib
from Crypto.Cipher import AES
from Crypto.Util import Padding

# fill in parameters from auth.log
# p = ...
# B = ...
# iv = bytes.fromhex('...')
# ct = bytes.fromhex('...')

g = 2
aliceSecret = ...
ss = pow(B,aliceSecret,p)
key = hashlib.sha256(ss.to_bytes(2048//8,'big')).digest()[:16]
cipher = AES.new(key,AES.MODE_CBC,iv)

print(Padding.unpad(cipher.decrypt(ct),AES.block_size).decode('utf-8'))
```

yielding

`UDCTF{th3_d3vil_15_1n_th3_det4il5}`

# Resources

[Full solution code](https://gist.github.com/adrian154/089bb15f8890cb30457eb5429e10f098)

[Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange)

[Chinese remainder theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem)

[Baby-step giant-step](https://en.wikipedia.org/wiki/Baby-step_giant-step)

[Pohlig&ndash;Hellman algorithm](https://en.wikipedia.org/wiki/Pohlig%E2%80%93Hellman_algorithm)