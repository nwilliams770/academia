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

### Lesson 5: Grouping Data (Aggregate Data Types)
* Let's look at some data types and structures that we can use to group various amounts of data, of the same type and in some cases, not of the same type
* For arrays in Go, we must specify the size and type it will hold: `var x [5]int` => an `int` array of length 5
    * Note that the length of an array is part of its type! so `var x [5]int` and `var y [6]int` are technically different types :p
* However, in Go, arrays are actually discouraged from use *in the documentation* as treated more so as a building block for slices

Let's introduce slices:
* We're going to create a slice using a **composite literal**, a way we can compose a bunch of values together of the same type:
* From the docs: composite literals construct values for structs, arrays, slices, and maps and create a new value each time they're evaluated
```go
x := type{values} // composite literal
x := []int{4, 5, 6, 7, 8, 42}
```
And now let's look at some things we can do with slices
* We can get the length of it from the built-in `len` method, `len(x)`
* We can index into a slice like we would an array, `x[0]`
* We can loop over it, `for i, v := range x { ...block }` where `i` is our index and `v` is current value
* We can slice a slice, using the `:` operator: `x[1:3]` => [5, 7] (the second value is up to and not including) | we don't need to provide a terminating index either, it'll default to the rest of the slice: `x[1:]` => [5 7 8 42]
* We can append to a slice. `x = append(x, 77, 88)` => [4, 5, 6, 7, 8, 42, 77, 88]
* We can append a slice to another, `y := []int{45, 46}`, `x = append(x, y...) // note the ... is like a spread operator, unfurls all the values of y`
    * To summarize, we cannot just append two slices, we must append values of the same type that the slice holds which is why we must unfurl the slice using `...`
* We can delete from a slice, `x = append(x[:2], x[4:]...)` will remove the 3rd and 4th values from the slice

