## Linux, Unix, POSIX
[source](https://opensource.com/article/18/5/differences-between-linux-and-unix)
* Unix beginnings at AT&T Bell Labs, two notable members of team were Ken Thompson and Dennis Ritchie
* Many Unix concepts were derivative of its predecessor (Multics), the decision to write this small operating system in C is what separated it
    - At the time, operating systems were rarely portable but instead tightly linked to the hardcare platform for which they have been authored
    - By refactoring Unix in C, Unix could be ported to many hardware architectures
* Portability and Ken Thompson's Unix philosophy of modular software design allowed Unix to quickly expand to research, academic, and commercial uses
* What is the Unix philosophy?
    - Recommended utilizing small, purpose-built programs in combination to do complex overall tasks
    - Simple, short, clear modular, and extensible code that can be easily maintained and repurposed by developers other than its creators
* Unix designed around model of "piping" inputs and outputs of programs togethere into a linear set of operations
* Unix was NOT open-source but licensable and throughout the 80s and into the 90s, many different branches of Unix appeared (e.g. Unix Wars)
* The **POSIX** spec (a set standard of the API) was born in 1988 in order to address this

### Enter Linux
* Linux was actually the combination of two efforts in the early 90s: Richard Stallman, loking to create a truly free and open source alternative to Unix, and Linus Torvald
    - Stallman was working on the utilities and programs under the name GNU, but there was no kernel (a project was underway but developing a kernel is rough going!)
    - Linus Torvald produced a working and viable kernel called Linux
    - Torvald was already using several GNU tools and the marriage of GNU and the Linux kernel was a perfect match!
* Because Linux is free and open source, anyone could create a Linux distribution and soon there were hundreds!

### Comparing Unix and Linux
* From a UX perspective, not much is different! Much of the attraction of Linux was the operating system's availability across many hardware architectures and ability to use tools familiar to Unix system admins and users
* Because of POSIX standards and compliance, software written on Unix could be compiled for Linux with limited amount of porting effort