A sequence is basically an infinite list of numbers. It can be thought of as a function whose domain is the set of positive integers, where the inputs are positions in the series. For example, consider the sequence 2, 4, 6, 8 &hellip;; it is defined by the function $a(n) = 2n$, though when talking about sequences we usually use subscript notation, so we'd write it as $a_n = 2n$.

## Sequence Convergence

A sequence **converges** if $\lim_{n\to\infty} a_n = L$, where $L$ is a finite number. If no finite limit exists, the sequence **diverges**.

A sequence can diverge without growing towards infinity. For example, $\lim_{n\to\infty} \sin(n)$ doesn't exist, so we say that $a_n = \sin(n)$ diverges.

# Infinite Series

If $a_n$ is an infinite sequence, then $\sum_{n=1}^\infty a_n = a_1 + a_2 + a_3 + \ldots$ is an **infinite series**. You may see it written simply as $\sum a_n$.

The sum of the first $n$ elements of a sequence is known as a **partial sum**.

$$
\begin{align*}
    S_1 &= a_1 \\
    S_2 &= a_1 + a_2 \\
    S_3 &= a_1 + a_2 + a_3 \\
    &\vdots \\
    S_n &= a_1 + a_2 + a_3 + \ldots + a_n
\end{align*}
$$

As you can see, the partial sums form a sequence, which may converge or diverge. Determining whether the infinite series for a given sequence converges or diverges is kind of a big deal.

## p-series

The series $\sum_{n=1}^\infty \frac{1}{n^p} = 1 + \frac{1}{2^p} + \frac{1}{3^p} + \ldots + \frac{1}{n^p}$ is known as the **p-series**. When $p = 1$, the series is known as the **harmonic series**, which is equal to $1 + \frac12 + \frac13 + \ldots + \frac1n$.

**Theorem:** For a *p*-series, if $p$ > 1 the series converges. Otherwise, the series diverges.

## Geometric Series

A series of the form $\sum_{n=0}^\infty ar^n = a + ar + ar^2 + \ldots + ar^n$ is known as a **geometric series**. 

**Theorem:** A geometric series converges to $\frac{a}{1 - r}$ when $|r| < 1$. When $|r| > 1$, the series diverges.

## The *n*th-term test

**Theorem:** If $\sum a_n$ converges, then $\lim_{n\to\infty} a_n = 0$. Therefore, if $\lim_{n\to\infty} a_n \neq 0$ or the imit doesn't exist, then $\sum a_n$ does not converge.

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
    \int \frac{1}{x(x+1)}\,dx &= \int \frac{(x+1) - x}{x(x+1)}\,dx\\[1.0em]
    &= \int \frac{x+1}{x(x+1)} - \frac{x}{x(x+1)}\,dx\\[1.0em]
    &= \int \frac1x - \frac{1}{x+1}\,dx\\[1.0em]
    &= \ln|x| - \ln|x+1| + C\\[1.0em]
    &= \ln\left|\frac{x}{x+1}\right| + C
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

## The Direct Comparison Test

The convergence of a series can be proven by comparing it to another series which is known to converge or diverge. This is convenient for series that are not easily tested with other methods.

**Theorem:** Let $0 \leq a_n \leq b_n$ for all $n$. $\sum a_n$ converges if and only if $\sum b_n$ converges.

<aside>

**Problem:** Does the series $\sum \frac{1}{2^x+x}$ converge or diverge?

**Solution:** We can compare this series to the geometric series $\left(\frac{1}{2}\right)^x$, which we know converges since $r = \frac12 < 1$. We can show that $\frac{1}{2^x+x} < \frac{1}{2^x}$ for all $x$ where $2^x+x > 2^x$, which turns out to be all $x > 0$.

In addition, $2^x+x > 0$ and $2^x > 0$, so both series meet our condition of being nonnegative, proving that the series converges.

</aside>

## The Ratio Test

The ratio test is the convergence test of choice for Twitter users.

**Theorem:** Let $\lim_{n\to\infty} \left|\frac{a_{n+1}}{a_n}\right| = L$. If $L < 1$, the series converges; if $L > 1$, the series diverges. If $L = 1$ or the limit doesn't exist, the test is inconclusive (the series could be either convergent or divergent).

<aside>

**Problem:** Does the series $\sum \frac{2^x}{x!}$ converge or diverge?

**Solution:** We can apply the ratio test.

$$
\begin{align*}
    \lim_{n\to\infty} \left|\frac{a_{n+1}}{a_n}\right| &= \lim_{n\to\infty} \left|\frac{2^{x+1}}{(x+1)!} \times \frac{x!}{2^x}\right| \\
    &= \lim_{n\to\infty} \left|\frac{2}{x+1}\right| \\
    &= 0
