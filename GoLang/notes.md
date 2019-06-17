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
* Because Go is statically-typed, vars are declared to hold VALUEs or a certain TYPE

Creating your own type:
* we can declare our own type in Go quite easily, `type corndog int` where `int` is the underlying type
* how can we make corndogs play with their underlying types (or other types for that matter): conversion:
    - `var x hotdog = 7` => `int(x)`

---

### Lesson 3: Fundamentals
A brief review of what's going on under the hood of our software:
* On & Off, 1 & 0, Binary Digits, Bits, and Machine Language are all words used to refer to this idea that, within a computer, it's all nothing but a bunch of ZERO's and ONE's, or switches that are ON or OFF. It's all just a bunch of binary digits or bits, that's the language which computers speak, it's machine language
* Circuits, switches, transistors and even "gates" are all words used to refer to this thing within a computer that can either be ON or OFF. People use all of those words to talk abotu this same thing: the ability of computers to store ON / OFF states.
* An example of one of the most common coding schemes today is **ASCII** and **UTF-8**

Review Numeral Systems:
* Binary is base 2, meaning we have a ones place, twos place, fours place, eights place, and only two characters, 1 and 0; (6 => 110 | 10 => 1010 | 86 => 110000 | 7 => 111)
* Hexadecimal is base 16, therefore using 16 characters, but because we only have 0-9 to represent numbers in our system, we use a-f to represent 10-15, ones place, 16's, 256's (75 => 49 | 10 => A | 911 => 38F)

Constants:
* constants are an unchanging value that can declared in different ways:
    * `const untypedHi = "hi"` (or `hi` for string literal)
    * `const str typedHi = "hi"`
    * `"Hello"` is an example of a untyped string constant
    * `const ( ... )` for declaration of multiple consts at once 
* when a constant is **untyped**, an untyped string constant in our example, it does not yet have a fixed type; it is a string but not a Go value of type `string`
* conversely a **typed** constant has Go type and cannot be assignd to a Go variable of a different type
* untyped constants have default types, an implicit type that it transfers to a value if a type is needed where none is provided: `str := "Hello"`
* In summary, typed constant obey all the rules of typed values in Go while an untyped constant does not carry a Go type in the same way and can mixed and matched more freelys. It does have a default type that is exposed when and only when no other type info is avail

Iota:
* a predeclared indentifier
* can be used an automatic +1 incrementers

Bit Shifting:
* `<<` and `>>` are using for shifting bits, which is a notion of shifting placevalues of bits:
```go
    x := 4  // 100 in binary
    y := x << 1 // => 1000 in binary, 8 in base-10

    // An application of bit shifting with iota + bit shifting
    _ = iota
    kb = 1 << (iota * 10)
    mb = 1 << (iota * 10)
    gb = 1 << (iota * 10)
```

---

### Lesson 4: Control Flow




    

