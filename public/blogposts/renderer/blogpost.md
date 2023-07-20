I am a big fan of 3D text reaction images. This is one of my favorites:

<figure style="max-width: 400px">
    <img src="original.png" alt='3D render of text that reads "GAY SEX"'>
    <figcaption>3D render of text that reads "GAY SEX" &mdash; <a href="https://twitter.com/GlitchyPSI">@GlitchyPSI</a></figcaption>
</figure>

My sense of humor might be a little broken.

Anyways, I also like doing 3D graphics stuff, so I decided to recreate this meme from scratch. That means writing code to generate the model, and then creating a pathtracer to render that model using realistic lighting. Let's see how I did it. 

# The Model

We will begin by building a 3D model of the scene. There are existing tools for generating meshes from text like [Text2STL](https://text2stl.mestres.fr/en-us/generator), but I opted to create my own solution so I could fine-tune the parameters.

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

A B&eacute;zier curve, simply put, is a way of defining a smooth curve using a control point in addition to a starting and ending point. Impact uses quadratic B&eacute;zier curves, which are created by tracing a point on an imaginary line that spans between the lines connecting the two anchor points to the control point. Frankly, it's a rather tricky concept to put into words, so here's a widget demonstrating the concept that you can interact with.

<canvas id="bezier-demo" style="width: 100%"></canvas>
<input type="range" id="bezier-t" style="width: 100%" min="0" max="100" step="1">  

Mathematically, a B&eacute;zier curve is a parametric function, mapping a scalar input we call $t$ to 2D points along a path. We can obtain the point for a given $t$ value by first determining the coordinates of the points defining the blue line (obtained by linearly interpolating along the lines between the anchor points and the control points), and then linearly interpolating between those two points to get the point on the curve. Here is a rather crude implementation in JavaScript:

```js
const lerp = (x1, x2, t) => x1 + (x2 - x1) * t;

const quadCurve = (x0, y0, cx, cy, x1, y1, t) => [
    lerp(lerp(x0, cx, t), lerp(cx, x1, t), t),
    lerp(lerp(y0, cy, t), lerp(cy, y1, t), t)
];
```

We can apply this to our opentype.js output by evaluating `quadCurve` at regular intervals of $t$ for every quadratic curve in the path, which yields the following discretization:

![text rendered with naive evaluation of bezier curve](t-param.png)

The lines are smooth now, but the points are distributed unevenly. For example, look at the inner curves of the S. There are *way* too many points in those areas, much more than what's necessary to create the illusion of a smooth, continuous curve. These excess points will increase the complexity of our model and slow down our renderer. We can try reducing the amount of times we sample the curve for each segment, but this ends up leaving the larger curve segments with a jagged appearance.

The problem is that the relationship between $t$ and the length of the curve up to $t$ is not linear, so our points are not spaced at regular intervals along the curve. We could solve this if we had a function that mapped arc length to $t$-values. For quadratic B&eacute;zier curves, a closed-form expression for arc length *does* exist, but it's rather&hellip; unwieldy:

<figure>
    <img src="arclen-expression.png" alt="https://gamedev.stackexchange.com/a/6019/98873">
    <figcaption><a href="https://gamedev.stackexchange.com/a/6019/98873">@robert - Bezier curve arc length</a></figcaption>
</figure>

Luckily, there's an easier way. We can approximate the arc length function by evaluating the curve at regular intervals of $t$, recording the total length of the segments up to that point, and inverting the function. The code looks something like this:

```js
const tToDist = new Array(32);
let totLen = 0, prevPointX = null, prevPointY = null;

for(let i = 0; i < tToDist.length; i++) {
    const [x, y] = quadCurve(lastX, lastY, command.x1, command.y1, command.x, command.y, i / tToDist.length)
    if(i == 0) {
        tToDist[i] = 0;
    } else {
        totLen += Math.sqrt((x-prevPointX)**2 + (y-prevPointY)**2);
        tToDist[i] = totLen;
    }
    prevPointX = x;
    prevPointY = y;
}

const distToT = dist => {
    let i = 0; 
    while(tToDist[i] < dist) {
        i++;
    }
    return (dist - tToDist[i - 1]) / ((tToDist[i] - tToDist[i - 1]) * tToDist.length) + (i - 1) / tToDist.length;
};
```

In `distToT`, we simply use linear interpolation to find the approximate value of $t$ that lies at an arc length of `dist` on the curve. Armed with `distToT`, we can sample the curve at even intervals of arc length rather than $t$. This simple scheme yields pretty good results:

!["GAY SEX", bezier curves evaluated with arc length parameter](arclen-param.png)

Much better.

Now, all that's left is for us to convert our 2D outlines into a 3D model. The preferred representation for 3D objects in computer graphics is a *polygon mesh*, which is just a thin surface defined by a collection of polygons (usually triangles). We will be storing our mesh as an array of 3D points, followed by a list of triangles whose vertices are provided as indices into the array  of points. This allows us to take advantage of the fact that the same vertex is usually shared by multiple triangles to reduce memory usage.

Building the side walls of our text is pretty simple. We basically extrude our outlines into 3D surfaces by copying the points, shifting them to however thick we want our text to be, then connecting them to the front points with triangles. 

<figure>
    <img src="extruded.png" alt='gay sex in glorious 3D'>
    <figcaption>GAY SEX, now in glorious 3D. I wrote a quick <a href="https://en.wikipedia.org/wiki/Wavefront_.obj_file">OBJ</a> exporter so I could view the results in Windows' 3D viewer, but we won't be using that format in our actual renderer.</figcaption>
</figure>

Now, we just need to fill in the front and back of our 3D text, meaning that we must [triangulate](https://en.wikipedia.org/wiki/Polygon_triangulation) each letter. This is actually kind of tricky, especially when the letters have holes in them. Let's start by identifying which paths are holes, and which paths they are cutting holes in. Our text only has one hole (in the "A"), but I chose to implement a general solution in order to accomodate other strings.

<script src="bezier.js"></script>