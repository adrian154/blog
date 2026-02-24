# Hertzian Dipole

Let us consider the Hertzian dipole, an infinitesimal element of current. The current density in space of such a dipole, situated at the origin and oriented in the $z$ direction, is

$$\mathbf{J}(r) = \hat{z} I \ell \delta(r)$$

(Note - it is implied that we are working in the frequency domain, so all quantities are sinusoidally varying.)

We wish to compute the electric and magnetic fields associated with this current distribution. The first step is to determine the magnetic vector potential $\mathbf{A}$:

$$\mathbf{A}(\vec{r}) = \int_\Omega \frac{\mu}{4\pi} \frac{\mathbf{J}(\vec{r'})}{|\vec{r}-\vec{r'}|} e^{-j\beta |\vec{r}-\vec{r'}|}\,d\vec{r'}$$

This integral quite neatly evaluates to

$$\mathbf{A}(\vec{r}) = \frac{\mu}{4\pi} \frac{\hat{z}I\ell}{|\vec{r}|} e^{-j\beta \vec{r}} $$

The magnetic field $\mathbf{H}$ is related to $\mathbf{A}$ by

$$\mathbf{H} = \mu (\nabla \times \mathbf{A})$$

Based on the appearance of $\mathbf{A}$, it seems wise to proceed in spherical coordinates. Making use of the fact that

$$\hat{z} = (\cos\theta) \hat{r} - (\sin\theta) \hat{\theta}$$

we rewrite $\mathbf{A}$ as

$$\mathbf{A}(r, \theta) = [(\cos\theta) \hat{r} - (\sin\theta) \hat{\theta}]\,\frac{\mu I \ell}{4\pi} \frac{e^{-j\beta r}}{r}$$

The curl of $\mathbf{A}$ (in spherical cooordinates) is:

$$\nabla \times \mathbf{A} = \begin{vmatrix}
    \frac{\hat{r}}{r^2 \sin \theta} & \frac{\hat{\theta}}{r \sin \theta} & \frac{\hat{\phi}}{r} \\[6pt]
    \frac{\partial}{\partial r} & \frac{\partial}{\partial \theta} & \frac{\partial}{\partial \phi} \\[6pt]
    A_r & r A_\theta & r\sin\theta A_\phi
\end{vmatrix}$$

It will help to write $\mathbf{A}$ componentwise.

$$A_r = \cos\theta \frac{\mu I \ell}{4\pi} \frac{e^{-j\beta r}}{r}$$

$$A_\theta = -\sin\theta \frac{\mu I \ell}{4\pi} \frac{e^{-j\beta r}}{r}$$

$$A_\phi = 0$$

Now we are off to the races. Conveniently, since $A_\phi = 0$ and $\frac{\partial\mathbf{A}}{\partial\phi} = 0$, we can discount the $r$ and $\theta$ components of $\nabla \times \mathbf{A}$. So, we are left with

$$\begin{align*}
    (\nabla \times \mathbf{A})_\phi &= \frac{1}{r} \left(\frac{\partial}{\partial r} rA_\theta - \frac{\partial}{\partial\theta} A_r\right)\\[1em]
    &= \frac{1}{r}\left(r\frac{\partial}{\partial r} A_\theta + A_\theta - \frac{\partial}{\partial\theta} A_r\right)\\[1em]
\end{align*}$$

Evaluating those partial derivatives:

$$\frac{\partial}{\partial r}A_\theta = -\sin\theta \frac{\mu I \ell}{4\pi} \left[\frac{-j\beta r e^{-j\beta r} - e^{-j\beta r}}{r^2}\right]$$

$$\frac{\partial}{\partial \theta} A_r = -\sin\theta \frac{\mu I \ell}{4\pi} \frac{e^{-j\beta r}}{r}$$

Before we go writing out everything, we can see that $A_\theta - \frac{\partial}{\partial \theta} A_r = 0$. So, we really just have

$$\begin{align*}
    (\nabla \times \mathbf{A})_\phi &= \frac{\partial}{\partial r} A_\theta \\[1em]
    &= -\sin\theta \frac{\mu I \ell}{4\pi} \left[\frac{-j\beta r e^{-j\beta r} - e^{-j\beta r}}{r^2}\right]
\end{align*}$$

We can finally write a solution for $\mathbf{H}$:

$$\mathbf{H} = \hat{\phi} \,\frac{\mu I \ell \, \sin\theta  \, e^{-j\beta r}}{4 \pi} \left(\frac{j\beta r + 1}{r^2}\right)$$

Now, for the electric field. Maxwell's equations in the frequency domain state that

$$\nabla \times \mathbf{H} = j\omega \varepsilon \mathbf{E}$$

So,

$$\mathbf{E} = \frac{1}{j\omega\varepsilon} (\nabla \times \mathbf{H})$$

Oh God, we have to take another curl! This time, the electric field has a component in both the $r$ and $\theta$ directions. Let us calculate them separately, starting with $E_r$:

$$\begin{align*}
    (\nabla \times H)_r &= \frac{1}{r^2 \sin \theta} \left[\frac{\partial}{\partial \theta} r\sin\theta H_\phi - \frac{\partial}{\partial \phi} r H_\theta \right] \\[1em]
    &= \cos\theta\frac{\mu I \ell \,  \, e^{-j\beta r}}{2 \pi} \left(\frac{j\beta r + 1}{r^3}\right)
\end{align*}$$

$(\nabla \times H)_\theta$ is a bit more menacing:

$$\begin{align*}
    (\nabla \times H)_\theta &= -\frac{1}{r \sin \theta} \left[\frac{\partial}{\partial r} r \sin\theta H_\phi - \frac{\partial}{\partial \phi}H_r\right]\\[1em]
    &= \frac{1}{r\sin\theta} \left[\sin\theta H_\phi + r\sin\theta\frac{\partial}{\partial r} H_\phi\right]\\[1em]
    &= \frac{1}{r} H_\phi + \frac{\partial}{\partial r} H_\phi
\end{align*}$$

After a deep breath, we will evaluate this partial derivative:

$$\begin{align*}
    \frac{\partial}{\partial r} H_\phi &= \frac{\mu I \ell \sin\theta}{4\pi} \left[-j\beta e^{-j\beta r}\left(\frac{j\beta r + 1}{r^2}\right) + e^{-j\beta r}\left(\frac{-j\beta r - 2}{r^3}\right)\right]\\[1em]
    &= \frac{\mu I \ell \sin\theta}{4\pi} e^{-j\beta r} \left[\frac{\beta^2 r^2 - 2j\beta r - 2}{r^3}\right]
\end{align*}$$

Substituting in we get

$$(\nabla \times H)_\theta = -\frac{\mu I \ell \sin\theta}{4\pi} e^{-j\beta r} \left[\frac{\beta^2 r^2 - j\beta r - 1}{r^3}\right]$$

At this point, we have (basically) fully characterized the $\mathbf{E}$ and $\mathbf{H}$ fields associated with a Hertzian dipole. We can clean up these expressions a little, applying the fact that $\beta = \frac{\omega}{c}$, $c = \sqrt{\mu \varepsilon}$, and characteristic impedance $\eta = \sqrt{\frac{\mu}{\epsilon}}$: then, $\frac{\mu}{\omega\varepsilon} = \frac{\eta}{\beta \varepsilon}$.

$$H_\phi = \frac{\mu I \ell \sin\theta}{4 \pi} e^{-j\beta r} \left(\frac{j\beta}{r} + \frac{1}{r^2}\right)$$

$$E_r = \frac{\eta}{\varepsilon} \cos\theta\frac{I \ell}{2 \pi}  e^{-j\beta r}\left(\frac{1}{r^2} - \frac{j}{\beta r^3}\right)$$

$$E_\theta = j \frac{\eta}{\varepsilon} \sin\theta \frac{I \ell}{4\pi} e^{-j\beta r} \left[\frac{\beta}{r} - \frac{j}{r^2} - \frac{1}{\beta r^3}\right]$$

As $r$ increases, terms with $1/r^3$ dependence vanish fastest, while those with $1/r$ dependence are the last to go; these terms dominate in the "far field". We can write out what $\mathbf{E}$ and $\mathbf{H}$ look like in this regime:

$$H_\phi = j\frac{\mu I \ell \sin\theta \beta}{4 \pi r} e^{-j\beta r}$$

$$E_\theta = j\frac{\eta}{\varepsilon}\frac{I \ell \sin\theta \beta}{4\pi r}e^{-j\beta r}$$

In the far-field radiation from a Hertzian dipole strongly resembles plane waves in free space: the electric field, magnetic field, and direction of propagation ($\vec{r}$) are all mutually orthogonal (this mode of propagation is called TEM). The electric and magnetic fields are also related by $\eta$: $\mathbf{H} = \hat{r} \times \eta^{-1} \mathbf{E}$.

# Radiation Parameters

How do we generically specify the radiation pattern of an antenna? We can start with the electric field, which probably has some angular dependence $F(\theta, \phi)$, and polarization $\hat{e}$:

$$\mathbf{E} = F(\theta, \phi) \hat{e} \left(\frac{e^{-jkr}}{r}\right)$$

The magnetic field can be found with

$$\mathbf{H} = \hat{r} \times \eta^{-1} \mathbf{E}$$

The power carried by the wave is given by the Poynting vector:

$$\mathbf{S} = \mathbf{E} \times \mathbf{H}$$

This value fluctuates with time; we are more interested in the time-averaged Poynting vector:

$$\mathbf{S}_\mathrm{av} = \frac12 \Re\{\mathbf{E} \times \mathbf{H}^*\}$$

After some light substitution, we can find $\mathbf{S}_\mathrm{av}$ in terms of the previous electric field parameters:

$$\mathbf{S}_\mathrm{av} = \hat{r} \frac{|F(\theta, \phi)|^2}{2\eta r^2}$$

Here, we see that we have recovered the famous inverse square law of radiation.

The power radiated by an antenna has units of $\mathrm{W}$; $\mathbf{S}_\mathrm{av}$, or irradiance, has units of $\mathrm{W}/\mathrm{m}^2$. We can go a step further and define the notion of radiation intensity, which is the amount of power radiated over a certain solid angle ($\mathrm{W}/\mathrm{sr}^2$). Radiation intensity is given by

$$U(\theta, \phi) = r^2 (\hat{r} \cdot \mathbf{S}_\mathrm{av})$$

The radiation intensity is directly related to $F$:

$$U(\theta, \phi) = \frac{|F(\theta, \phi)|^2}{2\eta}$$

The shape of $U$ is the radiation pattern of the antenna. The total radiated power can be recovered by integrating $U$ over the unit sphere.

Directivity is the ratio of the maximum and average radiation intensity; it tells us whether the antenna is highly directional (most energy focused in one singular direction) or not. It is a ratio, so therefore dimensionless, and often given in dB.

# Impedance Parameters

An antenna can be considered a one-port component with some frequency-dependent impedance. Some power is reflected at the tline-antenna interface; some is lost due to resistive losses in the antenna (zero if the antenna is considered to be made of PEC), and the rest is radiated out to space. From the perspective of the circuit, resistive loss and power radiated look the same; assuming the losses are negligible, we say that the antenna has some **radiation resistance**. It can be measured on a VNA; assuming no resistive losses, an antenna is functioning best when $S_{11}$ is minimized (most of the power going into the antenna isn't coming back).

The efficiency of an antenna is simply defined as power radiated divided by overall power input (power radiated plus power dissipated):

$$\eta = \frac{P_\mathrm{rad}}{P_\mathrm{rad} + P_\mathrm{loss}}$$

(annoyingly overloaded symbol)

## Directivity vs Gain

Directivity can be written in terms of power radiated:

$$D = \frac{4\pi U_\mathrm{max}}{P_\mathrm{rad}}$$

Gain is very similar to directivity, but it also takes account the radiation efficiency of the antenna:

$$G = \frac{4\pi U_\mathrm{max}}{P_\mathrm{rad} + P_\mathrm{loss}}$$
