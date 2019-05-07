# Functional Programming Jardon + EXAMPLES
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