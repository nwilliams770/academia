## Generators
* Generator functions allow us to write a function that can send back a value then later resume to pick up where it left off
* Allow us to generate a sequence of values overtime as opposed to holding those values in memory
* Main difference in syntax will be use of a `yield` statement

* When compiled they become an object that supports an iteration protocol, means that when they are called in your code they don't actually return a value then exit
* Instead they will suspend and resume execution state around last point of value generation

What's the advantage?
* Instead of having to compute an entirely, possibly huge series of value up front, the generator computes one value and waits until the next value is called for

* For example, `range()` doesn't produce a list in memory for all the values from start to stop, it just keeps tracks of last number and step size, to provide a flow of numbers
    - That's why, when we need a list, we have to specify it! `list(range(start,stop))`

```python
def gen_fibon(n):
    a = 1
    b = 1
    for i in range(n):
        yield a
        a,b = b,a+b

for number in gen_fibon(10):
    print(number)
```

* The `next(generator_obj)` can be used to get the next in the sequence; note that if we have a finitely defined sequence, we can run into a `StopIteration` exception
* `iter` allows us to turn objects that are iterable (such as strings) into a generator
```python
s = "string"
s_iter = iter(s)
next(s_iter) # => "s"