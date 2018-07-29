### Events and the Event Emitter
### Review .call and .apply
- .call let's you invoke a function but can be passed a object which will have the method called on it. E.g. you can invoke one object's method as if it was another object's, you can change what the this keyword points to
- You can also pass other params to the function itself: obj1.call(obj2, param1, param2, ...);
- Apply is the same as call but you pass the extra params as an array obj1.apply(obj2, [params1, params2, ...])

### Inheriting from the Event Emitter
- When creating our chain of inheritance, we are hooking into the function constructor's prototype. This do NOT accomodate for objects and methods that are directly added to the object. EX: function Greetr () { this.greeting = "hi" }
- To fix this we do function Greetr() { EventEmitter.call (this); this.greeting = "hi"; }
- (util).inherits just connects the prototypes, not what directly attaches properties and methods to the object

- When using classes, to set up our chain of inheritance as well as methods/property inheritance, we first have:
Greetr extends EventEmitter (this handles prototype inheritance)
in constructor..
super(); (this handles properties and methods)
- This class structuring is totally fine for modules

### Review ES6 Classes
- Doesn't change anything going on under the hood, just some syntactic sugah
- Side note; 'use strict'; should be used for production level code