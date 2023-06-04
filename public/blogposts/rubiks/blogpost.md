For most people, solving a Rubik's cube alone is a virtually impossible task. That's hardly surprising&mdash;the humble puzzle can exist in over 43 quintillion states (an order of magnitude greater than the number of grains of sand on Earth!). Yet in just a few hours, you can train yourself to solve *every one* of those configurations using some basic intuition and a little bit of memorization. From here, the challenge becomes solving the cube quickly. 

However, there is an even greater challenge than solving the cube in the shortest time: finding an **optimal** solution, i.e. the shortest sequence of moves that will solve the cube. This feat is essentially impossible for us mere mortals; we'll have to turn to computers if we want to solve this problem.

Before we even start concerning ourselves with solving the cube, let's take it apart to get an idea of how it *really* works.

<figure style="max-width: 1080px">
    <img src="disassembled.jpg" alt="partially disassembled cube">
    <figcaption>Disassembled MoYu RS3 M 2021</figcaption>
</figure>

Upon disassembling the cube, we see that it is *not* composed of smaller cubes. Rather, it is made up of edge pieces and corner pieces, rotating around a fixed skeleton to which the immobile center pieces are attached. Broadly speaking, our goal is to put each piece (or "cubie", in cuber notation) on the correct position and in the correct orientation.

## A Quick Guide to Notation

For those not familiar, the notation used by cubers to express moves on the cube is quite simple. Each move consists of a letter representing the face being turned (**U**p, **D**own, **L**eft, **R**ight, **F**ront, or **B**ack).

After this letter, there may be a symbol indicating how much to turn. An unembellished letter is taken to mean a clockwise 90&deg; turn, a "2" indicates a 180&deg; turn, and an apostrophe (read as "prime", a convention taken from mathematics) signifies a counterclockwise 90&deg; turn.

# Thinking with Cubies

Now that we have some insight on the inner workings of the cube, we can start building an abstract representation of the puzzle that our solver can work with.  We can use an array of size 8 to record which corner piece occupies which corner slot, and do the same for the 12 edges. However, the cubies can also be in different orientations, which we must keep track of. This requires us to establish some conventions.

## Corner Orientation

Each corner has three possible orientations. We call the default orientation the piece has in its solved position $0$. Twisting the piece clockwise yields an orientation of $1$, and another clockwise twist gives an orientation of $2$. Three twists of the corner brings us back to the starting position.

<img src="corner-orientation.png" style="max-width: 400px" alt="twisting of one corner">

That' fine and dandy if all we're doing is twisting a corner in place, but actual moves also change the position of the pieces. How do we define a corner's orientation when it's not in its original spot?

The key observation is that a corner cubie will always be in either the top (white) or the bottom (yellow) layer. If it's in its original layer, nothing changes; U and D moves don't affect corner orientation. If it's in the opposite layer, we pretend that the white sticker is yellow (or vice versa). Therefore, if the white sticker is facing down, the corner orientation is $0$. Thus, double moves do not affect corner orientation.

## Edge Orientation

If you are a cuber, you may be familiar with the concept of edge orientation. However, we actually use a slightly different edge orientation convention than the one most speedsolvers are accustomed to, for reasons that will be explained later in the article. Here's how it works.

Each edge has two stickers; we pick one of them to be the "key sticker". For the edges in the slice sandwiched between the front and back layers, the key sticker is white/yellow; for edges between the top and bottom layers, we choose red/orange, and the edges between the left and right layers use green/blue.

To determine the orientation of an edge, we check if its key sticker is facing the same way as the key sticker of the edge that occupies that spot when the cube is solved. The orientation of the edge is $0$ if it's facing the same way, and $1$ if it isn't.

<img src="edge-orientation.png" style="max-width: 300px" alt="flipping of an edge">

If that doesn't make any sense, consider a practical example. Let's look at the white-orange edge on a solved cube. The key sticker of this edge is white. If we do an L move, the edge moves to the spot that was once occupied by the orange-green edge. The white sticker is *not* facing orange, so the edge's orientation is now $1$. From this, you can deduce that any quarter turn will flip the orientation of all affected edges, while a double turn will not affect edge orientation.

