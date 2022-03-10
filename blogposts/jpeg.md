Recently, I set out to create my own photo organizer, a project which eventually bloomed into [Photobox](https://github.com/adrian154/photobox). In doing so, I came across a great deal of mucking about with image formats and compression, and then it dawned on me: JPEGs are ridiculously good at compressing image data, far beyond what seems possible! Take this picture, for example:

![a test image](resources/jpeg/test-compressed.jpg)

*This poor cormorant has no idea what he's about to go through.*

This image is 597 by 800 pixels. Each pixel consists of three components, red, green, and blue. The brightness of each component is encoded as an 8-bit value, where 0 is no light emitted and 2^8 - 1 = 255 is the maximum brithness your display can muster. So, each pixel contains at least three bytes of information. Multiply that by the number of pixels, and we get a file size of around 359 kilobytes! Yet the image shown above is actually only 43kB in size, just 12% of the value we just calculated. In other words, by encoding the image using the JPEG format, we can achieve a compression ratio of roughly 8:1. Part of this is because JPEG is **lossy**, meaning the compressed image is slightly degraded compared to the original image, but in most situations this loss in quality is virtually imperceptible. How is this possible? Let's find out.

# Chroma Subsampling

The first method that JPEG uses to reduce the filesize is a technique called **chroma subsampling**. Essentially, this step exploits the fact that our eyes are much more sensitive to changes in brightness than to changes in color. After all, changes in brightness are how we perceive shapes and features. If you converted an image to black and white, you would still have a good idea of what the image is a picture of, whereas if you only had the color information it'd convey much less detail. If we stored the color information at a lower resolution than the brightness information, it could reduce the size of the image without noticeably degrading the quality.

RGB isn't very conducive to chroma subsampling, though, because the brightness of the pixel is baked into all three channels. JPEG first converts the RGB pixel data to a color space called [YCbCr](https://en.wikipedia.org/wiki/YCbCr). Like RGB, YCbCr pixels also consist of three values; however, the meaning of the values are different. **Y** is the luminance (brightness) of the pixel, and **Cb** and **Cr** together represent the color of the pixel without any luminance info.

But how is RGB mapped to YCbCr? In my opinion, the relationship between the two color spaces is best explained visually. We can imagine RGB as a cube, with *x*-axis as red, *y*-axis as green, and *z*-axis as blue.

<video class="center" loop controls autoplay><source src="resources/jpeg/rgb-cube-animation.mp4" type="video/mp4"></video>

This cube has one important property: there exists a line through the cube where the R, G, and B values are all equal. We can treat the luminance component (Y) as representing distance along this axis. Now, for a given Y, we can take a slice of the cube and assign the remaining two degrees of freedom to Cb and Cr, respectively.

This is essentially how YCbCr works, except the RGB values are first processed so that the cube ends up looking more like a slanted rectangular prism. For the more math-inclined readers, you might recognize this as an affine transformation, hence why the RGB-YCbCr conversion is generally described using matrix multiplication. This variation is necessary to ensure that all the "slices" are rectangular. Here's a demo that shows the Cb/Cr planes as we adjust Y. 

<video class="center" loop controls autoplay><source src="resources/jpeg/ycbcr-slices.mp4" type="video/mp4"></video>

*No, that Y is definitely not backwards.*

Here's what the CbCr plane looks like at Y=0.5:

![ycbcr diagram](resources/jpeg/ycbcr.png)

When an image is converted to JPEG, the first thing that happens is that the RGB colors are converted to YCbCr. The Cb and Cr channels are stored at half the resolution of the full image.

Let's compare what the components of the image look like in the two color spaces. Here's what the image looks like in RGB.

![rgb components of the image](resources/jpeg/rgb-components.jpg)

And here's what the image looks like in YCbCr:

![image in ycbcr color space](resources/jpeg/cormorant-ycbcr.jpg)

Note that unlike the RGB components, you can't just add Y, Cb, and Cr together and expect it to look like the original imgae.