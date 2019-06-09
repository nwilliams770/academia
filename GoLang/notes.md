## Topics
* Dev environment
* Variables, values, & type
* Fundamentals
* Control flow
* Grouping data
* Structs
* Functions
* Pointers
* Application
* Concurrency
* Channels
* Error handling
* Writing documentation
* Testing & benchmarking

---

### Lesson 1: Dev Environment
You will learn:
* Go workspace
* IDE's
* shell / bash commands (for unix, linux, mac)
* environment variables

General topics:
* GUI: graphical user interface
* CLI: command line interface
* Terminal: text input/output environment 
    * console: physical terminal
    * in unix, linux called shell or bash
    * in windows command prompt, windows command, cmd, dos prompt
* Instruction set architecture: Instructions given to CPU and the corresponding OS which is written to make that system operate
    * x86 (32-bit) or x86-64 (64-bit version e.g. 64 bits can be processed at a time by your machine)

**Go workspace**
Workspace (how computer and code is organized) in Go is quite opinionated for efficiency and team optimziation:
* one folder, any name, any location, needs:
    * bin: binary (compiled)
    * pkg: archived folders, e.g. pre-compiled code that hasn't changed since last compilation
    * src: namespacing, package management
        * github.com
            * \github.com username\
                * folder with code / repo
* `go get` used for package management
* GOPATH points to your go workspace
* GOROOT points to your binary installation of Go

**IDEs**
Integrated Development Environments


    

