It's that time of year again. Yes. After a 14-month drought of commits on my [operating system project](https://github.com/adrian154/egg-kernel/), I have decided to bring it back to life, this time armed with 2x as much undue optimism, programming knowledge, and (most importantly) free time.

I've gone ahead and dumped what egg-kernel is currently capable of to serve as a sort of roadmap for future development.

egg-kernel starts when its bootsector is loaded. The bootsector loads the bootloader, which...

* enables the A20 line
* retrieves a map of available memory using the BIOS
* loads the kernel into memory
* sets up a basic flat memory model using the GDT
* enters protected mode
* launches the kernel

The kernel itself doesn't do anything that you'd expect an actual OS to do. (Yet.) It's mostly more x86 housekeeping:

* set up a GDT (again) and IDT 
* install exception handlers
* remap the PIC and abstract away some of the more gory details of IRQ handling
* enable paging
* enter usermode and immediately raise a GPF for shits and giggles

egg-kernel is the third iteration of my OS development journey. This time, I think I have accumulated enough knowledge to actually take it further. Regardless, I'm not 100% satisfied with the codebase; there's a lot of poor design decisions (evidence of my rather bad understanding of C), and probably a healthy dose of undefined behaviors sprinkled in. Also, regrettably enough, I wrote most of egg-kernel during the height of my infatuation with CamelCase, leaving me forever beholden to my past foolishness.

Here is my loosely structured TODO list for the kernel.

* Implement a basic stream interface, so that logging can be handled with stdout/stdin. (this way logging via serial ports can also be seamlessly integrated)
* Flesh out memory management
    * Implement a better physical memory allocator
        * The current allocator is rather inelegant. Page availability is tracked through a giant bitmap, which comes with the disadvantage of O(N) allocations. Maybe a stack or buddy-based scheme would be faster.
    * Recursively map page tables
    * Make sure all the TLB-handling code works
    * Implement a virtual address allocator
        * Implement a kernel heap so we can stop allocating everything statically.
    * (Maybe) switch to a higher-half kernel, since this seems to be recommended as a Good Thing&trade;
        * Why exactly is it better?
        * Gripe: this means paging might have to be set up in the bootloader, which is rather ugly.
* Work towards usermode and multitasking
    * Figure out the TSS
    * Implement software context switches
    * Implement a scheduler
        * Create an abstract interface for PIT/HPET/other timing interrupt sources
    * Make some syscalls
        * Write a userspace libc
    * Parse object file format instead of using flat binaries
* Transition to an actual filesystem
    * Implement fs-reading code in bootsector/bootloader
    * Update build process accordingly
    * Write some ATA code for protected mode disk IO
    * Which filesystem?
        * exFAT seems reasonably modern but also not super complicated
* Far-future food for thought
    * Support for SMP
    * Support for long mode
    * Use APIC instead of 8529 PICs
        * What about MSI?
    * Mess around with vm86
    * Mess around with ACPI
    * Mess around with PCI/virtio
    * Try running the OS on some real hardware

Later down the road I plan on writing some follow-up posts detailing my development journey on this blog. That is, if I ever get around to it.