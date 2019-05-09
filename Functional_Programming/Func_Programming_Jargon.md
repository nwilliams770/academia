# Functional Programming Jardon + EXAMPLES
[source](https://github.com/hemanth/functional-programming-jargon#arity)
## Arity
The number of arguments a function accepts. From words like unary, binary, ternary, arity is composed of the two suffixes "-ary" and "-ity".
If a function takes take arguments, it is a binary function or a function with an arity of two

## Higher-Order Functions (HOF)
A function which takes a function as argument and/or returns a function
```javascript
const filter = (predicate, xs) => xs.filter(predicate)
```

```javascript
const is = (type) => (x) => Object(x) instanceof type
```

```javascript
filter(is(Number), [0, '1', 2, null]) // [0, 2]
```

## Closure
Formal definition: A closure is a technique for implementing lexically scoped named binding. It is a way of storing a function with an environment.
    - Lexical scoping (aka static scoping) is a convetion that sets the scope (range of functionality) of a variable so that it may only be called/refernece from within the block of code in which it is defined. 
A scope which retains variables available to a function when it's creation 
```javascript
const addTo = (x) => {
    return (y) => {
        return x + y
    }
}
// or const addTo = x => y => x + y;
const addToFive = addto(5)
addToFive(3) // => 8
```
Note that the x value is retained in addtoFive's closure, this works because vars in the parent scope are not garbage-collected as long as the function itself is retained.

The state of the function `addTo` is saved even after the block of code is finished executing.

Common in event-handlers so they have access to vars defined in parents when eventually called

Lambda vs Closure:
- a lambda is just an anonymous function, a function defined with no name.
- A closue is any function which closes over the environment in which it was defined. This means it can access variables not in its parameter list!
- What is to note is that lamdbdas, because they are quick on-the-fly throwaway functions, are useful when writing closures!
so clean: 
```javascript 
const adder = x => y => x + y;
add5 = adder(5);
add5(1) == 6
```
The state 

## Partial Application
Creating a new function by pre-filling some of the args to the original function. Called Partially Appling a Function
```javascript
// Accepts a func and some args
const partial = (func, ...args) => {
    // returns a function that takes more args
    (...moreArgs) => {
        // and calls passed in function with all of args
        f(...args, ...moreArgs)
    }
}

const add3 = (a, b, c) => a + b + c;
const fivePlus = partial(add3, 2, 3) // => 2 + 3 + c
fivePlus(4) // => 9
```

Partial application helps create simpler functions from more complex ones by baking in data when you have it. You can use `Function.prototype.bind` to partially apply a function in JS: 
```javascript
const add1More = add3.bind(null, 2, 3) // (c) => 2 + 3 + c
```

## Currying
Note that curried functions are automatically partially applied.
Currying is the process of converting a func that takes multiple args into a function that takes them one at a time.
Each time func is called it only accepts one arg and returns a func that takes one arg, until all args are passed.
```javascript
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(40)(2) // 42.

const add2 = curriedSum(2) // (b) => 2 + b

add2(10) // 12
```

## Autocurrying
Transforming a function that takes multiple args into that, if given less than correct # of args, returns a func that takes the rest. Only when the func gets the correct # of args does it evaluate

lodash & Rambda have `curry` function that works this way, accepting a func as its arg

## Function Composition
The act of putting two functions together to form a third where the output of one func is the input of another
```javascript
const compose = (f, g) => (a) => f(g(a)) // Definition
const floorAndToString = compose((val) => val.toString(), Math.floor) // Usage
floorAndToString(121.212121) // '121'
```

## Continuation
At any given point in a program, the part of the code that's yet to be executed is known as a continuation. 
Often seen in async programming when program needs to wait receive date or something before continuing. Response is passed off to the rest of the program, e.g. the **continuation**, once it's beenr received

## Purity
A function is pure if the return value is **only** determined by its input values and does not produce side effects
A Pure function:
```javascript
const greet = (name) => `Hi, ${name}`
```

Impure versions:
```javascript
// Based on data stored OUTSIDE the function
window.name = 'Brianne'
const greet = () => `Hi, ${window.name}`

// Modifies state OUTSIDE the function
let greeting
const greet = (name) => {
  greeting = `Hi, ${name}`
}
```

## Side effects
A function has a side effect if, apart from returning a value, it interacts with (reads or write) external mutable state.

## Idempotent
A function is idempotent if reapplying it to its result does not produce a different result. From a RESTful service standpoint, for an operation or service call to be idempotent, clients can make the same call repeatedly while producing the same result 
`Math.abs(Math.abs(10))`

## Point-free style
Writing functions where definition does not explicitly identify arguments used. Usually requires currying or other Higher-Order funcs aka tacit programming
```javascript
const map = (fn) => (list) => list.map(fn)
const add = (a) => (b) => a + b

const incrementAll2 = map(add(1))
```

## Predicate
A function that returns true or false for a given value, common use is as the callback for an array filter
```javascript
const predicate = (a) => a > 2

;[1, 2, 3, 4].filter(predicate) // [3, 4]
```
## Contracts
Specifies the obligations and guarantees of the behavior from a func or expression at runtime. Set of rules that are expected from input and output, errors usually reported when contract violated

## Functor, ## Lift, ## Category Theory, ## Applicative Functor
Super complex, need to come back to look into more detail
[one explanation of functors](https://stackoverflow.com/questions/2030863/in-functional-programming-what-is-a-functor)

## Lazy Evaluation
Call-by-need evaluation mechanism that delays the evaluation of an expression until its value is needed. In functional langs, this allows for structures like infinite lists which would not normally be available in an imperative language where the sequencing of commands is significant
Note: `function*` defines a generator function, which returns a Generator object
```javascript
const rand = function*() {
  while (1 < 2) {
    yield Math.random()
  }
}
```

## Monoid
An object with a function that "combines" that object with another of the same type
A simple monoid is the addition of numbers: `1 + 1 // 2` (numbers are the objs and `+` is the func)
An identity value must also exist that when combined with a value doesn't change it. The indetity value for addition is `0`
Array concatenation also forms a monoid, the identity value is an empty array
If identity and compose functions are provided, functions themselves form a monoid
```javascript
const identity = (a) => a
const compose = (f, g) => (x) => f(g(x))
```

## Monad
Monad is vacuous for non-mathematicians, **computation builder** is more descriptive of what they are useful for.
[source](https://stackoverflow.com/questions/8428554/what-is-the-comonad-typeclass-in-haskell)

## Comonad

## Morphism
A transformation func.

### Endomorphism
A function where the input type is the same as the output (str => str // int => int)

### Isomorphism
A pair of transformations between two types of objects that is structural in nature and no data is lost.
EX: 2D coordinates could be stored in an array `[2, 3]` or object `{x: 2, y: 3}`

### Homomorphism

### Catamorphism

### Anamorphism

### Hylomorphism

### Paramorphism

### Apomorphism



