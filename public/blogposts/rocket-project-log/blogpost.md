# 2023 Dec 25: Initial Thoughts

I want to build a pump-fed bipropellant rocket! Why? Because not many people have done it, mainly. Tons of amateurs have fired solid rocket motors, not many have built liquid-fueled engines, and even fewer have ventured outside the realm of pressure-fed systems.

The pumps will probably be driven by electric motors. I think trying to design a turbopump will push this project into the realm of implausibility.

A pump-fed arrangement has many advantages for a flight vehicle (lighter tanks since they don’t need to hold pressure, possibility of running at a higher chamber pressure, simpler vehicle operations since there are no high pressures at rest), but trying to design a flight-capable engine will only add more complexity to an already difficult project. That can come later.

Ultimate goals: pump-fed, regeneratively cooled engine with a thrust of 1 kN.

The best fuel/oxidizer will be determined primarily by availability and safety. For those reasons, I am thinking ethanol and liquid oxygen. Both are fairly easy to obtain, not especially toxic, and less dangerous to handle compared to other fuels, while still offering decent performance. It’s also a very well characterized combo with a long history of use in both professional and amateur engines.

(Some more background on my thought process while deciding fuel/ox combo: first, oxidizers are realistically limited to liquid oxygen and nitrous oxide. Nitrous oxide is self-pressurizing, but since our goal is to have our tanks at ambient pressure, it loses its advantage over liquid oxygen. So we will be dealing with at least one cryogenic propellant; let’s not have two! This limits our fuels to substances that are liquid at room temperature, so really just the alcohols and kerosene. These are both still viable options, but I have a preference for ethanol since it burns cooler and is probably more consistent than kerosene since it’s a pure substance.)

Things that need to be figured out, roughly ordered by dependency:
* basic chamber properties (pressure, mass flow rate, nozzle dimensions)
* how will the chamber be cooled
* injector design
* cryogenic plumbing, especially the valves
* pump design
* geometry (impeller and volute)
* sealing
* fabrication of everything
* igniter and test stand
* (further iteration depending on results of tests)

There is also the possibility of adapting an off-the-shelf pump for use in the system. This seems more viable for the fuel pump, since I suspect there probably aren’t any affordable pumps matching our requirements that can operate at cryogenic temperatures. Need to investigate.

It might be a good idea to develop the thrust chamber first. Then we can approach pump design in a more informed manner, since we’ll have real pressure drop and flow measurements to work from. The thrust chamber can be tested using a pressure-fed setup before the pumps are ready. Need to investigate how hydrostatic testing of the thrust chamber + injector assembly could be done.

Biggest hurdles I anticipate:
* Chamber cooling. This is probably the most important challenge to overcome. Options include film cooling, regenerative cooling, and ablative cooling. Ablative cooling is undoubtedly the easiest option but seems cumbersome to work with, and I would rather not. The other two options would be very difficult to design and manufacture. Finding out that cooling was insufficient during a hot fire would be suboptimal, so good analysis is crucial.
* Pump design. Will most likely be a centrifugal pump. Must produce sufficient flow at design pressure without leaks. Must be reliable. Must be able to fabricate the design using available facilities. Cryogenic seals may prove to be very difficult. Also, achieving good efficiency may be challenging. Cavitation could be an issue. Impeller will need to be balanced, this may be difficult.
* Injector design. Must provide good mixing and atomization without creating hotspots which could lead to thrust chamber failure. Injector pressure drop directly influences pump specifications. Manufacturability will be a very important factor. I think it will probably end up being a pintle or impinging-jet design.

Instrumentation will probably include pressure transducers, temperature gauges, and of course the load cell to measure thrust. I don’t foresee DAQ being a huge problem.

With regards to control, the most non-trivial part is probably the pumps. I am not sure if this will require closed-loop control.

This is all very ambitious, but I figure that it can be done with some persistence. So let’s see!

