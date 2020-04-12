## Advanced Python Objects and Data Structures
### Numbers
* `hex()`
* `bin()`
* `pow(base, exponent, mod-%)`
* `abs`
* `round(num, precision=0)` => always return floats

### Str
* `capitalize()`,`upper()`, `lower()`
* `count(str)`
* `find(str)` => index of first instance
* `center(total_length_of_result, centering_filler` => fillerfillterORGINIAL_STRfillerfiller
* `isalnum()` is alpha-numberic
* `isalpha()` is alphabetic
* `islower()`, `istitle`, `isupper`
* `isspace()`
* `endswith()`
* `split(regex_expression)`

### Sets
* `clear()`
* `copy()`
* `difference(another_set)` => new set
* `difference_update(another_set)` => mutated original set
* `intersection(another_set)`
* `intersection_update(another_set)`
* `isdisjoint()`
* `issubset()`
* `issuperset()`
* `symmetric_difference()`
* `symmetric_difference_update()`
* `union()`
* `update()` => union update

### Dictionaries
* Just like we have list comprehension, we also have dict comprehension
```python
{x:x**2 for x in range(10)}
{k:x**2 for k,v in zip(['a','b'],range(10))}
```

### Lists
* `extend(another_list)`
* `insert(index, val)`
* `remove(val)` removes first instance
