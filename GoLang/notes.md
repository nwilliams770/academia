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