Some other people’s projects that I’m taking inspiration from:
* [250 lbf regeneratively cooled chamber by Robert Watzlavick](https://www.watzlavick.com/robert/rocket/regenChamber3/index.html)
* [50 lbf rocket build log by Jared Brewer](https://liquidrocketproject.blogspot.com/)
* [300 lbf pump-fed keralox engine by Ben Juenger](https://www.speedwayspaceproject.space/)
* [1 kN pump-fed ethalox engine by Yuchong Li](https://www.kechuang.org/u/426/profile/timeline)

# 2023 Dec 26: Nerdsniped

Spent the day patching RPA to remove the free trial limitations, even though this was *absolutely* not necessary. It took an unreasonably long time because I am pretty lousy at reverse engineering, although I guess I learned a lot about Qt's internals and also got to use x64dbg for the first time. It's not even December 26th anymore. I'm going to bed.

# 2023 Dec 29: Preliminary Calculations

Okay, so I'm going to exposit a little about basic rocketry since I feel like that's a good way to strengthen your understanding of a subject. (If you are reading this, I highly highly recommend reading Sutton's *Rocket Propulsion Elements*! It covers these topics in a very approachable way without cutting corners.)

A rocket produces thrust by expelling matter (exhaust) against the desired direction of motion, which produces an equal and opposite reaction force as predicted by Newton's third law. The stuff we are exhausting is known as the *reaction mass*.

For a chemical rocket all the reaction mass is carried onboard, so the impulse (total momentum change) delivered to the vehicle is equal to that mass times the exhaust velocity. Furthermore, we know that $F = \frac{dp}{dt}$, so the thrust is given by

$$F = \dot{m}v_e$$

where 
* $\dot{m}$ is mass flow rate
* $v_e$ is the effective exhaust velocity

We control mass flow rate, which is equal to the rate of fuel/oxidizer flow into the chamber, so the quantity of interest is the exhaust velocity. In order to maximize the impulse delivered to our rocket, we want the highest possible exhaust velocity.

When we combust fuel and oxidizer together in a confined environment (like the thrust chamber), the result is a high-temperature gas. Conversion of the thermal energy of the gas to kinetic energy is accomplished through a [converging-diverging nozzle](https://en.wikipedia.org/wiki/De_Laval_nozzle).

In order to analyze the flow in our rocket, we're going to make a few simplifying assumptions (see part 3.1 of Sutton):

* The exhaust is homogenous, gaseous, and obeys the perfect gas law
* There is no heat transfer between the exhaust and the environment
* There are no shocks in the exhaust
* The gas properties are uniform across any "slice" normal to the nozzle axis (quasi-1D)
* The composition of the exhaust does not change within the nozzle

This type of flow is known as [isentropic nozzle flow](https://en.wikipedia.org/wiki/Isentropic_nozzle_flow), and it has the useful property that the gas conditions at any two positions along the flow are related by a few simple equations. So, if we know the conditions at one position, we can calculate the conditions anywhere else. In addition, we also get an equation describing the ideal exhaust velocity:

$$v = \sqrt{\frac{2\gamma R T_c}{(\gamma - 1)M} \left[1 - \left(\frac{p_e}{p_c}\right)^{\frac{\gamma-1}\gamma}\right]}$$

where

* $v$ is exhaust velocity
* $\gamma$ is the ratio of specific heats
* $R$ is the universal gas constant
* $T_c$ is the chamber temperature
* $M$ is the exhaust molecular mass
* $p_e$ is the exit pressure 
* $p_c$ is the chamber pressure

Usually, we specify the chamber pressure $p_c$ as a design parameter. $\gamma$ and $M$ depend on the composition of the combustion products, and similarly $T_c$ is determined by the thermochemical properties of our fuel/oxidizer.

Knowing all this, we can get a rough idea of how the sizing process will go:

* Inputs: thrust, chamber pressure, ambient pressure, oxidizer/fuel properties and ratio
* Determine $\gamma$, $M$, $T_c$ using combustion model
* Compute nozzle throat/exit area ratio using isentropic flow equations
* Compute necessary mass flow rate and throat area
* Determine chamber dimensions using characteristic length and other rules of thumb (more on this later)

Since this is meant to be an educational project, I thought it would be fun to do my own combustion analysis and compare the results to those produced by existing solvers (RPA and NASA's CEA).

