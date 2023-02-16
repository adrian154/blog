This article aims to roughly describe the Minecraft spawning algorithm as it exists in **Java Edition 1.19**.

Spawning consists of three phases, which run every tick:
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

Mobs in the miscellaneous category are not involved in natural mob spawning.

# Mob Cap

Spawning for each mob category can only occur if the number of mobs in loaded chunks belonging to that category is lower than a value called the **mob cap**.

The mob cap for each category is calculated from a base value and scales linearly with the number of loaded chunks. Here is the exact formula:

$$\text{global-mobcap} = \frac{\text{mobcap-value} \times \text{spawnable-chunks}}{289}$$

| Mob Category                | Base mob cap |
|-----------------------------|--------------|
| Monster                     | 70           |
| Creature                    | 10           |
| Ambient                     | 15           |
| Axolotls                    | 5            |
| Underground water creatures | 5            |
| Water creatures             | 5            |
| Water ambient               | 20           |

A chunk is considered spawnable if it is within 8 chunks of a player. In other words, ever player has 17x17 grid of spawnable chunks centered on them. 

<figure style="max-width: 512px">
    <img src="spawnable-chunks.png" alt="diagram of spawnable chunks">
    <figcaption>A diagram of spawnable chunks surrounding the player's chunk, which is represented in green.</figcaption>
</figure>

This is where the 289 found in the mob cap equation comes from; in singleplayer, there will always be 289 spawnable chunks since there is only one player in the game, so the mob cap will be equal to the base value for every category.

On a server, if all the players are spread out so that none of their 17x17 chunk regions overlap, the global mobcap for each category will be equal to the singleplayer mobcap multiplied by the number of players. If there is overlap, the global mobcap will be less.

<figure style="max-width: 512px">
    <img src="spawnable-chunks-overlap.png" alt="diagram of two players' spawnable chunks overlapping">
    <figcaption>In this situation, there are only 434 spawnable chunks, compared to the maximum possible value of 2 &times; 289 = 578 if the players were further apart.</figcaption>
</figure>

If the number of mobs in a category exceeds the global mobcap, spawning for that category is entirely skipped. The mob cap is only checked at the start of the spawning cycle, so by the end of the tick, the number of mobs may exceed the mob cap.

The game also checks the local mob cap on a chunk-by-chunk basis. Each player has a local mob cap, which simply counts the number of mobs in each category within the spawnable chunks surrounding that player. For a given category and chunk, if there is at least one player within range whose local mob cap isn't filled, spawning can proceed.

## Practical Example

Suppose the game is currently evaluating monster spawning for the chunk highlighted in red.

<img style="max-width: 512px" src="spawnable-chunks-highlighted.png" alt="the same diagram of two players' spawnable chunks, with one chunk between the two players highlighted in red">

There are 434 loaded chunks, so the global monster mob cap is $70 \times 434 / 289 = 105$. If the total number of monsters in the world is greater than 105, no monster spawning will happen in any chunks.

If the global mob cap is not met, the game proceeds to check each player's local mob cap. First, it retrieves the number of monsters within player 1's spawnable chunks, highlighted in blue here:

<img style="max-width: 512px" src="chunks-p1.png">

If there are fewer than 70 monsters in the blue chunks, monsters can spawn in the red chunk. Otherwise, the game moves on to player 2's local mob cap.

<img style="max-width: 512px" src="chunks-p2.png">

The local mob cap helps ensure that spawns are equally distributed between players. Before 1.18, if multiple players were online and occupying different parts of the world, odds are the vast majority of spawning spaces would be outside of a mob farm, which would severely impact the number of spawns in the farm. Now, players in non-spawnproofed areas have minimal effect on mob spawning beyond their spawnable chunks because their local mob cap will prevent them from taking up more of the global mob cap. 

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

![debug screen](debugscreen_sc.png)

