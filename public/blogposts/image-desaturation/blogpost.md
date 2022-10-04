Have you ever uploaded an image to Reddit or Discord, only to find that the preview was noticeable desaturated from the original?

It's not just you. In this article, I'll be exploring the technical reason for why this happens, and how you can avoid it.

# What's going wrong?

Ultimately, this issue arises when your image is improperly converted from one color space to another; in my case, Adobe RGB is usually the culprit. Most decent photo editing tools (like Photoshop) will include the appropriate ICC color profile in the saved image, so everything will appear normal at first. The mangling occurs when you upload that image to a site that's not equipped to deal with non-sRGB images, which proceeds to directly dump those Adobe RGB values into a new file, now devoid of color profile metadata, all while neglecting to perform a proper conversion between color spaces.

Here's an example of this very process in action. Suppose I have this picture, which I've adjusted and imported into Photoshop as 16-bit Adobe RGB.

<img style="max-width: 500px" src="properly-converted.jpg" alt="an example image (two markers being thrown up into the air), showing vibrant colors">

I'm so excited about this shot that I immediately save the file as JPEG and send it to my friends over Discord, only to find that it now looks like... this.

<img style="max-width: 500px" src="improperly-converted.jpg" alt="the same image, now washed out and yucky">

It still looks *fine*, but the color quality is markedly diminished compared to the original. This happens because the Adobe RGB gamut spans a wider range of colors than sRGB, so directly reinterpreting Adobe RGB values as sRGB will result in desaturation.

The steps you need to prevent this from happening strongly depend on what your workflow looks like, but for most amateur photographers like me you generally have two good options:

- Work in Adobe RGB and convert to sRGB before saving your final copy. In Photoshop, you can do this by going to <kbd>Edit</kbd> &rarr; <kbd>Convert to Profile</kbd> and selecting sRGB.

- Import your RAW files as sRGB, and you won't have to worry about any of this stuff. The disadvantage is that the sRGB gamut may be smaller than what is supported by the media you plan on displaying the final product on (be that screen or print), resulting in lost color quality. 

# Further Reading

* [Ken Rockwell - sRGB vs Adobe RGB](https://www.kenrockwell.com/tech/adobe-rgb.htm)