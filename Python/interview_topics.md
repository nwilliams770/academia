### When is it the right time to use Python? And the wrong time?
* Situational! Depends on what you are optimizing for: Are you looking to rapidly develop or developing a product for the long-haul
    - Python, based on Ry experience, would not necessarily be pragmatic for a very large codebase
    - Python, unlike a compiled langauge, has a huge open-source third-party libraries at your disposal
    - Python could also be used for prototyping
* Wrong time, *real-time performance*, counting on code to run at a certain frequency
* Also, a compiler will compile every single line of code, which is generally more extensive than unit tests
* Also, a more performant language than Python such as a compiled language costs more $$$ because you need more computing power
* In the real world, inertia is the main motivator! Sometimes pragmatism wins

### What are exec and eval? How can they be unsafe?
* `exec(str_of_python_code)` -- runs your code but no return value
* `eval(str_expression_of_python_code)` -- runs expression and returns
* Use-cases? Meh..

Tangent: **getattr** and **setattr**, **hasattr**, **get**

### What is the GIL? What implications does this have?
[great article about Python's GIL](https://realpython.com/python-gil/)
* Global intepreter lock is a mutex (or lock) that allows only one thread to hold control of the Python interpreter, only one thread can be in a state of execution at a time.
    - only one thread executed at a time EVEN in a multi-threaded architecture with more than one CPU core
* Python uses reference counting for memory management
    - Objects create in Python have a reference count variable that keeps track of the number of references that point to the object. When it reaches zero, the memory occupied by the object is released 🤯
* Because of race conditions (generally, unexpected behavior due to unconstrained parallel computing) where two threads might change, access, or delete a value simultaneously, it can cause leaked memory or release memory while the object still exists. PAS BON ÇA!

* We can keep our reference count var safe by adding locks to all data structures that are shared across threads, but we DON'T want to do that because we run the risk of encountering a Deadlock (deadlocks can happen if there is more than one lock)
    - Another reason this isn't good is because the repeated acquisition and release of locks would be decreased performance

* The GIL is a single lock on the interpreter which adds a rule that execution of any Python code requires acquiring the interpreter lock.
    - This prevents deadlocks BUT effectively makes any CPU-bound Python program single-threaded
*Tangent*: CPU-bound vs I/O-bound:
* CPU-bound programs are ones that push the CPU to its limit for example a lot of complex mathematical computations like matrix multiplications, searching, image processing, etc
* I/O-bound programs spend a lot of time waiting for I/O which can come from a user, file, database, networ, etc. They have to wait a while till they get what they need due to the their source having to do its own processing.


### Development Environment and Best Practice
* **pep8**: 'official' Python written standard from creator of Python, Guido van Rossom
    - flake8 and pylint are linters that enforce pep8 on your IDE, but they are also configurable!
* **$PATH**: An environment variable that points to all directories where executables (e.g. binaries) are stored
* **PYTHON_PATH**: An environment variable that is used by Python to search for referenced modules
    - Note that a Python path may contain multiple search paths
    - This is *particularly* important when you have a large codebase
    - Not having a cleanly set PYTHON_PATH variable means you gotta do all this ugly `sys.path.append` stuff, which is NOT sustainable
* What is `__init__.py`?
    - It's a necessary file for a package (directory-structure around a module, which is just a single file)
    - In order to say something like `import package.module`, we need an `__init__.py` file
    - Possibly just an optimization to help Python search for modules more quickly, but it is no longer needed in Python 3!
* Interpreter vs Compiler:
    - In this context, a "program" is a binary file that can be executed
        - A binary file, for the scope of these notes, machine instructions in an executable format
        - The act of converting source code to instructions for your computer to follow (e.g. flip that circuit, turn that 1 to a 0) is either through compilation or interpretation
        - What are the benefits and drawbacks to each?
            - Compiler will tell you during compilation if you made an error such as a syntax error, you can also add more tooling to do a fair amount of static analysis
            - A big drawback to compilation is that portability is very limited; a compiler will compile for a specific environment which includes OS, processor type, etc. We can compile for a variety of different hardware and OS, but we'll have different applications for each one, no es bueno
                - For example, I compile a file on my laptop, I can't run that binary file on my iphone
            - Conversely, compiled software is remarkably faster because it's compiled before runtime. Additionally, the compiler can optimize your code in ways beyond an individual developer's code (for example, optimizing for a specific processor)
            - There are also more steps with compiled code because we must recompile everytime we make a change
            - An interpreter is a piece of software that will read and execute your code line by line
            - A perk to this is that it's faster to develop with, easier share and run someone else's code
            - Downside is that it is quite slower and tends to lead to larger file sizes

* **CPython**: The most common Python interpreter. Note that Python is just a spec for an interpreter and there are many different implentations of it (this is same for any interpreted language)