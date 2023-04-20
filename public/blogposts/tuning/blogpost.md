You can tuna fish, but you can't tune a piano. Wait, what?

Okay, that's not quite true. You *can* tune a piano, but only approximately. It turns out that the mathematics behind the 12-tone scale used in most Western music hides some sinister secrets.

Let's start with the basics. Behind every key on a piano are 1&ndash;3 strings, which have been tensioned so that when the strings are struck they will ring out at a specific frequency. Each note is associated with a distinct frequency, and keys are arranged such that the pitch of the notes increases from left to right.

Of course, the burning question remains: how do we know what frequency to assign to each note? The answer to this is pretty nuanced, but luckily we get one freebie. Every tuning system requires us to start by assigning a specific frequency to an arbitrary key to use as a reference point; we call this the pitch standard. The most common pitch standard in modern times is A440, which sets the frequency of the first A above middle C to 440 Hz.

Now, let's do a little experiment. This is what it sounds like if I play A<sub>4</sub> on my piano.

<audio controls src="a4.mp3"></audio>

Ironically, my piano is pretty badly out of tune, but that doesn't matter for this demonstration. I can use [a bit of math](https://en.wikipedia.org/wiki/Fourier_transform) to take the sound and dissect it into the individual frequencies that make it up, kind of like how a prism can split light into its color components. Here is the resulting spectrum:

<figure>
    <img src="spectrum.png" alt="spectral power distribution of piano note">
    <figcaption>Disclaimer: the y-axis is a log scale.</figcaption>
</figure>

There's a big peak representing the main frequency, but there are also a bunch of extra peaks, which are known as overtones, or partials. The reason for their production has to do with the physics of string vibration. Essentially, a string that is fixed at both ends is limited to vibrating at integer multiples of its fundamental frequency. For example, in this case, we see additional peaks at 880 Hz, 1320 Hz, 1760 Hz, and so on. These patterns of vibration are called *resonant modes*, and collectively, they form the harmonic series.

When a string is struck or plucked, the resulting vibration contains many of these resonant modes, creating a complex spectrum like the one that we observed. The same phenomenon is actually exhibited by many other oscillating systems besides strings. For example, air in a tube is also confined to resonating at multiples of the tube's fundamental frequency. This is why, for a given fingering, a French horn player is restricted to playing notes within the harmonic series. 

When two tones from the harmonic series are played together, we generally perceive the result to be fairly pleasant, or *consonant* (as opposed to dissonant). While much of what we perceive to be harmonious is subjective and dependent on cultural context, it is true that our ears usually interpet notes which share a lot of overtones as more consonant. This phenomenon was known to many early musicians such as the Ancient Greeks, who went on to incorporate these intervals in their composition. Indeed, there is a widely circulated story recounting how Pythagoras was brought to this epiphany after listening to four blacksmiths striking anvils which produced tones of different pitches, though like most stories involving Pythagoras, there is no evidence that it actually happened.

Try it for yourself&mdash;click the Play button to hear the intervals formed by the harmonic series!

<button onclick="play()">Play</button>

<canvas id="harmonics" width="640" height="500"></canvas>

<script src="main.js"></script>

Okay, so we're making some real progress. We know from the [circle of fifths](https://en.wikipedia.org/wiki/Circle_of_fifths) that we can start from any note and advance in perfect fifths to cycle through the other 12 notes before returning to the starting note. This is the idea behind [Pythagorean tuning]().

If you actually try this, you will realize that it doesn't quite work. We saw in the previous demo that a perfect fifth is represented by a frequency ratio of 3:2. So if we multiply the frequency of a note by 3/2 twelve times, we would expect to come back to the same note a few octaves up. Yet (3/2)<sup>12</sup> is approximately 129.746, which is not a power of two!

The reason for this is mathematical. The square root of two is irrational, meaning that it is impossible to create it by multiplying together rational numbers (i.e. fractions of integers). In fact, pretty much all the intervals are *slightly* wrong. The problem becomes very apparent when you try to play chords using our accursed tuning system:

<button onclick="playChordPythagorean()">Play Chord</button>

