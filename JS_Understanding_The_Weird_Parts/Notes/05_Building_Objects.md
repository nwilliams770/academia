## Building Objects

### Function Constructors, 'new'
- 'new' keyword, introduced to attract Java devs, is an operator
- EX:
  function Person (y) {
    this.name = y;
  }
  var john = new Person ('John Doe');
  - With the 'new' keyword, an empty object is created and function is invoked. HOWEVER, JS engine changes 'this' to the empty object that was created
  - **function contructor**: A normal function that is used to construct objects. The 'this' var points to new empty object and object is return from function automatically.

  - a function's prototype is used only when the new operator is used.
  - any objects you create using a function constructor has a prototype of the function constructor. Which means you can add properties and methods to the function constructor proto and it will affect ALL objecs created by that function constructor.
  - more efficient to put methods on the prototype instead of each individual object (ex: Person.prototype.newMethod = function()..)

  - standard is to have function constructors with a capital letter

  #### Built-In Function Constructors
  - JS has some built-in functions that you can use
  - EX: var a = new Number("3") <== this will create an object!
  - Be wary of using these when constructing primitives 
  
  #### Arrays and 'for...in'
  - EX: 
  arr = ['a', 'b', 'c']
  for (var prop in arr) {
    ...
  }
  - For...in iterates through the properties of an object, an in the case of an array in JS, the properties are the values the array contains.
  - If you augment the array prototype with some added library, this will add extra iterations to your loop. Use traditional for loop instead

### Object.create and Pure Prototypal Inheritance
- EX:
  var person = {
    firstname: 'Default',
    greet: function () {
      return 'Hi' + this.firstname;
    }
  }
  var john = Object.create(person)
  john.firstname = 'John';

  ^ this is pure Prototypal Inheritance
  
- Polyfill: Code that adds a feature which the engine may lack.

### ES6 and Classes
- ES6 introduces classes, but in a new way
EX: 
  class Person {
    constructor(first, last) {
      this.first = first;
      this.last = last;
    }

    greet() {
      return 'Hi' + first;
    }
  }

  - In other language class is just a template, but in JS, the 'class' is AN OBJECT!
  - class InformalPerson extends Person <== how prototypes are set
  

