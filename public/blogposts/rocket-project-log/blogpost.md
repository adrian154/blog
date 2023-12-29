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

# 2023 Dec 28: Preliminary Calculations

Since this is meant to be an educational project, I thought it would be fun to do my own combustion analysis and compare the results produced by RPA and NASA's CEA.

Our input parameters are the same in all cases:
- 1 kN thrust 
- 1 atm ambient pressure
- 20 bar chamber pressure
- Ethanol/LOX fuel, O/F ratio 1.0&ndash;2.0

(Disclaimer: the chamber pressure of 20 bar is picked arbitrarily for the sake of this exercise.)

We know that the thrust produced is equal to

$$F = \dot{m}v_e$$

where 
* $\dot{m}$ is mass flow rate
* $v_e$ is the effective exhaust velocity

The [isentropic nozzle flow](https://en.wikipedia.org/wiki/Isentropic_nozzle_flow) equations enable us to determine the gas conditions (temperature, pressure, velocity) at any position along the flow. However, to use these equations, we need to know the temperature and ratio of specific heats $\gamma$ of the gas entering the nozzle. Both of these values will depend on the combustion process. 

Once we know these two values, we can calculate the exhaust velocity of the nozzle, as well as the exit-to-throat area ratio. From there we can determine the necessary mass flow rate to reach our target thrust using the first equation, as well as the actual dimensions of the nozzle and chamber.

(divergence loss)

(shifting equilibrium)

