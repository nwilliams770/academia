## Processors, Machine Code, C++
- Microprocessors are designed to understand usually one language such as IA-32 x84-64, ARM, MIPS
- **Machine Code**: Every program you run has been converted or compiled into machine code.
- Node is written in C++ because V8 is written in C++
- Ecmascript is the standard JavaScript is based on; needed a standard because there are many different engines
- **JavaScript Egine**: A program that converts JS codfe into something the computer processor can understand; should follow ECMAScript standard on features, functionality
- Google's V8 engine can be embedded in ANY C++ application; that's how Node came into existence:
  - You can essentially add features to JS by embedding V8 engine into your C++ app
  - Why important? C++ has way more features! JS designed for browser, not designed for dealing with files or touching a DB
  - Example: "print" is not a keyword in JS, but actually a keyword bound to a function in the v8 engine that has code to actually perform "print"
  - JS is much more abstracted away from hardware than C++
- Node is a C++ application that adds a wealth of features to JavaScript


