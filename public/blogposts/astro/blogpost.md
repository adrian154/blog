As an amateur astrophotographer, I find deep-sky objects to be some of the most rewarding targets to capture. They display a stunning range of colors and structures that exemplify the beauty of the cosmos. Their characteristics also require highly unique imaging and processing techniques, presenting a challenge that I find very engaging.

So&hellip; what *is* a deep sky object, exactly? Broadly speaking, "DSO" encompasses everything outside of the Solar System (besides individual stars). This category includes objects such as star clusters, nebulae, and galaxies. DSOs vary wildly in apparent size, but they generally have one thing in common: they are very faint, meaning that very long exposures are necessary to fully bring out their details.

The requirement for long exposure time brings us to another major obstacle: Earth is constantly rotating, causing the position of objects in the sky to constantly change! If we don't correct for this, all our images would be ruined by what is essentially extreme motion blur, not to mention the fact that the target would drift out of frame within minutes. Therefore, we must account for this motion by rotating our imaging setup along the *polar axis* against Earth's rotation. This is accomplished by attaching our camera to  an [equatorial mount](https://en.wikipedia.org/wiki/Equatorial_mount).

Alas, tiny deviations in our mount's alignment are inevitable, which will show up as trailing in long exposures. This sets an upper limit on how long of an exposure we can take. To overcome this limitation, we'll take multiple exposures and combine them, in a process called *stacking*. Using many exposures also allows us to detect and exclude satellite trails from the final image.

Today, we will be focusing on the stacking and postprocessing part of DSO astrophotography. We will be writing code to align, stack, and adjust the raw data to yield a beautiful image.

# Aberrations and Calibration

Here's what it looks like if we lightly process one of the raw files straight out of the camera:

*TODO-Lightly processed image*

Okay, it looks kinda cool, but there are also some obvious issues with this image. First, there's a pretty strong vignette. Also, see those dark spots? Those are the result of dust particles on the sensor. Not pretty.

Handling these problems is not that hard, surprisingly. The trick is to take a reference picture of a uniform white field (what astrophotographers call a *flat frame*) to characterize the non-uniformity of the optical system.

*TODO-The flat frame*

If we normalize these values and divide the image by the flat frame, we get this:

*TODO-Corrected image*

Look&mdash;the vignette and dust particles are practically gone! Now, let's turn our attention to the finer details.

# All About Noise

*TODO-Zoomed in noise shot*

Astrophotographers hate nothing more than noise (except maybe light pollution or clouds). In order to effectively combat noise, we need a good understanding of the physical processes that give rise to noise.



# Alignment and Stacking 

# Post-processing

