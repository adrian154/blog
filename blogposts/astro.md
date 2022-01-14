A couple nights ago I decided to do some astrophotography. I had the opportunity to use a rather nice [90mm macro lens](https://www.tamron.jp/en/product/lenses/f017.html) by Tamron, and since it's got a longer focal length than anything else I own (besides the 300mm zoom lens, which my puny tracker can't handle anyways) as well as fairly wide aperture, I decided to see what kind of images it could produce.

Admittedly, my technique is by far the limiting step throughout all of this. The whole experience was hindered by my relative inexperience:
* I'm not very good at achieving a good focus, so the stars are a little blobby right off the bat. (I should really get around to making or buying a focusing mask.)
* I calibrated the image using the usual trifecta (dark, flat, and bias). However, putting the lens cap on to take the dark frames caused it to immediately fog up; not a problem, but evidently it screwed up my light frame since there's a dark spot in the middle of the image caused by a mote of dust. I'm not 100% sure if it was the fog that did it, or whether I even applied the light frames while stacking, but oh well.
* I don't have an external intervalometer, so I am limited to my camera's built-in maximum of 30-second exposures. Not that I have  much of a choice, since I'm not very good at polar alignment either, so pushing my subs past 30 seconds would probably introduce ridiculous tracking error.

But enough self-deprecation, here's the gory details.
* **Gear**
	* iOptron Skyguider Pro
	* Nikon D7000
	* Tamron 90mm macro lens
* **Capture**
	* 120 light frames, 30 second exposure time, f/3.5 at ISO 200
	* dark, flat, and bias frames
* **Processing**
	* Stacked in DeepSkyStacker
	* Stretched in Photoshop

And the final result...

![the unstretched image](static/images/astro-unstretched.jpg)

OK, not much to look at, because that's before any post-processing in Photoshop. Here's the final result, after much fiddling with sliders and cropping.

![final](static/images/orion.jpg)

I'm actually pretty proud of this result. It's probably my best astrophoto. (Hardly impressive, but we all start somewhere.) That being said, there are a couple issues that irk me a ltitle:
* The core is rather bright and dangerously close to clipping.
* The star coloring is a little odd, though as I write this blogpost I've gotten much more used to it.

I've been rather interested in examining how my [processing workflow](http://www.markshelley.co.uk/Astronomy/Processing/ACR_Critique/acr_critique.html) may be mangling the colors in my images, so here are the results of my own tinkerings. First, I reprocessed my stacked data from that outing, this time making sure to only apply adjustments to all channels instead of manually balancing the color until it looks good. Here's a comparison shot.

![reprocessed](static/images/astro-comparison.jpg)

Yes, the one on the right is a little washed out and the noise is especially apparent, but that's not important for what I am investigating. I proceeded to pick the color from a specific location in both images. The values I got were (6501, 5248, 6222) and (27740, 26994, 27590). Now, in theory, the ratio between these values should be the same, but they're not. Clearly, if preserving the original colors of your image is important to you, you cannot rely on Photoshop's levels/curves adjustments.