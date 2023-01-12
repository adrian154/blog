Optimally solving a Rubik's cube is a computationally challenging problem. The puzzle can exist in over 43 quintillion distinct states; for reference, that's an order of magnitude greater than the number of grains of sand on Earth. Quickly finding the shortest path from one of these states to the goal state requires some cleverness.

Before we even start concerning ourselves with solving the cube, let's take it apart to get an idea of how it *really* works.

<figure style="max-width: 400px">
    <img src="disassembled.jpg" alt="partially disassembled cube">
    <figcaption>For those interested, the pictured cube is a MoYu RS3 M 2021.</figcaption>
</figure>

Upon disassembling the cube, we see that it is *not* composed of smaller cubes. Rather, it is made up of edge pieces and corner pieces, rotating around a fixed skeleton (to which the center pieces are attached). Broadly speaking, our goal becomes to put each piece on the 
correct position and facing the correct direction.

# Thinking with Cubies

*The moving pieces that comprise a Rubik's cube are referred to as "cubies" in the literature.*

Using this information, we can start building an abstract representation of the cube based on its mechanical properties. We can store the position of each corner/edge cubie using arrays of length 8 and 12, respectively. However, this is not enough to represent the entire cube. We still need to keep track of the orientation of each cubie, which requires us to establish some arbitrary conventions.

## Corner Orientation

We'll start with corner orientation. Corner cubies will always reside in either the top or bottom layer of the cube. As a consequence, every corner will have a white or yellow sticker, which we can use as a point of reference. We'll say that if this sticker is facing up/down in the cubie's current position, the corner has an orientation of $0$. If the sticker is to the right of its natural position, a clockwise twist, the corner has an orientation of $1$. And finally, if the corner is left of its natural position, a counterclockwise twist, the corner has an orientation of $2$.

## Edge Orientation

Like corner orientation, we will stick with the strategy of assigning an arbitrary sticker on each edge cubie to serve as a reference. For the pieces in the top/bottom layers, we will use the white/yellow stickers. This leaves us with the four edges in the E-slice; for these, we will treat the stickers on the front or rear face as the point of reference. This gives each edge cubie two possible orientations: $0$ if the key sticker is facing one of the faces which we have chosen to use as references, or $1$ if the edge is facing the other way.

If you are an intermediate speedcuber, you likely already have some degree of familiarity with the concept of edge orientation, because EO has some implications for speedsolving. Specifically, an oriented edge can be solved (put into the correct position with the correct orientation) using only the moves $\braket{L, R, U, D, F^2, B^2}$. This property is quite useful because it allows many parts of the solve to be completed without rotations of the entire cube, making the ability to recognize and control edge orientation invaluable for speedcubers.

Using this information, we can calculate the number of total possible cubes:

$$\underbrace{12! \times 2^{12}}_\text{edges} \times \underbrace{8! \times 3^8}_\text{corners} = 519,024,039,293,878,272,000$$

Wait a moment. This number is considerably bigger than the 43 quintillion figure we cited earlier; exactly 12 times greater, to be exact. What gives? Well, it turns out that just because we can *physically* put together the pieces in a certain configuration doesn't mean that we can reach that state by applying moves to a solved cube. It behooves us to understand the conditions which determine what states can be solved.

# The Laws of the Cube

For a second, let's ignore orientation and think only about permutation. Suppose we kept track of the position of each cubie using a list of numbers $1$ through $20$. (This scheme is a tad stupid&mdash;a corner can never occupy a position normally occupied by an edge&mdash;but bear with me.) Mathematically, this list would be a permutation, since each value occurs exactly once.

Permutations have an interesting property called parity. Just like integers, every permutation can be classified as odd or even. Even permutations can only be obtained by performing an even number of swaps, and vice versa for odd permutations.

When the cube is solved, we say that it has even parity, because zero swaps have been performed. Furthermore, a quarter turn can be expressed as six swaps, meaning that the overall parity of the cube will always be even. This eliminates **half** of all possible states: positions with odd parity will always remain odd no matter what moves we apply to it, so the cube can never be solved.

Further reductions in the number of solvable states are explained by the rules surrounding corner and edge orientation.

## EO Rules

TODO

## CO Rules

TODO

# The Search Algorithm

Now that we have thoroughly explored the practical details of representing the cube, we can start thinking about how we're actually going to find an optimal solution.

For starters, we can recognize that optimally solving a Rubik's cube is a graph search problem. Each possible state is a vertex in the graph, with the edges between vertices representing moves that transform one state into another. 

If we treat this graph as a tree rooted in the initial state, we could traverse the tree in breadth-first fashion until we found a path to the goal state. However, all solutions of this type suffer from impractical space or time requirements. At any point, there are 18 distinct moves that we can apply to the cube&mdash;6 faces times three different degrees of turning (clockwise, 180&deg;, and counterclockwise). This causes the number of positions to grow exponentially with depth.

We can bring down the branching factor with some simple optimizations, as outlined by Richard Korf in his seminal 1997 paper on optimally solving the cube:

> Since twisting the same face twice in a row is redundant, ruling out such
moves reduces the branching factor to 15 after the first move. Furthermore, twists of opposite faces of the cube are independent and commutative. For example, twisting the front face, then twisting the back face, leads to
the same state as performing the same twists in the opposite order. Thus, for each pair of opposite faces we arbitrarily chose an order, and forbid moves that twist the two faces consecutively in the opposite order. This results in a search tree with an asymptotic branching factor of about 13.34847. 

&hellip;but even with this reduced branching factor, searching the entire tree is still much too slow. 

We can improve upon our existing method with a bidirectional search. By searching from both the goal state and the initial state until a connection is found between the two frontiers, we would only need to search to half the length of the optimal solution, which is much more feasible. 

This still isn't *quite* within our reach; the median optimal solution length is 18 TBC

# Exploiting Symmetry

Here's a bit of an experiment that you can try if you happen to own two or more cubes. Let's say we apply some sequence of scrambling moves to both cubes, except we hold them in different initial orientations. Take a look at the two cubes&mdash;notice anything about them?

![picture of symmetric cubes](symmetry.jpg)

These two states are indisputably *different*, but clearly they are functionally identical&mdash;we can recolor the faces on one cube to turn it into the other one. Intuitively, these two cubes must also require the same number of moves to be solved, meaning that there's no point in storing entries for both in our pruning table.

The potential for gains here is pretty huge. Each state can have up to 48 symmetry-equivalent siblings (24 possible orientations, times two because we can mirror the scramble). Most states *do* have 48 symmetry equivalents, although some have less because they remain unchanged under reflection/rotation. The most extreme example of this is the solved cube; it has no symmetry equivalents besides itself because it looks the same from every angle.

Another useful tidbit is the fact that the *inverse* of a position is always at the same distance as the position itself. This lets us perform two pruning lookups and take the maximum as the value of the heuristic, allowing us to prune more.