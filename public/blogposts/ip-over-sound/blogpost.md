A couple months ago, I wrote a [blogpost](/blogposts/internet-explained/) giving a basic overview of the technologies behind the Internet, starting from the physical layer. In that post, I briefly touched on the challenges faced by WiFi transceivers&mdash;specifically, coordinating transmissions between devices to ensure that only one device is transmitting on the channel at a time. I likened the problem to what happens when multiple people try to have a conversation in the same room, which got me thinking: what if we did just that? What if I wrote a program that allowed two computers to communicate through their speaker and microphone?

Transmitting digital data over an analog channel designed for audio is hardly a novel idea. Older readers may recall that once upon a time, the most prevalent manner of accessing the Internet was through dialup, where two modems communicate through the telephone system. (Are you feeling old? You should be.)

Speaking of which, what even is a modem? Well, *modem* is actually an abbreviation for *modulator-demodulator*. Essentially, what we are going to be doing is implementing a modem in software.

Before we start, let's establish what the hardware we are dealing with is capable of. Most microphones sample at a rate of 44,100 Hz, meaning that the computer measures the level of the analog signal coming from the microphone 44,100 times per second. Why this number? Well, according to the [Nyquist-Shannon sampling theorem](https://en.wikipedia.org/wiki/Nyquist%E2%80%93Shannon_sampling_theorem), the maximum frequency that can be captured is equal to half the sampling rate. Half of 44.1 kHz is around 22 kHz, which happens to be approximately the highest frequency that a normal human ear can detect.

The actual bit rate which our channel can support is given by the [Shannon-Hartley theorem](https://en.wikipedia.org/wiki/Shannon%E2%80%93Hartley_theorem):

<div class="indented">

$$C = B \log_2\left(1 + \frac{S}{N}\right)$$

where
* $C = $ bits per second
* $B = $ bandwidth of the channel
* $S = $ signal power
* $N = $ noise power

</div>

As you can see, as noise ($N$) goes towards zero the bitrate approaches infinity. The idea is that with less noise, we can measure the level of the channel more precisely. For example, if the chnanel has 1 part in 100 of noise, we could measure the level of the channel in increments of $2^6=64$ without worrying about noise causing an incorrect measurement. This would allow us to transmit 6 bits per Hz&hellip; theoretically. In reality, we have to worry about things like synchronization and decoding, preventing us from ever reaching that theoretical maximum.

# Modulation

The fundamental problem we are dealing with is how to convert a digital signal to an analog one in a way that allows us to reliably recover the digital signal even in the presence of noise and latency. Thankfully, smarter people than me have already put a great deal of effort into attacking this problem, so I have literally centuries of telephony to build off of.

TODO: Implement and discuss PSK.