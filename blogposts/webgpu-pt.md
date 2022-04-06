<p style="text-align: center"><b>What determines how a material looks?</b></p>

We perceive materials based on how they scatter light. Thus, our material model needs to explain what happens to a ray of light when it hits a material.

There are two primary interactions which occur:
* Absorption: some frequencies of light are absorbed more strongly than others, creating color.
* Scattering: how light bounces off the material will determine its texture. Consider the two most extreme examples: a perfect mirror consistently reflects light in a very specific direction, while a painted surface with matte finish will scatter light rays in random directions.

For our purposes, it is enough to model absorption by multiplying incoming light against a set of coefficients. The scattering of light is a random process, so we can characterize it using its distribution. (Obviously, this assumes that the scattering events are independent; I can't think  of any physical situation where this wouldn't be the case). The distribution function looks like this:

Let $\text{BRDF}(\omega_i, \omega_o)$ be the proportion of light coming from direction $\omega_i$ reflected in direction $\omega_o$.

BRDF stands for Bidirectional Reflectance Distribution Function. One important property of BRDFs which their name betrays is reciprocity: $\text{BRDF}(\omega_i, \omega_o)$ = $\text{BRDF}(\omega_o, \omega_i)$. Intuitively, this says that reflection is the same in both directions. 

<p style="text-align: center"><b>How do we simulate how light moves through a scene?</b></p>

Depending on the level of accuracy you demand, the answer to this question might end up encompassing the entirety of physics. However, for the purposes of 3D rendering, it's safe to make some simplifying assumptions about the behavior of light. We treat light as a series of rays which always travel in straight lines, neglecting wave effects like diffraction and interference. By sacrificing these behaviors (which aren't noticeable in most scenes), we can use **raytracing** to simulate light transport.

With that, we can write an expression for the light from a point in terms of sources of illumination in the rest of the scene; this equation basically dictates how we shade the scene.

Let $L_o(x, \omega_o)$ be the intensity of light radiated from point $x$ towards direction $w_\omega$, $L_i(x, \omega_i)$ be the intensity of light incoming towards point $x$ from direction $\omega_i$, and $L_e(x)$ be the light emitted from point $x$.

$$L_o(x, \omega_o) = L_e(x) + \int_\Omega \text{BRDF}(\omega_i, \omega_o) \,d\omega_i$$

<aside>

We assume that all light sources emit at equal intensity in all directions; that is, they are *isotropic*. Thus, $L_e$ is expressed only in terms of $x$.

</aside>