The rapid warbling sound you hear is an acoustic phenomenon known as [beating](https://en.wikipedia.org/wiki/Beat_(acoustics)), which occurs when two tones that are slightly out of tune are played together. (This may be hard to hear without headphones). For reference, here's what the same chord sounds like if we calculate the frequency of the other two notes based on the root note times the frequency ratios we figured out earlier:

<button onclick="playChordPerfect()">Play Chord</button>

Essentially, the problem is that a note's exact frequency may vary depending on what interval it's in. This is less a problem if you play an instrument where you have full control over what pitch is being played, but on a piano, the frequencies of each note are fixed. Thus, it is impossible to tune a piano such that every interval remains pure. 

Well. What do we do, then?

# The "Solution"

Over the centuries, a littany of different tuning systems have been devised. Each system dealt with the unavoidable compromises of harmony in different ways to suit the needs of composers of their time, and in turn, their limitations influenced how music was written. However, in the modern era, one particular scheme has come to dominate music: **equal temperament**. Why "temperament"? I think [Wikipedia](https://en.wikipedia.org/wiki/Musical_temperament) provides an excellent, succinct definition:

> A temperament is a tuning system that slightly compromises the pure intervals of just intonation to meet other requirements.

Equal temperament does not use integer ratios. Instead, a semitone is defined to have a frequency ratio of the twelfth root of 2. This way, twelve semitones will produce a perfect octave every time. Here's what the chord from earlier sounds like under equal temperament:

<button onclick="playChordET()">Play Chord</button>

If you give it a listen, you might say: *I can still hear beating&mdash;what's the big idea?* You're right; under equal temperament, *every* interval besides the octave is a little bit impure. And given the existence of systems like [5-limit tuning](https://en.wikipedia.org/wiki/Five-limit_tuning), which minimizes the number of impure intervals, equal temperament seems like a waste of time, but it has an ace up its sleeve: equal temperament sounds acceptable when playing in any key, while most tuning systems based on just intonation become severely dissonant when playing in any key besides the one they're based on. This is a dealbreaker for modern music, which often makes use of modulation. Having to retune your piano every time you want to play in a different key is rather inconvenient!

<aside>

Of course, just intonation's shortcomings did not stop composers from incorporating key changes into their music. To accomodate these pieces, instrument makers often added extra keys that split enharmonically equivalent notes into multiple pitches. Check out this organ with 14 keys per octave:

<iframe class="yt-video" width="100%" src="https://www.youtube-nocookie.com/embed/7GhAuZH6phs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

</aside>

# Coda

The history of tuning systems and how their evolution shaped Western music is absolutely fascinating, and this article only scratches the surface. Here are some videos and articles (some of which I used as references while writing this post), in case you'd like to learn more.

Ethan Hein's [Tuning Is Hard](https://www.ethanhein.com/wp/2022/tuning-is-hard/) dives deep into the details of tuning with just intonation.

This video uses a digital keyboard to demonstrate the fundamental flaw of just intonation.

<iframe class="yt-video" width="100%" src="https://www.youtube-nocookie.com/embed/Yqa2Hbb_eIs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Remember how I claimed that tuning systems aren't as important for instruments that can change pitches on the fly? That's *mostly* true, but it's still impossible to play everything in perfect harmony. An Italian mathematician named Giambattista Benedetti demonstrated this phenomenon through a series of "puzzles"&mdash;repeating melodies whose pitch would become sharper and sharper if one attempted to play them using only pure intervals. Adam Neely made an excellent video on the subject:

<iframe class="yt-video" width="100%" src="https://www.youtube-nocookie.com/embed/TYhPAbsIqA8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Bach may have composed *The Well-Tempered Clavier* to demonstrate how [well temperament](https://en.wikipedia.org/wiki/Well_temperament) (a class of tuning systems that would eventually give rise to equal temperament) enabled music written in any key to sound good. Here is a performance of the first prelude in three different temperaments, accompanied by some very enlightening explanation of each tuning system.

<iframe class="yt-video" width="100%" src="https://www.youtube-nocookie.com/embed/kRui9apjWAY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Finally, MinutePhysics made a video seven years ago which first introduced me to the mathematical problems faced by tuning and inspired this article.

<iframe class="yt-video" width="100%" src="https://www.youtube-nocookie.com/embed/1Hqm0dYKUx4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Also, [music numbers](https://www.youtube.com/watch?v=HXLltEn4O5E).