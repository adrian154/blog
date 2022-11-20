Optimally solving a Rubik's cube is a computationally challenging problem. Over 43 quintillion different states can be reached by simply scrambling the cube; for reference, this is an order of magnitude greater than the number of grains of sand on Earth. Quickly finding the shortest path from one of these states to the goal state requires some cleverness.

Let's start by taking apart the cube to see what really makes it tick. We see that the cube consists of a central structure, to which the six center pieces are attached. There are also 12 edge pieces and 8 corner pieces. Because the center pieces can't move, we only need to keep track of the position and orientation of the edge pieces.

Using this information, we can start building an abstract representation of the cube. Each corner piece can be in 1 of 8 positions, and 1 of 3 orientations. Likewise, each edge piece can be in 1 of 8 positions, and 1 of 2 orientations. Putting these together, we get 

$$12! \times 2^{12} \times 8! \times 3^8 = 519,024,039,293,878,272,000$$

But wait, this number is clearly larger than the 43 quintillion we cited earlier. What gives?

Well, it turns out that of all the ways you can assemble a cube from the pieces, only 1 in 12 can be solved. Let's take a second to understand why this is the case.

# The Laws of the Cube

Suppose we decided to keep track of the position of the cube's pieces by assigning a number 1&ndash;20 to each one and putting them in a list. Every time we apply a turn to the cube, we update the position of the pieces by swapping some of the elements in this list. Mathematically speaking, this structure would be a permutation, since the order matters (unlike a combination) and each value only occurs once.

If you sketch it out, it's not too hard to see that any quarter turn swaps three corner pieces and three edges, making for six swaps in total. This is important; the laws of combinatorics tells us that if you have a permutation created by doing an even number of swaps, it is impossible to create that same permutation through an odd number of swaps, meaning that we can classify every permutation as having even or odd parity. Half of all possible permutations have odd parity; those states could never be solved because the parity of the cube is always even.

<figure style="max-width: 200px">
    <img src="unsolvable-permutation.png" alt="unsolvable Rubiks' cube; two edges have been swapped">
    <figcaption>This cube is not solvable; only 1 swap has been applied to it, so its parity is odd.</figcaption>
</figure>

It doesn't really make sense to put the edge and corner pieces in the same permutation, however, since edges and corners occupy physically different positions. Therefore, let's think of the cube as two permutations, one for edges and one for corners, instead of one big permutation. The parity of these permutations is not necessarily always even, since we're applying three swaps at a time, so we have to restate our restriction: the parity of the corners must be equal to the parity of the edges.

So far, we've eliminated half of all possible states. Edge orientation and corner orientation place some further constraints on solvability that bring us down to that magic 1/12th from earlier.

## Edge Orientation

Every edge can be in one of two orientations, which we'll call $0$ and $1$. We only need to adjust edge orientation for turns along one axis, so we adopt the convention used by speedsolving (B/F turns). It's easy to see that in this frame of reference, L/R and U/D turns do not change edge orientation, giving rise to "good edges" (which can be solved using only $\braket{L, R, U, D, F^2, B^2}$) and "bad edges". Every move that affects EO flips an even number of edges, so the sum of the edges' orientation must always be even. This halves the number of solveable states, leaving only 1/4th solveable.

## Corner Orientation

Like edges, not all corner orientation cases are solveable. However, things are a little more complicated because corners have three possible orientations.