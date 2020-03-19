## Python Statements
### if, elif, else
* control flow syntax in Python makes use of colons and indentation, e.g. whitespace, which is crucial in Python!

### for loops
* We can use for loops to iterate over many of the iterable objects in Python
* for *item_name* in *my_iterable*:
* there are times when you don't want to use  the item_name, you just want to iterate for a given number of times, you can use this shorthand: for _ in  *my_iterable*:s
* tuple unpacking:
    - lists of tuples are very common data structure pairing in Python because we have tuple unpacking
    - for a,b in mylist: OR  for (a,b) in mylist:
    - using this syntax, we can unpack the tuple and access each item in it individually
* for key,value in  dictionary.items()
* for value in  dictionary.values()

### while loops
* while *boolean_condition*:
* while *boolean_condition*: ... else: ...
* break: breaks out of current closest enclosing loop
* continue: goes to the top of  the current enclosing loop.
* pass: does nothing at all (can use a placeholder to avoid syntax errors)

### useful operators
* for num in range(3, 10, 2):
    - range(start, end-exclusive, step-size)
    - list(range(...))
    - range is a more efficient way to generate numbers as opposed to having them in memory
* for item in (enumerate(word)): e.g for index,val_at_index in enumerate(word):
    - enumerate provides an index counter
    - 'item' in this case would be a tuple containing the current index and the value at the index position
* for item in zip(list1, list2):
    - item will be a tuple: (item_in_list1, item_in_list2)
    - can also list(zip(mylist1,mylist2))
* *value* in *list/string*
    - 2 in [1,2,3], 'x' in ['a','b','c'], 'x' in 'a world', 'mykey' in {'key':'val'}
* min(mylist), max(mylist)
* from random import shuffle
    - shuffle(mylist)
* from randdom import randint
    - randint(0, 1000)
* result = input('Enter a number here: ')

### list comprehensions
* a unique way of creating a list in Python
* if you find yourself using a for loop along  with .append() to create a list, List comprehensions are a good alternative!
* mylist = [letter for letter in mystring]
* mylist = [element for element in iterate_object]
* mylist = [num for num in range(0,11)]
* mylist = [num**2 for num in range(0,11)]
* mylist = [x for x in range(0,11) if x%2 == 0]
* mylist = [x if x%2 == 0 else 'ODD' for x in range (0,11)]