Using this information, we can create a structure to represent a cube.

```c
struct Cube {
    uint8_t corners[8];
    uint8_t corner_twist[8];
    uint8_t edges[12];
    uint8_t edge_flip[12];
};
```

We can also calculate the number of possible cubes:

$$\underbrace{12! \times 2^{12}}_\text{edges} \times \underbrace{8! \times 3^8}_\text{corners} = 519,024,039,293,878,272,000$$

*Wait a minute*, you might be asking. This result is clearly bigger than the 43 quintillion figure cited earlier. What gives? The answer is that not every combination of pieces can be solved. To understand these conditions, it helps to  know a little bit about abstract algebra.

# Permutations

For a second, let's ignore orientation and think only about permutation. In mathematics, a permutation is an ordered list of elements so that each element only appears once. Ignoring cubies for a moment, we can think of the 48 stickers on the surface of the Rubik's cube as members of a permutation.

How do we actually realize the notion of a permutation using just sets? For this, we treat permutations as functions. Suppose $S$ is the set of all elements contained in our permutation. A permutation would then be a bijection of $S$, or a function that maps members of $S$ onto $S$ so that

* no two inputs map to the same output, and
* no two outputs map to the same input (each input only maps to one output).

For example, the permutation $(3\;1\;2)$ can be written as a function $f$ where $f(1) = 3$, $f(2) = 1$, and $f(3) = 2$.

![bijection](bijection.png)

Since permutations are just functions, they can be composed. The result is a bijection of $S \rightarrow S$, which is just another permutation. You can think of applying a move to the cube as composing the cube's permutation with another permutation (the move).

If we consider the set of all permutations of $n$ objects, which we will call $G$, we notice that it has some interesting properties:

* Composing two elements of $G$ always yields another element of $G$. Furthermore, this operation is associative, or $a \cdot (b \cdot c) = (a \cdot b) \cdot c$ (since function composition is always associative).
* There exists an element $e$ in $G$ so that, for every $x$ in $G$, $x \cdot e = e \cdot x = x$. We call this the identity element. If the elements of the permutation are the integers $1$ to $n$, this is the permutation $(1\;2\;3\;\ldots\;n)$.
* For every $x$ in $G$, there is some element $x^{-1}$ (the inverse) so that $x \cdot x^{-1} = e$.

