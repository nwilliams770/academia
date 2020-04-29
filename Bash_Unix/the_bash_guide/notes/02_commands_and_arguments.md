## Ch 2: Commands and Arguments
* Bash generally takes one command at a time, executes it, and when completed returns to you for next command; we call this *synchronous* command execution
* Some commands can take a long time to complete, in particular commands that start other programs with which you can interact; such as a file editor!
* Bash command is smallest unit of code that bash can independently execute. While executing, you cannot interact with the bash shell. As soon as bash is done executing, it returns to you for the next command to execute.
* Bash is mostly line-based; when it reads commands, it does so line-by-line
* Cannot execute a command until it has enough info to do its job; a special `>` prompt will be shown is command given is not yet at an end
* **compound commands** compound a bunch of basic commands into a larger logical block
* we can run commands from a text file (e.g. a script) in non-interactive mode using `bash [script]`
    - A bash script is a program in itself, although it does need the bash interpreter to do the work of translating the bash language into instructions the kernel understands
    - enter the *hashbang*: it tell the kernel what interpreter it needs to use to understand the language in a given file and where to find it
    - called a hashbang because it always begins with a hash "#" followed by a bang "!"; it then must specify an absolute pathname to any program that understands the language in your file and can take a single argument
* What's the difference between our file before and after adding the hashbang?
    - most systems require you to mark a file as executable before the kernel is willing to allow you to run it as a program
* In summary: Bash gets commands by reading lines. As soon as it reads enough lines to comppose a complete command, bash begins running that command. Usually, commands are just a single line long. An interactive bash session reads lines from you at the prompt. Non-interactive bash processes read their commands from a file or stream. Files with a hashbang as their first line (and the executable permission) can be started by your system's kernel like any other program

* Bash is a lax language interpreter, which means it will permit you to write ambiguous commands. Its syntax will not prevent you from writing commands that do things that are not what they seem. It it on you to learn syntax adequately, recognize the pitfalls, and pick up the discipline to stick to practices that consistently avoid buggy code.

### Basic grammar of a bash command
* At the highest level there are a few different kinds of commands.
Syntax annotation: **bold** must be written as-is, `[]` is optional parts, when element of syntax can be repeated multiple times, denoted with `...`

Simple commands:
[ var **=** value ... ] name [ arg... ] [ redirection... ]
* most common, specifies name of a command to execute along with optional set of arguments, env variables and file descriptor redirections
* before command name you can optionally put a few `var` assignments, which apply to the environment of this one commands only

Pipelines:
* an example of the "syntax sugar" that comes with bash
[ **time** [ **-p** ] ] [ **!** ] command [ **/** | **/&** ] command2... ]
* rarely use `time` keyword but convenient for finding out how long it takes to run commands
* Bash will create a *subshell* for each command and set up first command's stdout (standard output) such that it points to second command's stdin (standard input)
* `|` is the pipe symbol; tells bash to connect output of first command to input of second command.
* `|&` does the same but also connects stderr (standard error); usually undesirable since stderr file descriptor is normally used to convey messages to the user; if we send them to second commands rather than terminal display, need to make sure the second command can handle receiving these messages

Lists: A sequence of other commands. In esseence: a script is a command list: one commands after after. Commands in lists separated by a comtrol operator which indicated to bash what to do when executing the command before it

command control-operator [ command2 control-operator... ]
* Simplest control operator is starting a new line `;`, tells bash to run command and wait for it to finish before advancing to next in list.
* `||` control operator which tells bash to run command before as it normally would, but after finishing that move to the next command only if the command before it failed

Compound Commands: Commands with special syntax inside them. Most obvious example is a block of commands: block itself behaves as a single big command but inside it are a bunch of "sub" commands.

**if** list [ **;**| **<newline>** ] **then** list [ **;**| **<newline>** ] **fi**

**{** list **;** **}**

Coprocess: more bash syntax sugar. allows you to easily run a command asynchronously and set up some new file descriptor plugs that connect directly to new command's input and output.

**coproc** [ name ] command [ redirection... ]

Functions: when you declare a func in bash, essentially creating a temp new command which you can invoke later in the script.

name **()** compound-command [ redirection ]
* note parens should always be empty! they are not used to declare the args the function accepts

* In summary: Bash commands tell bash to perform a unit of work. These units of work cannot be subdivided: bash needs to know the whole command to be able to execute it. There are diff kinds of commands for diff types of operations. Some commands group other commands into blocks or test their result. Many command types are syntax sugar: their effect can be achieved differently, but they exist to make the job easier.

### Command names and running programs
[ var **=** value ... ] name [ arg... ] [ redirection... ]
* Let's look at a simple command again, the name tells bash what the joib is that you want this command to perform. To figure out what you want your command to do, bash performs a search to find out what to execute.
* In order, bash uses the `name` to try to find a
    - functions previously declared. All declared funcs are put in a list and bash searches this list to see if any of them have same name
    - builtin: tiny proedures built into bash. small operations programmed into bash and bash doesn't need to run a special program to be able to perform them.
    - program (aka external command): Bash looks for programs by looking into your sytem's configured `PATH`
* Note, before this search, bash checks if you've declared any *aliases* by the name of the command. If so, bash replaces the name by the value of the alias before proceeding.

