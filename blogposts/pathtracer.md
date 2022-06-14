It's that time of year again, where I begin yet another ill-advised venture into computer graphics. Hooray!

Today, we're going to be creating a renderer based on a technique known as pathtracing. You may have heard the terms "pathtracing" and "raytracing" thrown around an awful lot recently, and with good reason; pathtracing is one of the simplest yet most robust methods for rendering photorealistic images. Let's explore how they work.

# Raytracing

What even **is** raytracing? Recall that the geometric definition of a ray is basically half of a line; it starts at a point, and extends infinitely in one direction. To trace a ray means to determine where it hits the objects in your scene. 

From here, we can imagine how raytracing could be used to render a 3D scene. Consider how a pinhole camera works in real life:

![diagram of how a pinhole camera forms an image](resources/pathtracer/pinhole-camera.png)

We can determine where the light hitting each point on the rear surface of the camera (the image plane) came from, because it had to have come through the pinhole. If we consider the pinhole to be extremely small (i.e. a point), we can draw a ray starting from the image plane and going through the pinhole into the scene.

The algorithm used in a raytracer is very similar; however, we don't want the image to be inverted, so we do things a little differently. In a raytracer, we place the image in front of the camera point. The color of each point in the image can then be determined by tracing a ray starting from the camera point through the point in the image into the scene, and performing some shading calculations.

**TODO**: illustration of raytracing algorithm

This is what sets raytracing apart from other rendering algorithms, because a raytracer doesn't need to actually know anything about how the geometry in the scene is represented; it only cares about where rays intersect with surfaces in the scene. This allows raytracers to simulate effects like the reflection from a smooth mirror effortlessly; if a ray hits a mirror, simply trace another ray starting from the hit point. However, such a feat is much more difficult for conventional rendering algorithms like rasterization. Rasterization works by representing every surface in the scene as many connected polygons (usually triangles), which are rendered by transforming the 3D points into screen coordinates and then filling the resulting region on screen according to some shading algorithm. How to support perfect reflections in such an algorithm is less than obvious. Developers have to resort to tricks such as [reflection mapping](https://en.wikipedia.org/wiki/Reflection_mapping), which generally yield less-than-optimal results and require much more artist input.

At this point, you may be wondering why everyone hasn't abandoned rasterization for raytracing if it's so much better. Unfortunately, raytracing is *slooowwww*. Let's say we want to use raytracing to render a scene at 1920x1080 resolution and 60 FPS. We would need to trace at least 124 million rays per second, which means determining which triangle (if any) out of potentially millions in the scene which the ray intersects with. And this is already the best case scenario; for realistic lighting effects, the number of rays traced per pixel may be much higher. It's no surprise that only now are we seeing limited use of raytracing techniques in video games.

However, if you're making an animated movie, the importance of rendering quickly is considerably diminished. Sure, faster turnaround might be nice, but raytracing can render effects that are simply impossible for rasterization-based techniques. For these reasons, raytracing dominates in the domain of *offline rendering* (i.e. rendering images that are not displayed immediately, unlike realtime rendering). Big studios like Pixar have [embraced](https://graphics.pixar.com/library/PathTracedMovies/paper.pdf) pathtracing as the method of choice for next-generation photorealistic graphics.1