\end{align*}
$$

The series converges. 

</aside>

## The Root Test

**Theorem:** Let $\lim_{n\to\infty} \sqrt[n]{|a_n|} = L$. If $L < 1$, the series converges; if $L > 1$, the series diverges. If $L = 1$ or the limit doesn't exist, the test is inconclusive (the series could be either convergent or divergent).

The root test is stronger than the ratio test, meaning that there are situations where the root test is able to prove convergence/divergence but the ratio test is inconcusive. However, there are no situations where the root test is inconclusive but the ratio test is able to prove convergence/divergence.

<aside>

**Problem:** Does the series $\sum \left(\frac{x^{5}}{2^{x}}\right)^3$ converge or diverge?

**Solution:** The root test with $n = 3$ is perfect for tackling this problem.

$$
\begin{align*}
    \lim_{n\to\infty} \sqrt[n]{|a_n|} &= \lim_{x\to\infty} \sqrt[3]{\left(\frac{x^{5}}{2^{x}}\right)^3} \\
    &= \lim_{x\to\infty} \frac{x^5}{2^x}
\end{align*}
$$

Oops. Probably should've picked an equation that resulted in a simpler limit. At this point, it's probably safe to just equate the limit to zero because exponential functions have a greater asymptotic growth rate than power functions and call it day.

Nevertheless, if you're not content with simply equating the limit to zero, here's some more rigor for you. (Well, what little rigor I can extract from my math-addled brain.)

$$
\begin{align*}
    \lim_{x\to\infty} \ln\left(\frac{x^5}{2^x}\right) &= \lim_{x\to\infty} \ln(x^5) - \ln(2^x) \\
    &= \lim_{x\to\infty} 5\ln x - x\ln2
\end{align*}
$$

Let's try to prove that this tends towards negative infinity.

$$\frac{d}{dx} 5\ln x - x\ln2 = \frac{5}{x} - \ln2$$

The limit of the derivative at infinity is $-\ln2$, which is a constant nonzero value. Thus, $\lim_{x\to\infty} 5\ln x - x\ln2$ must tend towards negative infinity. We have:

$$\lim_{x\to a} \ln(f(x)) = \ln(\lim_{x\to a} f(x))$$

Thus, $e^{\lim_{x\to\infty} \ln\left(\frac{x^5}{2^x}\right)} = \lim_{x\to\infty} \frac{x^5}{2^x}$. Because we proved that the limit within the exponent tends towards negative infinity, $e$ to the power of that limit must tend towards zero.

I can't help but feel that there was an easier way to do that, but whatever.

</aside>

## Modified Series Still Converge

You can do all sorts of things to a series, and it'll still converge:
* You can add or remove a finite number of terms.
* You can multiply it by a finite constant.
* You can add it to another convergent series.
* You can rearrange the terms.

Sometimes modifying a series (e.g. rearranging it) allows us to prove that it converges in an easier way. 

## Alternating Series

Many of the tests so far only work with nonnegative series. Adapting negative series to these tests is easy, just flip the signs. However, some series have both positive and negative terms, like the **alternating harmonic series**:

$$\sum_{n=1}^\infty \frac{(-1)^{n+1}}{n} = 1 - \frac12 + \frac13 - \frac14 + \ldots$$

In general, alternating series will follow the form $\sum_{n=1}^\infty (-1)^n a_n$.

**Theorem:** For an alternating series $\sum_{n=1}^\infty (-1)^n a_n$, if $a_{n+1} < a_n$ for all $n$ and $\lim_{n\to\infty} a_n = 0$, the sequence converges.

<aside>

**Problem:** Does $\sum \frac{(-1)^{n+1}}{n}$ converge or diverge?

**Solution:** We start by recognizing that $a_n = \frac1n$. From there, it's easy to see that the two conditions are met:
* $\frac{1}{n+1} < \frac{1}{n}$
* $\lim_{n\to\infty} \frac1n = 0$

</aside>

## Absolute Convergence

Some especially quirky sequences have mixed signs, but they don't follow the strictly alternating pattern of a regular alternating series. For these offenders, we can define a concept of absolute convergence.

**Theorem:** If $\sum |a_n|$ converges, $\sum a_n$ converges too, and it is **absolutely convergent**. If $\sum a_n$ converges but not $\sum |a_n|$, the series is **conditionally convergent**.

<aside>

We just proved that the alternating harmonic series converges, but we also know that the harmonic series diverges. Thus, the alternating harmonic series is only conditionally convergent.

</aside>

# Power Series

So far we have beaten the topic of determining series convergence to death and beyond, but what are they actually useful for? It turns out that we can use series to approximate many functions (such as the trigonometric functions) which cannot be expressed using elementary operations alone.

A power series is a series of the form 

