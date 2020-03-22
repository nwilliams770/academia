## Object-Oriented Programming
* OOP allows us to better organize and structure our code that is reusable by creating custom objects with their own attributes and methods
* `class CamelCaseClass():` within `def __init__(self,param1,param2):` `def some_method(self)`
* Above our init, we can define class object attributes which will be the name for all instances of a given class, it can be referred by `self.classAttribute` or `ClassName.attribute`
* note that on methods we have to pass `self` as a param to bind it to the instance of the class

### Inheritance and Polymorphism
* Inheritance is a way to form new classes using previously created ones; we can have a base class and a derived class which inherits from it
* Note we can override methods of an inherited class
```python
class Dog(Animal):
    def __init__(self):
        Animal.__init__(self)
```
* Dunder/Special Methods