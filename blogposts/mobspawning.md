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

# Mob Cap Calculation

The first spawning-related action that occurs during a game tick is the evaluation of the mob caps. During this step, the game iterates through all loaded entities and counts how many mobs in each [category](#mob-categories) exist. The basic idea behind the mob cap is that the number of mobs in each category that can spawn in the world is limited to a base setting for that category times the number of players. (Technically, the global mob cap is based on the number of loaded chunks, but this fact isn't really important unless players are clumped close together.)

Generally speaking, monsters that have special attributes preventing them from despawning do not contribute to the mobcap, so the following groups aren't counted:
- Mobs with the `PersistenceRequired` tag set to true
- Mobs that are passengers (e.g. riding a boat or minecart)
- Fish and axolotls from buckets
- Endermen carrying blocks
- Raiders that are part of raids

There is a narrow class of mobs that contribute to the monster mob cap but do not despawn, meaning that if enough of these mobs are accumulated to fill the mob cap hostile mob spawning will be disabled for the entire world. Such a device is called a mobswitch. Examples include:
- Shulkers
- Wardens
- Withers
- Zombie villagers which have been traded with before

I'm mostly certain that these are all the exceptions that exist, but I may have missed some.

## Local Mob Cap

In addition to the global mob cap, the game also keeps track of a local mob cap; you may also see this referred to as the per-player mob cap. For each mob, the game looks at the chunk the mob is occupying, and finds all the players within 128 blocks of that chunk. The mob is then counted in the mob cap for each of those players. This method was implemented in 1.18 to ensure that mob spawns would be fairly split between players on multiplayer worlds regardless of the number of spawning spaces actually available.

## Spawning Potentials

*Acknowledgement: this section would not have been possible without Gnembon's [video](https://www.youtube.com/watch?v=4XNvnKDSoEw) on the subject.*

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

# Mob Cap Evaluation

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

Note that as soon as the game finds a player whose local mob cap isn't filled, it continues to the spawning step; the rate of spawning does not depend on the number of players in range.

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