$$\sum_{n=0}^\infty a_n(x - c)^k = a_0 + a_1(x-c) + a_2(x-c)^2 + \ldots$$

where $a_n$ is the sequence of coefficients, and $c$ is the center.

We can treat the power series as a function of $x$:

$$f(x) = \sum_{n=0}^\infty a_n(x - c)^k$$

Every power series has a **radius of convergence** $R$ such that when $|x - c| < R$ the series is convergent, and when $|x - c| > R$ the series is divergent. The series may or may not converge at $|x - c| = R$.

<aside>

**Problem:** What is the radius of convergence of the power series $\sum \frac{x^n}{n!}$? 

**Solution:** We can apply the ratio test.

$$
\begin{align*}
    \lim_{n\to\infty} \left|\frac{a_{n+1}}{a_n}\right| &= \lim_{n\to\infty} \left|\frac{(n+1)!}{x^{n+1}} \times \frac{x^n}{n!}\right| \\
    &= \lim_{n\to\infty} \left|\frac{n+1}{x}\right| \\
    &= |x| \lim_{n\to\infty} n+1 
\end{align*}
$$

For all $x \neq 0$, the value of the ratio test approaches infinity, so the series is divergent. This gives us a radius of convergence of $0$.

</aside>

A related concept is the interval of convergence. However, this interval is not simply equal to $(x - R, x + R)$; whether the endpoints are convergent needs to be tested separately.

So why are power series useful? We'll get to that in a second. Recall $f(x)$ from just a moment ago:

$$f(x) = \sum_{n=0}^\infty a_n(x - c)^n$$

This function has some properties which make it useful. Over the function's interval of convergence, it is continuous and differentiable. We can find the integral of the power series by integrating each of its terms separately and adding them all up:

$$
\begin{align*}
    \int f(x)\,dx &= \sum_{n=0}^\infty \int a_n(x-c)^n\,dn \\
    &= \sum_{n=0}^\infty a_n\frac{(x-c)^{n+1}}{n+1} + C
\end{align*}
$$

## Approximating Functions with Power Series

Now for the main course, the headline act. It turns out that we can represent many functions as power series.

Say we have a function $f(x)$, which **can** be represented with a power series:

$$f(x) = \sum_{n=0}^\infty a_n(x - c)^n = a_0 + a_1(x - c) + a_2(x - c)^2 + \ldots$$

How do we find the coefficients of this series?

For starters, we know that $f(c) = a_0$, since when $x = c$ all terms following this one are zero.

The next coefficient can be determined by taking the derivative of $f(x)$:

$$
\begin{align*}
    f'(x) &= \sum_{n=0}^\infty n a_n(x-c)^{n-1} \\
    &= a_1 + 2a_2(x-c) + 3a_3(x-c)^2 + 4a_4(x-c)^3 + \ldots
\end{align*}    
$$

Thus, $f'(c) = a_1$.

We can repeat this process to determine the rest of the coefficients:

$$
\begin{align*}
    f''(x) &= \sum_{n=0}^\infty n(n-1) a_n(x-c)^{n-2} \\
    &= 2a_2 + 6a_3(x-c) + 12a_4(x-c)^2 + 20a_5(x-c)^3 + \ldots
\end{align*}
$$

We see that $f'(c) = a_1$, $f''(c) = 2a_2$, $f'''(c) = 6a_3$, $f''''(c) = 24a_4$, and so on. We can generalize this: $f^{n}(c)$, the $n\text{th}$ derivative of $f$, is equal to $n! \times a_n$.

## The Taylor Series

The $n\text{th}$ Taylor polynomial of $f(x)$ is 

$$
\begin{align*}
    T_n(x) &= \sum_{k=0}^\infty \frac{f^k(c)}{k!} (x-c)^k \\
           &= f(c) + f'(c)(x-c) + \frac{f''(c)}{2}(x-c)^2 + \frac{f'''(c)}{6}(x-c)^3 + \ldots
\end{align*}
$$

When $c = 0$, we call it the **Maclaurin series**.

<aside>

**Problem:** Find the Maclaurin expansion of $sin(x)$.

**Solution:**

$$
\begin{align*}
    \sin(x) &= \sum_{n=0}^\infty \frac{f^n(0)}{n!} x^n \\
    &= \sin(0) + \cos(0)x - \frac{\sin(0)}{2!} x^2 - \frac{\cos(0)}{3!} x^3 \ldots \\
\end{align*}
$$

We can disregard all the terms where $n$ is even since $sin(0) = 0$, leaving us with:

$$
\begin{align*}
    \sin(x) &= x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + \ldots \\
            &= \sum_{n=0}^\infty (-1)^{n + 1} \frac{}{(2n - 1)!}
\end{align*}
$$

</aside>