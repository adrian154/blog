The information in this document is applicable for **Java Edition 1.19**.

These are the major steps in the spawning algorithm, in order:
- Collect mob cap data
- Run spawning attempts, depending on mob caps 
- Despawn entities

# Mob Categories

The spawning algorithm categorizes all mobs into one of several categories, which are listed here.

| Mob Category                | Description            |
|-----------------------------|------------------------|
| Monster                     | Hostile mobs           |
| Creature                    | Animals                |
| Ambient                     | Bats only              |
| Axolotls                    | Take a guess...        |
| Underground water creatures | Glow squid only        |
| Water creatures             | Dolphins and squid     |
| Water ambient               | Fish                   |
| Miscellaneous               | Boats, minecarts, etc. |

# Mob Cap Basics

The first spawning-related action that occurs during a game tick is the evaluation of the mob caps. During this step, the game iterates through all loaded entities and counts how many mobs in each category exist. The basic idea behind the mob cap is that the number of mobs in each category that can spawn in the world is limited to a base setting for that category times the number of players. (Technically, the global mob cap is based on the number of loaded chunks, but this fact isn't really important unless players are clumped close together.)

Generally speaking, monsters that have special attributes preventing them from despawning do not contribute to the mobcap, so the following groups aren't counted:
- Mobs with the `PersistenceRequired` tag set to true (e.g. mobs that have been nametagged)
- Mobs that are riding an entity/vehicle
- Fish and axolotls from buckets
- Endermen carrying blocks
- Raiders that are part of raids

There is a narrow class of mobs that contribute to the monster mob cap but do not despawn, meaning that if enough of these mobs are accumulated to fill the mob cap hostile mob spawning will be disabled for the entire world. Such a device is called a mobswitch. Examples include:
- Shulkers
- Wardens
- Withers
- Zombie villagers which have been traded with before

I'm mostly certain that these are all the exceptions that exist, but I may have missed some.

## Spawning Potentials

In soul sand valleys and warped forests, a special "potential"-based mechanic is used to reduce the number of mob spawns without adjusting the mob caps themselves. If a mob is in one of these biomes, their position is recorded. Here are the relevant charge/energy values:

<h3 style="text-align: center">Soul Sand Valley</h3>

| Mob Type | Total Energy | Charge |
|----------|--------------|--------|
| Skeleton | 0.7          | 0.15   |
| Ghast    | 0.7          | 0.15   |
| Enderman | 0.7          | 0.15   |
| Strider  | 0.7          | 0.15   |

<h3 style="text-align: center">Warped Forest</h3>

| Mob Type | Total Energy | Charge |
|----------|--------------|--------|
| Enderman | 1.0          | 0.12   |

The positions of the counted mobs and their charge can be used to calculate a potential value for any block position. This potential value is used to nerf mob spawns; the exact algorithm is explained later in this article.

<aside>

The mob caps are only evaluated once per tick, meaning that by the end of the tick the number of mobs in the world may exceed the mob cap. Thus, the mob cap should not be considered a hard limit.

</aside>

# Mob Cap Calculation

Before spawning can begin, the game first checks the global mob cap for each mob category, which is calculated using the following formula:

$$\text{global-mobcap} = \frac{\text{mobcap-value} \times \text{spawnable-chunks}}{289}$$

Here are the base mob cap values:

| Mob Category                | Mob cap |
|-----------------------------|---------|
| Monster                     | 70      |
| Creature                    | 10      |
| Ambient                     | 15      |
| Axolotls                    | 5       |
| Underground water creatures | 5       |
| Water creatures             | 5       |
| Water ambient               | 20      |

The number of spawnable chunks is the number of loaded chunks that are within 8 chunks of a player. In other words, ever player has 17x17 grid of spawnable chunks centered on them. 

<figure style="max-width: 512px">
    <img src="resources/spawning/spawnable-chunks.png" alt="diagram of spawnable chunks">
    <figcaption>A diagram of spawnable chunks surrounding the player's chunk, which is represented in green.</figcaption>
</figure>

This is where the 289 found in the mob cap equation comes from; in singleplayer, there will always be 289 spawnable chunks (unless you've set your simulation distance extremely low), so the mob cap will be equal to the constant for each category. On a server, if all the players are spread out so that none of their 17x17 chunk regions overlap, the global mobcap for each category will be equal to the singleplayer mobcap multiplied by the number of players; if there is overlap, the global mobcap will be less.

<figure style="max-width: 512px">
    <img src="resources/spawning/spawnable-chunks-overlap.png" alt="diagram of two players' spawnable chunks overlapping">
    <figcaption>These two players' spawnable chunks overlap, so there are only 434 spawnable chunks instead of 2 &times; 289 = 578. This means that the global mobcap will only be ~1.5&times; greater than the singleplayer value, instead of 2&times;.</figcaption>
</figure>

If the number of mobs in a category exceeds the global mobcap, spawning for that category is entirely skipped.

If the global mob cap is not met, the game then checks the local mob cap on a chunk-by-chunk basis. For a given chunk, the game looks at all the players which have that chunk inside their spawnable chunks area. The game then compares the player's local mob cap to the base value; if it is below the limit, spawning for that category will proceed.

I know that explanation may have been a little confusing, so here's a practical example. Let's go back to our two-player scenario from earlier. Suppose the game is currently evaluating monster spawning for the chunk highlighted in red.

<img style="max-width: 512px" src="resources/spawning/spawnable-chunks-highlighted.png" alt="the same diagram of two players' spawnable chunks, with one chunk between the two players highlighted in red">

The global monster mob cap is $70 \times 434 / 289 = 105$. If the total number of monsters in the world is greater than 105, no monster spawning will happen in any chunks.

If the global mob cap is not met, the game proceeds to check each player's local mob cap. First, it retrieves the number of monsters within player 1's chunks, highlighted in blue here:

<img style="max-width: 512px" src="resources/spawning/chunks-p1.png">

If there are fewer than 70 monsters in the blue chunks, monsters can spawn in the red chunk. Otherwise, the game moves on to player 2's local mob cap.

<img style="max-width: 512px" src="resources/spawning/chunks-p2.png">

What effect does the local mob cap have on mob spawning? Well, it helps ensure that no player can take up ane excessive portion of the mob cap. Before 1.18, mob farms often worked poorly in multiplayer since if multiple players were online, the spawning algorithm was much more likely to pick a spawning space in the environment rather than one in a farm. Now, players in non-spawnproofed areas have minimal effect on the mob cap because mobs will stop spawning in their chunks once the local mob cap is reached.

Note that as soon as the game finds a player whose local mob cap isn't filled, it continues to the spawning step; the rate of spawning does not depend on the number of players in range.

<aside>

A lot of information relevant to mob spawning is available on the debug screen nowadays. If you look at the line on the top-left part of the screen starting with "SC", you will find:
* SC: number of spawning chunks
* M: monster mob cap
* C: creature mob cap
* A: ambient mob cap
* A: axolotl mob cap
* U: underground water creatures mob cap
* W: water creatures mob cap
* W: water ambient mob cap

![debug screen](resources/spawning/debugscreen_sc.png)

On multiplayer, you may need to use a server-side mod like [Carpet](https://github.com/gnembon/fabric-carpet) to view global mob cap statistics.

</aside>

# Spawning

Now, the game actually starts looking for a location to spawn a mob. It begins by selecting a random X and Z value; next, it looks up the height of the highest non-air block at that X/Z combo, and picks a random Y-value between the minimum build height and the Y-coordinate of air block above the highest block.

<aside>

The Y-value of the highest block for every X/Z combo is known as the **heightmap**. The heightmap of your current position is displayed on the debug screen as "CH S".

![heightmap](resources/spawning/debugscreen_ch.png)

You can also use the [MiniHUD](https://www.curseforge.com/minecraft/mc-mods/minihud) mod to overlay heightmap indicators over the regular world.

</aside>

The heightmap is the reason why farms perform best at lower Y-levels. In the optimal configuration, the farm's lowest spawning platform is at the minimum build height and there are no blocks above the highest spawning spaces. This way, if a spawn attempt lands within the X/Z bounds of the farm, it will not end up below or above the farm. Of course, if you farm is situated at the bottom of the world you will also need to spawnproof within a 128-block radius of your AFK spot. If you are willing to put in the time, you can kill two stones with one bird by excavating a [perimeter](resources/spawning/perimeter.webp).

<figure style="max-width: 1708px">
    <img src="resources/spawning/comparison.png" alt="effect of a platform on mob spawning">
    <figcaption>The platform on the left had a layer of blocks above it at Y=255, while the platform on the right was not covered. Both platforms were allowed to spawn mobs for 15 seconds. There are nearly twice as many mobs on the uncovered platform compared to the covered one, demonstrating the importance of keeping the heightmap low in a mob farm.</figcaption>
</figure>


Once a location is picked, the game runs some preliminary checks to determine whether it should attemt to spawn mobs there. If the block at the position is a full block, soul sand, or mud, the attempt immediately ends. Otherwise, it will make up to three attempts to spawn a pack of mobs near that location.

## Pack Spawning

Minecraft spawns all mobs in packs, meaning that one spawn attempt may result in multiple mobs being spawned. Keep in mind that the algorithm can be rather idiosyncratic and knowing all the details is not too important when it comes to farm optimization.

The game starts by setting a counter for the number of remaining attempts to spawn a pack of mobs. This counter is initialized with a random value from 1 to 5.

Next, the game adds a random X and Z offset between -5 and 5 to the current position. These values are picked so that smaller offsets are more common than further offsets; specifically, they follow a [triangular distribution](https://en.wikipedia.org/wiki/Triangular_distribution). Next, the game checks if the spot is within 24 blocks of the player or the world spawn point. If either of these conditions is met, the game repeats the process. Note that each time, the offset is added to the already-offsetted position, which means that pack spawn attempts can wander rather far away from the initial position. However, in practice, this is unlikely; here's a heatmap showing the spatial distribution of pack spawn attempts.

![pack spawn heatmap](resources/spawning/packspawn-heatmap.png)

As you can see, most of the attempts end up pretty close to the initial location; around 76% of all attempts are within 5 blocks of the initial location. Pack spawning is why building an overhang in a mob farm may increase its rates; by raising the heightmap in the blocks surrounding the spawning platforms, spawn attempts that begin outside of the farm could still find their way in. This is also why you should never place solid opaque blocks at foot level at any location in the farm, since if a spawn attempt begins at that position it will instantly end.

<figure style="max-width: 560px">
    <img src="resources/spawning/footlevel.png" alt="explanation of why foot level blocks are bad">
    <figcaption>Do not do this. I have ways of finding you.</figcaption>
</figure>

Anyways, if the position is *not* within 24 blocks of the player/world spawn and its chunk is loaded, the game gets the biome at that position and checks which mobs can spawn. At this stage, if the biome is a river biome and the category is water ambient mobs, there is a 98% chance that the spawn attempt will fail. Here are the mobs which will spawn in various biomes and their weights; note that within a Nether fortress the fortress spawns override all biome spawns.

## Monster Spawn Weights


var18 = [1-4]
var13, var14 = [-5, 5] triangular distr
var10 = the offset loc

get nearest player
if distance to player or world spawnpoint < 24 blocks, abort
if chunk is not ticking, abort
    - entities can spawn in lazy chunks at low render distance

get biome at position
- if this is empty, abort

# Despawning

Every tick, entites check whether they should despawn according to the following rules.
- If the difficulty is peaceful, despawn hostile mobs
- If the mob is an enderman, don't despawn if carrying a block
- If the mob is an axolotl or fish, don't despawn if from a bucket
- If the mob is a raider, don't despawn if part of a raid
- If the `PersistenceRequired` NBT tag is set to true, don't despawn
- If the mob is a passenger, don't despawn
- Calculate the distance to the nearest player
    - If the distance is greater than the despawn distance and the mob should despawn when far away, despawn.
    - If the distance is greater than the no despawn distance, the mob should despawn when far away, and over 600 ticks have elapsed, the mob has a 1/800 chance of despawning each tick

The no despawn distance is always 32, while the despawn distance depends on the mob's category. All mob categories despawn at a distance of 128 blocks except water ambient mobs, which start despawning at just 64 blocks away.

The `PersistenceRequired` NBT tag is set when mobs are named with nametags. It is also set on certain mobs created through natural processes, such as the following (not a comprehensive list):
- Zombie piglins created when pigs are struck by lightning
- Witches created when villagers are struck by lightning
- All elder guardians
- Duplicated allays
- Skeletons created from skeleton traps
- Most if not all mobs spawned as part of a structure, e.g. the black cat in a witch hut

Here are the rules for whether a mob should despawn when far away.
- Default: despawn
- Golems: never despawn
    - Shulkers are considered golems for some bizarre reason, maybe because they shoot projectiles? Anyways, this is why they don't despawn.
- Animals: never despawn
    - Chickens: despawn if part of a chicken jockey
    - Cats: despawn if not tame and alive for greater than 2,400 ticks
- Allay: never despawn
- Raiders: if part of a raid, never despawn; otherwise, despawn if not part of a patrol or over 128 blocks away
- Zombie Villager: despawn if not converting and zero villager XP (i.e. if a villager which has been traded with is infected, the resulting zombie villager won't despawn)
- Warden: never despawn
- Wandering Trader: never despawn
- Villager: never despawn

Endermites will disappear after 2,400 ticks unless the `PersistenceRequired` tag is set, but this mechanic is implemented separately from regular despawning.