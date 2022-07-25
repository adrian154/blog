Recently, I set out to create my own photo organizer, a project which eventually bloomed into [Photobox](https://github.com/adrian154/photobox). In doing so, I came across a great deal of mucking about with image formats and compression, and then it dawned on me: JPEGs are ridiculously good at compressing image data, far beyond what seems possible! Take this picture, for example:

![a test image](/blogposts/jpeg-explained/test-compressed.jpg)

*This poor cormorant has no idea what he's about to go through.*

This image is 597 by 800 pixels. Each pixel consists of three components, red, green, and blue. The brightness of each component is encoded as an 8-bit value, where 0 is no light emitted and 2^8 - 1 = 255 is the maximum brithness your display can muster. So, each pixel contains at least three bytes of information. Multiply that by the number of pixels, and we get a file size of around 359 kilobytes! Yet the image shown above is actually only 43kB in size, just 12% of the value we just calculated. In other words, by encoding the image using the JPEG format, we can achieve a compression ratio of roughly 8:1. This is possible because most images (especially photographs) contain a lot of redundant info. JPEG uses various clever encoding tricks to eliminate unimportant data from an image while producing a virtually indistinguishable output. How? Let's find out.

# Chroma Subsampling

The first method that JPEG uses to reduce the filesize is a technique called **chroma subsampling**. Essentially, this step exploits the fact that our eyes are much more sensitive to changes in brightness than to changes in color. After all, changes in brightness are how we perceive shapes and features. If you converted an image to black and white, you would still have a good idea of what the image is a picture of, whereas if you only had the color information it'd convey much less detail. If we stored the color information at a lower resolution than the brightness information, it could reduce the size of the image without noticeably degrading the quality.

RGB isn't very conducive to chroma subsampling, though, because the brightness of the pixel is baked into all three channels. JPEG first converts the RGB pixel data to a color space called [YCbCr](https://en.wikipedia.org/wiki/YCbCr). Like RGB, YCbCr pixels also consist of three values; however, the meaning of the values are different. **Y** is the luminance (brightness) of the pixel, and **Cb** and **Cr** together represent the color of the pixel without any luminance info.

But how is RGB mapped to YCbCr? In my opinion, the relationship between the two color spaces is best explained visually. We can imagine RGB as a cube, with *x*-axis as red, *y*-axis as green, and *z*-axis as blue.

<video class="center" loop controls autoplay><source src="/blogposts/jpeg-explained/rgb-cube-animation.mp4" type="video/mp4"></video>

This cube has one important property: there exists a line through the cube where the R, G, and B values are all equal. One can imagine a coordinate system where we align the cube such that the luminance component (Y) extends along this line. We can then extract a slice of the cube for any given luminance, and assign the remaining two degrees of freedom to Cb and Cr.

This is essentially how YCbCr works, except the RGB values are first processed so that the cube ends up looking more like a slanted rectangular prism. (For the more math-inclined readers, you might recognize this as an affine transformation, hence why the RGB-YCbCr conversion is often described in terms of matrix multiplication). Here's a demo that shows the Cb-Cr planes as we adjust Y. 

<figure style="max-width: 480px">
    <video loop controls autoplay><source src="/blogposts/jpeg-explained/ycbcr-slices.mp4" type="video/mp4"></video>
    <figcaption>No, that Y is definitely not backwards.</figcaption>
</figure>

If you want a better view of what the Cb-Cr plane looks like, here is a labeled diagram rendered at Y = 0.5. 

![ycbcr diagram](/blogposts/jpeg-explained/ycbcr.png)

When an image is converted to JPEG, the first thing that happens is that the RGB colors are converted to YCbCr. The Cb and Cr channels are stored at half the resolution of the full image, a scheme which is referred to as **4:2:0**.

Let's compare what the components of the image look like in the two color spaces. Here's what the image looks like in RGB.

![rgb components of the image](/blogposts/jpeg-explained/rgb-components.png)

And here's what the image looks like in YCbCr:

![image in ycbcr color space](/blogposts/jpeg-explained/ycbcr-components.png)

As you can see, the importance of the luminance channel really shines through here. There is very little appreciable detail in the Cb and Cr channels, unlike in RGB space, where each channel is perceived (roughly) equally in the final image. We can safely discard much of the detail in the chrominance channels without sacrificing too much quality in the final image. However, this still doesn't bring us to the astounding compression ratios that JPEG achieves on a regular basis. For that, we'll need to go deeper into the compression process.

# Discrete Cosine Transform

In the previous step, we reduced size by getting rid of color information. However, we can also drastically reduce size by getting rid of unnecessary *spatial* information. What does that mean? Consider this photo of a flower.

![macro photograph of a pepper flower](/blogposts/jpeg-explained/test-2-reference.png)

If we zoom in close on the two highlighted regions, it becomes clear that not all image data is created equal. The one on the left contains much more information than the one on the right, yet they occupy the same amount of space.
 
![zoom in on sections of flower image](/blogposts/jpeg-explained/flower-regions-comparison.png)

Like last time, the problem now becomes representing the image data in a way that lets us separate the important parts from the unimportant parts. JPEG accomplishes this using the **discrete cosine transform (DCT)**.

Before we jump into compressing image data, let's establish the basics of DCT using simpler one-dimensional functions. Let's say I have the following signal:

<canvas id="signal-only"></canvas>

If you've ever heard of the Fourier transform, you know that we can express this signal as the sum of multiple sine waves with different frequencies. We can do that with cosines, too.

/*To understand the discrete cosine transform, we need to start thinking in the frequency domain.*/

## The Frequency Domain

TODO: Fourier Transform
* what goes into a circle?
* relationship b/t vectors (re/im) -> circle
* adding vectors, representing shapes
* how the transform works
* (maybe) DFT?
* harmonic analysis
* holy shit

## DCT in 2D



# Huffman Coding

TODO

# Further Reading

* [ITU - T.871: JPEG File Interchange Format (JFIF)](https://www.itu.int/rec/T-REC-T.871-201105-I/en)
* [CCITT - T.81: Digital Compression and Coding of Continuous-Tone Still Images - Requirements and Guidelines](https://www.w3.org/Graphics/JPEG/itu-t81.pdf)