### The `PATH` to a program
* We have all sorts of programs on your computer installed in different places. Some shipped with OS, others added by distribution, others installed by us or systems admin.
* On a standard UNIX system, a **few standardized locations** for programs to go. Some installed in `/bin`, others in `/usr/bin`, others in `/sbin`
* Enter `PATH` *environment variable* which contains a set of directories that should be searched for programs
* Bash looks through these listed directories whenever you try to start a program it doesn't yet know the location of
* To find where bash finds program for a command name, you can use the `type` built-in to find out (this is a more verbose response, if you need that for output you can use `which` which just returns the path)
* Sometimes you'll need to run a program that isn't installed in any of the PATH directories, in that case; you'll have to specify the path where bash can find that program (using an absolute path)
* In summary: when bash needs to a run a program, it uses the command name to perform a search. Searches the directories in PATH env variable, one by one, until it finds a directory that contains a program with the name of your command. To run a program not installed in a PATH directory, use the path to that program as your command's name

* The gross part of all bugs in bash shell are the direct result of their authors not properly understand command arguments
    - When we say "words" in the context of bash, we do NOT mean linguistic words
    - In bash, a word is defined as a sequence of chars considered a single unit by the shell. A word is also known as a token.
    - A bash word can contain many linguistic words
    - In bash, blank space is syntax just like anything else; it means "break up the previous apart from the next thing"; aka word splitting
* What about when a blank space is part of a file name or anything else? Two ways to make characters literal: quoting and escaping
    - quoting is wrapping chars in `"` or `'`
    - escaping is practice of placing a single `\` char in front of the char that we want to make literal
    - recommended to use quotes over escaping; clearer and more readable
    - if in doubt, quote your data! and never remove quotes to try to make something work
    - use double-quotes for any argument that contains expansions (such as `$variable` or `$(command)` expansions) and single quotes for any other arguments
* The rule:
    - if there is whitespace or a symbol in your arg, you must quote it
    - if there isn't, quotes are usually optional but you can still quote it to be safe
* Summary: To tell a command what to do, we pass it arguments. In bash, arguments are tokens, also called words, that are separated from each other by blank space. To include blank space in an argument's value, you need to either quote the argument or escape the blank spacee within. Failing that, bash will break your argument apart into multiple arguments at its blank space.Quoting arguments also prevents other symbols in it from being accidentally interpreted as bash code, such as '$10 USD' (variable expansions), "*** NOTICE ***" (filename expansions)

### Managing a command's input/output using redirection
* Processes use file descriptors to connect to streeams; each process will generally have three standard file descripters: stin (FD 0), stout (FD 1), sterr (FD 2)
* When bash starts a program, it sets up a set of file descriptors for that progrma first; it does this by looking at its own file descriptors and setting up an indetical set for the new process; we say new processes **inherit** bash's file descriptors.
    - when you open a new terminal shell, the terminal will ahve set up bash by connection file's input and output to the terminal (this is how keyboard input ends up in bash and bash's messages end up in the terminal window)
    - each time bash starts a program of its own, its gives that program a set of file descriptors to match its own
* We must employ *redirection* if we want to gain control over where our commands connect to: the practice of changing the source or destination of a file descriptor.
* Redirecting stout is done using the `>` operator; most common and useful form of redirection
* Another common use of redirection is for hiding error messages

`ls -l a b >myfiles.ls 2>/dev/null`
* In this case, we are redirecting stout to `myfiles.ls` and sterr to `/dev/null`
* Note how we can redirect any file descriptor (FD) by prefixing the `>` operator with the number of the FD. If a number if omitted, out redirections default to redirecting FD 1, stdout
* In our prev example, if we actually looked inside `/dev/null` using `cat /dev/null` we wouldn't see our error messages, why is that?
    - the file `null` is in the `/dev` directory
    - this is a special directory for *device files*
    - Device files are special files that represent devices in our system
    - When we write to or read from them, we're communicating directly with those devices through the kernel
    - The `null` device is a special device that is always empty; anything you write to it will be lost and nothing can be read from it; makes it useful for discarding information

* Back to our example, if wanted to save all output that would appear on the terminal (stout and sterr), we might think of doing something like:

`ls -l a b >myfiles.ls 2>myfiles.ls`

* THIS IS WRONG! Problem is that both FDs now have their own stream to the file which means both streams could be writing at the same time so you'd get an arbitrary garbled mix-together of the streams
* To solve this, we have to send both output and error bytes on **the same stream** and to do that, we have to duplicate FDs

`ls -l a b >myfiles.ls 2>&1`

* "copying" or duplicating FDs, is the act of copying one FD's stream connection to another FD. As a result, both FDs are connected to the same stream. We use the `>&` operator, prefixing it with the FD we want to change and following it with the FD whose stream we need to "copy"
* An important rule to note with redirecting FDs: redirections are eval'd from left to right.

`ls -l a b 2>&1 >myfiles.ls`
* Redirects FD 2's output to FD 1; which, at the time of eval, is probably the *terminal*; we can correct this by fixing the order of redirections like so:
`ls -l a b >myfiles.ls 2>&1`
* We first change the FD 1's target to stream to `myfiles.ls` then make FD 2 target the same as FD 1, which is the new stream to `myfiles.ls`