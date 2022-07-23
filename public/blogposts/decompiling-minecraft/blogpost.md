If you've ever tried optimizing a farm in Minecraft, you know that there are many questions about the game's mechanics which aren't answered anywhere on the Internet. When that time comes, you are generally forced to conduct an experiment in an attempt to probe the underlying behavior. However, there's actually a better alternative: decompiling the game and directly viewing the source code.

Decompiling Minecraft wasn't always an option. The game is obfuscated to prevent its source code from being understood, meaning that all variable, method, and class names are randomized. Here's what that obfuscation looks like:

![picture of decompiled MC source, showing randomized names](/blogposts/decompiling-minecraft/obfuscated.png)

As you can see, this is code is essentially impossible to understand. Yet a very determined group of individuals analyzed the decompiled source and assigned each obfuscated identifier a meaningful name, creating the [Mod Coder Pack](https://github.com/ModCoderPack). For a long time, this was the only way to view Minecraft's source code. However, when snapshot 19w36a was released in March 2019, Mojang announced that they would be [releasing official obfuscation maps](https://www.minecraft.net/en-us/article/minecraft-snapshot-19w36a) alongside future releases to make modding easier. This changed everything; suddenly, *every* obfuscated name (save for local variables) can be deobfuscated. For [various reasons](http://cpw.github.io/MinecraftMappingData.html), the biggest Minecraft modding project (Forge) was unable to directly use the maps. However, for curious players like you and I, decompiling Minecraft using the official maps is the best way to go if your goal is to understand Minecraft's mechanics.

So how do we do it? Before we begin, we need to do a little *mise en place*; that is, obtain the actual game JAR and mappings.

# Getting the Files 

You may not know this, but the location of all Minecraft game files is available at https://launchermeta.mojang.com/mc/game/version_manifest.json. Today, I'll be decompiling the 1.18.2 server, but you should be able to adapt my procedure to any version. To find the JSON manifest for a given version, just Ctrl+F through the file until you find the desired entry. Each version manifest contains the URL of all the files needed to run that version (including the client and server), as well as the mappings for those JARs. If you don't want to parse the JSON, you can just search for `client_mappings` or `server_mappings`.

<aside>

For convenience, I made a page with links to the downloads for all versions released at the time of writing with obfuscation maps available; check it out [here](/blogposts/decompiling-minecraft/links.html).

</aside>

# Renaming

The first thing we're gonna do is rename all the names in the game JAR using the obfuscation mappings. This can be accomplished using a tool called [SpecialSource](https://github.com/md-5/SpecialSource), which can be obtained through [Maven](https://search.maven.org/remotecontent?filepath=net/md-5/SpecialSource/1.11.0/SpecialSource-1.11.0-shaded.jar). Make sure to download the shaded version, or else dependencies necessary to run the tool will be missing.

Here's the usage for remapping a JAR:

```plaintext
java -jar SpecialSource-1.11.0-shaded.jar -i <original JAR> -o <output filename> -m <mappings filename> --kill-lvt
```

The `--kill-lvt` flag tells SpecialSource to ignore local variables. We include it since Mojang's official mappings do not include local variable names.

# Decompiling

Once the JAR is remapped, it's ready to be decompiled. Unfortunately, compilation is a lossy process, even for a VM language like Java. This means that decompilers often produce imperfect output; essentially, not all decompilers are made equal. As a result, quite a few people have attempted to tackle the problem of decompilation, producing a great many decompilers. Most have been abandoned, but a few are still being actively developed:
* [Fernflower](https://github.com/JetBrains/intellij-community/tree/master/plugins/java-decompiler/engine)
* [CFR](https://www.benf.org/other/cfr/)

Thankfully, in our case, the choice of decompiler is not that important since we don't need to recompile the game. I'll be using [Quiltflower](https://github.com/QuiltMC/quiltflower) in today's decompilation. Quiltflower is a fork of Fernflower created for the [QuiltMC](https://quiltmc.org/) project, with patches to produce more concise output in certain situations. Quiltflower is a drop-in replacement for Fernflower, so the following steps should work just as well if you're using Fernflower.

The first step is to obtain Quiltflower, which can be downloaded from its GitHub page. Next, we can begin the decompilation:

```plaintext
java -jar quiltflower-1.8.1.jar <remapped JAR> src/
```

Quiltflower decompiles fairly quickly; on my computer, the entire process finished in under a minute. (It'll go even faster if you don't accidentally decompile the obfuscated JAR instead of the remapped one&hellip;). Once your decompiler is finished, you'll be greeted with a folder containing the full source code of Minecraft!

<aside>

Fernflower/Quiltflower accept a great deal of options that control the decompilation process, which are documented on each project's [README](https://github.com/QuiltMC/quiltflower). If you find that the decompiled code does not meet your expectations, you may have to mess with the command line options that you're invoking the decompiler with.

</aside>

# Epilogue

If all of this seems like too much work to you, you're in luck: there's a project called [DecompilerMC](https://github.com/hube12/DecompilerMC) which will fetch all the tools and files necessary to decompile any version of Minecraft with released mappings automatically. 

For versions 1.12 and below, [ModCoderPack](http://www.modcoderpack.com/) can be used to deobfuscate Minecraft with community-submitted mappings. Similarly, [MCPConfig](https://github.com/MinecraftForge/MCPConfig/tree/master/versions/release) has mappings for 1.12 up to 1.19.