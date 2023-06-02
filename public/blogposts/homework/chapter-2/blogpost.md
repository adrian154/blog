# 2.1

7\. If integers $m$ and $n$ are even, then there exist integers $k_1$ and $k_2$ so that $2k_1 = m$ and $2k_2 = n$. Then, $m + n = 2k_1 + 2k_2$. Let $k_3 = k_1 + k_2$; we have shown that $m + n = 2k_3$, making $m + n$ even by definition.

13\. If integers $x$ and $y$ are rational, there are integers $a$, $b$, $c$, $d$ so that $x = \frac{a}b$ and $y = \frac{c}d$. Then, $x + y = \frac{a}b + \frac{c}d = \frac{ac + bd}{bd}$. $ac + bd$ is an integer, and so is $bd$. Therefore, $x + y$ is a rational number.

16\.

$$\begin{align*}
    (3k_1 + 1)(3k_2 + 2) &= 9k_1k_2 + 6k_1 + 3k_2 + 2 \\
                         &= 3(3k_1k_2 + 2k_1 + k_2) + 2 
\end{align*}$$

$$k_3 = 3k_1k_2 + 2k_1 + k_2$$

19\. 

* $x \cdot 0 + 0 = x \cdot 0$: $b + 0 = b$
* $x \cdot 0 = x \cdot (0 + 0)$: $b + 0 = b$
* $x \cdot (0 + 0) = x \cdot 0 + x \cdot 0$: $a(b + c) = ab + ac$
* Therefore, $x \cdot 0 = 0$, because $b + 0 = b$.

23\. If $X \subseteq Y$, then $X \cup Z \subseteq Y \cup Z$

$X \subseteq Y \implies \forall x \in X\;x \in Y$

$\forall x \in X\;x \in Y \implies \forall x \in X\;x \in Y \lor x \in Z$

$\forall x \in X\;x \in Y \lor x \in Z \implies \forall (x \in X \lor x \in Z)\;x \in Y \lor x \in Z$

so,

$X \subseteq Y \implies X \cup Z \subseteq Y \cup Z$

31\. Counterexample: let $X = \{1\}$ and $Y = \{2\}$. We have:

* $\mathcal{P}(X) = \{\{\}, \{1\}\}$
* $\mathcal{P}(Y) = \{\{\}, \{2\}\}$
* $\mathcal{P}(X \cup Y) = \{\{\}, \{1\} \{2\}, \{1, 2\}\}$

Clearly, $\mathcal{P}(X \cup Y)$ contains elements that are not in $\mathcal{P}(X)$ or $\mathcal{P}(Y)$, meaning that it cannot be a subset of the union of the two powersets.

45\. Countexample: let $X = Y = Z = \{1\}$.

$X \cap (Y \times Z) = \{\}$

$(X \cap Y) \times (X \cap Z) = \{(1,1)\}$

# 2.2

12\. Let $x = y = \sqrt2$. If $x^y$ is rational, the proof is complete since we have shown the existence of numbers meeting the criteria we are trying to prove.

Otherwise, let us prove the statement by contradiction. Suppose that $x^y$ is irrational. Let $a = x^y$ and $b = \sqrt2$. We have

$$\begin{align*}
    a^b &= (x^y)^{\sqrt2} \\
        &= x^{(y \sqrt2)} \\
        &= x^{\sqrt2 \sqrt2} \\
        &= \sqrt{2}^2 \\
        &= 2
\end{align*}$$

In both cases, we have shown the existence of numbers whose exponent is rational. However, this proof is non-constructive since it is not made clear which pair of numbers' exponents is *actually* irrational.

35\. Lemma: the product of an even and odd integer is even. Proof:

Let $u$ be even and $v$ be odd. By definition, there exist integers $k_1$ and $k_2$ so that $u = 2k_1$ and $v = 2k_2 + 1$.

$$\begin{align*}
    uv &= 2k_1(2k_2 + 1) \\
       &= 4k_1k_2 + 2k_1 \\
       &= 2(2k_1k_2 + k_1)
\end{align*}$$

Thus, there exists an integer $k_3 = 2k_1k_2 + k_1$ so that $uv = 2k_3$, meaning that $uv$ is even.

Let $n$ be an integer. If $n$ is even, $n + 1$ is odd. If $n$ is odd, $n + 1$ is even. Therefore, the product of $n$ and $n + 1$ is always even.

47\. For all $n \in \Z$, $n$ is odd iff $n + 2$ is odd. Proof:

If $n$ is odd, there exists an integer $k$ so that $n = 2k+1$. Then, $n + 2 = 2k + 3$. There exists a $k_2 = k + 1$ so that $n + 2 = 2k_2 + 1$. Therefore, $n$ being odd implies that $n + 2$ is odd.

If $n + 2$ is odd, there exists an integer $k$ so that $n + 2 = 2k + 1$. Then, $n = 2k - 1$. There exists a $k_3 = k + 1$ so that $n = 2k_3 + 1$. Therefore, $n + 2$ being odd implies that $n$ is odd.

