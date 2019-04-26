### Modules
- **Moldule**: A reusuable block of code whose existence does not accidentally impact other code (this is new to ES6)

- **CommonJS Modules**: An agreed upon standard for how code modules should be structured

### First-Class Functions and Function Expressions
- **First-Class Functions**: Everything you can do with other types, you can do with functions (You can use functions like strings, numbers, pass them around, set variables equal to them, put them in arrays)

- **Expression**: A block of code that results in a value. Function expressions are possible in JS because functions are first-class in JS.

### Building A Module
- require("") protects all your other code so that there are no collisions. Module is SELF-CONTAINED but you can allow interactivity between modules
- module.exports -- how we can expose a function or variable that other modules can work with
- EX: let greet = function () { console.log("HI!)}
      module.exports = greet

      in other file...
      let greet = require(./greet);
      greet();

### JavaScript Aside: Function Constructor
- **Function constructor**: A function that is used to create objects, implicity returns a new object. This is declared with the "new" keyword. 
      - EX: function Person(firstname, lastname) {
            this.firstname = firstname;
            this.lastname = lastname
      }

      - We can now create a new one! var nicolas = new Person("nicholas", "williams") 
      - Also change prototype of Person:
            - Person.prototype.greet = function() {
                  console.log("hello" + this.firstname)
            }
### By Reference vs By Value
- In JS, when pass a primitive value into a function, the passed in parameter in duplicated in memory; this is called by value
- When we pass in an object to a function, the parameter points to the SAME spot in memory as the object; no new copy of the object is made, two variables now point to same variable. This is by reference.

### IIFE (Immediately Invoked Function Expressions)
- Modules are not just re-usuable blocks of codes but also code that is protected that doesn't affect other code. Eg. we're dealing with SCOPE
- **Scope**: Where in code can you have access to a particular var or function. 
- Why use one? Because it's more convenient than just writing a function and having to invoke it later

### How Do Modules Really Work?
- Our simple module was:
 var greet = function() {
       console.log("Hi!")
 }
greet.js
 module.exports = greet;
 module.exports allows greet to become available to other files in our codebase

 - In our other file we use 
 app.js
 var greet = require("./greet");
 greet();

 - Module has a prototype and when you create a module, it gains access to the require function
- When calling module.exports, the JS engine is actually compiling and wrapping your code to form an IIFE, taking exports, require, module, __filename, etc. as params
- require is a function, that you pass a filepath to; module.exports is what the require function returns

- **JSON**: JavaScript Object Notation; A standard for structuring data that is inspired by JavaScript object literals. JS engines are built to understand it

- The REQUIRE function will look for the specified "filename.js". If can't find it will look for a folder with "filename" then look inside it for an index.js file. Now we have multi-file modules!
      - in the index file we can do something like: 
            - var english = require("./english.js")
            - var spanish = require("./spanish.js")
            module.exports = { english: english, spanish: spansh}
            
            app.js
            - var greet = require("./greet.js")
            - greet.english();

      - we can also add JSON to our module and require is within those files. We can access that required JSON just like any other object!

###Module Patterns
- One pattern is like we learned. We use module.exports to export some code wrapped in a function expression, essentially filling that empty exports object with our code. Then we require that code in another file, e.g. saving it within a variable, allowing us to use that code
- Let's try something different! 
      - module.exports.greet = function () { console.log("hi!") }
      in app.js..
      - greet2 = require("./greet2").greet; we JUST want that one property on the greet object

- Another pattern...
      - we'll use a function constructor!
      - function Greetr() {
            this.greeting = "hi!"
            this.greet = function () { console.log(this.greeting) }
      }
      module.exports = new Greetr();
      in app.js...
      var greet3 = require("./greet3")
      greet3.greet();

      - this can pattern can cause some confusion however..
      - the require function will cache its results of for any particular file name therefore if we create another instance of greet3, it will point to the same object!
      - e.g. the function constructor is only run once

      let's say we WANT multiple instances...
      - we can module.exports = Greetr; NOT new Greetr(); we are no longer passing a new object, just the ability to create a new object!

      back in app.js...
      var Greet4 = require("./greet4");
      var grtr = new Greet4()
      - now we've imported the function constructor itself
- One last pattern...
      - **Revealing module pattern**: Exposing only the properties and methods you want via a returned object. Very common and clean way to structure and protect code within modules
      var greeting = "Hi!"
      function greet() { console.log(greeting) }
      module.exports = {
            greet: greet
      }
      in app.js...
      var greet5 = require("./greet5").greet OR require("./greet5") and greet5.greet()

### Exports vs Module.exports
- Recall when code is run through Node, one of the paramerters is exports, what is that?
- exports is a short-hand for module.exports, they both point the same place in memory! but when we say something like, exports = some code; we are OVERIDING that reference and setting exports to a whole new value. the require function returns MODULE.EXPORTS so our code will never make it to the file and we will error out
- so we cannot override exports but we can mutate it by adding a new property or method
- we MUST say export.greet = function () { ... }
- lesson is.. JUST USE module.exports

### Requiring Native (Core) Modules 
- Some modules that come with Node are global, such as console, but some aren't and you can read about them on the API documentation.
- note that core modules are not required with a path name, just the name of the module itself ex: var util = require("util");

### Modules and ES6
- JS V8 itself is starting to support modules, not just the add-on features that come with Node
      export function greet() { ... }  greet.js
      import * as greetr from 'greet'; app.js
      greetr.greet();
