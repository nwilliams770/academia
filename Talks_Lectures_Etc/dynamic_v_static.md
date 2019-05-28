## Static vs Dynamic Typing [source](https://hackernoon.com/i-finally-understand-static-vs-dynamic-typing-and-you-will-too-ad0c2bd0acc7)
 Review **source code** and **translation**, original code vs translated-for-machine code,
 **compiled** and **interpreted**, translated before run-time vs translated on the fly

**Typing**: When types are checked; type coercion, `"3" + 5`, strongly typed languages like Go, Python will throw a type error and weakly typed languages like JS permit type coercion (`"3" + 5 => "35"`)
Static, types checked before run-time, vs dynamic, types checked on fly during execution,


Type-checking not concernd with language being compiled or interpreted
Let's see an example:
```python
def foo(a):
    if a > 0:
        print 'Hi'
    else:
        print "3" + 5
foo(2)
```
Python is interpreted and dynamically typed, so it only translates and type-checks code it's executing. `else` block did not run so it's never looked at and we won't have an error.

If it was statically typed?
Type error would be thrown before code is even run. Type-checking still performed before run-time even though it is interpreted

If it was compiled?
Else block would be translated/looked at before run-time but because dynamically typed it wouldn't throw an error. Dynamically typed langauges don't check types until execution and that line never executes

another example with Golang...
```golang
func foo(a int) {
  if (a > 0) {
      fmt.Println("Hi")
  } else {
      fmt.Println("3" + 5)
  }
}
func main() {
  foo(2)
}
```
statically typed and compiled
Types checked before running and type error caught. Even if interpreted types checked before run-time

How does it relate to Performance?
In general terms,
Compiled languages have better run-time performance if statically typed because knowledge of types will allows for machine code optimization
Statically typed in general more perfomant during run-time due to not need to check types during execution
Compiled languages faster at run time as they are pre-translated into machine code
Note delay before runtime for both compiled and statically typed

Static typing catches errors early, useful for long programs, often prevents variables from changing types which can defend against unintened mutations.

Dyanmic more flexible but allowsing variables to change types can sometimes lead to unexpected and hard to debug errors

## Dynamically Typed Languages Are Not What You Think [source](https://medium.com/@Jernfrost/dynamically-typed-languages-are-not-what-you-think-ac8d1392b803)
```
add x y = x + y   // Haskell syntax, static and strongly typed language
add(x::Int64, y::Int64) = x + y    // Julia code, dynamically typed language
```
Whether a langauge is storngly, weakly, static or dynamically types has little to do with source code, it's all about semantics

Static typing prevents running error-filled programs but at the expanse of some complexity. C/C++, Java are more verbose, must always declare types. Haskell on the otherhand avoids verboseness at the expense of a complex type system