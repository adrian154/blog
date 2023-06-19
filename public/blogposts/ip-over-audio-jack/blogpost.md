As a certified zoomer, I'm in an interesting age group where I was technically alive during the age of dialup, but too young to have any clear memories of it. I *do* remember re-discovering it when I was older, and being absolutely fascinated by the idea of audible data transmission. My fixation with dialup never really went away, so in today's post I'll be describing my adventures in developing a software-based modem that enables two computers to transmit data over an audio cable.

For the uninitiated, dialup was the way most netizens connected their computers to the Internet up to the early 2000s. You would connect a small device called a modem to the phone line, and it would communicate with your internet service provider over the phone system. Now, obviously, the phone system was designed to transmit human voices, not digital data. The modem's job was to convert the bits and bytes coming from the computer into waveforms that could be sent over the phone and vice versa. This was what I wanted to recreate.

If you have ever used dialup, you may remember it as being pretty slow. That's because the bandwidth of phone lines were extremely limited; most can only carry frequencies up to 4 kHz, which is enough to reproduce a human voice but not much else. Despite this, engineers were able to squeeze an astonishing amount of capacity from such a limited channel! By 1996, modems were able to communicate at 33.6 kbit/s using purely analog modulation, close to the [theoretical maximum](https://en.wikipedia.org/wiki/Noisy-channel_coding_theorem) data rate that could be achieved. Accomplishing this feat required the use of numerous signal processing techniques, some of which we will be utilizing for our own system.

For comparison, the channel we're working with has vastly superior specifications, and thus should be capable of sustaining much greater bitrates. My computer's audio is sampled at 48 kHz (versus telephone's 8 kHz), and is subject to much less noise and interference since the other device is just meters away. Given that we have all these luxuries, I made it my goal to at least do better than dialup.

# TX: Modulation

So&hellip; how do we actually turn a bitstream into an audio signal?



# RX: Demodulation

# Implementation