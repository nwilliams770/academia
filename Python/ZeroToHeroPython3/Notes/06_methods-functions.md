## Methods and Functions
* `help(object.method)`: built-in function to provide documentation on a given method
```python
def name_of_function(argument='default argument'):
    '''
    Docstring explains function. INPUT/OUTPUT
    '''
    ...some code
```

### *args and **kwargs
* arguments and keyword arguments, respectively
* A means to accept an arbitrary number of arguments
* When we see `*args` as a param, we can treat that as a tuple of parameters coming in; note that args is an arbitrary choice, the keyword here is the `*`
* **kwargs treats your params as a dictionary

### Lambda Expressions, Map, Filteer
* lambda expressions are a means for us to create anonymous functions
* `map(func, iterable)`
* `filter(check_func, iterable)`
* `lambda num: num ** 2`
```python
for item in map(function, iterable):
    do something

list(map(function, iterable))

list(map(lambda num: num**2, mynums))
```

### Nested Statements and Scope
* LEGB Rule: order that Python will look for vars:
    - Local: names assigned in any way within a func or lambda and not declared global in that  func
    - Enclosing function locals- names in local scope of any and all enclosing functions or lambdas, from inner to outer
    - Global: names assigned at the top-level of a module file, or declared global in a def within the file
    - Built-in: names preassigned in the built-in names module
* We can pull a global variable into a function by declaring `global var_name`