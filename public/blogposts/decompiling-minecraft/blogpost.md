Sometimes, for one reason or another, you might want to take a look at Minecraft's source code to get a better understanding of the game's inner workings. This is a guide on how to accomplish just that.

To start, you need to obtain the game JAR as well as the deobfuscation mappings. I've compiled links to all of these resources [here](links.html).

We need the deobfuscation mappings because Minecraft's source code is *obfuscated*, meaning that the names of classes and methods are set to random, meaningless strings. This was originally done to prevent reverse engineering of the game, but even though it no longer serves this purpose it is still done.

The first thing we're gonna do is rename all the names in the game JAR using the obfuscation mappings. This can be accomplished using a tool called [SpecialSource](https://github.com/md-5/SpecialSource), which can be obtained through [Maven](https://search.maven.org/remotecontent?filepath=net/md-5/SpecialSource/1.11.0/SpecialSource-1.11.0-shaded.jar).
Here's the command to remap the client:

```plaintext
java -jar SpecialSource-1.11.0-shaded.jar \
    -i client.jar \
    -o client-remmaped.jar \
    -m client.txt \
    --kill-lvt
```

The `--kill-lvt` flag tells SpecialSource to ignore local variables. We include it since Mojang's official mappings do not include local variable names. If you are on Windows, type this command on one line without the backslashes.

Decompiling the server requires an extra step, since the `server.jar` you download is actually a launcher program that downloads the real server JAR along with the libraries it needs to run. When you start the server, it will create a folder called `versions`; the JAR that you want to decompile will be stored here.

Once the JAR is remapped, it's ready to be decompiled. There are a number of decompilers that will all work fine, but my preference is [Vineflower](https://github.com/Vineflower/vineflower). All you need to do is download the [latest release](https://github.com/Vineflower/vineflower/releases/latest), put the decompiler JAR in the same folder as the remapped JAR, and begin the decompilation:

```plaintext
java -jar vineflower-1.10.1.jar <remapped JAR> src/
```

Once the decompiler finishes, you're all set!

# Epilogue

If you just want one tool to do all of these steps, check out [DecompilerMC](https://github.com/hube12/DecompilerMC), which will fetch all the tools and files necessary to decompile any version of Minecraft with released mappings automatically.

For versions 1.12 and below, [ModCoderPack](http://www.modcoderpack.com/) can be used to deobfuscate Minecraft with community-submitted mappings. Similarly, [MCPConfig](https://github.com/MinecraftForge/MCPConfig/tree/master/versions/release) has mappings for 1.12 up to 1.19.