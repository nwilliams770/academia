## Advanced Python Modules
### collections
* implements specialized container data types
* Counter, counts occurences of elements in a list or str, in the form of a dict
    - methods such as `most_common`, `sum(c.values())`
* DefaultDict, dictionary-like argument that takes a default condition upon instantiation, will NEVER have a `KeyError` as a result
* OrderedDict, dictionary but order is retained
* NamedTuple, generates a class-like object that has all the functionality of a tuple!
```python
Dog = namedtuple('Dog', 'age beed name')
bob = Dog(age=2, breed='Lab',name='Bob')
bob.age # => 2
```

### Debugger
* `pdb`is the module name
* `pbd.set_trace()` will pause execution and provide an interactive debugging environment for us to check values at that point in the code, we can even do operations (exit using `q`)

### Timeit
* `timeit` allow us to time our code
* `timeit.timeit("func expression passed as str", number=10000)

### Regex
* Regular expressions are text matching patterns and the `re` module allows us to use them for functionality such as search (note a Match object would be returned)
* We can it as well for splitting strs at specific founds
```python
split_term = "@"
phrase = "My email is blank@blank.com"

re.split(split_term, phrase)
```