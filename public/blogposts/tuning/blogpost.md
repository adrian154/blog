You can tuna fish, but you can't tune a piano. Wait, what?

Okay, that's not quite true. You *can* tune a piano, but only approximately. It turns out that the mathematics behind the 12-tone scale used in most Western music hides some sinister secrets.

Let's start with the basics. Behind every key on a piano are 1&ndash;3 strings, which have been tensioned so that when the strings are struck they will ring out at a specific frequency. Each note is associated with a distinct frequency, and keys are arranged such that the pitch of the notes increases from left to right.

Of course, the burning question remains: how do we know what frequency to assign to each note? The answer to this is pretty nuanced, but luckily we get one freebie. Every tuning system starts by assigning a specific frequency to an arbitrary key to use as a reference point; we call this the pitch standard. The most common pitch standard in modern times is A440, which sets the frequency of the first A above middle C to 440 Hz.

Now, let's do a little experiment. This is what it sounds like if I play A<sub>4</sub> on my piano.

<audio controls src="a4.mp3"></audio>

Ironically, my piano is pretty badly out of tune, but that doesn't matter for this demonstration. I can use [a bit of math](https://en.wikipedia.org/wiki/Fourier_transform) to take the sound and dissect it into the individual frequencies that make it up, kind of like how a prism can split light into its color components. Here is the resulting spectrum:

<figure>
    <img src="spectrum.png" alt="spectral power distribution of piano note">
    <figcaption>Disclaimer: the y-axis is a log scale.</figcaption>
</figure>

There's a big peak representing the main frequency, but there are also a bunch of extra peaks, which are known as overtones or partials. The reason for their production has to do with the physics of string vibration. Essentially, a string that is fixed at both ends is limited to vibrating at integer multiples of its fundamental frequency; these patterns of vibration are called *resonant modes*. Together, these modes form the harmonic series.

When a string is struck or plucked, the resulting vibration contains multiple of these resonant modes, creating a complex spectrum like the one that we observed. The same phenomenon is actualy exhibited by many other oscillating systems besides strings. For example, air in a tube is also confined to resonating at multiples of the tube's fundamental frequency. This is why, for a given fingering, a French horn player is restricted to playing notes within the harmonic series. 

When two tones from the harmonic series are played together, we generally perceive the result to be very pleasant, or *consonant* (as opposed to dissonant). While much of what we perceive to be harmonious is subjective and dependent on cultural context, it is true that our ears usally interpet notes which share a lot of overtones as consonant. This phenomenon was known to many early musicians who went on to influence later composing practices, such as the Ancient Greeks, who assigned names to these intervals. Indeed, there is a widely circulated story recounting how Pythagoras was brought to this epiphany after listening to four blacksmiths striking anvils which produced tones of different pitches, though like most stories involving Pythagoras, it is probably apocryphal.

Try it for yourself&mdash;click the Play button to hear the intervals formed by the harmonic series!

<button onclick="play()">Play</button>

<canvas id="harmonics" width="640" height="500"></canvas>

<script src="main.js"></script>

Okay, so we're making some real progress. We know from the [circle of fifths](https://en.wikipedia.org/wiki/Circle_of_fifths) that we can start from any note and advance in perfect fifths to cycle through the other 12 notes before returning to the starting note. Success! Right?

Well, right off the bat, it's clear to see that something is wrong. We saw in the previous demo that a perfect fifth is represented by a frequency ratio of 3:2. So if we multiply the frequency of a note by 3/2 twelve times, we would expect to come back to the same note a few octaves up. Yet $\left(\frac32\right)^{12}$ is approximately $129.746$, which is not a power of two!

Mathematically astute readers might have seen this coming. The square root of two is irrational, meaning that it is impossible to create it by multiplying together rational numbers (i.e. fractions of integers). In fact, pretty much all the intervals are slightly wrong. 

The problem becomes very apparent when you try to play chords using our accursed tuning system:

<button onclick="playChordJust()">Play Chord</button>

The rapid warbling sound you hear is an acoustic phenomenon known as [beating](https://en.wikipedia.org/wiki/Beat_(acoustics)), which occurs when two tones are slightly out of tune. For reference, here's what the same chord sounds like if we calculate the frequency of the other two notes based on the root note times the frequency ratios we figured out earlier:

<button onclick="playChordPerfect()">Play Chord</button>

Essentially, the problem is that a note's exact frequency may vary depending on what interval it's in. This isn't a problem if you play an instrument where you have full control over what pitch is being played, but on a piano, the frequencies of each note are fixed. Thus, it is impossible to tune a piano such that every interval remains pure. 

Well. What do we do, then?

# Further Reading (Watching?)

https://www.youtube.com/watch?v=TYhPAbsIqA8

https://www.youtube.com/watch?v=1Hqm0dYKUx4

https://www.ethanhein.com/wp/2022/tuning-is-hard/