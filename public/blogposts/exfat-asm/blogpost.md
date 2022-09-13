About once a year, I'm able to find the motivation to work on my [OSDev project](https://github.com/adrian154/blueberry). I've been in need of some distraction recently, so now seems like a fitting time to try my hand at writing a bare-bones exFAT driver in assembly.

The ultimate goal is to launch the kernel from a file on an exFAT-formatted partition. In order to accomplish this, a few things are necessary:
- Locate the partition
- Find and load the file into memory 
- Parse ELF, perform relocation, etc.

Right now, I've got the first step down. We'll be tackling the second step in today's blogpost.

# Background

Before we start coding, it behooves us to have a high-level understanding of how FAT filesystems work. For starters, the name gives us some clues; FAT stands for **File Allocation Table**. Indeed, FAT splits every volume into two parts: the file allocation table and the cluster heap.

The cluster heap consists of clusters, which are simply contiguous groups of sectors of a fixed size. The FAT is a series of cluster indexes, one per cluster, forming linked lists of clusters (or cluster chains). Each file is represented by a cluster chain.

The directory structure also lives in the cluster heap. There is a root directory from which all files and directories descend; each directory contains references to its children.

For simplicity, we'll make our kernel a single file in the root directory, so our work is cut out for us:
- Determine filesystem parameters (sectors per cluster, location of FAT and cluster heap, etc.)
- Find root directory, determine which cluster chain represents the kernel file
- Read FAT to determine next cluster in chain
    - Repeat until we've reached the end of the chain

# FAT Basics

First, let's open up the actual disk image that we'll be working with to see if we can make some sense of it.

The first sector of an exFAT partition is the Main Boot Sector, which mainly serves to describe the structure of the filesystem.

*Note:* In the disk image that I'm working with, the first sector of the exFAT partition is at sector 51.

<div class="client packet">
<div class="segment" data-hex="eb7690" data-name="JumpBoot">

JMP instruction, a relic from older FAT filesystems where the first sector of the volume was loaded and executed.

</div>
<div class="segment" data-hex="4558464154202020" data-name="FileSystemName">

A string identifying the filesystem ("EXFAT")

</div>
<div class="segment" data-hex="0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" data-name="MustBeZero" data-preview-truncate="39">

53 zero bytes.

</div>
<div class="segment" data-hex="0000000000000000" data-name="PartitionOffset">

The media-relative offset of the partition, in sectors. Zero indicates that we should ignore this field.

</div>
<div class="segment" data-hex="ac7f000000000000" data-name="VolumeLength">

The length of the volume, in sectors. 

</div>
<div class="segment" data-hex="80000000" data-name="FatOffset">

The volume-relative offset of the first FAT, in sectors. In our case, this field tells us that we need to go to sector 128 + 51 = 179 to find the FATs.

</div>
<div class="segment" data-hex="20000000" data-name="FatLength">

The length of each FAT, in sectors.

</div>
<div class="segment" data-hex="a0000000" data-name="ClusterHeapOffset">

The volume-relative offset of the cluster heap, in sectors. In our case, the first cluster is located at sector 160 + 51 = 211.


</div>
<div class="segment" data-hex="e10f0000" data-name="ClusterCount">

The number of clusters in the cluster heap.

</div>
<div class="segment" data-hex="05000000" data-name="FirstClusterOfRootDirectory">

The cluster index of the root directory, from which all other directories descend.

</div>
<div class="segment" data-hex="62ffc73c" data-name="VolumeSerialNumber">

A value to assist in distinguishing exFAT volumes.

</div>
<div class="segment" data-hex="0001" data-name="FileSystemRevision">

The version of exFAT used (1.00)

</div>
<div class="segment" data-hex="0000" data-name="VolumeFlags">

Bitfields describing certain properties of the volume:
- Bit 0: which FAT is the active one (a volume can contain up to two FATs)
- Bit 1: whether the volume is in a consistent state
- Bit 2: whether the media has experienced read/write failures before

</div>
<div class="segment" data-hex="09" data-name="BytesPerSectorShift">

The number of bytes per sector, encoded as a bitshift. In this case, it is indicated that there are 1 &lt;&lt; 9 = 512 bytes per sector. 

