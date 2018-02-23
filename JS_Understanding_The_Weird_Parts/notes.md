# JS: Understanding The Weird Parts

### Syntax Parsers, Execution Contexts, Lexical Environments

Syntax Parsers: Program that reads your code and determines what it does and if its grammar is valid. e.g. high level languages like JS.
- Code => Computer Instructions via compiler, syntax parser; machine is being fed a translation of your code, leaves room for other 'things' to be added during said translation

Lexical Environments: Where things in your code are written and how that context influences its execution.

Execution Context: A wrapper to help manage the currently running code.
-Lexical environment that is currently running is managed via execution contexts. Can contain things beyond what you've written in your code.

### The Global Environment

Whenever code is run, it's run within execution context (e.g. wrapped within the execution context). Base execution context is global execution context (JS engine creates for you Global Object and 'this' for you)
-Global object inside browsers, is the window object!



