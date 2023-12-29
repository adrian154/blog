> I've been talking to this obnoxious elf binary, he's super talkative but I think he mentioned he wanted to give you a flag or something.

The challenge consists of a program that offers to read and print out 8 bytes from an array at a user-provided index, allowing us to read from anywhere in memory. We can also tell the program to execute a function at a user-provided address. Our goal is to locate a `get_flag` function loaded from a shared library.

The [source](nauseous.c) is provided, so the first thing I did was get the program running locally. You can do this by writing a stub implementation of `get_flag` and compiling your own version of the shared library, and replacing the reference to `get_flag.h` in the code with the prototype of `get_flag`. Then, we just need to set `LD_LIBRARY_PATH` so Linux can find the shared object.

```c
// getflag.c
char *get_flag() {
	return "flag{placeholder}";
}
```

```sh
gcc -fPIC -shared -o libgetflag.so getflag.c
gcc nauseous.c -L. -lgetflag
export LD_LIBRARY_PATH=.
```

Normally, when calling a shared library function from position-independent code, the program first performs a RIP-relative jump to a procedure in the .plt section. The procedure in .plt then jumps to an address stored in the .got section. 

We can see this process in action by tracing a simpler program:

```c
#include <stdio.h>

int main(void) {
        puts("The HORSE is a noble animal.");
        return 0;
}
```

This is what `main` looks like after compilation.

```plaintext
(gdb) disas main
Dump of assembler code for function main:
   0x0000000000001149 <+0>:     endbr64
   0x000000000000114d <+4>:     push   rbp
   0x000000000000114e <+5>:     mov    rbp,rsp
   0x0000000000001151 <+8>:     lea    rax,[rip+0xeac]        # 0x2004
   0x0000000000001158 <+15>:    mov    rdi,rax
   0x000000000000115b <+18>:    call   0x1050 <puts@plt>
   0x0000000000001160 <+23>:    mov    eax,0x0
   0x0000000000001165 <+28>:    pop    rbp
   0x0000000000001166 <+29>:    ret
```

Keep in mind that the CALL is RIP-relative, GDB just assumes an offset of 0 initially. If we actually run the program and disassemble again it will fill in the CALL addresses with the actual offsets.

Let's disassemble `puts@plt`:

```plaintext
(gdb) disas 0x1050
Dump of assembler code for function puts@plt:
   0x0000000000001050 <+0>:     endbr64
   0x0000000000001054 <+4>:     bnd jmp QWORD PTR [rip+0x2f75]        # 0x3fd0 <puts@got.plt>
   0x000000000000105b <+11>:    nop    DWORD PTR [rax+rax*1+0x0]
```

Basically, the real address of `puts` is read from the GOT and jumped to. The GOT is filled by the ELF loader before the program is started. 

So, now we know what we need to do: we need to read the GOT section, which contains the address of `get_flag`. How do we do this?

The problem is that our reads are relative to a stack-allocated buffer whose position is not fixed relative to the GOT. Luckily, the stack frame of the current function is right above the buffer, so we get the value of RBP and a return address in .text. Using these values, we can compute an index that enables us to start reading from .text, and if we keep incrementing the index we will eventually reach the GOT.

How do we know where the GOT starts? Interestingly, I noticed that the first 8 bytes of the GOT always seem to contain the offset of the .dynamic section, which in this case is 0x3d48. So we can just keep reading memory until we encounter this value. I am honestly not sure why this is the case, but it works.

Here's the script I used to solve the challenge:

<script src="https://gist.github.com/adrian154/5a8dd8911cbbda4710062053ff45f531.js"></script>

Running it yields

`flag{man_linux_binaries_are_gr0ss}`

# Resources

[PLT and GOT - the key to code sharing and dynamic libraries](https://www.technovelty.org/linux/plt-and-got-the-key-to-code-sharing-and-dynamic-libraries.html)

[GOT and PLT for pwning](https://systemoverlord.com/2017/03/19/got-and-plt-for-pwning.html)