<figure style="max-width: 704px">
    <video src="gaussian-integral.mp4" controls></video>
    <figcaption><a href="https://www.reddit.com/r/mathmemes/comments/snleob/the_gaussian_integral/">Original by u/AlgebraPad</a></figcaption>
</figure>

Recently, I saw this video showing a proof of the [Gaussian integral](https://en.wikipedia.org/wiki/Gaussian_integral), set to DNCE's Cake By The Ocean. This inspired me to create a blogpost elaborating on what's really being shown here.

We start with the Gaussian integral:

$$\int_{-\infty}^{+\infty} e^{-x^2}\,dx$$

It's called the Gaussian integral because it is the integral of the Gaussian function $f(x) = e^{-x^2}$. This function is pretty important, and shows up a ton of different domains like physics and signal processing. You're probably familiar with the graph of the function:

![graph of gaussian function](gaussian-function.png)

This function has an interesting property: while the indefinite integral of $f(x)$ cannot be written using elementary functions, the definite integral over $(-\infty, \infty)$ *can* be analytically proven. This is what we will be exploring today.

The video starts by equating the integral to

$$\left(\left(\int_{-\infty}^{+\infty} e^{-x^2}\,dx\right)^2\right)^\frac12$$

This allows us to rewrite the expression as an integral of two variables:

$$\left(\int_{-\infty}^{+\infty} e^{-x^2}\,dx \int_{-\infty}^{+\infty} e^{-y^2}\,dy \right)^\frac12$$

$\int_{-\infty}^{+\infty}e^{-x^2}$ converges, so we can treat this as a case of an integral multiplied by a constant with respect to $y$. Thus, we have

$$\left(\int_{-\infty}^{+\infty} \left(\int_{-\infty}^{+\infty}e^{-x^2}\,dx\right) e^{-y^2}\,dy \right)^\frac12$$

$e^{-y^2}$ does not change with respect to $x$, so we can move it into the inner integral, yielding

$$\left(\int_{-\infty}^{+\infty} \int_{-\infty}^{+\infty} e^{-x^2} e^{-y^2}\,dx\,dy\right)^\frac12$$

or just

$$\left(\iint_{\R^2} e^{-(x^2+y^2)} d(x,y)\right)^\frac12$$

That $x^2+y^2$ tips us off that the next step will be to convert the integral to polar coordinates. To do this, we replace $x$ and $y$ with $\rho\cos\theta$ and $\rho\sin\theta$, and our boundaries become $\rho \in [0, \infty)$ and $\theta \in [0, 2\pi]$

$$\left(\iint_{\R^+ \times [0,2\pi]} e^{-\left((\rho\cos\theta)^2 + (\rho\sin\theta)^2 \right)} \left|\frac{d(x,y)}{d(\rho,\theta)}\right| d(\rho, \theta) \right)^\frac12$$

Since we've changed the variables of integration, the differential is now given by the determinant of the [Jacobian matrix](https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant).


$$\left(\iint_{\R^+ \times [0,2\pi]} e^{-\left((\rho\cos\theta)^2 + (\rho\sin\theta)^2 \right)} \left|\begin{pmatrix}\frac{\partial}{\partial\rho} x(\rho, \theta) & \frac{\partial}{\partial\theta} x(\rho, \theta) \\[0.7em]  \frac{\partial}{\partial\rho} y(\rho, \theta) & \frac{\partial}{\partial\theta} y(\rho, \theta)\end{pmatrix}\right| d(\rho, \theta) \right)^\frac12$$

From here, we can do a number of things to simplify the expression:
* Reduce the exponent $-\left((\rho\cos\theta)^2 + (\rho\sin\theta)^2 \right)$ to $-\rho^2$
* Simplify the partial derivatives in the determinant.

This leaves us with

$$\left(\int_0^\infty \int_0^{2\pi} e^{-\rho^2} \cdot \left|\begin{pmatrix}\cos\theta &-\rho\sin\theta \\ \sin\theta &\quad\rho\cos\theta\end{pmatrix}\right| \,d\theta \,d\rho\right)^\frac12$$

Evaluating the determinant:

$$\left(\int_0^\infty \int_0^{2\pi} e^{-\rho^2} \cdot (\rho\cos^2\theta + \rho\sin^2\theta) \,d\theta \,d\rho\right)^\frac12$$

$e^{-\rho^2}$ does not vary with respect to $\theta$, so we can move it to the outer integral, giving

$$\left(\int_0^\infty  e^{-\rho^2}  \int_0^{2\pi} \rho\left(cos^2\theta + \sin^2\theta\right) \,d\theta \,d\rho\right)^\frac12$$

or just

$$\left(\int_0^\infty  e^{-\rho^2}  \int_0^{2\pi} \rho\,d\theta\,d\rho\right)^\frac12$$

Moving $\rho$ to the outer integral yields

$$\left(\int_0^\infty  \rho e^{-\rho^2}  \int_0^{2\pi} d\theta\,d\rho\right)^\frac12$$

Simplifying the inner integral:

$$\left(\int_0^\infty  \rho e^{-\rho^2}  2\pi \,d\rho\right)^\frac12$$

Now, evaluate.

$$
\begin{align*}
    \left(2\pi \int_0^\infty \rho e^{-\rho^2} d\rho\right)^\frac12 &= \\
    \left(2\pi \left(-\frac12\right) \int_0^\infty (-2\rho) e^{-\rho^2} d\rho\right)^\frac12 &= \\
    \left(-\pi \left[e^{-\rho^2}\right]_0^\infty\right)^\frac12 &= \\
    \left(-\pi [e^{-\infty} - e^0]\right)^\frac12 &= \\
    \left(-\pi [0 - 1]\right)^\frac12 &= \\
    \left(\pi\right)^\frac12 &= \\
    \sqrt{\pi}
\end{align*}
$$