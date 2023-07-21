A blogpost? In this economy?! Yes, that's right. Today, we're going to be looking at how you can use an unmodified digital camera to detect cosmic rays and other charged particles.

![four cosmic rays](title.png)

First, what *is* a cosmic ray? They're not actually rays; rather, they are high-energy particles, usually protons, that have traveled through space to Earth. Some come from the sun, while others may originate from more distance sources in our galaxy or even other galaxies.

The original particle is called the primary cosmic ray, and it almost never makes it to the surface. Instead, when it collides with atoms in the atmosphere, a shower of secondary particles is produced. These particles are the ones which we'll be detecting. 

To actually observe these particles, we'll be using a plain old digital camera. The silicon detector it uses to record the intensity of light is also sensitive to radiation; when charged particles pass through the sensor, electrons are ripped from the atoms of the photosites, producing charges that can be read out just like a regular image. This effect is sometimes seen as a white speckle pattern in photos of radioactive samples.

<figure style="max-width: 500px">
    <img src="rad-meme.jpg" alt="photo of radiation source with white dots">
    <figcaption>&#9835; Dumb ways to die, so many dumb ways to die... &#9835;</figcaption>
</figure>

Anyways, the procedure is very simple. Just put the lens cap on your camera, put it in a dark place with the sensor facing the zenith (straight up), and leave it to take some pictures. With a little luck, you'll be greeted by some cosmic ray tracks in your images when you come back!

A few words about camera settings:
- In theory, a shorter exposure length offers many advantages, such as increased temporal resolution and less time for dark current to accumulate. However, this comes at the cost of more data to process and more shutter wear. I settled for an exposure length of 1 minute.
- I used an ISO of 200, which corresponds to about unity gain (i.e. 1 electron equals 1 ADU) on my camera. ISO 100 would probably work well too. In general, a lower ISO is preferred since read noise is not a significant concern. 

