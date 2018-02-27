## Syntax Parsers, Execution Contexts, Lexical Environments

**Syntax Parsers**: Program that reads your code and determines what it does and if its grammar is valid. e.g. high level languages like JS.
- Code => Computer Instructions via compiler, syntax parser; machine is being fed a translation of your code, leaves room for other 'things' to be added during said translation

**Lexical Environments**: Where things in your code are written and how that context influences its execution.

**Execution Context**: A wrapper to help manage the currently running code.
-Lexical environment that is currently running is managed via execution contexts. Can contain things beyond what you've written in your code.

## The Global Environment
Whenever code is run, it's run within execution context (e.g. wrapped within the execution context). Base execution context is global execution context (JS engine creates for you Global Object and 'this' for you)
- Global object inside browsers, is the window object!


## Execution Context: Creation and 'Hoisting'
 Hoisting: In JS, all declarations moved to the top of the current scope (or current script or current func); allowing us to use variables before declaration

What's going on here?
 - Execution context created in 2 phases:
  - Creation phase: creates Global Object, 'this', Outer Environment
  - Parses through code during creation phase, notes variablse and funcs, sets up memory space for them -- THIS IS HOISTING
  - So, once code executed line by line, those vars and funcs already created in memory so they can be accessed.
    - Note that variable assignment is executed line by line so variables can be accessed but they point to a placeholder, 'undefined'; 
    - funcs are sitting in memory in their entirety after hoisting

### Undefined in JS
- Undefined is actually a special  value in JS 
- Do not set values to undefined; better to treat it as a reminder that a value has never been set

## Function Invocation and the Execution Stack
- **Single threaded**: one command at a time
- **Synchronous**: execution one line at a time, in the order that it appears
- JS behaves in a single threaded manner

- When function is invoked, a new Execution Context is created, forming the **Execution Stack** 
- Each Execution Context has a creation phase and execution phase and is created every time function is invoked

## Functions, Context, Variable Environments
- Variable environment: where variables live in memory and how they relate to each other

## The Scope Chain
- Exery Execution Context has a reference to its Outer Environment
- When running a line of code with a variable, if variable is not that Execution Context, JS 
will look in reference to Outer Environment and that depends where function was written e.g. Outer (Lexical) Environment
- **Scope Chain**: The chain of Outer Environment references.

## Scope, ES6, and let
- **Scope**: Where a variable is available in your code and if its truly the same var or a new copy.
- 'let' allows block scoping. Variable cannot be used until declared. And when variable defined in a block, can only be used in that block.

## Async
- Other parts of the browser are handing async actions by JS engine such as rendering changes or HTTP requests but the JS engine is still synchronous!
- Event Queue handles async actions but only after Execution stack is empty; the browser is populating the Event Queue
- 




  