Since we have established that $p \implies q \land q \implies p$, we can conclude that $p \iff q$.

# 2.4

2\. $$\sum_{i = 1}^{n} i(i+1) = \frac{n(n+1)(n+2)}{3}$$ Proof:

Base case. $n = 1$: $1 \cdot 2 = \frac{1(1+1)(1+2)}{3} = 2$

Inductive step. If $\sum_{i = 1}^{n} i(i+1) = \frac{n(n+1)(n+2)}{3}$, $\sum_{i = 1}^{n + 1} i(i+1) = \frac{(n+1)(n+2)(n+3)}{3}$. Proof:

$$\begin{align*}
    \sum_{i = 1}^{n + 1} i(i+1) &= \left(\sum_{i = 1}^{n} i(i+1)\right) + (n+1)(n+2) \\
                                &= \frac{n(n+1)(n+2)}{3} + (n+1)(n+2) \\
                                &= \frac{n(n+1)(n+2) + 3(n+1)(n+2)}{3} \\
                                &= \frac{(n+3)(n+1)(n+2)}{3}
\end{align*}$$

Therefore, $$\sum_{i = 1}^{n} i(i+1) = \frac{n(n+1)(n+2)}{3}$$ for all $n \geq 1$.

3\. $$\sum_{i=1}^{n} n(n!) = (n+1)! - 1$$ Proof:

Base case. $n = 1$: $1(1!) = (1+1)! - 1 = 1$

Inductive step. If $\sum_{i=1}^{n} n(n!) = (n+1)! - 1$, $\sum_{i=1}^{n+1} n(n!) = (n+2)! - 1$. Proof:

$$\begin{align*}
    \sum_{i=1}^{n+1} n(n!) &= \left(\sum_{i=1}^{n} n(n!)\right) + (n+1)((n+1)!) \\
                           &= (n+1)! - 1 + (n+1)((n+1)!) \\
                           &= (n+1)!(1 + n + 1) - 1 \\
                           &= (n+1)!(n+2) - 1 \\
                           &= (n+2)! - 1
\end{align*}$$

Therefore, $\sum_{i=1}^{n} n(n!) = (n+1)! - 1$ for $n \geq 1$.

4\. $$\sum_{i = 1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}$$ Proof:

Base case. $n = 1$: $1^2 = \frac{1(1 + 1)(2 + 1)}{6} = 1$

Inductive step. If $\sum_{i = 1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}$, $\sum_{i = 1}^{n+1} i^2 = \frac{(n+1)(n+2)(2n+3)}{6}$. Proof:

$$\begin{align*}
    \sum_{i = 1}^{n+1} i^2 &= \left(\sum_{i = 1}^n i^2\right) + (n+1)^2 \\
                           &= \frac{n(n+1)(2n+1)}{6} + (n+1)^2 \\
                           &= \frac{n(n+1)(2n+1) + 6(n+1)^2}{6} \\
                           &= \frac{(n+1)(n(2n+1) + 6(n+1))}{6} \\
                           &= \frac{(n+1)(2n^2 + 7n + 6)}{6} \\
                           &= \frac{(n+1)(n + 2)(2n + 3)}{6} \\
\end{align*}$$

Therefore, $\sum_{i = 1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6}$ for $n \geq 1$.

16\. $2^n \geq n^2$, $n \geq 4$. Proof:

Base case. $n = 4$: $16 \geq 16$

Inductive step: If $2^n \geq n^2$, $2^{n+1} \geq (n+1)^2$. Proof:

$\frac{2^{n+1}}{2^n} = 2$

$\frac{(n+1)^2}{n^2} = \frac{n^2 + 2n + 1}{n^2} = 1 + \frac{2}{n} + \frac{1}{n^2}$

The latter ratio is less than $2$ for $n \geq 4$ and monotonically decreases, so the inequality is true.

Therefore, $2^n \geq n^2$ for $n \geq 4$

22\. $7^n - 1$ is divisible by $6$ for all $n \geq 1$. Proof:

Base case. $n = 1$: $7^1 - 1 = 6$.

Inductive step. If $7^n - 1$ is divisible by $6$, $7^{n + 1} - 1$ is divisible by $6$. Proof:

If $7^n - 1$ is divisible by $6$, there exists an integer $k$ so $7^n - 1 = 6k$. Then, $7^n = 6k + 1$.

$$\begin{align*}
    7^{n + 1} - 1 &= 7 \cdot 7^n - 1 \\
                  &= 7 \cdot (6k + 1) -1 \\
                  &= 42k + 7 - 1 \\
                  &= 42k + 6 \\
                  &= 6(7k + 1)
\end{align*}$$

So, there exists a $k_3 = 7k + 1$ so that $7^{n+1}-1 = 6k_3$, meaning that $7^{n+1} - 1$ is divisible by $6$.

Therefore, $7^n - 1$ is divisible by $6$ for all $n \geq 1$.