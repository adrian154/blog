# 3.2

10\. $t_3 = 5$

45\. $\sum_{i=1}^4 n^2 - 3n + 3 = 1 + 1 + 3 + 7 = 12$

50\. $\prod_{i=1}^{3} n^2 - 3_n + 3 = 1 \times 1 \times 3 = 3$

73\. $\sum_{i=1}^3 x_i = 2 + 5 + 8 = 15$

128\. $r_n = 3 \cdot 2^n - 4 \cdot 5^n$, $n \geq 0$. 

$r_n$ satisfies $r_n = 7r_{n - 1} - 10r_{n - 2}$ for $n \geq 2$. *Proof:*

$$\begin{align*}
    7r_{n-1} - 10r_{n-2} &= 7\left(3 \cdot 2^{n-1} - 4 \cdot 5^{n-1}\right) - 10\left(3 \cdot 2^{n-2} - 4 \cdot 5^{n-2}\right) \\
                         &= 21\cdot2^{n-1} - 28\cdot5^{n-1} - 30\cdot2^{n-2} + 40\cdot5^{n-2} \\
                         &= 42\cdot2^{n-2} - 140\cdot5^{n-2} - 30\cdot2^{n-2} + 40\cdot5^{n-2} \\
                         &= 12\cdot2^{n-2} - 100\cdot5^{n-2} \\
                         &= 3\cdot2^n - 4\cdot5^n
\end{align*}$$

142\. a. $\alpha\beta = baabcaaba$

b. $\beta\alpha = caababaab$

f. $|\beta\alpha| = |caababaab| = 9$

146\. $\lambda, 0, 1, 00, 01, 10, 11, 000, 001, 010, 011, 100, 101, 110, 111$

# 3.3

18\. $\{(1,1), (2,2), (3,3), (4,4), (5,5), (1, 4), (4, 1), (5, 2), (2, 5)\}$

19\. The elements of $R^{-1}$ are the same as $R$ because it is a symmetric relationship.

24\. The relation is not reflexive. $xx = 1$ is not true for all $x \in \R$.

The relationship is symmetric. If $xy = 1$, $yx = 1$.

The relationship is not antisymmetric because it is symmetric.

The relation is not transitive. If $xy = 1$ and $yz = 1$, $(xy)z = z$ and not $1$. Thus, the relation does not hold for all $x, y, z \in \R$.

# 3.4

1\. The relation is an equivalence relation, partitioning the set into equivalence classes $\{\{1, 3\},\{2\},\{3\},\{4\},\{5\}\}$.

9\. The relation is not an equivalence relation, because it is not reflexive. 

16\. The relation is an equivalence relation. 

18\. $\{(1,1),(2,2),(3,3),(4,4),(3,4),(4,3)\}$ 

$[1] = \{1\}, [2] = \{2\}, [3] = [4] = \{3,4\}$

39\. a. $(x,y) = (x,y)$, so the relation is reflexive.

The relation is symmetric;  if $(x,y) \sim (x', y')$, then $y = y'$, and either $x = 0$ and $x' = 1$ or $x = 1$ and $x' = 0$. In both cases, the converse case is true.

The relation is transitive. If three points are related, they must all have the same $y$-coordinate, and have opposite $x$-coordinates.

If equivalent points were glued together, the two opposite edges would be attached.

# 3.5

8\. $\{(a,w), (a,y), (c,y), (d,w), (d,x), (d,y), (d,z)\}$

17\.

$$A_1 = \begin{pmatrix}
    1 & 0 & 1 & 0 \\
    0 & 1 & 0 & 0 \\
    0 & 0 & 1 & 0 \\
    0 & 0 & 0 & 1 
\end{pmatrix}$$

$$A_2 = \begin{pmatrix}
    0 & 0 & 0 & 0 \\
    1 & 0 & 0 & 0 \\
    1 & 1 & 0 & 0 \\
    1 & 1 & 1 & 0 
\end{pmatrix}$$

$$A_1A_2 = \begin{pmatrix}
    1 & 1 & 0 & 0 \\
    1 & 0 & 0 & 0 \\
    1 & 1 & 0 & 0 \\
    1 & 1 & 1 & 0 
\end{pmatrix}$$