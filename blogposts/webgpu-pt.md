# A PBR Crash Course

**TODO: intro**

<p style="text-align: center"><b>What determines how a material looks?</b></p>

We perceive materials based on how they scatter light. Thus, our material model needs to explain what happens to a ray of light when it hits a material.

There are two primary interactions which occur:
* Absorption: some frequencies of light are absorbed more strongly than others, creating color.
* Scattering: how light bounces off the material will determine its texture. Consider the two most extreme examples: a perfect mirror will always reflect light in the same direction, while a painted surface with matte finish will scatter light rays in random directions.

For our purposes, it is enough to model absorption by multiplying the spectrum of the incoming light against a set of coefficients. The scattering of light is a random process, so we can characterize it using its distribution. (This assumes that the scattering events are independent; I can't think  of any physical situation where this wouldn't be the case). The distribution function looks like this:

<div class="indented">

Let $\text{BRDF}(\omega_i, \omega_o)$ be the proportion of light coming from direction $\omega_i$ reflected in direction $\omega_o$.

</div>

BRDF stands for Bidirectional Reflectance Distribution Function. One important property of BRDFs which their name betrays is reciprocity: $\text{BRDF}(\omega_i, \omega_o)$ = $\text{BRDF}(\omega_o, \omega_i)$. 
Intuitively, this says that reflection is the same in both directions. 

**TODO: brdf visualization**

<p style="text-align: center"><b>How do we simulate how light moves through a scene?</b></p>

Depending on the level of accuracy you demand, the answer to this question might end up encompassing the entirety of physics. However, for the purposes of 3D rendering, it's safe to make some simplifying assumptions about the behavior of light. We treat light as a series of rays which always travel in straight lines, neglecting wave effects like diffraction and interference. By sacrificing these behaviors (which aren't noticeable in most scenes), we can use **raytracing** to simulate light transport.

With that, we can write an expression for the light radiated by a point in terms of sources of illumination in the rest of the scene; this equation basically dictates how to shade the scene.

<div class="indented">

Let $L_o(x, \omega_o)$ be the intensity of light radiated from point $x$ towards direction $\omega_o$, $L_i(x, \omega_i)$ be the intensity of light hitting point $x$ from direction $\omega_i$, and $L_e(x)$ be the light emitted from point $x$.

</div>

$$L_o(x, \omega_o) = L_e(x) + \int_\Omega \text{BRDF}(\omega_i, \omega_o) L_i(x, \omega_i) (\omega_i \cdot n) \,d\omega_i$$

Wow, what a mouthful! Don't be scared; we can actually pick this apart piece-by-piece. Let's add a little bit of color: 

$$\textcolor{red}{L_o(x, \omega_o)} = \textcolor{green}{L_e(x)}\,+\int_{\Omega} \textcolor{blue}{\text{BRDF}(\omega_i, \omega_o) L_i(x, \omega_i)}\textcolor{orange}{(\omega_i \cdot n)}\,d\omega_i$$

This equation basically boils down to...

<div class="indented">

The <span style="color: #ff0000">light emitted by point $x$</span> is equal to the <span style="color: #009B55">light emitted from point $x$</span> plus the sum of the <span style="color: #0000ff">light hitting point $x$, multiplied by the likelihood of light being reflected towards the viewer</span>.

</div>

But wait, what's that last term, $\omega_i \cdot  n$? For starters, $n$ is the normal vector at point $x$. That basically means it's the vector perpendicular to the surface at point $x$. Since both $n$ and $\omega_i$ are unit vectors, their dot product is simply equal to the cosine of the angle between them. You will often see this written as $\cos\theta_i$.

If you want a rigorous explanation of this term, I would highly recommend that you read the section about radiometry (specifically, the definition of radiance, which is the quantity given by our equation) in [*Physically Based Rendering*](https://pbr-book.org/3ed-2018/Color_and_Radiometry/Radiometry). For now, my quick-and-dirty explanation will suffice.

Basically, the product of the BRDF and the incoming radiance tells us how much energy is going towards the viewer. However, as the surface becomes more tilted relative to the viewer, the apparent area it takes up in our view increases. Since the energy is spread out over a wider area, the radiance is lower. This phenomenon is known as [Lambert's law](https://en.wikipedia.org/wiki/Lambert%27s_cosine_law).

Think about what happens if you shine a light against a wall. It will appear brightest when you shine it directly perpendicular to the wall; in this case, $\theta_i = 0\degree$, so $\cos\theta_i = 1$. As you tilt the flashlight, the brightness of the wall decreases. Eventually, the beam will be parallel with the wall, at which point $\theta_i = 90\degree$ and $\cos\theta_i = 0$.

This equation, put together, is known as the **rendering equation**. Solving it is the focus of physically-based rendering.

<aside>

For the sake of simplicity, we assume that all light sources emit at equal intensity in all directions; that is, they are *isotropic*. Thus, $L_e$ is expressed only in terms of $x$.

</aside>

## Solving the Rendering Equation

The job of our renderer, in a nutshell, is to solve the rendering equation. Unfortunately, most of the integration methods we normally use are useless here because the rendering equation is very high-dimensional; in fact, unless we place some limits on the rendering equation, the number of dimensions is **infinite**! Thankfully, one class of methods stands out for very high dimension problems: [Monte Carlo integration](https://en.wikipedia.org/wiki/Monte_Carlo_integration).

The idea behind Monte Carlo integration is simple: if we evaluate the function for random points on its domain, the average will approach the integral of the function. Essentially:

<div class="indented">

Let $x_0, x_1 \ldots x_n$ be uniformly distributed random numbers in the range $[a, b]$. 

</div>

$$\lim_{n\to\infty} \frac{1}{n} \sum_{i=0}^n f(x_i) = \int_{a}^{b} f(x) \,dx$$

In some cases, our samples might not be uniformly distributed. In that case, we can simply weight each sample by the PDF of each sample.

$$\lim_{n\to\infty} \frac{1}{n} \sum_{i=0}^n \frac{f(x_i)}{\text{pdf}(x_i)} = \int_{a}^{b} f(x) \,dx$$

For the statistically inclined folk among the audience, this method of estimating an integral is **unbiased**; that is, given an infinite number of iterations, it will always converge onto the "correct" answer.

Here's a very basic demonstration of a Monte Carlo method, where we pick random points and count how many fall within a circle to estimate the value of pi.

<canvas id="pi-mc" width="256" height="256"></canvas>

<button id="pi-button">Run</button> <span id="pi-stats"></span>

Notice how as the number of points increases, the error progressively decreases. It can be shown that a Monte Carlo integrator will converge on the answer at a rate of $\frac{1}{\sqrt{n}}$, regardless of dimension. While this rate is unbearably slow compared to other methods when applied to 1D integration, as the number of dimensions grows, Monte Carlo integration gains a significant edge.

So how do we apply Monte Carlo integration to the rendering equation? It's pretty simple, actually; we can just plug in .