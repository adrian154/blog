A sequence is basically an infinite list of numbers. It can be thought of as a function whose domain is the set of positive integers, where the inputs are positions in the series. For example, consider the sequence 2, 4, 6, 8 &hellip;; it is defined by the function $a(n) = 2n$, though when talking about sequences we usually use subscript notation, so we'd write it as $a_n = 2n$.

## Sequence Convergence

A sequence **converges** if $\lim_{n\to\infty} a_n = L$, where $L$ is a finite number. If no finite limit exists, the sequence **diverges**.

A sequence can diverge without growing towards infinity. For example, $\lim_{n\to\infty} \sin(n)$ doesn't exist, so we say that $a_n = \sin(n)$ diverges.

# Infinite Series

If $a_n$ is an infinite sequence, then $\sum_{n=1}^\infty a_n = a_1 + a_2 + a_3 + \ldots$ is an **infinite series**. You may see it written simply as $\sum a_n$.

The sum of the first $n$ elements of a sequence is known as a **partial sum**.

$$
\begin{align*}
    S_1 = a_1 \\
    S_2 = a_1 + a_2 \\
    S_3 = a_1 + a_2 + a_3 \\
    \vdots \\
    S_n = a_1 + a_2 + a_3 + \ldots + a_n
\end{align*}
$$

As you can see, the partial sums form a sequence, which may converge or diverge. Determining whether the infinite series for a given sequence converges or diverges is kind of a big deal.

## p-series

The series $\sum_{n=1}^\infty \frac{1}{n^p} = 1 + \frac{1}{2^p} + \frac{1}{3^p} + \ldots + \frac{1}{n^p}$ is known as the **p-series**. When $p = 1$, the series is known as the **harmonic series**, which is equal to $1 + \frac12 + \frac13 + \ldots + \frac1n$.

## Geometric Series

A series of the form $\sum_{n=0}^\infty ar^n = a + ar + ar^2 + \ldots + ar^n$ is known as a **geometric series**. 

**Theorem:** A geometric series converges to $\frac{a}{1 - r}$ when $|r| < 1$. When $|r| > 1$, the series diverges.

## The *n*th-term test

**Theorem:** If $\sum a_n$ converges, then $\lim_{n\to\infty} a_n = 0$. Therefore, if $\lim_{n\to\infty} a_n \neq 0$, then $\sum a_n$ does not converge.

However, the opposite of this theorem is not always true; just because $\lim_{n\to\infty} a_n = 0$ doesn't mean the series $\sum a_n$ converges. Basically, you can use the *n*th-term test to prove that a series diverges, but you can't use it to prove that a series converges.

<aside>

**Problem:** Does the series $\sum \frac{n^2}{n^2 + 1}$ diverge?

**Solution:** To solve this, we simply evaluate the limit $$\lim_{n\to\infty} \frac{n^2}{n^2 + 1}$$

Since the degree of the top and bottom are the same, the limit is simply the leading coefficient of the numerator over the leading coefficient of the denominator, or $\frac11$. This is not zero, so the series diverges.

</aside>

## The Integral Test

**Theorem:** Let $f(x)$ be a continuous function such that $f(n) = a_n$. If $f(x) > 0$ and is decreasing for all $x \geq 1$, $\sum_1^\infty a_n$ converges if $\int_1^\infty a(n)\,dn$ converges. If the integral diverges, the series diverges too.

<aside>

**Problem:** Does the series $\sum \frac{1}{n(n+1)}$ converge or diverge?

**Solution:** Let's check with the integral test.

$$
\begin{align*}
&\int \frac{1}{x(x+1)}\,dx = \\[1.0em]
&\int \frac{(x+1) - x}{x(x+1)}\,dx = \\[1.0em]
&\int \frac{x+1}{x(x+1)} - \frac{x}{x(x+1)}\,dx = \\[1.0em]
&\int \frac1x - \frac{1}{x+1}\,dx = \\[1.0em]
&\ln|x| - \ln|x+1| + C = \\[1.0em]
&\ln\left|\frac{x}{x+1}\right| + C
\end{align*}
$$

Our integral is over $x \geq 1$, so we can get rid of the absolute value.

Now, to evaluate the improper integral:

$$
\begin{align*}
&\lim_{x\to\infty} \ln\frac{x}{x+1} - \ln\frac12 = \\
&\ln(1) - \ln\frac12 = \\
&-\ln\frac12
\end{align*}
$$

The integral converges, so the series converges too.

</aside>

## Modified Series Still Converge

You can do all sorts of things to a series, and it'll still converge:
* You can add or remove a finite number of terms.
* You can multiply it by a finite constant.
* You can add it to another convergent series.
* You can rearrange the terms.

Sometimes modifying a series (e.g. rearranging it) allows us to prove that it converges in an easier way.