* Most times you will use a composite literal to declare a slice but you can also do so using the built-in function `make([]T, length, capacity)`:
    * A slice, unlike an array, is dynamic in size and therefore takes a little more processing power when it's size needs to increase to fit more values (a new array must be created and all values must be copied over into it)
    * By using `make` and being very explicit about the length we want, we can be more performant during runtime and compilation
    * We can use make like so: `x := make([], 10, 100)` => `[0,0,0,0,0,0,0,0,0,0]`, we can verify this by using `len(x) => 10` and `cap(x) => 100`
    * What would happen if we added more values than our capacity? Our array will double in size (note: definitely look up the algorithmic reasoning behind that, it's definitely most cost-effective to double the size)

* Note that for slices we can have multi-dimensional, or nested, slices. These can be declared using the following syntax: `xp := [][]string{*slice1*, *slice2*, ..etc}`

Let's look at Maps now:
* A hash map, key-value pairs, unordered list, very fast lookup (duhhh): `map[key]value{"James": 32,"Miss Moneypenny: 27,}`, `map[string]int{}` (note `map[string]int` *is* our type)
* Note that in Golang, if you key into a map with a key that does not exist, you will get a zero value, this can be quite problematic as we don't know if the key exists of if it's corresponding value is 0, so there's a way to check: `v, ok := m["key that doesn't exist"]`
    * v is the value and the optional indentifier (normally called ok) lets us know if that key exists
    * A very common idiom (the comma-ok idiom) you may see is `if v, ok := m["James"]; ok { ...block }
* To add a new item the map, we use same syntax we've used in previous languages, `m["new_key"] = value`
* To remove an item from a map we can the built-in `delete` function: `delete(<map name>, "key")`
* To iterate over a map, we can use `for..range`: `for k, v := range m { ...block }`

---

### Lesson 6: Structs
* A struct is a data structure which allows us to compose together values of different type, it's an *aggregate* data structure or also known as a composite data struture
* When structs are nested, noteworthy to mention that the inner type is 'promoted' to the outer type, which is to say, fields of the inner type become available via the outer type, this can be shown through accessing those promoted fields with dot notation
* Note that structs may look a lot like objects but we use a different vocabulary to describe them, for example, we have an *instance* of an object but in Golang we call it a *value* of that type
* Let's look at anonymous struct:
    * There may be moments when we want to define a struct on the fly for quick use, we can use an anonymous struct for that as opposed to polluting our code with a named struct we'd only use once
```golang
// named
type person struct {
    first string
    last string
    age int
}
// anonymous
p1 := struct {
    first string
    last string
    age int
}
```
* Is Golang OOP? Go has OOP aspects but it's all about TYPE. We create TYPES in Go, user-defined TYPES. We can then have VALUES of that type. We can assign VALUES of a user-defined TYPE to VARIABLES. Some of those aspects are:
    * Encapsulation
        * state ("fields")
        * behavior ("methods")
        * exported and unexported; viewable and not viewable
    * Reusability
        * inheritance ("embedded types")
    * Polymorphism
        * interfaces
    * Overriding
        * "promotion"
* In Go:
    * you don't create classes, you create a TYPE
    * you don't instantiate, you create a VALUE of a TYPE

---

### Lesson 7: Functions
* All about being modular--we want to avoid spaghetti code, we can be modular in Go by using functions and packages
* function structure is..`func (r receiver) indentifier(parameters) (return(s)) {...}`
    * we define our function with parameters (if any) and we call our function and pass in arguments
```golang
// multiple returns have to be in (), otherwise they don't have to be
func mouse(fn string, ln string) (string, bool) {
    a := fmt.Sprint(fn, " ", ln, `, says "Hello!"`)
    b := false
    return a, b
}
```
* We can have variadic parameters in our functions, such as `func foo(x ...int)` but what type will `x` be if we call `foo(2, 3, 4, 5)`? A slice of `int`s
    * Keep this in mind when you work with variadic parameters so you know how to properly handle them in your functions!
    * Variadic parameters must be the LAST parameters in your function as well
    * Note that, even with variadic params, we must respect types, for example:
```golang
xi := int[]{1, 2, 3, 4}
x := foo(xi) // THIS WILL ERROR, foo accepts any number of ints NOT a slice of ints
x := foo(xi...) // With '...' we can 'unfurl' the slice and feed our function its contents e.g. ints!
x := foo() // This ALSO works! variadic params can accept NOTHING and be just fine
```
* Let's look at the `defer` keyword:
    * It, as you can guess, defers the execution of a function
    * Deferred functions will be called after their wrapper functions have returned
    * When to use? We can use it when opening a file. After we open the file, inside that function we can call a deferred function to close it so we never leave files open

* How about methods? Structs with functions
```golang
// ALL values of secretAgent can now access the 
func (s secretAgent) speak() {
    fmt.Println("I am", s.first, s.last)
}
sa1 := secretAgent{
    person: person{
        "James",
        "Bond",
    },
    ltk: true,
}
```
* Interfaces allow us to define behavior and to do polymorphism:
```golang
// 
type human interface {
    // This means that, any other type that also has the method `speak()` is ALSO of type human

    // "If you have these methods then you are also my type"
    speak()
}
```
* A value can be of more than one type! By assigning any type that has the method `speak` to type `human` as well, we can do human-specific things such as `speakHuman (h human) { fmt.Println("human speaking!)}`
    * As long as the argument contains the method `speak`, it can be used in `speakHuman`
    * This means that VALUES of other types such as `secretAgent` or `person` can also be passed to `speakHuman` as they both have `speak` methods

* Go supports anonymous functions, syntax is quite similar to IIFEs in JavaScript:
```golang
func main() {
    func () {
        fmt.Println("The meaning of life is 42")
    }()

    // We can also have function expressions:
    f := func(x int) {
        fmt.Println("The meaning of life is:", x)
    }

    f(42)

    // We can also return functions:
    // Note we don't need to wrap parens around our return type because we are only return ONE thing
    func bar() func() int {
        return func () int {
            return 451
        }
    }

    // Note we can call the returned by function by stacking the call operator
    bar()() // => 451

    // Go also supports callbacks (passing a func as an argument), demonstrated in func even
    func sum(xi ...int) int {
        total := 0
        for _, v := range xi {
            total += v
        }
        return total
    }

// note our variadic param has to be last!
    func even(f func(xi ...int) int, vi...int) int {
        var yi []int
        for _, v := range vi {
            if v % 2 == 0 {
                yi = append(yi, v)
            }
        }
        return f(yi...)
    }

    // We can also encapsulate variables e.g limit their scope by using closures
    {
        // This here is a "closure", just not one we'd see in the wild but it is that simple to encapsulate a variable
        y := 42
        fmt.Println(y)
    }

    func increment func() int {
        var x int
        return func () int {
            x++
            return x
        }
    }

    a := increment()
    b := increment()
    // If we call the functions in a and b, we'll see that they will each iterate INDEPENDENTLY of each other

    // Let's look at an example of recursion

    func factorial(n int) int {
        if n == 0 {
            return 1
        }
        return n * factorial(n-1)
    }

}
```

---

### Lesson 8: Pointers
* A pointer is just an address to a place in memory where a value is stored
* In Go, we can see/access the address of any stored value using the `&` operator: `a := 42 // fmt.Println(&a)`
* Like C, a pointer type is represented with `*`, `*int`, `*string` BUT we use the same symbol, `*` an an operator to deference a pointer/memory address:
```golang
a := 42
b := &a // of type *int
c := *b // 42
*&a // 42 | We get the address using &, then get the value stored at that address using *

// Note how we can mutate values stored in other variables using pointers and their operators
// ALSO by passing pointers, we're able to manipulate values outside of local function scope
a := 42
b := &a
*b := 52
fmt.Println(a) // 52
```
When is it appropriate to use pointers?
* If we're working with very large pieces of data, we can pass around their addresses as opposed to the data itself, helps performance to a degree
* If a value needs to be changed that's at a certain location
* Everything in Go is **passed by value**

* Method sets determine what methods attach to a TYPE. It is exactly what says it is: The set of methods for a given type? That is its method set!
    * A NON-POINTER receiver, recall: `func (c circle) area() float64 {...}`
        * works with values that are POINTERS and NON-POINTERS
    * A POINTER receiver
        * *only* works with values that are POINTERS
* Note that, when dereferencing a struct, use `(*value).field` BUT, as an exception, if the type of `x` is a named pointer type and `(*x).f` is a valid selector expressin denoting a field (but not a method), `x.f` is shorthand for `(*x).f`

---

### Lesson 9: Application
More more example based section, good examples of working with `Writer` as well as `Marshal` and `Unmarshal` examples
Also a great example of custom sorting such as by a type's field
* Let's start looking at the standard library and some applications
* When using the JSON package, we can use `Marshal` to convert data to JSON and `Unmarshal` to convert JSON data to something Go can work with
* We can use `Encode` and `Decode` for a quicker, less methodical way to convert data to and from JSON

---

### Lesson 10: Concurrency
* A little history: 2006, Intel releases first dual-core processor and 2007, Go development begins with intent to natively take advantage of multiple cores
* Let's review parallelism, concurrency, and the differences:
    * **parallelism**: when tasks *literally* run at the same time e.g. on a multicore processor. A condition that exists when at least two threads are executing simultaneously
    * **concurrency**: when two or more tasks can start, run, and complete in overlapping time periods. Doesn't mean they'll ever both be running at the same time. For example, *multitasking* on a multicore processor. A condition that exists when two threads are making progress.
        * Note that concurrency is a design pattern, a way you can write code (concurrent parallel) that can run in parallel. It does NOT guarantee parallelism in any way
    * Keep in mind some tasks may be *interruptible* and/or *independentable* which will affect the feasibility of concurrently executing a task [good example](https://stackoverflow.com/questions/1050222/what-is-the-difference-between-concurrency-and-parallelism?page=1&tab=votes#tab-top)

How can we write concurrent code in Go? Let's go over new some keywords
* `go <function call>` will launch something into its own Goroutine
* `func init()` is run once before `func main()`, usually used to for web dev like setting up templates
* Once `func main()` runs, program is terminated so in order to 'sync' the code in the newly created Goroutine, we can use package `sync`, particularly `WaitGroup`

Quick reversion to method sets: **"The method set of a type determines the INTERFACE that the type implements"**

Back to concurrent code:
* In many different coding environments, concurrent programming can be made difficult by the subtleties requires to implement correct access to shared variables
* We can encounter **race conditions**: when two or more threads (for our case, it's two or more Goroutines that could be yielding the thread back and forth e.g. concurrently or in parallel) that can access the same data aren't in sync with their read-write functionality or attempt to modify the shared data at the same time
* "Do not communicate by sharing memory; instead, share memory by communicating"
* *Goroutines* used because threads, coroutines, processes convey inaccurate connotations. Its a function executing concurrently with other goroutines in the same address space.
    * prefix a function or method call with `go` to run the call in a new goroutine, note function literals can also be run in new routines with this syntax as well
* Good example of creating a [race condition](https://play.golang.org/p/FYGoflKQej) and cool tip, you can use a flag, `-race` when running your code to see if a race condition is present `go run -race <file>`
    * We have multiple goroutines accessing a shared variable `counter`
    * To solve this, we need to treat this variable almost like checking out a book, when a goroutine checks it out, nothing else can
    * We can implement this sort of design using a mutex, part of the `sync` package to essentially lock down parts of our code so that multiple goroutines cannot access the same variable at the same time
    * Package `atomic` also offers solutions to race conditions