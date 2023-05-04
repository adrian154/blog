

I had a spare [RockPi S](https://wiki.radxa.com/RockpiS) lying around from a previous project, so I decided to use it for my prototype. The first part to arrive was a little LCD screen, so I decided to try and get that working first. This turned out to be quite a painful experience that led me down a dark corridor full of footguns and bear-traps. (I'm a total n00b when it comes to electronics and embedded development, so a lot of the inconvenience I encountered was really due to me blindly stumbling around out of ignorance. Please forgive me.)

At first, things look pretty cut and dry. The screen uses SPI, which is perfect because the RockPi has two SPI buses, so all we need to do is connect a couple things and watch everything come to life. Wait&mdash;according to the pinout there's three buses, actually. The SCLK and CS pins for SPI0 aren't labeled, though, so I guess we're gonna go with SPI1.

Next challenge: there are a few extra pins that are driven by GPIO. No biggie, I can just edit the GPIO numbers in the vendor code. Surely this will work. Right?

Things are looking pretty good so far. I decided it was time to download the code for the test program (and install a compiler while I'm at it), but unfortunately, the board's WiFi is pretty abysmal. Like, 1 kB/s level of suck. I can't transfer the code from my computer, either, because I had to sacrifice the front panel ports of my PC to fit a new graphics card, meaning that I only have two functioning ports that are already occupied by my keyboard and mouse. So I decide to move everything to the living room so I can run Ethernet from the router. Barely an hour into the project and I'm already on the floor, not a good sign!

Time to run the test program and&mdash;oops, forgot to enable spidev. Thankfully it's pretty easy, we just need to edit uEnv.txt. (The device tree overlay docs claim that the chip only has *one* SPI bus for some reason.) Reboot, aaaaand&hellip; now the kernel won't run!

Some research confirms my stupid mistake: I forgot to remove the uart0 overlay, which uses the same pins and thus can't be enabled at the same time. But there's a bit of a complication. As a Windows user, I can't really mount the ext3-formatted boot partition to fix my mistake. So I dig out an old spare laptop which is busy running Ubuntu Server, and of course it doesn't have a MicroSD slot, so it's time to turn the house upside down looking for an adapter.

Finally, I find an adapter in an old pile of cables. I spring into action, plugging it into the laptop and mounting the boot partition at record speed, and&mdash;wait a minute, read only?? Why?! I take out the MicroSD adapter, only to realize that the f\*\*\*ing read lock has broken off, rendering it permanently read-only.

*Sigh*. I can feel my inner Luddite violently protesting.

Remarkably, a broken read lock can be fixed by simply jamming some tinfoil into the empty slot where it once was. I can now remount the card, fix my mistakes, and finally run the damn test program.

Of course, the screen doesn't work. No smoke, though, and at least the backlight comes on. At this point I'm not really sure what's wrong, besides the fact that data is clearly not making it to the screen. After a bit of fruitless tinkering, I bite the bullet and buy a cheap logic analyzer so I can observe what's actually going on over the SPI bus.

TBC...