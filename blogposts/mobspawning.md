# Natural Mob Spawning

The information in this document is applicable for **Java Edition 1.19**.

These are the major steps in the spawning algorithm, in order:
- Collect mob cap data
- Run spawning attempts, depending on mob caps 
- Despawn entities

# Mob Cap

The first spawning-related action that occurs during a game tick is the evaluation of the mob cap. During this step, the game iterates through all loaded entities. The following mobs do not contribute to the mobcap:
- Mobs with the `PersistenceRequired` tag set to true
- Mobs that are passengers (e.g. riding a boat or minecart)
- Fish and axolotls from buckets
- Endermen carrying blocks
- Raiders that are part of raids



<aside>

The mob caps are only evaluated once per tick, meaning that by the end of the tick the number of mobs in the world may exceed the mob cap. Thus, the mob cap should not be considered a hard limit.

</aside>

# Spawning

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

The no despawn distance is always 32, while the despawn distance depends on the mob's [category](#mob-categories).

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

## Mob Categories

| Mob Category                | Despawn Distance | Max per chunk |
|-----------------------------|------------------|---------------|
| Monster                     | 128              | 70            |
| Creature                    | 128              | 10            |
| Ambient                     | 128              | 15            |
| Axolotls                    | 128              | 5             |
| Underground water creatures | 128              | 5             |
| Water creatures             | 128              | 5             |
| Water ambient               | 64               | 20            |
| Miscellaneous               | 128              | n/a           |

Note that even though despawn distances are specified for every mob category, in many cases (e.g. axolotls) this value is not used. To see when this value is applicable, refer back to the explanation of the [despawning algorithm](#despawning).