Unfortunately, this line isn't available when playing on a multiplayer server; instead, you'll need to use a mod like [Carpet](https://github.com/gnembon/fabric-carpet) to view global mob cap statistics.

</aside>

## Mob Cap Quirks

Generally speaking, monsters that have special attributes preventing them from despawning do not contribute to the mobcap, so the following groups aren't counted:
- Mobs with the `PersistenceRequired` tag set to true, including:
    - Zombie piglins created when pigs are struck by lightning
    - Witches created when villagers are struck by lightning
    - All elder guardians
    - Duplicated allays
    - Skeletons created from skeleton traps
    - Zombies holding items
    - Most mobs spawned as part of a structure, e.g. the black cat in a witch hut
- Mobs that are riding another entity (such as a boat or a minecart)
- Fish and axolotls from buckets
- Endermen carrying blocks
- Raiders that are part of raids

There is a narrow class of mobs that contribute to the monster mob cap but do not despawn, meaning that if enough of these mobs are accumulated to fill the mob cap hostile mob spawning will be disabled for the entire world. Such a device is called a mobswitch. Examples include:
- Shulkers
- Wardens
- Withers
- Zombie villagers which are converting or have been traded with before

# Spawning

Every tick, the game looks through all spawning chunks and checks which categories of mobs may spawn there. Then, for each category, it selects a random position within the chunk which will be used for mob spawning. It begins by selecting a random X and Z value; next, it looks up the height of the highest non-air block at that X/Z combo, and picks a random Y-value between the minimum build height and the Y-coordinate of air block above the highest block.

<aside>

The Y-value of the highest block for every X/Z combo is known as the **heightmap**. The heightmap of your current position is displayed on the debug screen as "CH S" or "SH S".

![heightmap](debugscreen_ch.png)

You can also use the [MiniHUD](https://www.curseforge.com/minecraft/mc-mods/minihud) mod to overlay heightmap indicators over the regular world.

</aside>

Once a location is picked, the game checks if the block at that location is a redstone conductor (i.e. all full solid blocks, as well as soul sand and mud). If so, the spawn attempt immediately ends. Otherwise, it will make up to **three** attempts to spawn a pack of mobs near that location.

The heightmap is a critical factor in the performance of a farm. Spawning attempts are evenly distributed along the Y-axis, so you want to minimize the chance that a spawn attempt occurs above or below your farm. Thus, there are two things you should keep in mind:
* Always try to build mob farms as low as possible.
* Avoid placing solid blocks above mob farms.

![diagram of impact of heightmap on spawning](heightmap.png)

Unfortunately, if you build your farm very low in the world to maximize its rates, you will need to eliminate all spawnable spaces within 128 blocks of its proximity to prevent those spawns from filling up the mob cap. This means either lighting up all the caves within that radius or excavating a perimeter. I am way too lazy to do either of those things, so I usually build my farms above ground so I can position my AFK spot such that there are no unwanted spawnable spaces. 

Another thing to keep in mind is that the game doesn't try to spawn a mob directly at the selected location; instead, it picks random positions in a square surrounding the initial position using the rules outlined in the following section. This means that spawn attempts which begin outside of your farm may still contribute to its rates. This yields two more pieces of advice:

* Build an overhang directly above the highest spawning platform in your mob farm to raise the heightmap in the columns surrounding the farm so that spawn attempts which occur there may produce spawns within the farm. 
* Never place solid blocks at foot level around the farm, since they will instantly cause a spawn attempt to end.

<figure style="max-width: 560px">
    <img src="footlevel.png" alt="explanation of why foot level blocks are bad">
    <figcaption>Do not do this.</figcaption>
</figure>

## Pack Spawning Mechanics

Minecraft spawns all mobs in packs, meaning that one spawn attempt generally results in multiple mobs being spawned. Keep in mind that the algorithm can be rather idiosyncratic and knowing all the details is not too important when it comes to farm optimization.

The idea behind pack spawning is that the game starts from the initial position, adds a random X and Z offset, and tries to spawn a mob. This process is repeated for every mob in the pack. The offsets are picked according to a [triangular distribution](https://en.wikipedia.org/wiki/Triangular_distribution), so smaller offsets occur more frequently. 

<aside>

Pack spawns can potentially spawn mobs very far away from the origin of the spawn attempt. For example, if the selected mob type's pack size is 4, the final spawn location could be anywhere within a 41x41 region around the original position. However, in practice, this is unlikely. Check out this heatmap showing the spatial distribution of spawn attempts.

![pack spawn heatmap](packspawn-heatmap.png)

As you can see, most of the attempts end up pretty close to the initial location; in fact, over 75% of all attempts are within 10 blocks of the initial location. We can find the cumulative distribution of pack spawn distance to determine how much overhang we need.

![cumulative distribution of pack spawn distance](distance-distr.png)

As you can see, bigger is better, but the benefit you get from building a bigger overhang gradually diminishes.

</aside>

When the position is offset for the first time, the game checks the biome at that position, and retrieves the list of mobs in the current category that can spawn in that biome. That list looks something like this:

| Mob Type            | Weight |
|---------------------|--------|
| Spider              | 100    |
| Zombie              | 95     |
| Zombie Villager     | 5      |
| Skeleton            | 100    |
| Creeper             | 100    |
| Slime               | 100    |
| Enderman            | 10     |
| Witch               | 5      |

*The mob spawning weights and pack sizes are documented [here](../mob-spawning-weights/).*

The odds of a mob type being selected is equal to its weight divided by the total weight of all the mob types in that category. In this case, the probability that a zombie is picked to be spawned is $\frac{95}{515}$.

## Spawn Conditions

Over time, the rules that decide whether a mob should be allowed to spawn have grown quite Byzantine. I will attempt to give a mostly complete description of them here.

For starters, all attempts to spawn a mob as part of a pack fail if they are within 24 blocks of the player or the world spawn point. The position must also be within a loaded chunk and within the world border. However, the chunk does not have to be *entity* ticking, so it's possible for mobs to spawn in lazy chunks that never despawn. These mobs still contribute to the mobcap, so it may lead to situations where the mob cap gets quickly taken up. This phenomenon was once classified as a [bug](https://bugs.mojang.com/browse/MC-155289), but for unknown reasons this behavior was reintroduced in 1.17. Generally speaking, this is only a problem if you play on a very low simulation distance.

Once a mob type is picked, the game checks whether the selected position is valid for the mob according to the following rules:
* The distance between the position and the nearest player cannot be greater than the mob's despawn distance.
    * Creatures are not affected by this.
* If the mob's spawn placement type is `ON_GROUND`:
    * The upper face of the block below the position must be full and cannot emit a light level greater than 13.
    * Bedrock, berries, glass, tinted glass, and trapdoors are not spawnable.
    * Soul sand and mud are spawnable despite their upper face not being full.
    * Mangrove leaves and regular leaves are only spawnable for ocelots and parrots.
    * Ice is only spawnable for polar bears.
    * Magma blocks are only spawnable for fire immune mobs.
    * The block *at* the position and above the position must be valid for mob spawns:
        * The blocks cannot be full.
        * The blocks cannot be redstone conductive.
        * The blocks cannot have liquid.
        * The block cannot be a rail.
        * The block cannot harm the mob being spawned:
            * Non-fire immune mobs cannot spawn in fire
            * Only wither skeletons can spawn in wither roses
            * Only polar bears, snow golems, and strays can spawn in powder snow
* If the mob's spawn placement type is `IN_WATER`:
    * The block at the position must be water, and the block above it may not be a redstone conductor (full blocks, soul sand, mud).
* If the mob's spawn placement type is `IN_LAVA`:
    * The block at the position must be lava.
* The mob must not collide with a block or another entity at the position.

| Spawn Placement | Mobs |
|-----------------|------|
| `IN_WATER`           | Axolotl, Cod, Dolphin, Drowned, Guardian, Pufferfish, Salmon, Squid, Tropical Fish, Glow Squid |
| `ON_GROUND`          | Bat, Blaze, Cave Spider, Chicken, Cow, Creeper, Donkey, Enderman, Frog, Ghast, Goat, Horse, Husk, Iron Golem, Llama, Magma Cube, Mooshroom, Ocelot, Parrot, Pig, Hoglin, Piglin, Polar Bear, Rabbit, Sheep, Skeleton, Slime, Spider, Stray, Turtle, Witch, Wither Skeleton, Wolf, Zombie, Zombified Piglin, Zombie Villager |
| `IN_LAVA`            | Strider |
| `NO_RESTRICTIONS`    | Fox, Panda |

There are also further mob-specific rules that need to be satisfied for the spawning attempt to continue.

### Axolotl

The block underneath the position must be clay.

### Cod, Dolphin, Pufferfish, Salmon, Squid, Tropical Fish

The position's Y-level may be between 50 and 63, inclusive. The block below the position and the block above the position must be water. The block above may not be waterlogged or a bubble column. In Lush Caves, tropical fish may spawn at any Y-level.

### Drowned

The block below the position must be water, and the light level must be zero. In rivers, there is a $\frac{1}{16}$ chance of the spawn attempt succeeding. In all other biomes, the chance is $\frac{1}{40}$, and the position must also be over 5 blocks below the sea level.

### Guardian

The block at the position and below the position must contain water. If the position is exposed to the sky, there is a 95% chance of the spawn attempt failing.

### Bat

The Y-level must be below 64. The light level must be below 4, except around Halloween (Oct 20 - Nov 3), when the light level  must be below 7. The chance of a spawn attempt failing increases linearly. 

### Blaze

No additional conditions.

### Monsters

In the Overworld, the light level must be zero. In the Nether, the light level must be less than 11.

### Animals

The block below the position must be a grass block and the light level must be above 8.

### Frog

The block below the position must be  a grass block, mud, mangrove roots, or muddy mangrove roots, and the light level must be above 8.

### Ghast

The spawn attempt has a 95% chance of failing.

### Glow Squid

The Y-level of the position must be less than or equal to 30, the light level must be zero, and the block at the position must be water.

Fun fact: the method that checks whether a glow squid can spawn has been misspelled as <code>checkGlow<b>Squide</b>SpawnRules</code> since 1.18.

### Goat

The block below the position must be stone, snow, a snow block, packed ice, or gravel, and the light level must be above 8.

### Husk

Regular monster spawn rules apply. The sky light at the position must also be 15.

### Mooshroom

The block below the position must be mycelium.

### Ocelot

### Parrot

### Hoglin

### Piglin

### Polar Bear

### Rabbit

### Slime

### Stray

### Strider

### Turtle

### Wolf

success chance affected by light level: drowned, monster

# Despawning

Golems, animals, allays, wandering traders, and villagers never despawn, with exceptions:
- Untamed cats that are older than 2,4000 ticks can despawn.
- Chickens that spawned as part of a chicken jockey can despawn.

Shulkers are considered golems for some reason, so they don't despawn.

In addition, certain mobs with special characteristics do not despawn:
- Endermen carrying blocks
- Axolotl and fish from buckets
- Raiders that are participating in a raid
- Mobs with the `PersistenceRequired` NBT tag set to true
- Mobs riding another entity
- Zombie villagers that are in the process of converting or have been traded with

For mobs that can despawn, the following process is used:
- Calculate the distance to the nearest player
    - If the distance is greater than 128 blocks (or 64 blocks for water ambient mobs), despawn immediately.
    - If the distance is greater than 32 blocks and over 600 ticks have elapsed, the mob has a 1/800 chance of despawning each tick

Endermites will disappear after 2,400 ticks unless the `PersistenceRequired` tag is set, but this mechanic is implemented separately from regular despawning.

## Spawning Potentials

In addition to the mob cap, spawning is limited in soul sand valley and warped forest biomes through a new potential-based mechanic. Here's how it works.

Essentially, every mob emits a potential field that diminishes with distance. The strength of this potential at a given position is calculated according to the following equation:

$$\text{potential} = \frac{\text{charge}}{\text{distance-to-mob}}$$

The charge value depends on the mob type and biome. 

When spawning one of the mobs listed in the tables below, the potential contribution from all loaded mobs is added up and compared to a total energy value. The potential must be less than the total energy for the spawn attempt to continue.

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