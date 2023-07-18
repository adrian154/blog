One of [DEFCON](https://en.wikipedia.org/wiki/DEF_CON)'s most fascinating traditions is the badges&mdash;little electronic circuits you wear around your neck that do cool things. Every year, the convention has an official badge given to all attendees, but there are also dozens of unofficial ones created by individuals. This year will mark my second DEFCON, and this time, I wanted to have my own cool gadget to show off. So I set out to design and build my own badge.

After a little bit of shuffling through eBay, I found this cheap pulse oximeter. Basically, it's a sensor that detects the concentration of oxygen dissolved in your bloodstream by shining red and infrared light through part of your body (e.g. a finger) and measuring how much light is absorbed.

Here's the big idea. Most of the oxygen in human blood is bound to hemoglobin, forming oxyhemoglobin or HbO<sub>2</sub>. Oxyhemoglobin has a different absorption spectra compared to deoxygenated hemoglobin; this explains why your extremities turn purple when their blood supply is cut off. Oxygen saturation is defined as the percentage of hemoglobin which is oxygenated, or

$$\frac{C_{\mathrm{HbO}_2}}{C_{\mathrm{HbO}_2} + C_\mathrm{Hb}}$$

There are other forms of hemoglobin, but unless you're actively suffering from carbon monoxide poisoning or other unlikely conditions, their contribution is negligible.

Concentration and absorption are related by the [Beer-Lambert law](https://en.wikipedia.org/wiki/Beer%E2%80%93Lambert_law):

$$A = \varepsilon \ell c$$

where $A$ is the absorbance, $\varepsilon$ is the absorptivity of the species, $\ell$ is the path length, and $c$ is the concentration of the species. Furthermore, the intensity of the received light decays exponentially with increasing absorbance, so 

$$\frac{I}{I_0} = e^{-A}$$

Of course, our measurements will include absorption from a variety of sources. 