</div>
<div class="segment" data-hex="03" data-name="SectorsPerClusterShift">

The number of sectors per cluster, encoded as a bitshift. In this case, there are 1 &lt;&lt; 3 = 8 sectors per cluster.

</div>
<div class="segment" data-hex="01" data-name="NumberOfFats">

The number of FATs in the volume.

</div>
<div class="segment" data-hex="80" data-name="DriveSelect">

The drive number for use with [INT 13h](https://en.wikipedia.org/wiki/INT_13H).

</div>
<div class="segment" data-hex="00" data-name="PercentInUse">

The percentage of clusters in the cluster heap available for use. In our case, our test file is so small that not even 1% of the available space is used.

</div>
<div class="segment" data-hex="00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" data-name="Unused/Reserved" data-preview-truncate="39">

This space is meant to be occupied by bootcode, but we don't have any. Some of this space is reserved.

</div>
<div class="segment" data-hex="55aa" data-name="BootSignature">

A magic number indicating to IBM PCs that the volume is bootable. Not significant in our case since this sector is not the first sector on our disk.

</div>
</div>

One important thing to note is that clusters are indexed starting from 2, due to historical reasons. Thus, we should interpret the FirstClusterOfRootDirectory value of 5 as three sectors beyond the start of the cluster heap.

Anyways, our first order of business is to read the root directory so we can locate the kernel. If we head to the sector at `(FirstClusterOfRootDirectory - 2) << SectorsPerClusterShift + ClusterHeapOffset + PartitionOffset`, we'll find the root directory, which consists of a series of directory entries.

The first directory entry is the volume label, whose function is self-explanatory.

<div class="client packet">
<div class="segment" data-hex="83" data-name="EntryType">

A bitfield indicating entry type. The way exFAT categorizes entry types is, in my opinion, a little idiosyncratic. This byte consists of three bitfields:
- Bit 7: whether the directory is in use
- Bit 6: the type category (0 is critical, 1 is benign)
- Bit 5: the type importance (0 is primary, 1 is secondary)
- Bits 0&ndash;4: the type code, whose interpretation depends on the type category and importance.

In this case, the specification says that a critical primary entry with a type code of 3 is a Volume Label directory entry.

</div>
<div class="segment" data-hex="09" data-name="CharacterCount">

The number of characters in the volume label. Because the size of the DirectoryEntry header is fixed, this field is limited to 11.

</div>
<div class="segment" data-hex="42006c007500650062006500720072007900" data-name="VolumeLabel">

The volume label ("Blueberry"), encoded with UTF-16LE.

</div>
<div class="segment" data-hex="000000000000000000000000" data-name="Unused/Reserved">

The rest of the directory entry is filled with zeroes.

</div>
</div>

The second directory entry provides the location of the allocation bitmap, which is used by the operating system to find unused clusters fo allocation. We won't be interacting with this since we will not be writing files.

<div class="client packet">
<div class="segment" data-hex="81" data-name="EntryType">

0x81 indicates an in-use critical primary entry with a type code of 1. The specification says that this entry is the Allocation Bitmap.

</div>
<div class="segment" data-hex="00" data-name="BitmapFlags">

The LSB of this field describes which FAT the allocation bitmap describes. The remaining bits are reserved. In this case, 0 means that it describes FAT #1.

</div>
<div class="segment" data-hex="000000000000000000000000000000000000" data-name="Reserved">

Reserved bytes to pad out the directory entry.

</div>
<div class="segment" data-hex="02000000" data-name="FirstCluster">

The first cluster of the allocation bitmap.

</div>
<div class="segment" data-hex="fd01000000000000" data-name="DataLength">

The number of bytes in the allocation bitmap.

</div>
</div>

The third directory entry describes the up-case table, which maps lowercase unicode characters to their uppercase equivalents. Most characters which do not have a clear lowercase/uppercase mapping simply map to themselves, though of course this is not the case for certain ranges like the Latin alphabet.

<div class="client packet">
<div class="segment" data-hex="82" data-name="EntryType">

0x81 indicates an in-use critical primary entry with a type code of 2. The specification says that this entry is the Up-case Table.

</div>
<div class="segment" data-hex="000000" data-name="Reserved">

I'm not sure why these three bytes are reserved, but they are.

</div>
<div class="segment" data-hex="0dd319e6" data-name="TableChecksum">

A checksum used to ensure table integrity.

</div>
<div class="segment" data-hex="000000000000000000000000" data-name="Reserved">

More reserved bytes.

</div>
<div class="segment" data-hex="03000000" data-name="FirstCluster">

The first cluster of the up-case table.

</div>
<div class="segment" data-hex="fd01000000000000" data-name="DataLength">

The number of bytes in the up-case table.

</div>
</div>

The last directory entry is the one matching our test file.

<div class="client packet">
<div class="segment" data-hex="85" data-name="EntryType">

0x81 indicates an in-use critical primary entry with a type code of 5. The specification says that this entry is a File.

</div>
<div class="segment" data-hex="92" data-name="SecondaryCount">

The number of secondary entries that follow the file.

</div>
<div class="segment" data-hex="4fa7" data-name="SetChecksum">

The checksum of all directory entries within the set, excluding this field.

</div>
<div class="segment" data-hex="2000" data-name="FileAttributes">

A set of bitfields describing file attributes.
- Bit 0: MS-DOS read-only attribute
- Bit 1: MS-DOS hidden attribute
- Bit 2: MS-DOS system attribute
- Bit 3: reserved
- Bit 4: MS-DOS directory attribute
- Bit 5: MS-DOS archive attribute

There's an excellent article by Raymond Chen covering the meanings of these attributes, how they came to be, and why there's a gap between system and directory on [The Old New Thing](https://devblogs.microsoft.com/oldnewthing/20180830-00/?p=99615).

I'm not sure why, but one of the reserved bits is set on this file. It could be intended behavior, a bug, a misunderstanding on my part&hellip; please comment if you know more.

</div>
<div class="segment" data-hex="0000" data-name="Reserved">

Two reserved bytes.

</div>
<div class="segment" data-hex="b0592a55" data-name="CreateTimestamp">

A timestamp describing when the file was created.
- Bits 0&ndash;4: second
- Bits 5&ndash;10: minute
- Bits 11&ndash;15: hour
- Bits 16&ndash;20: day
- Bits 21&ndash;24: month
- Bits 25&ndash;31: year

</div>
<div class="segment" data-hex="b0592a55" data-name="LastModifiedTimestamp">

A timestamp describing when the file was modified. Same format as CreateTimestamp.

</div>
<div class="segment" data-hex="b0592a55" data-name="LastAccessedTimestamp">

A timestamp describing when the file was most recently accessed. Same format as CreateTimestamp.

</div>
<div class="segment" data-hex="00" data-name="Create10msIncrement">

An additional field providing 10ms resolution to the create timestamp.

</div>
<div class="segment" data-hex="00" data-name="LastModified10msIncrement">

An additional field providing 10ms resolution to the last modified timestamp.

</div>
<div class="segment" data-hex="00" data-name="CreateUtcOffset">

The offset from UTC of the create timestamp. A value of 0 means this offset should be ignored.

</div>
<div class="segment" data-hex="00" data-name="LastModifiedUtcOffset">

The offset from UTC of the last modified timestamp. A value of 0 means this offset should be ignored.

</div>
<div class="segment" data-hex="00" data-name="LastAccessedUtcOffset">

The offset from UTC of the last accessed timestamp. A value of 0 means this offset should be ignored.

</div>
<div class="segment" data-hex="00000000000000" data-name="Reserved">

Some zero bytes to pad the entry to the required length.

</div>
<div class="segment" data-hex="c0" data-name="EntryType">

0xC0 indicates a critical secondary entry with a type code of 0. The specification says that this entry is the Stream Extension. 

</div>
</div>

85
02
4fa72000
0000
b0592a55
b0592a55b0592a55
00
00

00
00
00
00000000000000

c0030008683300002c00000000000000000000000600
00002c00000000000000c10074006500730074002e007400780074000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000
000000000000000000000000000000000000000000000000000000000000