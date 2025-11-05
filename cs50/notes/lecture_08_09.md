## Lecture 8, Lecture 9 Python
- What we've done previously: source code => compiler (clang) => machine code
- In Python, source code => (compiler => byte code =>)interpreter; Python is both the name of the language and name of the program used to interpret
- In C, it's convention to for your program to automatically invoke the `main` function; in Python, you need to explicitly invoke `main`
- In C, single quotes for char, double quotes for string; in Python, they're equivalent
- Before we just had comments, denoted using "#"; we also have these nifty doc-strings in Python that we denote using """Some comment"""
    - These comments can be rounded up and used to create a doc file, which is like a user's manual for what all your functions do, what values they return, etc.
    - A useful way to comment on all your methods
- Previously, we had a prototype of all our functions we were going to use. This was because clang did not know a function existed until it sees it, so when a func was being called in main, we'd error out because we hadn't seen it yet!
- 2 ways of importing CS50 library:
    - `from cs50 import function_name` // `from cs50 import *`
        - The second one is BAD practice, potential collisions/shadowing of variables as you're importing everything into the namespace
    - `import cs50` is safer, you just have to invoke methods through the cs50 obj, cs50.get_int()
- C ints are 32-bits, Python ints are 64
- Fundamental feature of Python: named parameters!
    - `print("??", end="")`
    - When calling a function, we don't name them as we pass them in, but in Python, if a function takes multiple args, you can explicity name them
    - This is GREAT because it means that ordering of arguments in a function call don't matter if you explicitly name them!
- web server is just a program running on a physical machine, that listens for http requests and responds to them
- Python supports tuples! EX:`tuple = ("0.0.0.0", 800)`
- We'll be using Flask (a mini framework) and it is a library that we import (`from flask import Flask`) and software that we can call from the command line `flask run`
- Python:
    - Inspired by C (Cpython, primary interpreter, written in C)
    - We learn' Python 3 up in here!
    - Only declare variables by initialization (must assign a value to it)
    - Python arrays (known as lists) are not fixed size, they are dynamic and you can mix types
    - The interpreter reads your code from top to bottom so there's no need for a `main` func. If you do, you must have this line `if ___name___ == "__main__": 
        main()`
    - style is CRUCIAL to Python--tabs and indentation mean something so you must be attentive when writing your code
    - to invoke python interpreter in terminal `python <file>`
- Flask:
    - Python has native functionality to support networking and more, so you can write backends in Python
    - web frameworks make it even easier, abstracting away the minutia of Python's syntax and providing helper functions
    - getting started:
        in an application.py or whatever other name you want for it..
        - `from flask import Flask` importing the Flask class
        - `app = Flask(__name__)` initiate the app, __name__ just means the file, so create a Flask app based on whatever file this line of code appears in
        - then just add funcs that define the behavior of the app
        - to run it in IDE is simple too
            - `export FLASK_APP=application.py
               export FLASK_DEBUG=1
               flask run`
    - Data can be passed in via URLs as well as forms
        @app.route("/show/<number>")
        def show(number):
            return "You passed {}".format(number)
- SQL:
    - SQL is the language, MySQL is the open source platform which you can establish the type of relational DB that SQL is most adept at working with
    - Many installs of SQL come with a GUI tool called phpMyAdmin to make it more user friendly
    - CHAR in SQL: not a data type, it's a fixed-length string
    - VARCHAR is specified by a MAXIMUM possible length of a string that can be stored
    - SQLite can store all these things but it groups them into more generalized, overarching affinities
    - INSERT, SELECT, UPDATE, DELETE -- pretty much only opereations you'll ever need
    - We can split tables up and design them in a way where we can JOIN them temporarily to do more complex queries with more efficiency