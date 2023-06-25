I am a big fan of 3D text reaction images. If you are unfamiliar with this class of reaction images, here is one of the progenitors of the family:

<figure style="max-width: 400px">
    <img src="original.png" alt='3D render of text that reads "GAY SEX"'>
    <figcaption>3D render of text that reads "GAY SEX" &mdash; <a href="https://twitter.com/GlitchyPSI">@GlitchyPSI</a></figcaption>
</figure>

My sense of humor might be a little broken.

Anyways, I like making stuff to do with 3D graphics, so I decided to recreate this meme from scratch. That means writing code to generate the model, and then creating a pathtracer to render that model using realistic lighting. Let's dive in.

# The Model

Let's begin by building a 3D model of the scene. There are existing tools for generating meshes from text like [Text2STL](https://text2stl.mestres.fr/en-us/generator), but I opted to create my own solution so I could fine-tune the parameters.

Right now, our goal is to convert each character into a list of points representing the outline. A good place to start is [opentype.js](https://opentype.js.org/), which takes a string and turns it into an SVG path. This frees us from decoding the font files, handling things like kerning, etc. Even *I* have limits :^)

Feeding "GAY SEX" and a copy of the Impact font file into opentype.js leaves us with a list of commands that looks like this:

```json
[
    {"type":"M","x":225.078125,"y":126.5234375},
    {"type":"L","x":225.078125,"y":140.1953125},
    {"type":"L","x":142.8515625,"y":140.1953125},
    {"type":"L","x":142.8515625,"y":111.484375},
    {"type":"Q","x1":142.8515625,"y1":84.3359375,"x":140.5078125,"y":77.5},
    {"type":"Q","x1":138.1640625,"y1":70.6640625,"x":129.375,"y":70.6640625},
    {"type":"L","x":129.375,"y":70.6640625},
    {"type":"Q","x1":121.7578125,"y1":70.6640625,"x":119.0234375,"y":76.5234375},
    {"type":"Q","x1":116.2890625,"y1":82.3828125,"x":116.2890625,"y":106.6015625},
    ...
]
```

The meaning of each command is determined by the `type` field. For Impact, we need to deal with four key commands:

- `M`: begin a new path starting at (x, y)
- `L`: draw a straight line from the previous position to (x, y)
- `Q`: draw a B&eacute;zier curve to (x, y) with a control point at (x1, y1)
- `Z`: close the path

Most of these commands are pretty trivial, except for `Q`. I didn't really know how B&eacute;zier curves worked, so I replaced them with straight lines on my initial attempt. Here's what the result looks like:

![text rendered without bezier curve](no-interpolation.png)

Not *terrible*, but it's rather jagged. Let's fix this.

A B&eacute;zier curve, simply put, is a way of defining a smooth curve using a control point in addition to a starting and ending point. Impact uses quadratic B&eacute;zier curves, which are created by tracing a point on an imaginary line that spans between the lines connecting the two anchor points to the control point. It's a rather tricky concept to put into words, frankly, so here's a widget demonstrating the concept that you can interact with.

<canvas id="bezier-demo" style="width: 100%"></canvas>
<input type="range" id="bezier-t" style="width: 100%" min="0" max="100" step="1">  

<script src="bezier.js">