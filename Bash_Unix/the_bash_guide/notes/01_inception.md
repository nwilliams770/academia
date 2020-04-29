[source material](https://guide.bash.academy/)

## Ch 1 Inception: What is bash and where does it live?
* Bash is a program, but designed to be easy for you to talk to; but unlike others with a particular task in mind when designed, Bash was programmed to take commands from you, the user
* A "language" was created which allows users to "speak" to this program and tell it what to do, this language is bash shell language
* A **shell** program is one that provides users with an interface to interact with other programs; there's a variety each with their own language:
    - C shell (csh)
    - Z shell (zsh)
    - Korn shell (ksh)
    - Debian's Almquist shell (dash)
    - Bourne shell
* Bash (aka Bourne Again shell) is currently the most popular and ubiquitously available shell
* All these shells use seemingly similar syntax but it's important to be fully aware of the shell you're writing code in
* Bash uses a method directly counter to ideas of GUIs that employ buttons, widgets, text fields, etc.; it runs a text-only "console" where interaction is mainly limited to display chars on your screen and reading them from your keyboard
* Bash is a simple tool in a vast toolbox of programs that lets you interact with your system using a text-based interface

### Where do I find bash? How do I start using it?
* You'll find it as a simple executable located in one of your system's standard binary directories.
* A **binary** is an executable program that contains "binary code" which is executed directly by the system's kernel
* Two distinct modes of operation that the bash shell supports:
    - interactive mode: bash shell awaits your commands before executing them. Each command you pass it is executed. While being executed you cannot interact with the bash shell; after, you it awaits another command
    - non-interactive mode: Used for executing scripts (pre-written series of commands)
* The bash program generally runs in a text-based interface; standard way of open a text-based interface involved opening a *terminal*.
    - way back when, terminals were hardware devices we used to connect to a computer and interact with it. Now, most terminals are "emulated"
* The bash program is only one of many programs that can run in a terminal so it's important to note that *bash is not what's making text appear on your screen*. The terminal programs takes care of that, taking text from bash and placing it in its window for you to see.
* In a terminal, many terminal-based programs can run simultaneously, forming a chain through which your input and their output flows

### What exactly is a program and how does it connect to other programs?
* In short, a *program* is a set of pre-written instructions that can be run by your system's kernel. A program gives instructions to the kernel directly. A kernel is technically also a program, but one that runs constantly and communicates with your hardware instead

* A program generally lives on your disk. When you "run" or "execute" it, kernel creates a *process* for your program to work in, loading your programs pre-written instructions (code). Your program can run many times simultaneously, each of those instaces are running processes of your program
* A process relays instructions in your program to the kernel and also has a few hooks to outside world via file descriptors, essentially plugs we use to connect processes to files, devices, or other processes
* File descriptors are indentified by numbers, though first three have standard names:
    - standard input (File descriptor 0): where most processes receive their input from. By default, processes in your terminal will have standard input "connected" to your keyboard. More specifically, to the input your terminal program receives
    - standard output (File descriptor 1): where most processes send their output to. By default, processes in your terminal will have their standard output "connected" to your display. More specifically, your terminal program will display this output in its window.
    - standard error (File descriptor 2): where most processes send their error and info messages to. By default, processes in terminal will have their standard error "connected" to your display, just like standard output. Important to understand that standard error is just another plug, just like standard output, which lead's to terminal's display. It isn't dedicated to errors, in fact bash uses it for most informational messages as well as your prompt!
* A process is NOT limited to these three file descriptors, it can create neew ones with their own number and connect them to other files, devices, or processes as it sees fit.
* If a program needs its output to go to another program's input, as opposed to your display, it will instruct kernel to connect its standard output to the other program's standard input.
    - Now all info it sends to standard output file descriptor will flow into the other program's standard input file descriptor. These flows of info between files, devices, and processes are called **streams**
* A **streeam** is information  (specifically bytes) flowing through the links between files, devices, and processes in a running system.
    - They can transport any kind of bytes, and the receeiving end can only consume their bytes in the order they were sent.
    - Reading something from the stream consumes those bytes from the stream and the stream advances. Stream cannot be rewound for info to be re-read (so if a program wants to use some info read from a stream later, it better save it!)
* *File descriptors are process specific* and do not describe the streams that connect processes, they  only describe the process' plugs where these streams can be conneted to
* In summary, each time a program is started, the system created a running process for it. Processes have plugs called *file descriptors* which allow them to connect *streams* that leads to files, devices or other processes
