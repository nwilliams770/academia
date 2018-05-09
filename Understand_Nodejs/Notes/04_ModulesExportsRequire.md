## Modules
- **Moldule**: A reusuable block of code whose existence does not accidentally impact other code (this is new to ES6)

- **CommonJS Modules**: An agreed upon standard for how code modules should be structured

## First-Class Functions and Function Expressions
- **First-Class Functions**: Everything you can do with other types, you can do with functions (You can use functions like strings, numbers, pass them around, set variables equal to them, put them in arrays)

- **Expression**: A block of code that results in a value. Function expressions are possible in JS because functions are first-class in JS.

##Building A Module
- require("") protects all your other code so that there are no collisions. Module is SELF-CONTAINED but you can allow interactivity between modules
- module.exports -- how we can expose a function or variable that other modules can work with
- EX: let greet = function () { console.log("HI!)}
      module.exports = greet

      in other file...
      let greet = require(./greet);
      greet();

## JavaScript Aside: Function Constructor
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