Any set and binary operation that fulfill these properties forms a mathematical structure known as a [group](https://en.wikipedia.org/wiki/Group_(mathematics)). Indeed, the set of all Rubik's cube positions forms a group known as the [cube group](https://en.wikipedia.org/wiki/Rubik%27s_Cube_group). The cube group is a subgroup of $S_{48}$, which contains all permutations of size $48$.

<aside>

[Cayley's theorem](https://en.wikipedia.org/wiki/Cayley%27s_theorem) states that *any* group is isomorphic to a subgroup of a permutation group. This isn't really important to know for our application, though.

</aside>

A permutation where two elements are swapped but all other elements remain the same is known as a **transposition**. Any permutation can be written as the product of a series of transpositions. This gives rise to an interesting result: every permutation can either be written as the product of an even number of transpositions or an odd number of transpositions. We call these permutations *even* and *odd*, respectively, and this quality of a permutation is known as its parity.

From this, it follows that the product of two even permutations is always even. This, combined with the fact that the cube's initial parity is even (zero transpositions), and each of the basic moves that can be performed on the cube has even parity, means that the overall parity of the cube is always even. It is impossible to turn a position with odd parity into one with even parity by only composing even permutations, hence why half of all permutations are unsolvable.

<figure style="max-width: 256px">
    <img src="parity.png" alt="unsolvable permutation (two edges swapped)">
    <figcaption>If we disassemble a cube and swap two edges it will become unsolvable, since the position has odd parity.</figcaption>
</figure>

There are further restrictions on which positions are solvable due to piece orientation. For example, we know that quarter turns flip the orientation of every edge involved. Thus, the sum of the edge orientation values of the cube must always be even. Similarly, the overall change in corner orientation due to a move is always a multiple of three, meaning that the total corner orientation is always divisible by three.

<figure style="max-width: 360px">
    <img src="unsolvable.png" alt="unsolvable cubes due to edge flip/corner twist">
    <figcaption>No sequence of moves can flip a single edge or twist a single corner.</figcaption>
</figure>

With our newfound knowledge of the laws of the cube, we can rewrite our original expression:

$$\underbrace{\frac12}_\text{parity} \times \underbrace{12! \times 2^{11}}_\text{edges} \times \underbrace{8! \times 3^7}_\text{corners} = 43,252,003,274,489,856,000$$

We know that all positions meeting our criteria can be solved, since we can devise sequences of moves ("algorithms" in cuber lingo) that manipulate portions of the cube while leaving the rest undisturbed. By repeatedly applying these algorithms, solving any state becomes trivial.

# The Search Algorithm

Now that we have thoroughly explored the practical details of representing the cube, we can start thinking about how we're actually going to find an optimal solution.

For starters, we can recognize that optimally solving a Rubik's cube is a graph search problem. Each possible state is a vertex in the graph, with the edges between vertices representing moves that transform one state into another.

The problem is that the number of nodes we need to process grows exponentially with the number of moves from the starting position. For any state, there are 18 distinct moves that we could apply to the cube&mdash;6 faces times three different degrees of turning (clockwise, 180&deg;, and counterclockwise). 

<aside>

There are some optimizations that marginally reduce the branching factor, as outlined by Richard Korf in his seminal 1997 paper *Finding Optimal Solutions to Rubik's Cube Using Pattern Databases*:

> Since twisting the same face twice in a row is redundant, ruling out such
moves reduces the branching factor to 15 after the first move. Furthermore, twists of opposite faces of the cube are independent and commutative. For example, twisting the front face, then twisting the back face, leads to
the same state as performing the same twists in the opposite order. Thus, for each pair of opposite faces we arbitrarily chose an order, and forbid moves that twist the two faces consecutively in the opposite order. This results in a search tree with an asymptotic branching factor of about 13.34847. 

</aside>

Breadth-first search has no chance of working, since storing the search frontier in memory would become impossible once we reach around depth 10. (For reference, the median length of the optimal solution for a random position is 18.)

The alternative is to use depth-first search. A simple DFS does not work because the tree is infinite, so we must set a depth limit. In order to guarantee optimality, we can start with a depth limit of zero and successively increase the limit until a solution is found. This algorithm is called [iterative deepening depth-first search](https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search) (IDDFS).

IDDFS still explores every possible state, which is what we want to avoid. What we need is some heuristic which tells us which parts of the tree we don't need to search.

## The Art of Pruning

We can augment depth-first search using some function that gives a lower bound on the distance of a position from the solved state. When evaluating a node in our search, if the current search depth plus the value of the heuristic exceeds the depth limit, we know that the optimal solution cannot possibly be contained in a subtree of that node and can skip searching it. This combination of IDDFS and a heuristic is known as [iterative deepening A*](https://en.wikipedia.org/wiki/Iterative_deepening_A*) (IDA*).


The heuristic must never overestimate the number of moves it will take to solve a position, or else we may accidentally stop searching a branch that contains a solution. This condition is called admissibility. How do we construct an admissible heuristic?

Ideally, we would have a lookup table that recorded the number of moves required to solve every possible state. However, such a table would be much too large to construct or store. Instead, we can compute the amount of moves necessary to solve *part* of the cube.

For example, let's say we ignored the edges of the cube and focused our attention on the corners, essentially treating the cube as a 2x2x2. The corners can exist in $8! \times 3^7 = 88,179,840$ different configurations; we could run a BFS on the entire problem space in a short amount of time and save the resulting table. Then, during our search, we can look up the number of moves necessary to solve the corners of the state that we are currently considering and use that value as the heuristic. This value is clearly admissible since any solution that solves the cube will also solve the corners, and the values contained within our table are optimal.

To accomplish this, we need to figure out a way to map the corner configuration of a cube to a table index. We can break this down into two subproblems:

- Mapping corner orientation to an integer
- Mapping corner permutation to an integer

Creating an index for corner orientation is fairly easy; we can treat the corner orientation values as digits of a base-3 number, giving us our index.

```c
int compute_co_coord(struct Cube *cube) {
    int coord = 0, base = 1;
    for(int i = 0; i < 7; i++) {
        coord += cube->corner_twist[cube->corners[i]] * base;
        base *= 3;
    }
    return coord;
}
```

<aside>

We call these indexes "coordinates", the term used by most existing cube literature. Don't let this confuse you; they do not represent points in space.

</aside>

Encoding a permutation as an integer is slightly more challenging. How this can be accomplished is outside the scope of this article, although if you want to learn about the solution, the term you want to Google is [Lehmer code](https://en.wikipedia.org/wiki/Lehmer_code).

To generate the actual pruning table, we just perform a breadth-first search starting from the solved position until the table is full. Since we're operating on coordinates, we don't actually need to use a full cube representation in pruning table construction. Instead, we can construct lookup tables that map coordinates and moves to coordinates directly. This considerably speeds up pruning table generation.

Of course, a pruning table based on the corners alone is too underpowered for our purposes. A table that incorporates more information about the cube's state will produce estimates closer to the true value of the heuristic function, which will enable us to prune more nodes from our search. 

In practice, we quickly run into problems with memory usage. Adding edge orientation info to our table increases its size by 2048&times; to over 180 billion entries, which greatly exceeds the total memory of my computer. We'll need to take measures to reduce redunant information in the table.

# Symmetry Reduction

Here's a bit of an experiment that you can try if you happen to own two or more cubes. Let's say we apply the same sequence of scrambling moves to both cubes, except we hold them in different initial orientations. Take a look at the result&mdash;notice anything unusual?

![picture of symmetric cubes](symmetry.jpg)

Look carefully, and you'll see that the two cubes have same underlying pattern, but a different color scheme. Since these two symmetry-equivalent cubes can be solved by the same sequence of moves, they could be represented by a single entry in the pruning table.

Just how many of these symmetry-equivalent variants exist for a given position? Well, there are 24 different ways we could hold the cube when scrambling, times two because can mirror the scrambling moves, yielding up to 48 symmetry-equivalent siblings. A small portion of positions have fewer than 48 symmetry equivalents because they remain unchanged under reflection/rotation from certain angles. If we only stored one entry for all the symmetry equivalents of a given state, we can effectively decrease the size of our pruning table by ~48&times;.

Let's flesh out the details a little more. Let $A$ be the position represented by the scrambling moves that we applied to the cube earlier. If $S$ is one of the 48 symmetries, the position given by $SAS^{-1}$ will be symmetry-equivalent to $A$. This can be written as $A \sim B$.

Symmetry-equivalence has the following properties:

* Position $A$ is always symmetry-equivalent to itself.
* If position $A \sim B$, $B \sim A$, since for every symmetry $S$ there exists an inverse symmetry $S^{-1}$.
* If $A \sim B$ and $B \sim C$, $A \sim C$, since the symmetries are closed under multiplication.

This makes symmetry equivalence an [equivalence relation](https://en.wikipedia.org/wiki/Equivalence_relation), meaning that it partitions the cube group into disjoint sets of symmetry-equivalent cubes. We call these sets **equivalence classes**.

To actually apply 

## The Inverse

There's one last trick up our sleeve that we can use to further boost our pruning. Suppose $S$ is the sequence of moves that creates some position. We know that there is some sequence of moves $S^{-1}$ such that $S \times S^{-1}$ produces the solved state. Because of this relationship, we call $S^{-1}$ the *inverse* of $S$. These two positions must be at the same distance, but our pruning table might have a greater value for $S^{-1}$ than $S$. Thus, we can look up both positions and take the maximum of both lookups as the value of the heuristic, potentially boosting our pruning.