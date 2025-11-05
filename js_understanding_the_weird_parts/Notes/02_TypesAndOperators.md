# Types and Operators

##Types and JS
- **Dynamic Typing**: You don't tell Engine (compiler) what type of data a variable holds but instead it is figured out during execution.
ex: let isNew = true; isNew = 3; isNew = "hey!"
- **Static Typing**: You tell the Engine (compiler) ahead of time what content you intend to hold in a variable. ex: bool isNew = true;

##Primitive Types
- **Primitive Type**: A type of data that represents a single value. That is, not an object
  - Undefined: lack of existence
  - Null: lack of existence, usually set by programmer
  - Boolean: true/false
  - Number: Only one type in JS (not like integer and float in Ruby). The number type is float in JS
  - String: sequences of chars.
  - Symbol: new for ES6. 

##Operators
- **Operator Precedence**: Which operator function is called first when
- **Operator Associativity**: Order operator functions get called in: left-to-right or right-to-left

##Coercion
**Coercion**: Converting a value from one type to another (happens frequently in dynamically typed languages!) ex: 1 + '2' = '12'

###Comparators and Coercion
- Bugs can arise from using '==' due to coercion. Because the JS engine is attemping to convert values, it can easily cause confusion. 
- Using '===' strict equality, will prevent odd potential errors. Ex: 3 === 3 => true; '3' === 3 => false
- Rule of thumb: Do comparisons for things that you know will be the same type. Only use '==' if you EXPLICITLY want to coerce the values. * same with '!=' and '!=='

##Existence and Booleans
- Just note that 0 will eval to false; something to be mindful of when taking advantage of coersion.

## Default Values
- JS doesn't mind if you invoke a function without the expected parameters, they will be set to undefined if not provided a default value.
