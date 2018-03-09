## Objects and Functions

### Object Anatomy
- An Object can contain:
  - Primitive 'property'
  - Object 'property' e.g. another object nested inside it
  - Function e.g. a 'method'
- Prefer to use the object literal when declaring an object {} for easier setup

### Faking Namespaces
- **Namespace**: A container for variables and functions. Typically to keep vars and funcs with the same name separate.
- Does not exist in JS
- To prevent any sort of collision we can create object containers to store vars and funcs that might collide. Used a lot in frameworks and libraries.

### JSON and Object Literals
- JSON: JavaScript Object Notation
- JSON is just a string of data but with some variations
- Properties (e.g. keys) MUST be wrapped in quotes
- Can call JSON.stringify(object) to convert to JSON string
- Can call JSON.parse('string') takes a JSON string and converts to JS object

- Bottom-line: looks very similar but JSON is more strict

### Functions are Objects
- **First Class Functions**: Everything you can do with other types, you can do with functions. Assign them to vars, pass them around, create them on the fly.

- Functions are objects whose code just happens to be a property of that object.

- 2 special properties on func object:
  - NAME: optional, can be an anonymous function
  - CODE: the actual lines of code that you write. It's INVOCABLE

#### Function Statements and Function Expressions
- **Expression**: A unit of code that results in/returns a value. Doesn't have to save to a variable.
- Function statement: function green() { console.log('hi'); }
- Function expression: var anonGreet = function() { console.log('hi'); }
- The function statment is hoisted and can be called before declaration. BUT the expression is not hoisted, it is set to undefined during the creation phase.
- you create a function on the fly for example, as an argument to another function. Beauty of FIRST_CLASS FUNCTIONS

### By Value vs. By Reference
- Let's say we assign a = some primitive value
- If we say b = a (or pass b to a func), we create a COPY of that primitive value and make a reference from b to it; THIS IS BY VALUE
- You can alter the value of a but that will not change the value of b

- If we assign a to an object (remember a function is an object as well!), b will point to the SAME OBJECT; this is BY REFERENCE
- However, we can re-assign b to a new object that is not in memory

### Objects, Functions, and 'this'
- Declaring a function on the global scope, 'this' points to the window object
- Declaring a func inside an object (a method of the object) however, the JS engine determines 'this' is the object itself

- Weird behavior: defining a func inside another, 'this' will point to Window
- Common practice to save 'this' into a variable in order to exploit the references when changing scope.

### 'arguments' and Spread
- When execution context created, 'arguments' keyword created
- contains all values of all params passed to a function you're calling
- arguments is array-like
- '...' operator can be used in function params to allow infinite num of args to be passed in

### Immediately Invoked Function Expression (IIFE)
- EX: var greeting = function(name) {
  return 'Hello' + name;
}('Francois');    func is invoked immediately after declaration
- Can even be declared on global scope but must be wrapped in parens in order to maintain it as an expression for JS syntax parser
- EX: (function(name) {
  console.log("Hi" + name); }(someVar)); 
})

#### IIFEs and Safe Code
- When creating something reusable, you can wrap code in IIFE in order to prevent any potential variable collisions
- Vars in IIFE not hoisted, only live in that funcs Execution Context (not putting it into the global object)

-EX: You can still work with global object however, just pass it in!
  (function(global, name) {
    let greeting = 'hello';
    global.greeting = 'hello';
  }(window, 'John'));

### Closures

