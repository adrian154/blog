About once a year, I'm able to find the motivation to work on my [osdev project](https://github.com/adrian154/blueberry). I've been in need of some distraction recently, so now seems like a fitting time to try my hand at writing an exFAT driver in assembly.

The ultimate goal is to launch the kernel from a file on an exFAT-formatted partition. In order to accomplish this, a few things are necessary:
- Locate the partition
- Find and load the file into memory 
- Ideally: perform relocation, etc.

Right now, I've got the first step down. The next step is to read the filesystem and load the kernel into memory.

# FAT Basics

Before we start coding, let's open up the actual disk image that we'll be working with to see if we can make some sense of it.

The first sector of an exFAT partition is the Main Boot Sector.

```
00000000  eb 76 90 45 58 46 41 54  20 20 20 00 00 00 00 00  |.v.EXFAT   .....|
00000010  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
00000040  00 00 00 00 00 00 00 00  ac 7f 00 00 00 00 00 00  |................|
00000050  80 00 00 00 20 00 00 00  a0 00 00 00 e1 0f 00 00  |.... ...........|
00000060  05 00 00 00 fc 31 a6 f5  00 01 00 00 09 03 01 80  |.....1..........|
00000070  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
000001f0  00 00 00 00 00 00 00 00  00 00 00 00 00 00 55 aa  |..............U.|
```

This has a few interesting fields:
- the file system name ("EXFAT"), which helps us identify that the partition is formatted with exFAT.
- the offset of the first FAT (128)
- the offset of the cluster heap (160)
- the first cluster of the root directory (5)
- bytes per sector (512)
- sectors per cluster (8)
- the number of clusters in the cluster heap

If we head to sector 128 + 51, we'll find the first FAT.

```
00000000  f8 ff ff ff ff ff ff ff  ff ff ff ff 04 00 00 00  |................|
00000010  ff ff ff ff ff ff ff ff  00 00 00 00 00 00 00 00  |................|
00000020  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
*
```

The exFAT spec says that the first two FAT entries are to be ignored, so we are left with four entries:
* 2: `ffffffff`
* 3: `00000004`
* 4: `ffffffff`
* 5: `ffffffff`

The FAT entries make up a linked list of clusters; each entry in the FAT represents the index of the next FAT entry. To find out which files map to which cluster chains, we need to take a look at the root directory.