One last tidbit: my camera, a Nikon D7000, applies some transformations to raw images such as black-point subtraction and channel scaling. This is great for regular photography, but it will screw up our data. Thankfully, there is a free [tool](https://nikonhacker.com/viewtopic.php?t=2319) that uses USB commands to disable these adjustments.

As a bonus, this hack will also make the camera include the optical black pixels in the saved image. These pixels reside on the edge of the sensor and are blocked from receiving any light. Normally, they are used to calibrate the sensor's black point and are cropped from the final image, but cosmic rays can pass right through the opaque layer. Thus, we actually gain a tiny bit of extra detector area. 

# Post-processing

I left my camera snapping away overnight, and woke up to 348 images. Let's open them up and take a look!

Upon first inspection, the images look totally black, which is hardly surprising. It's a picture taken with the lens cap on. What did you expect? 

If we crank up the exposure a lot, some patterns start to appear:

![hot pixels](hot-pixels.png)

Wow, are those all cosmic rays? *No.* If you open up another exposure and go to the same spot, you will see the exact same patterns.

What we're dealing with is hot pixels. Every photosite will spontaneously produce electrons even in the absence of light due to thermal fluctuations; this signal is known as *dark current*. For most pixels, this is contained at about 0.1 electrons per second. However, due to flawed manufacturing, some pixels exhibit much higher dark current than others, manifesting as hot pixels.

It can be difficult to distinguish a hot pixel from a cosmic ray using just one frame of data, so instead we analyze the value of a pixel across multiple frames to check for anomalies. Hot pixels will show a consistent value in every frame, while a genuine cosmic ray hit will stand out.

Before we can get to messing with the images, we must convert them to a format that our code can read. My camera outputs images in Nikon's proprietary NEF format, which is not very amenable to manipulation. Luckily, there's an open-source tool called [dcraw](https://www.dechifro.org/dcraw/) which will take our NEFs and produce [PGMs](https://en.wikipedia.org/wiki/Netpbm), which are basically just a short header followed by uncompressed pixel data.

If you are replicating my experiment, here is an example dcraw invocation:

```text
dcraw -4 -D *.NEF
```

* `-4`: output linear 16-bit values
* `-D`: output a grayscale image

These flags are very important. dcraw is designed to work with photographic data, so it will normally apply some adjustments to convert the raw data into a viewable image. For example, in order to record color, every photosite in the camera sensor is covered with a tinted filter in a [repeating pattern](https://en.wikipedia.org/wiki/Color_filter_array).

<figure style="max-width: 320px">
    <img src="bayer-matrix.png" alt="illustration of color filter array">
    <figcaption><a href="https://en.wikipedia.org/wiki/File:Bayer_pattern_on_sensor.svg">Image</a> by <a href="https://en.wikipedia.org/wiki/User:Cburnett">Cburnett</a> / <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.en">CC BY-SA</a></figcaption>
</figure>

dcraw will assign each pixel an (R,G,B) value by interpolating based on its neighbors, a process called [demosaicing](https://en.wikipedia.org/wiki/Demosaicing). However, the particles we're looking for aren't affected by the colored filters, so demosaicing will merely distort the data and thus must be avoided.

## Anomaly Detection

Disclaimer: my statistics knowledge pretty much peaked with AP Stats and has been going downhill since. So I'm pretty much spitballing here. Beware!

In the absence of cosmic rays, the only signal we expect to observe is the dark current, which varies randomly due to [shot noise](https://en.wikipedia.org/wiki/Shot_noise). Shot noise follows a Poisson distribution, approaching a normal distribution under our conditions.

![pixel value distribution showing bell curve](pixel-value-dist.png)

Normality is confirmed by a normal probability plot:

![normal probability plot showing linear distribution](normal-probability-plot.png)

Incidentally, I totally forgot how to do these, so I wrote a short explanatory [blogpost](/blogposts/normality-plot/) to refresh my memory.

Knowing all this, we can calculate a z-score for every sample, which essentially represents the number of standard deviations separating it from the mean. If this value is above a certain threshold, we mark the pixel in that frame as anomalous. I chose a cutoff of $z = 6$; theoretically, the odds of observing a value that extreme due to random variation alone are well below one in a billion. In reality, due to increasing dark current as the sensor heats up, the pixel values are not truly normally distributed and there will be occasional false positives.

In order to determine the z-scores, we must first compute the mean and standard deviation of each pixel. This turns out to be a bit problematic, since a na&iuml;ve algorithm requires all the values of the sample to be in memory. Unfortunately, the 11 GB of data we collected is a little too big for me to fit into memory. While there are [algorithms](https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance#Welford's_online_algorithm) capable of computing mean and variance one value at a time in a single pass, I opted to calculate the sample mean and then the sum of the squared differences. This has the benefit of allowing me to remove the value in consideration from the mean and variance, preventing outliers from distorting the sample statistics.

<aside>

This is done based on the assumption that there will never be more than one outlier per pixel, which is reasonable considering that there are 17 million pixels per frame.

</aside>

The two-pass solution is slower, but by saving the computed values to a file and reusing it in subsequent analysis the computational cost is [amortized](https://en.wikipedia.org/wiki/Amortized_analysis). <s>Also, I have an SSD, so none of this is really relevant.</s>

After identifying the anomalies, I grouped them into clusters by simply finding all other anomalies within a 16-pixel radius. This worked remarkably well, and allowed me to quickly find the most extensive cosmic ray patterns.

## Cooling

After collecting the first batch of data, I decided to do a little experiment. Recall that dark current is proportional to temperature. Therefore, by cooling the camera, we can significantly reduce the dark current level. I accomplished this by freezing my camera overnight.

<figure>
    <img src="camera-in-freezer.jpg" alt="camera, in ziploc bag, in freezer">
    <figcaption>Warning: not for consumption.</figcaption>
</figure>

We can see just how much cooling affects noise by comparing the distribution of pixel values. I raised the exposure time to 10 minutes while in the freezer, so the variance of the real noise level is 10x lower.

![histograms of pixels from warm and cold frames. warm bell curve is farther to right and more dispersed](dark-current-histogram.png)

That's quite a reduction! Not only does the signal level go down, the distribution also becomes less dispersed. This is explained by the statistical properties of shot noise: its standard deviation is equal to the square root of the event rate. This can be used to determine the gain of the sensor at a given ISO; more on this in an upcoming blogpost!

<aside>

The high pixel value of the particle tracks means that this mild improvement in noise doesn't increase the SNR much, so this experiment doesn't benefit much from cooling. It is a neat trick, though.

</aside>

# Results

At a confidence level of 6 sigma, I was left with 15,150 anomalous pixels and 2,083 clusters of at least size 2. The cosmic ray flux at sea level is about 1 muon/cm<sup>2</sup>/minute, so we should expect to have seen about 1,300 cosmic rays over the course of our experiment. This disparity can be explained by the fact that some of the particles may be of terrestrial origin (i.e. ambient radioactive decay).

Cluster size appears to follow an exponential distribution:

![cluster size histogram showing that larger sizes rapidly become more uncommon](cluster-size-distribution.png)

Graphs are nice, but I wanted to see some actual images. So, I wrote a short script that would extract each identified cluster from the image, find the difference betweeh the value of each pixel and its mean (to correct for hot pixels), and plot the result. I co-opted one of [ehtplot](https://github.com/liamedeiros/ehtplot)'s colormaps for this purpose. I also applied some gamma correction at $\gamma = 0.7$ to enhance feature visibility. 

Here are the long-awaited images:

![5x5 collage of cosmic rays](collage.png)

What are these particles? The curved particles ("worms") are most likely electrons; their low mass makes them easily deflected, hence the curved trajectories. These electrons are probably produced by Compton scattering of gamma rays emitted in the decay of naturally occuring radionuclides.

![curved electron path](worm.png)

The straight paths are most likely muons, produced by high-altitude air showers due to cosmic rays. 

![straight muon path](line.png)

Distinguishing between the two is hardly an exact science, so... take all of this with a grain of salt.

Here are some shots from the freezer dataset:

![worm track split into three parts](44._DSC3441.pgm.9.png)

![multiple particles](17._DSC3426.pgm.0.png)

This next one's interesting: there's a trail, but it's dark. I did a little digging and discovered the cause of this artifact: a particle track occurred at that spot  in another frame, and its influence on the mean was so significant that when we subtracted it from the pixels, the imprint of that other track was left behind.

![dark track](5._DSC3436.pgm.8.png)

In some frames, we see not just one track but multiple spots. It's very likely that all of these particles were produced in the same air shower.

![multiple particles](10._DSC3425.pgm.284.png)

![multiple particles](15._DSC3426.pgm.354.png)

# Closing Remarks

I had a *lot* of fun with this project, and I'm really glad that it turned out as well as it did! 

If you're interested in replicating my experiment, my code is available on [GitHub](https://github.com/adrian154/cosmic-ray-detector). Warning: this was all written in quite a rush, so it may take some prodding to get it working. If you have any questions please feel free to reach out or leave a comment. You can also download my processed data [here](data.zip).