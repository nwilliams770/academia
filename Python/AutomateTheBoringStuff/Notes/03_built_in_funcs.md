## Python's Built-In Functions
* A means a terminating a program early is using the `exit` method from the `sys` module
* Add new modules using `pip`, pre-installed with Python
* Argument: The *value* passed in the function call e.g. hello('Alice')
* Parameter: The variable inside the function e.g def hello(name)
* Local and global scope allow us to treat functions as 'black boxes'
* If we want to specify that a function will interact or create a global variable we must declare it with the `global` keyword
```python
def spam():
    global eggs
    eggs = 'Yummm'
    print(eggs)

eggs = 42
spam()
print(eggs)
```