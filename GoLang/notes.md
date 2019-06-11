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

---

### Lesson 2: Variables, Values, & Types
Introduction to packages:
* variadic parameters
    * `...<some type>` is how we signify a variadic param
    * type `interface{}` is empty interface, every value is also of type `interface{}`
    * thus, `...interface{}` can accept infinite number of arguments of any type
* throwing away returns
    * `_` is used to cast away returns e.g. not do anything with them
* compiler will not allow unused vars
* notation in Go for using packages is
    * `package.Indentifier` ex: `fmt.Println()`

Exploring Types:
* short declaration operator, `:=`, allows us to declare and assign a value, ex: `x :=42`
    * when to use `var x = 42`? when you want to scope to be package level (e.g. entire program level)
    * we can also declare a variable a specific type, and it will by default be assigned it's **zero value** ex: `var z int` <= zero value for `int` is `0`




    

