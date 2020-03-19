## Python Object and Data Structure Basics
### Data Types
* Pretty standard compared with what you know, there are some extra data types as well as semantic differences:
    - Lists (e.g. arrays), ordered sequence of objects
    - Dictionaries (e.g. hashmap) unordered key-value pairs
    - Tuples - ordered immutable sequence of objects (10,"hello",200.3)
    - Sets - unordered collection of unique objects {"a","b"}

### Assigning Variables
* Rules for variable names:
    - can't start with a number
    - no spaces
    - no special chars
* Python is dynamically typed, so we can assign a single variable to a variety of different data types without erroring out
* We can check types using `type()`

### Strings
* They are **ordered sequences** and thusly, can be indexed into or sliced to grab sub-sections (indexing using `[start:stop:step]` notation)
    - when slicing into a string, note that start is *inclusive* while end is *exclusive* that is, up to and not including
    - one can also not add a start or stop to grab a slice starting from the beginning or end of string respectively
    - step size can be combined with start and/or stop to get subsets in steps
* Immutable, we cannot update parts of a string, we can only update via cocatenate, or multiplication

### Print formatting
* .format ()
    - can use index positions to print values at specific locations in our string:
    `print('The {q} {b} {f}.format(f='fox',b='brown'..))
* string literal
    -print(f'Hello my name is {name}');

### Lists
* Ordered sequences that can hold various object types
* support indexing, slicing, and be nested
* `len(*list*)`
* can update values in a list
* add and remove values using .append and .pop(*optional index location*)

### Dictionaries
* unordered mappings for storing objects, does so with key*value pairs (note that keys are strings)
* can get keys and values via .keys(), .values(), or d.items()

### Tuples
* Similar to list but they are **immutabile**, once an element is inside a tuple, it can not be reassigned
* use paranthesis, not square brackets
* two unique methods
    - count(*value*) returns how often a value occurs in tuple
    - index(*value*) returns index of first occurnece of value
* useful for maintaining data integrity

### Sets
* unordered collections of unique elements
* instantiated using `set()` or `set(*list*)`
* `add()`

### Booleans, None
* capitalized in Python, True and False
* None used a null value placeholder

### I/O with Basic Files
* access file using `.open(**full file path**)`
* we can `.read()` or `.readlines()` the file, but the cursor that's read the file must be reset to read it again
* can reset this cursor using `.seek(0)`
* if we open a file, we must `.close()` it but we can use some syntactic sugar to avoid that:
```python
    with open('myfile.txt') as my_new_file:
        # Block of code for things pertaining to this  file
        # contents = my_new_file.read()
        contents = my_new_file.readlines()
```
* there are times when we'd only swant a module to read or write files and sometimes you want both, we can specify a mode
    - `with open('myfile.txt', mode='mode') as my_new_file:`
    - 'r' is read only
    - 'w' write only  (will overwrite files or create new)
    - 'a' append only
    - 'r+' reading and writing
    - 'w+' writing and reading