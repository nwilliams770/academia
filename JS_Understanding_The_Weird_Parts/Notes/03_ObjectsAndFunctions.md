##Objects and Functions

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

###JSON and Object Literals
- JSON: JavaScript Object Notation
- JSON is just a string of data but with some variations
- Properties (e.g. keys) MUST be wrapped in quotes
- Can call JSON.stringify(object) to convert to JSON string
- Can call JSON.parse('string') takes a JSON string and converts to JS object

- Bottom-line: looks very similar but JSON is more strict

###Functions are Objects
- **First Class Functions**: Everything you can do with other types, you can do with functions. Assign them to vars, pass them around, create them on the fly.

- Functions are objects whose code just happens to be a property of that object.

- 2 special properties on func object:
  - NAME: optional, can be an anonymous function
  - CODE: the actual lines of code that you write. It's INVOCABLE

##Function Statements and Function Expressions
- **Expression**: A unit of code that results in/returns a value. Doesn't have to save to a variable.
- Function statement: function green() { console.log('hi'); }
- Function expression: var anonGreet = function() { console.log('hi'); }
- The function statment is hoisted and can be called before declaration. BUT the expression is not hoisted, it is set to undefined during the creation phase.
- you create a function on the fly for example, as an argument to another function. Beauty of FIRST_CLASS FUNCTIONS

